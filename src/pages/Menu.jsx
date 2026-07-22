import React, { useState } from 'react';
import { useProducts } from '../features/products/hooks';
import { useCategories } from '../features/categories/hooks';
import { MessageSquare, Search, Eye, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '../components/ui/Navbar';
import ProductDetailModal from '../features/products/components/ProductDetailModal';
import { useLanguage } from '../context/LanguageContext';
import { translations } from '../lib/translations';
import { getWhatsAppNumber } from '../config/constants';

const Menu = () => {
  const { lang, formatPrice, region } = useLanguage();
  const t = translations[lang] || translations.en;
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeModalProduct, setActiveModalProduct] = useState(null);

  const { data: categories, isLoading: categoriesLoading } = useCategories();
  const { data: products, isLoading: productsLoading } = useProducts(selectedCategory);

  const whatsappPhone = getWhatsAppNumber(region);

  const filteredProducts = products?.filter((product) =>
    product.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getCategoryName = (catId) => {
    return categories?.find((c) => c.id === catId)?.name || '';
  };

  return (
    <div className={`min-h-screen bg-surface-50 dark:bg-surface-950 transition-colors duration-500 ${lang === 'ar' ? 'font-arabic' : ''}`}>
      <Navbar isMenuPage={true} />

      <main className="max-w-7xl mx-auto px-4 pt-24 sm:pt-28 pb-12">
        <div className="mb-6 sm:mb-8 max-w-xl mx-auto">
          <div className="relative">
            <Search className={`absolute ${lang === 'ar' ? 'right-4' : 'left-4'} top-1/2 -translate-y-1/2 w-5 h-5 text-surface-400`} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={lang === 'ar' ? 'ابحث عن كيك أو حلويات...' : 'Search cakes, sweets, bakery...'}
              className="input-field input-with-icon-left shadow-sm"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className={`absolute ${lang === 'ar' ? 'left-4' : 'right-4'} top-1/2 -translate-y-1/2 text-surface-400 hover:text-surface-600 dark:hover:text-surface-200 transition-colors p-1`}
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        <section className="mb-6 sm:mb-10 sticky top-[64px] sm:top-[80px] z-30 bg-surface-50/90 dark:bg-surface-950/90 backdrop-blur-md py-3 sm:py-4 -mx-4 px-4 sm:mx-0 sm:px-0">
          <div className="flex gap-2 sm:gap-3 overflow-x-auto scrollbar-hide pb-2 snap-x">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`relative px-5 py-2 sm:px-6 sm:py-2.5 rounded-2xl font-bold text-sm sm:text-base transition-all whitespace-nowrap snap-start ${
                selectedCategory === null
                  ? 'text-black shadow-md'
                  : 'bg-white dark:bg-surface-900 text-surface-600 dark:text-surface-400 hover:bg-surface-100 dark:hover:bg-surface-800 shadow-sm border border-surface-200 dark:border-surface-800'
              }`}
            >
              {selectedCategory === null && (
                <motion.div layoutId="activeCategory" className="absolute inset-0 bg-primary-500 rounded-2xl -z-10" />
              )}
              {lang === 'ar' ? 'الكل' : 'All Items'}
            </button>
            {categoriesLoading ? (
              <div className="flex gap-2 sm:gap-3">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-20 sm:w-24 h-9 sm:h-11 bg-surface-200 dark:bg-white/10 animate-pulse rounded-2xl"></div>
                ))}
              </div>
            ) : (
              categories?.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`relative px-5 py-2 sm:px-6 sm:py-2.5 rounded-2xl font-bold text-sm sm:text-base transition-all whitespace-nowrap snap-start ${
                    selectedCategory === cat.id
                      ? 'text-black shadow-md'
                      : 'bg-white dark:bg-surface-900 text-surface-600 dark:text-surface-400 hover:bg-surface-100 dark:hover:bg-surface-800 shadow-sm border border-surface-200 dark:border-surface-800'
                  }`}
                >
                  {selectedCategory === cat.id && (
                    <motion.div layoutId="activeCategory" className="absolute inset-0 bg-primary-500 rounded-2xl -z-10" />
                  )}
                  {cat.name}
                </button>
              ))
            )}
          </div>
        </section>

        {productsLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-white dark:bg-surface-900 rounded-[32px] shadow-sm border border-surface-100 dark:border-surface-800 flex flex-col overflow-hidden">
                <div className="w-full h-56 sm:h-64 bg-surface-100 dark:bg-white/5 animate-pulse"></div>
                <div className="p-5 sm:p-6 space-y-3">
                  <div className="h-5 w-3/4 bg-surface-100 dark:bg-white/5 animate-pulse rounded-lg"></div>
                  <div className="h-4 w-full bg-surface-100 dark:bg-white/5 animate-pulse rounded-lg"></div>
                  <div className="flex justify-between items-end pt-4">
                    <div className="h-6 w-1/3 bg-surface-100 dark:bg-white/5 animate-pulse rounded-lg"></div>
                    <div className="w-20 h-9 bg-surface-100 dark:bg-white/5 animate-pulse rounded-xl"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredProducts?.length === 0 ? (
          <div className="text-center py-20 bg-white dark:bg-surface-900 rounded-[32px] border border-dashed border-surface-200 dark:border-surface-800">
            <MessageSquare className="w-16 h-16 text-surface-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-surface-900 dark:text-white mb-2">
              {lang === 'ar' ? 'لا توجد منتجات' : 'No products found'}
            </h3>
            <p className="text-surface-500 dark:text-surface-400 text-sm">
              {lang === 'ar' ? 'جرب البحث باسم آخر أو اختيار فئة مختلفة' : 'Try searching for something else or pick another category.'}
            </p>
          </div>
        ) : (
          <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
            <AnimatePresence mode="popLayout">
              {filteredProducts?.map((product) => (
                <motion.div
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  whileHover={{ y: -6 }}
                  transition={{ type: "spring", stiffness: 300, damping: 25 }}
                  key={product.id}
                  onClick={() => setActiveModalProduct(product)}
                  className="group bg-white dark:bg-surface-900 rounded-[32px] shadow-md hover:shadow-2xl transition-all duration-500 border border-surface-100 dark:border-surface-800 flex flex-col overflow-hidden cursor-pointer"
                >
                  <div className="relative h-56 sm:h-64 w-full overflow-hidden bg-surface-100 dark:bg-surface-800">
                    <img
                      src={product.imageUrl || 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&q=80&w=800'}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    />

                    {getCategoryName(product.categoryId) && (
                      <span className={`absolute top-4 ${lang === 'ar' ? 'right-4' : 'left-4'} bg-black/60 backdrop-blur-md text-white text-[11px] font-extrabold uppercase px-3.5 py-1 rounded-full shadow-lg border border-white/10 z-10`}>
                        {getCategoryName(product.categoryId)}
                      </span>
                    )}

                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <span className="bg-white/95 dark:bg-surface-900/95 text-slate-900 dark:text-white px-4 py-2 rounded-full text-xs font-black flex items-center gap-2 backdrop-blur-md shadow-xl border border-white/20">
                        <Eye className="w-4 h-4 text-primary-500" />
                        {lang === 'ar' ? 'عرض التفاصيل' : 'View Details'}
                      </span>
                    </div>

                    {!product.isAvailable && (
                      <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] flex items-center justify-center z-20">
                        <span className="bg-red-500 text-white px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider shadow-xl">
                          {lang === 'ar' ? 'نفذت الكمية' : 'Sold Out'}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="p-5 sm:p-6 flex flex-col flex-grow bg-white dark:bg-surface-900 relative z-20">
                    <h3 className="font-black text-surface-900 dark:text-white text-lg sm:text-xl leading-snug mb-1 group-hover:text-primary-500 transition-colors">
                      {product.name}
                    </h3>

                    <p className="text-xs sm:text-sm text-surface-500 dark:text-surface-400 font-medium leading-relaxed line-clamp-2 mb-4">
                      {product.description || (lang === 'ar' ? 'كيك ومخبوزات طازجة مصنوعة بكل حب يومياً.' : 'Freshly baked delights crafted daily with premium ingredients.')}
                    </p>

                    <div className="mt-auto flex items-center justify-between gap-3 pt-3 border-t border-surface-100 dark:border-surface-800/80">
                      <div className="flex flex-col">
                        <span className="text-[10px] text-surface-400 font-bold uppercase tracking-wider">{lang === 'ar' ? 'السعر' : 'Price'}</span>
                        <span className="text-primary-600 dark:text-primary-500 font-black text-lg sm:text-xl">
                          {formatPrice(product.price)}
                        </span>
                      </div>

                      {product.isAvailable && (
                        <a
                          href={`https://wa.me/${whatsappPhone}?text=${encodeURIComponent(
                            lang === 'ar'
                              ? `مرحباً، أود طلب: ${product.name}`
                              : `Hello, I'd like to order: ${product.name}`
                          )}`}
                          target="_blank"
                          rel="noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="px-4 py-2.5 bg-primary-500 text-black font-black text-xs sm:text-sm rounded-2xl flex items-center gap-2 hover:bg-primary-400 transition-all shadow-md shadow-primary-500/20 hover:scale-105 active:scale-95 shrink-0"
                          title="Order via WhatsApp"
                        >
                          <MessageSquare className="w-4 h-4 fill-black/20" />
                          <span>{lang === 'ar' ? 'طلب' : 'Order'}</span>
                        </a>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </main>

      <ProductDetailModal
        product={activeModalProduct}
        categoryName={activeModalProduct ? getCategoryName(activeModalProduct.categoryId) : ''}
        isOpen={Boolean(activeModalProduct)}
        onClose={() => setActiveModalProduct(null)}
      />

      <footer className="pt-16 pb-10 bg-black text-white border-t border-white/5 relative overflow-hidden mt-20">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">
          <div className="flex items-center gap-3">
            <img src="/logo-round.png" alt="Burj Al Khaleej" className="w-8 h-8 rounded-lg object-cover" />
            <span className="text-sm font-black uppercase tracking-widest">Burj Al Khaleej Bakery</span>
          </div>
          <p className="text-surface-500 text-xs font-medium uppercase tracking-widest">
            &copy; {new Date().getFullYear()} Burj Al Khaleej. All rights reserved.
          </p>
          <Link to="/login" className="text-surface-500 hover:text-primary-500 text-xs font-bold uppercase tracking-widest transition-colors">
            Staff Portal
          </Link>
        </div>
      </footer>
    </div>
  );
};

export default Menu;
