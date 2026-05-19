import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X } from 'lucide-react';

const ConfirmDialog = ({ isOpen, onClose, onConfirm, title, message, confirmText, cancelText, type = 'danger' }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-surface-950/60 backdrop-blur-sm">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }} 
        animate={{ scale: 1, opacity: 1 }} 
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white dark:bg-surface-900 w-full max-w-md rounded-[32px] p-8 shadow-2xl border border-surface-100 dark:border-surface-800"
      >
        <div className="flex justify-between items-start mb-6">
          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${
            type === 'danger' ? 'bg-red-100 dark:bg-red-900/20 text-red-600' : 'bg-primary-100 dark:bg-primary-900/20 text-primary-600'
          }`}>
            <AlertTriangle className="w-8 h-8" />
          </div>
          <button onClick={onClose} className="p-2 text-surface-400 hover:text-surface-600 dark:hover:text-surface-200 transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-2 uppercase tracking-tighter">
          {title}
        </h3>
        <p className="text-slate-600 dark:text-slate-400 font-bold leading-relaxed mb-8">
          {message}
        </p>

        <div className="flex gap-4">
          <button 
            onClick={onClose} 
            className="btn-secondary flex-1 py-4"
          >
            {cancelText || 'Cancel'}
          </button>
          <button 
            onClick={() => {
              onConfirm();
              onClose();
            }} 
            className={`flex-[2] py-4 rounded-2xl font-black text-lg transition-all shadow-lg active:scale-95 ${
              type === 'danger' ? 'bg-red-600 hover:bg-red-700 text-white shadow-red-500/20' : 'btn-primary'
            }`}
          >
            {confirmText || 'Confirm'}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default ConfirmDialog;
