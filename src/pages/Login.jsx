import { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Lock, Mail, Loader2, ChevronLeft, ShieldCheck, Eye, EyeOff } from 'lucide-react';
import ThemeToggle from '../components/ui/ThemeToggle';
import LanguageToggle from '../components/ui/LanguageToggle';
import { useLanguage } from '../context/LanguageContext';
import { motion } from 'framer-motion';
import Toast from '../components/ui/Toast';

const Login = () => {
  const { lang } = useLanguage();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [toastData, setToastData] = useState({ isOpen: false, message: '', type: 'success' });

  // Auto redirect if already logged in
  useEffect(() => {
    if (user && isAdmin) {
      const destination = location.state?.from?.pathname || '/admin';
      navigate(destination, { replace: true });
    }
  }, [user, isAdmin, navigate, location]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const cleanEmail = email.trim();
    if (!cleanEmail || !password) {
      setError(lang === 'ar' ? 'يرجى إدخال البريد الإلكتروني وكلمة المرور' : 'Please enter email and password.');
      return;
    }

    setLoading(true);
    try {
      await login(cleanEmail, password);
      const destination = location.state?.from?.pathname || '/admin';
      navigate(destination, { replace: true });
    } catch (err) {
      console.error("Authentication error:", err.code);
      setError(lang === 'ar' ? 'البريد الإلكتروني أو كلمة المرور غير صحيحة.' : 'Invalid email or password credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen flex flex-col items-center justify-center bg-surface-50 dark:bg-surface-950 px-4 transition-colors duration-500 overflow-hidden relative ${lang === 'ar' ? 'font-arabic' : ''}`}>
      {/* Background Gold Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[45%] aspect-square bg-primary-500/10 blur-[130px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[45%] aspect-square bg-primary-500/10 blur-[130px] rounded-full pointer-events-none" />

      <header className="fixed top-0 left-0 right-0 p-4 sm:p-6 flex justify-between items-center z-50 max-w-7xl mx-auto">
        <Link to="/" className="flex items-center gap-2 text-surface-600 dark:text-surface-400 hover:text-primary-500 font-bold transition-colors bg-white/70 dark:bg-surface-900/70 backdrop-blur-md px-4 py-2 rounded-2xl border border-surface-200 dark:border-surface-800 shadow-sm">
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
        className="max-w-md w-full bg-white/80 dark:bg-surface-900/80 backdrop-blur-2xl p-8 sm:p-10 rounded-[40px] relative z-10 border border-surface-200 dark:border-surface-800 shadow-2xl shadow-black/10 dark:shadow-black/50"
      >
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
            className="w-20 h-20 bg-black dark:bg-surface-950 rounded-3xl flex items-center justify-center shadow-2xl mx-auto mb-6 border border-white/10 overflow-hidden group"
          >
            <img src="/logo-round.png" alt="Burj Al Khaleej Logo" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
          </motion.div>

          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white mb-2 uppercase tracking-tighter">
            {lang === 'ar' ? 'تسجيل دخول الموظفين' : 'Staff Login'}
          </h1>
          <p className="text-slate-500 dark:text-slate-400 font-bold text-xs sm:text-sm flex items-center justify-center gap-2">
            <ShieldCheck className="w-4 h-4 text-primary-500" />
            {lang === 'ar' ? 'بوابة الإدارة الآمنة' : 'Secure Manager Portal'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <label className="block text-xs font-black text-slate-700 dark:text-slate-300 uppercase tracking-widest">
              {lang === 'ar' ? 'البريد الإلكتروني' : 'Email Address'}
            </label>
            <div className="relative group">
              <Mail className={`absolute ${lang === 'ar' ? 'right-4' : 'left-4'} top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-500 transition-colors w-5 h-5`} />
              <input
                type="email"
                required
                autoComplete="email"
                className={`input-field input-with-icon-left bg-surface-50 dark:bg-surface-950/50`}
                placeholder="admin@burjalkhaleej.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-black text-slate-700 dark:text-slate-300 uppercase tracking-widest">
              {lang === 'ar' ? 'كلمة المرور' : 'Password'}
            </label>
            <div className="relative group">
              <Lock className={`absolute ${lang === 'ar' ? 'right-4' : 'left-4'} top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-500 transition-colors w-5 h-5`} />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                autoComplete="current-password"
                className={`input-field input-with-icon-left bg-surface-50 dark:bg-surface-950/50 ${lang === 'ar' ? 'pl-12' : 'pr-12'}`}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className={`absolute ${lang === 'ar' ? 'left-4' : 'right-4'} top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors p-1`}
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {error && (
            <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="bg-red-500/10 text-red-600 dark:text-red-400 p-4 rounded-2xl text-xs sm:text-sm border border-red-500/20 font-bold flex items-center gap-3">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse shrink-0" />
              <span>{error}</span>
            </motion.div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full py-4 text-lg relative overflow-hidden group shadow-lg shadow-primary-500/30"
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (lang === 'ar' ? 'تسجيل الدخول' : 'Sign In')}
            </span>
          </button>
        </form>
      </motion.div>

      <footer className="mt-12 text-slate-400 text-xs font-bold uppercase tracking-widest text-center">
        &copy; {new Date().getFullYear()} Burj Al Khaleej Staff Portal
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
