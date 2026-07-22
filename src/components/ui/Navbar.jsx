import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ChevronLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ThemeToggle from './ThemeToggle';
import LanguageToggle from './LanguageToggle';
import { useLanguage } from '../../context/LanguageContext';
import { translations } from '../../lib/translations';

const Navbar = ({ isMenuPage = false }) => {
  const { lang } = useLanguage();
  const t = translations[lang] || translations.en;
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass border-b border-surface-100 dark:border-surface-800">
      <div className="max-w-7xl mx-auto px-4 h-16 sm:h-20 flex items-center justify-between">

        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-black dark:bg-white/5 rounded-xl flex items-center justify-center shadow-lg overflow-hidden border border-white/10 group-hover:scale-105 transition-transform">
            <img src="/logo-round.png" alt="Burj Al Khaleej" className="w-full h-full object-cover" />
          </div>
          <div>
            <span className="text-base sm:text-xl font-black text-slate-900 dark:text-white tracking-tighter leading-none block uppercase">
              BURJ AL KHALEEJ
            </span>
            <span className="text-[9px] sm:text-[10px] font-bold text-primary-500 tracking-[0.2em] uppercase">
              {lang === 'ar' ? 'مخبز' : 'BAKERY'}
            </span>
          </div>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          <Link
            to="/"
            className={`font-bold transition-colors ${isActive('/')
                ? 'text-primary-500'
                : 'text-slate-600 dark:text-slate-400 hover:text-primary-500'
              }`}
          >
            {t.nav.home}
          </Link>
          <Link
            to="/menu"
            className={`font-bold transition-colors ${isActive('/menu')
                ? 'text-primary-500'
                : 'text-slate-600 dark:text-slate-400 hover:text-primary-500'
              }`}
          >
            {t.nav.menu}
          </Link>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <LanguageToggle />
          <ThemeToggle />
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2.5 text-surface-700 dark:text-surface-200 hover:text-primary-500 transition-colors rounded-xl active:bg-surface-100 dark:active:bg-surface-800"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
            />
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              className="absolute top-full left-0 right-0 bg-white dark:bg-surface-900 border-b border-surface-200 dark:border-surface-800 p-6 z-50 md:hidden shadow-2xl space-y-3"
            >
              <Link
                to="/"
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-4 py-3 rounded-2xl font-bold transition-colors ${
                  isActive('/')
                    ? 'bg-primary-500/10 text-primary-600 dark:text-primary-400 font-extrabold'
                    : 'text-surface-700 dark:text-surface-200 hover:bg-surface-100 dark:hover:bg-surface-800'
                }`}
              >
                {t.nav.home}
              </Link>
              <Link
                to="/menu"
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-4 py-3 rounded-2xl font-bold transition-colors ${
                  isActive('/menu')
                    ? 'bg-primary-500/10 text-primary-600 dark:text-primary-400 font-extrabold'
                    : 'text-surface-700 dark:text-surface-200 hover:bg-surface-100 dark:hover:bg-surface-800'
                }`}
              >
                {t.nav.menu}
              </Link>
              <Link
                to="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-4 py-3 rounded-2xl font-bold text-amber-600 dark:text-amber-400 bg-amber-500/10 hover:bg-amber-500/20 transition-colors"
              >
                {lang === 'ar' ? 'بوابة الإدارة (الأدمن)' : 'Staff Portal (Admin)'}
              </Link>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
