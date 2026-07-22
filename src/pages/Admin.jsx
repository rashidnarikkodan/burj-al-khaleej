import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  Package,
  Grid,
  LogOut,
  ChevronLeft,
  X,
  Menu as MenuIcon,
  MapPin as MapPinIcon,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import ThemeToggle from '../components/ui/ThemeToggle';
import LanguageToggle from '../components/ui/LanguageToggle';
import { useLanguage } from '../context/LanguageContext';
import { motion, AnimatePresence } from 'framer-motion';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import Toast from '../components/ui/Toast';

import ProductManager from '../features/products/components/ProductManager';
import CategoryManager from '../features/categories/components/CategoryManager';
import StoreManager from '../features/locations/components/StoreManager';

const Admin = () => {
  const { logout } = useAuth();
  const { lang } = useLanguage();
  const [activeTab, setActiveTab] = useState('products');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const [confirmData, setConfirmData] = useState({ isOpen: false, title: '', message: '', onConfirm: () => {} });
  const [toastData, setToastData] = useState({ isOpen: false, message: '', type: 'success' });

  const showToast = (message, type = 'success') => {
    setToastData({ isOpen: true, message, type });
  };

  const showConfirm = (title, message, onConfirm) => {
    setConfirmData({ isOpen: true, title, message, onConfirm });
  };

  const NavItems = () => (
    <>
      <button
        onClick={() => { setActiveTab('products'); setIsSidebarOpen(false); }}
        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${
          activeTab === 'products' ? 'bg-primary-500 text-black shadow-sm' : 'text-surface-500 dark:text-surface-400 hover:bg-surface-50 dark:hover:bg-surface-900/50'
        }`}
      >
        <Package className="w-5 h-5" />
        {lang === 'ar' ? 'المنتجات' : 'Products'}
      </button>
      <button
        onClick={() => { setActiveTab('categories'); setIsSidebarOpen(false); }}
        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${
          activeTab === 'categories' ? 'bg-primary-500 text-black shadow-sm' : 'text-surface-500 dark:text-surface-400 hover:bg-surface-50 dark:hover:bg-surface-900/50'
        }`}
      >
        <Grid className="w-5 h-5" />
        {lang === 'ar' ? 'الفئات' : 'Categories'}
      </button>
      <button
        onClick={() => { setActiveTab('stores'); setIsSidebarOpen(false); }}
        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${
          activeTab === 'stores' ? 'bg-primary-500 text-black shadow-sm' : 'text-surface-500 dark:text-surface-400 hover:bg-surface-50 dark:hover:bg-surface-900/50'
        }`}
      >
        <MapPinIcon className="w-5 h-5" />
        {lang === 'ar' ? 'الفروع' : 'Stores'}
      </button>
    </>
  );

  return (
    <div className={`min-h-screen bg-surface-50 dark:bg-surface-950 flex flex-col lg:flex-row transition-colors duration-500 ${lang === 'ar' ? 'font-arabic' : ''}`}>
      {/* Mobile Header */}
      <header className="lg:hidden glass sticky top-0 z-50 px-4 h-16 flex items-center justify-between border-b border-surface-100 dark:border-surface-800">
        <div className="flex items-center gap-3">
          <button onClick={() => setIsSidebarOpen(true)} className="p-2 -ml-2 text-slate-600 dark:text-slate-400">
            <MenuIcon className="w-6 h-6" />
          </button>
          <h1 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tighter">Admin</h1>
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <LanguageToggle />
        </div>
      </header>

      {/* Sidebar - Desktop */}
      <aside className="hidden lg:flex w-64 bg-white dark:bg-surface-900 border-r border-surface-100 dark:border-surface-800 flex-col fixed inset-y-0 transition-colors z-40">
        <div className="p-8">
          <Link to="/" className="flex items-center gap-2 mb-6 text-slate-500 hover:text-primary-500 transition-colors font-bold">
            <ChevronLeft className={`w-4 h-4 ${lang === 'ar' ? 'rotate-180' : ''}`} />
            <span className="text-sm">{lang === 'ar' ? 'الرئيسية' : 'Home'}</span>
          </Link>
          <div className="flex items-center gap-3 mb-4">
            <img src="/logo-round.png" alt="Logo" className="w-10 h-10 object-cover rounded-lg" />
            <h1 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">Admin</h1>
          </div>
          <p className="text-xs text-slate-400 uppercase tracking-widest font-black">Burj Al Khaleej</p>
        </div>

        <nav className="flex-1 px-4 space-y-2">
          <NavItems />
        </nav>

        <div className="p-4 space-y-4 border-t border-surface-50 dark:border-surface-800">
          <div className="flex justify-between items-center px-2">
            <LanguageToggle direction="up" align={lang === 'ar' ? 'right' : 'left'} />
            <ThemeToggle />
          </div>
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 font-bold hover:bg-red-50 dark:hover:bg-red-900/10 transition-all"
          >
            <LogOut className="w-5 h-5" />
            {lang === 'ar' ? 'تسجيل الخروج' : 'Logout'}
          </button>
        </div>
      </aside>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsSidebarOpen(false)} className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] lg:hidden" />
            <motion.aside initial={{ x: lang === 'ar' ? '100%' : '-100%' }} animate={{ x: 0 }} exit={{ x: lang === 'ar' ? '100%' : '-100%' }} className={`fixed inset-y-0 ${lang === 'ar' ? 'right-0' : 'left-0'} w-72 bg-surface-50 dark:bg-surface-900 z-[70] flex flex-col shadow-2xl lg:hidden`}>
              <div className="p-6 flex items-center justify-between border-b border-slate-100 dark:border-white/5">
                <h1 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">Menu</h1>
                <button onClick={() => setIsSidebarOpen(false)} className="p-2 text-slate-400"><X className="w-6 h-6" /></button>
              </div>
              <nav className="flex-1 p-4 space-y-2">
                <NavItems />
              </nav>
              <div className="p-6 border-t border-slate-100 dark:border-white/5">
                <button onClick={logout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 font-bold bg-red-50 dark:bg-red-900/10 transition-all">
                  <LogOut className="w-5 h-5" />
                  Logout
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <main className={`flex-1 p-4 sm:p-10 ${lang === 'ar' ? 'lg:mr-64' : 'lg:ml-64'}`}>
        <AnimatePresence mode="wait">
          {activeTab === 'products' ? (
            <motion.div key="products" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
              <ProductManager lang={lang} showToast={showToast} showConfirm={showConfirm} />
            </motion.div>
          ) : activeTab === 'categories' ? (
            <motion.div key="categories" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
              <CategoryManager lang={lang} showToast={showToast} showConfirm={showConfirm} />
            </motion.div>
          ) : (
            <motion.div key="stores" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
              <StoreManager lang={lang} showToast={showToast} showConfirm={showConfirm} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <ConfirmDialog
        isOpen={confirmData.isOpen}
        onClose={() => setConfirmData(prev => ({ ...prev, isOpen: false }))}
        onConfirm={confirmData.onConfirm}
        title={confirmData.title}
        message={confirmData.message}
      />
      <Toast
        isOpen={toastData.isOpen}
        message={toastData.message}
        type={toastData.type}
        onClose={() => setToastData(prev => ({ ...prev, isOpen: false }))}
      />
    </div>
  );
};

export default Admin;
