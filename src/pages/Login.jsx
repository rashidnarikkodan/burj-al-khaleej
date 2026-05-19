import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Lock, Mail, Loader2, ChevronLeft, ShieldCheck } from 'lucide-react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../lib/firebase';
import ThemeToggle from '../components/ui/ThemeToggle';
import LanguageToggle from '../components/ui/LanguageToggle';
import { useLanguage } from '../context/LanguageContext';
import { motion } from 'framer-motion';
import Toast from '../components/ui/Toast';

const Login = () => {
  const { lang } = useLanguage();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  // Toast State
  const [toastData, setToastData] = useState({ isOpen: false, message: '', type: 'success' });
  const showToast = (message, type = 'success') => {
    setToastData({ isOpen: true, message, type });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/admin');
    } catch (err) {
      setError(lang === 'ar' ? 'البريد الإلكتروني أو كلمة المرور غير صحيحة.' : 'Invalid email or password.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSetupAdmin = async () => {
    setLoading(true);
    try {
      await createUserWithEmailAndPassword(auth, 'admin@burjalkhaleej.com', 'admin123');
      showToast('Admin account created: admin@burjalkhaleej.com / admin123', 'success');
    } catch (err) {
      if (err.code === 'auth/email-already-in-use') {
        showToast('Admin account already exists.', 'info');
      } else {
        showToast('Error: ' + err.message, 'error');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen flex flex-col items-center justify-center bg-surface-50 dark:bg-surface-950 px-4 transition-colors duration-500 overflow-hidden relative ${lang === 'ar' ? 'font-arabic' : ''}`}>
      {/* Decorative Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] aspect-square bg-primary-500/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] aspect-square bg-primary-500/10 blur-[120px] rounded-full pointer-events-none" />

      <header className="fixed top-0 left-0 right-0 p-6 flex justify-between items-center z-50">
        <Link to="/" className="flex items-center gap-2 text-surface-600 dark:text-surface-400 hover:text-primary-500 font-bold transition-colors bg-white/50 dark:bg-surface-900/50 backdrop-blur-md px-4 py-2 rounded-xl border border-surface-200 dark:border-surface-800">
          <ChevronLeft className={`w-5 h-5 ${lang === 'ar' ? 'rotate-180' : ''}`} />
          <span className="hidden sm:inline">{lang === 'ar' ? 'العودة للرئيسية' : 'Back Home'}</span>
        </Link>
        <div className="flex items-center gap-3">
          <LanguageToggle />
          <ThemeToggle />
        </div>
      </header>

      <motion.div 
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="max-w-md w-full glass p-8 sm:p-10 rounded-[40px] relative z-10 border border-surface-100 dark:border-surface-800 shadow-2xl"
      >
        <div className="text-center mb-10">
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", delay: 0.2 }}
            className="w-24 h-24 bg-surface-950 rounded-3xl flex items-center justify-center shadow-2xl mx-auto mb-8 border border-surface-800 overflow-hidden group"
          >
            <img src="/logo-round.png" alt="Logo" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
          </motion.div>
          <h1 className="text-3xl sm:text-4xl font-black text-surface-900 dark:text-surface-50 mb-3 uppercase tracking-tighter">
            {lang === 'ar' ? 'دخول الأدمن' : 'Admin Login'}
          </h1>
          <p className="text-surface-500 dark:text-surface-400 font-bold flex items-center justify-center gap-2">
            <ShieldCheck className="w-4 h-4 text-primary-500" />
            {lang === 'ar' ? 'لوحة التحكم الآمنة' : 'Secure dashboard access'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="block text-sm font-black text-surface-700 dark:text-surface-300 uppercase tracking-widest ml-1">{lang === 'ar' ? 'البريد الإلكتروني' : 'Email'}</label>
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-surface-400 group-focus-within:text-primary-500 transition-colors w-5 h-5" />
              <input
                type="email"
                required
                className="input-field pl-12 bg-surface-50/50 dark:bg-surface-900/50"
                placeholder="admin@burjalkhaleej.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-black text-surface-700 dark:text-surface-300 uppercase tracking-widest ml-1">{lang === 'ar' ? 'كلمة المرور' : 'Password'}</label>
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-surface-400 group-focus-within:text-primary-500 transition-colors w-5 h-5" />
              <input
                type="password"
                required
                className="input-field pl-12 bg-surface-50/50 dark:bg-surface-900/50"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          {error && (
            <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="bg-red-500/10 text-red-600 dark:text-red-400 p-4 rounded-2xl text-sm border border-red-500/20 font-bold flex items-center gap-3">
              <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
              {error}
            </motion.div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full py-5 text-xl relative overflow-hidden group shadow-primary-500/40"
          >
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
            <span className="relative z-10 flex items-center justify-center gap-3">
              {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : (lang === 'ar' ? 'تسجيل الدخول' : 'Sign In')}
            </span>
          </button>
        </form>
      </motion.div>

      <button 
        onClick={handleSetupAdmin}
        className="fixed bottom-20 text-[10px] text-surface-300 dark:text-surface-600 hover:text-primary-500 transition-colors uppercase tracking-[0.2em] font-black"
      >
        [ Setup Admin Account ]
      </button>

      <footer className="fixed bottom-8 text-surface-400 text-xs font-bold uppercase tracking-widest">
        &copy; {new Date().getFullYear()} Burj Al Khaleej Admin Portal
      </footer>

      <Toast 
        isOpen={toastData.isOpen} 
        message={toastData.message} 
        type={toastData.type} 
        onClose={() => setToastData(prev => ({ ...prev, isOpen: false }))} 
      />
    </div>
  );
};

export default Login;
