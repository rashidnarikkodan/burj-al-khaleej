import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, XCircle, Info, X } from 'lucide-react';

const Toast = ({ message, type = 'success', isOpen, onClose, duration = 3000 }) => {
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [isOpen, duration, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[300] w-[90%] max-w-sm"
        >
          <div className={`glass p-4 rounded-2xl shadow-2xl border flex items-center gap-4 ${
            type === 'success' ? 'border-green-500/20 bg-green-500/10' : 
            type === 'error' ? 'border-red-500/20 bg-red-500/10' : 
            'border-primary-500/20 bg-primary-500/10'
          }`}>
            <div className={`shrink-0 ${
              type === 'success' ? 'text-green-500' : 
              type === 'error' ? 'text-red-500' : 
              'text-primary-500'
            }`}>
              {type === 'success' && <CheckCircle2 className="w-6 h-6" />}
              {type === 'error' && <XCircle className="w-6 h-6" />}
              {type === 'info' && <Info className="w-6 h-6" />}
            </div>
            
            <p className="flex-1 font-bold text-sm text-slate-900 dark:text-white">
              {message}
            </p>

            <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600 transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Toast;
