import React, { useState, useRef, useEffect } from 'react';
import { useLanguage, languages } from '../../context/LanguageContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, ChevronDown, Check } from 'lucide-react';

const LanguageToggle = ({ direction = 'down', align = 'right' }) => {
  const { lang, setLang } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const directionClasses = direction === 'up' ? 'bottom-full mb-2' : 'top-full mt-2';
  const alignClasses = align === 'right' ? 'right-0' : 'left-0';

  return (
    <div className="relative" ref={dropdownRef}>
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setIsOpen(!isOpen)}
        className="px-3 sm:px-4 py-2 rounded-xl border border-surface-200 dark:border-surface-800 text-xs sm:text-sm font-bold bg-white dark:bg-surface-900 text-surface-700 dark:text-white transition-all flex items-center gap-2 shadow-sm"
      >
        <Globe className="w-4 h-4 text-primary-500" />
        <span className="uppercase">{lang}</span>
        <ChevronDown className={`w-3 h-3 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: direction === 'up' ? -10 : 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: direction === 'up' ? -10 : 10, scale: 0.95 }}
            className={`absolute ${alignClasses} ${directionClasses} w-40 sm:w-48 bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-800 rounded-2xl shadow-2xl z-[100] overflow-hidden`}
          >
            <div className="p-3 sm:p-4">
              <p className="text-[10px] font-black text-surface-400 uppercase tracking-widest mb-2 sm:mb-3">Language</p>
              <div className="grid grid-cols-1 gap-1">
                {Object.entries(languages).map(([id, data]) => {
                  const fontClass = id === 'ar' ? 'font-arabic' : id === 'hi' ? 'font-hindi' : 'font-sans';
                  return (
                    <button
                      key={id}
                      onClick={() => {
                        setLang(id);
                        setIsOpen(false);
                      }}
                      className={`flex items-center justify-between px-3 py-2 rounded-lg transition-colors ${
                        lang === id ? 'bg-primary-50 dark:bg-primary-900/10 text-primary-600' : 'hover:bg-surface-50 dark:hover:bg-surface-800'
                      }`}
                    >
                      <span className={`font-bold text-xs sm:text-sm ${fontClass}`}>{data.name}</span>
                      {lang === id && <Check className="w-4 h-4" />}
                    </button>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LanguageToggle;
