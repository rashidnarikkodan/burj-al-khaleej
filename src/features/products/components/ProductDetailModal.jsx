import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../../../context/LanguageContext';
import { getWhatsAppOrderUrl } from '../../../config/constants';

const ProductDetailModal = ({ product, categoryName, isOpen, onClose }) => {
  const { lang, formatPrice, region } = useLanguage();

  if (!isOpen || !product) return null;

  const orderMsg = lang === 'ar'
    ? `مرحباً، أود طلب: ${product.name}`
    : `Hello, I'd like to order: ${product.name}`;

  const whatsappUrl = getWhatsAppOrderUrl(region, orderMsg);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-surface-950/70 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-white dark:bg-surface-900 w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-t-[32px] sm:rounded-[32px] shadow-2xl border border-surface-100 dark:border-surface-800 relative break-words"
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-black/40 text-white hover:bg-black/60 flex items-center justify-center backdrop-blur-md transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="relative w-full aspect-[4/3] bg-surface-100 dark:bg-surface-800">
            <img
              src={product.imageUrl || 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&q=80&w=800'}
              alt={product.name}
              className="w-full h-full object-cover"
            />
            {!product.isAvailable && (
              <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] flex items-center justify-center">
                <span className="bg-red-500 text-white px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider shadow-lg">
                  {lang === 'ar' ? 'نفذت الكمية' : 'Sold Out'}
                </span>
              </div>
            )}
          </div>

          <div className="p-5 sm:p-8 space-y-5 sm:space-y-6">
            <div>
              {categoryName && (
                <span className="inline-block px-3 py-1 bg-primary-500/10 text-primary-600 dark:text-primary-400 rounded-full text-xs font-bold uppercase tracking-wider mb-3 break-words">
                  {categoryName}
                </span>
              )}
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white leading-tight break-words">
                {product.name}
              </h2>
              {product.description && (
                <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base font-medium leading-relaxed mt-3 break-words">
                  {product.description}
                </p>
              )}
            </div>

            <div className="flex items-center justify-between border-t border-b border-surface-100 dark:border-surface-800 py-4">
              <div>
                <span className="text-xs text-slate-400 font-bold uppercase tracking-wider block">
                  {lang === 'ar' ? 'السعر' : 'Price'}
                </span>
                <span className="text-2xl font-black text-primary-600 dark:text-primary-500">
                  {formatPrice(product.price)}
                </span>
              </div>
              <div className="flex items-center gap-2">
                {product.isAvailable ? (
                  <span className="flex items-center gap-1.5 text-xs font-bold text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 px-3 py-1.5 rounded-full">
                    <CheckCircle2 className="w-4 h-4" />
                    {lang === 'ar' ? 'متوفر' : 'Available'}
                  </span>
                ) : (
                  <span className="flex items-center gap-1.5 text-xs font-bold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 px-3 py-1.5 rounded-full">
                    <XCircle className="w-4 h-4" />
                    {lang === 'ar' ? 'غير متوفر' : 'Out of Stock'}
                  </span>
                )}
              </div>
            </div>

            {product.isAvailable && (
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noreferrer"
                className="btn-primary w-full py-4 text-lg flex items-center justify-center gap-3 shadow-lg shadow-primary-500/25"
              >
                <MessageSquare className="w-5 h-5" />
                {lang === 'ar' ? 'اطلب عبر واتساب' : 'Order via WhatsApp'}
              </a>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default ProductDetailModal;
