import { useState } from 'react';
import { useProducts } from '../features/products/hooks';
import { useCategories } from '../features/categories/hooks';
import { MessageSquare, Loader2, Filter, ChevronLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import ThemeToggle from '../components/ui/ThemeToggle';
import LanguageToggle from '../components/ui/LanguageToggle';
import { useLanguage } from '../context/LanguageContext';
import { translations } from '../lib/translations';

const Menu = () => {
  const { lang, formatPrice, region } = useLanguage();
  const t = translations[lang];
  const [selectedCategory, setSelectedCategory] = useState(null);
  const { data: categories, isLoading: categoriesLoading } = useCategories();
  const { data: products, isLoading: productsLoading } = useProducts(selectedCategory);

  const whatsappNumbers = {
    OM: '96897668570'
  };

  return (
    <div className={`min-h-screen bg-surface-50 dark:bg-surface-950 transition-colors duration-500 ${lang === 'ar' ? 'font-arabic' : ''}`}>
      <header className="glass sticky top-0 z-40 border-b border-surface-100 dark:border-surface-800">
        <div className="max-w-7xl mx-auto px-4 h-16 sm:h-20 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-surface-600 dark:text-surface-400 hover:text-primary-500 font-bold transition-colors">
            <ChevronLeft className={`w-5 h-5 ${lang === 'ar' ? 'rotate-180' : ''}`} />
            <span className="hidden sm:inline">{lang === 'ar' ? 'العودة' : lang === 'hi' ? 'वापस' : 'Back'}</span>
          </Link>
          <div className="flex items-center gap-3">
             <h1 className="text-xl sm:text-2xl font-black text-surface-900 dark:text-white uppercase tracking-tighter">{t.nav.menu}</h1>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <LanguageToggle />
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6 sm:py-12">
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
              {lang === 'ar' ? 'الكل' : lang === 'hi' ? 'सब कुछ' : 'All Items'}
            </button>
            {categoriesLoading ? (
              <div className="flex gap-2 sm:gap-3">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="w-20 sm:w-24 h-9 sm:h-11 bg-surface-200 dark:bg-white/10 animate-pulse rounded-2xl"></div>
                ))}
              </div>
            ) : (
              categories?.map(cat => (
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
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
              <div key={i} className="bg-white dark:bg-surface-900 rounded-2xl sm:rounded-3xl shadow-sm border border-surface-100 dark:border-surface-800 flex flex-col overflow-hidden">
                <div className="w-full aspect-square sm:aspect-[4/3] bg-surface-100 dark:bg-white/5 animate-pulse"></div>
                <div className="p-3 sm:p-4">
                  <div className="h-4 sm:h-5 w-3/4 bg-surface-100 dark:bg-white/5 animate-pulse rounded-lg mb-3"></div>
                  <div className="flex justify-between items-end">
                    <div className="h-4 w-1/3 bg-surface-100 dark:bg-white/5 animate-pulse rounded-lg"></div>
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-surface-100 dark:bg-white/5 animate-pulse rounded-xl"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : products?.length === 0 ? (
          <div className="text-center py-20">
            <MessageSquare className="w-16 h-16 text-surface-300 mx-auto mb-6" />
            <h3 className="text-xl font-bold text-surface-900 dark:text-white mb-2">{lang === 'ar' ? 'لا توجد منتجات' : 'No products found'}</h3>
            <p className="text-surface-500 dark:text-surface-400">{lang === 'ar' ? 'نحن نقوم بتحديث المنيو حالياً' : 'We\'re updating our menu. Please check back later!'}</p>
          </div>
        ) : (
          <motion.div layout className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-6">
            <AnimatePresence mode="popLayout">
              {products?.map((product) => (
                <motion.div
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  whileHover={{ y: -4 }}
                  transition={{ type: "spring", stiffness: 300, damping: 25 }}
                  key={product.id}
                  className="group bg-white dark:bg-surface-900 rounded-2xl sm:rounded-3xl shadow-sm hover:shadow-2xl transition-all duration-300 border border-surface-100 dark:border-surface-800 flex flex-col overflow-hidden"
                >
                  <div className="relative aspect-square sm:aspect-[4/3] w-full overflow-hidden bg-surface-100 dark:bg-surface-800">
                    <img 
                      src={product.imageUrl} 
                      alt={product.name} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    {!product.isAvailable && (
                      <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px] flex items-center justify-center z-10">
                        <span className="bg-red-500 text-white px-3 py-1 rounded-full text-[10px] sm:text-xs font-black uppercase tracking-wider shadow-lg">
                          {lang === 'ar' ? 'نفذت الكمية' : lang === 'hi' ? 'बिक गया' : 'Sold Out'}
                        </span>
                      </div>
                    )}
                  </div>
                  
                  <div className="p-3 sm:p-4 flex flex-col flex-grow bg-white dark:bg-surface-900 relative z-20">
                    <h3 className="font-bold text-surface-900 dark:text-white text-xs sm:text-base leading-tight mb-2 line-clamp-2 group-hover:text-primary-500 transition-colors">
                      {product.name}
                    </h3>
                    
                    <div className="mt-auto flex items-center justify-between gap-2">
                      <div className="flex flex-col">
                        <span className="text-primary-600 dark:text-primary-500 font-black text-sm sm:text-lg">
                          {formatPrice(product.price)}
                        </span>
                      </div>
                      
                      {product.isAvailable && (
                        <a 
                          href={`https://wa.me/${whatsappNumbers[region]}?text=I'd like to order ${product.name}`}
                          target="_blank"
                          rel="noreferrer"
                          className="w-8 h-8 sm:w-10 sm:h-10 bg-surface-100 dark:bg-surface-800 text-surface-600 dark:text-surface-300 hover:bg-primary-500 hover:text-black rounded-xl sm:rounded-2xl flex items-center justify-center transition-all duration-300 shrink-0 shadow-sm hover:shadow-primary-500/25 hover:scale-110 active:scale-95"
                        >
                          <MessageSquare className="w-4 h-4 sm:w-5 sm:h-5" />
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

      <footer className="pt-20 pb-10 bg-black text-white border-t border-white/5 relative overflow-hidden mt-20">
        <div className="absolute inset-0 bg-gradient-to-b from-primary-900/10 to-transparent pointer-events-none"></div>
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-8 mb-20">
            <div className="md:col-span-5">
              <div className="flex items-center gap-4 mb-6 group">
                <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10 group-hover:border-primary-500/50 transition-colors">
                  <img src="/logo-round.png" alt="Burj Al Khaleej Logo" className="w-10 h-10 object-cover" />
                </div>
                <div>
                  <h3 className="text-2xl font-black tracking-widest uppercase">BURJ AL KHALEEJ</h3>
                  <p className="text-primary-500 text-[10px] font-bold tracking-[0.3em] uppercase">{lang === 'ar' ? 'مخبز' : 'Bakery'}</p>
                </div>
              </div>
              <p className="text-surface-400/80 mb-8 max-w-sm text-sm leading-loose font-medium">
                {lang === 'ar' ? 'نصنع الحلويات بحب وشغف لنجعل كل لحظاتكم مميزة وطعم لا ينسى.' : 'Crafting premium sweets with love and passion to make every moment special and unforgettable.'}
              </p>
              <div className="flex items-center gap-4">
                <a href="https://instagram.com" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-surface-300 hover:bg-primary-500 hover:text-black transition-all">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                </a>
                <a href="https://facebook.com" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-surface-300 hover:bg-primary-500 hover:text-black transition-all">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
                </a>
                <a href="https://twitter.com" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-surface-300 hover:bg-primary-500 hover:text-black transition-all">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path></svg>
                </a>
                <a href="mailto:contact@burjalkhaleej.com" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-surface-300 hover:bg-primary-500 hover:text-black transition-all">
                   <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                </a>
              </div>
            </div>

            <div className="md:col-span-2 md:col-start-8">
              <h4 className="text-sm font-black text-white uppercase tracking-widest mb-6">{t.footer.links}</h4>
              <ul className="space-y-4">
                <li><Link to="/" className="text-surface-400/80 hover:text-primary-500 text-sm font-medium transition-colors">{t.nav.home}</Link></li>
                <li><Link to="/menu" className="text-surface-400/80 hover:text-primary-500 text-sm font-medium transition-colors">{t.nav.menu}</Link></li>
              </ul>
            </div>

            <div className="md:col-span-3">
              <h4 className="text-sm font-black text-white uppercase tracking-widest mb-6">{lang === 'ar' ? 'تواصل معنا' : 'Contact'}</h4>
              <ul className="space-y-4">
                <li className="flex items-center gap-3">
                  <svg className="w-4 h-4 text-primary-500 shrink-0" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                  <span className="text-surface-400/80 text-sm font-medium">+968 97668570</span>
                </li>
                <li className="flex items-center gap-3">
                  <svg className="w-4 h-4 text-primary-500 shrink-0" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                  <a href="mailto:contact@burjalkhaleej.com" className="text-surface-400/80 hover:text-primary-500 text-sm font-medium transition-colors">contact@burjalkhaleej.com</a>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-surface-500/60 text-xs font-medium uppercase tracking-widest">&copy; {new Date().getFullYear()} Burj Al Khaleej. All rights reserved.</p>
            <div className="flex items-center gap-6">
              <Link to="/login" className="text-surface-500/60 hover:text-primary-500 text-xs font-bold uppercase tracking-[0.2em] transition-colors">
                Staff Login
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Menu;
