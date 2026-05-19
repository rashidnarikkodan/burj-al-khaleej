import { Link } from 'react-router-dom';
import { ShoppingBag, ChevronRight, MapPin, Phone, Instagram, ArrowRight, Star, Clock, Heart, Award, Quote, Facebook, Twitter, Mail } from 'lucide-react';

const WhatsappIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
  </svg>
);
import { motion, useScroll, useSpring } from 'framer-motion';
import ThemeToggle from '../components/ui/ThemeToggle';
import LanguageToggle from '../components/ui/LanguageToggle';
import { useTheme } from '../context/ThemeContext';
import { useLanguage, regions } from '../context/LanguageContext';
import { translations } from '../lib/translations';
import { useLocations } from '../features/locations/hooks';
import { useCategories } from '../features/categories/hooks';

const Home = () => {
  const { theme } = useTheme();
  const { lang, region } = useLanguage();
  const t = translations[lang];


  const { data: dynamicCategories, isLoading: categoriesLoading } = useCategories();
  const { data: dynamicLocations, isLoading: locationsLoading } = useLocations(region);

  const whatsappNumbers = {
    OM: '96897668570'
  };

  const categories = dynamicCategories || [];
  const locations = dynamicLocations || [];

  const testimonials = [
    {
      name: lang === 'ar' ? "أحمد البلوشي" : "Ahmed Al-Balushi",
      role: lang === 'ar' ? "زبون دائم" : "Regular Customer",
      text: lang === 'ar' ? "أفضل كيك في عمان! كيك الرد فيلفيت رائع جداً. دائماً طازج ويصل في الوقت المحدد." : "The best cakes in the region! Their Red Velvet is legendary. Always fresh and delivered on time.",
      rating: 5
    },
    {
      name: lang === 'ar' ? "فاطمة سعيد" : "Fatima Said",
      role: lang === 'ar' ? "منظمة حفلات" : "Party Planner",
      text: lang === 'ar' ? "أنصح دائماً بمخبز برج الخليج لمناسباتي. حلوياتهم التقليدية أصيلة ولذيذة." : "I always recommend Burj Al Khaleej for my events. Their traditional sweets are authentic and delicious.",
      rating: 5
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.2 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  const openInGoogleMaps = (lat, lng) => {
    window.open(`https://www.google.com/maps?q=${lat},${lng}`, '_blank');
  };

  return (
    <div className={`min-h-screen bg-surface-50 dark:bg-surface-950 transition-colors duration-500 overflow-x-hidden ${lang === 'ar' ? 'font-arabic' : ''}`}>

      <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-surface-100 dark:border-surface-800">
        <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-12 h-12 bg-black dark:bg-white/5 rounded-xl flex items-center justify-center shadow-lg overflow-hidden border border-white/10 group-hover:scale-105 transition-transform">
              <img src="/logo-round.png" alt="Logo" className="w-full h-full object-cover" />
            </div>
            <div className="hidden sm:block">
              <span className="text-xl font-black text-slate-900 dark:text-white tracking-tighter leading-none block">BURJ AL KHALEEJ</span>
              <span className="text-[10px] font-bold text-primary-500 tracking-[0.2em] uppercase">{lang === 'ar' ? 'مخبز' : lang === 'hi' ? 'बेकरी' : 'BAKERY'}</span>
            </div>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <Link to="/" className="text-slate-600 dark:text-slate-400 hover:text-primary-500 font-bold transition-colors">{t.nav.home}</Link>
            <Link to="/menu" className="text-slate-600 dark:text-slate-400 hover:text-primary-500 font-bold transition-colors">{t.nav.menu}</Link>
          </div>

          <div className="flex items-center gap-3 sm:gap-4">
            <LanguageToggle />
            <ThemeToggle />
          </div>
        </div>
      </nav>

      <section className="relative pt-32 pb-20 overflow-hidden min-h-[90vh] flex items-center">
        <div className="absolute top-0 right-0 -z-10 w-1/2 h-full bg-primary-50/30 dark:bg-primary-900/5 rounded-l-[100px] hidden lg:block"></div>
        <div className="max-w-7xl mx-auto px-4 grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: lang === 'ar' ? 50 : -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <motion.span
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-block px-4 py-1.5 bg-primary-100 dark:bg-primary-900/20 text-primary-700 dark:text-primary-500 rounded-full text-sm font-bold mb-6 tracking-wide uppercase"
            >
              {t.hero.tagline}
            </motion.span>
            <h1 className="text-5xl lg:text-7xl font-black text-slate-900 dark:text-white leading-[1.1] mb-6">
              {lang === 'ar' ? (
                <>تذوق <span className="text-primary-500">الكمال</span> في كل لقمة</>
              ) : (
                <>Taste the <span className="text-primary-500 relative">Perfection
                  <svg className="absolute -bottom-2 left-0 w-full h-3 text-primary-200 dark:text-primary-900/30 -z-10" viewBox="0 0 100 10" preserveAspectRatio="none"><path d="M0 5 Q 25 0, 50 5 T 100 5" fill="none" stroke="currentColor" strokeWidth="8" /></svg>
                </span> in Every Bite</>
              )}
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-400 mb-10 max-w-lg leading-relaxed">
              {t.hero.desc}
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/menu" className="btn-primary px-8 py-4 text-lg group">
                {t.hero.explore}
                <ArrowRight className={`w-5 h-5 group-hover:translate-x-1 transition-transform ${lang === 'ar' ? 'rotate-180 group-hover:-translate-x-1' : ''}`} />
              </Link>
              <a href={`https://wa.me/${whatsappNumbers[region]}`} target="_blank" rel="noreferrer" className="btn-secondary px-8 py-4 text-lg">
                {t.hero.whatsapp}
              </a>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
            whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="relative"
          >
            <div className="relative z-10 rounded-[40px] overflow-hidden shadow-2xl rotate-3 hover:rotate-0 transition-transform duration-700 border-8 border-white dark:border-slate-900">
              <img src="https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&q=80&w=1200" alt="Bakery Hero" className="w-full aspect-[4/5] object-cover" />
            </div>
            <motion.div
              animate={{ y: [0, -15, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -bottom-10 -left-10 z-20 glass p-8 rounded-3xl shadow-2xl border-l-4 border-primary-500"
            >
              <p className="text-primary-600 font-black text-2xl">{t.hero.fresh}</p>
              <p className="text-slate-500 dark:text-slate-400 text-sm font-bold">{t.hero.bakedDaily}</p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <section className="py-24 bg-surface-50 dark:bg-surface-950 transition-colors">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: <Clock className="w-8 h-8" />, title: t.features.freshTitle, desc: t.features.freshDesc },
              { icon: <Award className="w-8 h-8" />, title: t.features.premiumTitle, desc: t.features.premiumDesc },
              { icon: <Heart className="w-8 h-8" />, title: t.features.heartTitle, desc: t.features.heartDesc }
            ].map((feature, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.2 }} className="p-8 rounded-[32px] bg-white dark:bg-surface-900 border border-surface-100 dark:border-surface-800 hover:shadow-xl transition-all group">
                <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900/20 rounded-2xl flex items-center justify-center text-primary-600 dark:text-primary-500 mb-6 group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">{feature.title}</h3>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-surface-100 dark:bg-surface-900/30 transition-colors duration-500">
        <div className="max-w-7xl mx-auto px-4 text-center mb-16">
          <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-5xl font-black text-slate-900 dark:text-white mb-6">{t.categories.title}</motion.h2>
          <motion.p initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }} className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">{t.categories.desc}</motion.p>
        </div>
        <motion.div variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} className="max-w-7xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {categoriesLoading ? (
            <div className="col-span-full flex justify-center py-20">
              <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : categories.length === 0 ? (
            <div className="col-span-full text-center py-20 bg-white dark:bg-surface-900 rounded-[40px] border border-dashed border-surface-200 dark:border-surface-800">
              <ShoppingBag className="w-16 h-16 text-surface-200 dark:text-surface-800 mx-auto mb-4" />
              <p className="text-surface-500 font-bold">{lang === 'ar' ? 'لا توجد فئات حالياً' : 'No categories found yet'}</p>
            </div>
          ) : (
            categories.map((cat, i) => (
              <motion.div key={cat.id} variants={itemVariants} className="group relative h-[450px] rounded-[40px] overflow-hidden shadow-2xl cursor-pointer">
                <img src={cat.imageUrl || 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&q=80&w=800'} alt={cat.name} className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-[1.5s]" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity"></div>
                <div className="absolute bottom-0 left-0 right-0 p-8">
                  <span className="text-primary-500 text-sm font-black uppercase tracking-widest mb-2 block">{lang === 'ar' ? 'فئة' : 'Category'}</span>
                  <h3 className="text-3xl font-black text-white mb-4">{cat.name}</h3>
                  <Link to="/menu" className="bg-white/10 backdrop-blur-md text-white border border-white/20 px-6 py-2 rounded-full font-bold flex items-center justify-center gap-2 w-fit group-hover:bg-primary-600 group-hover:border-primary-600 transition-all">
                    {t.categories.viewAll} <ChevronRight className={`w-4 h-4 ${lang === 'ar' ? 'rotate-180' : ''}`} />
                  </Link>
                </div>
              </motion.div>
            ))
          )}
        </motion.div>
      </section>

      <section className="py-24 bg-surface-50 dark:bg-surface-950 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-black text-slate-900 dark:text-white mb-6">{t.stores.title}</h2>
            <p className="text-xl text-slate-600 dark:text-slate-400">{t.stores.desc}</p>
          </div>

          <div className="relative w-full aspect-[16/9] lg:aspect-[21/9] bg-surface-100 dark:bg-surface-900 rounded-[50px] overflow-hidden shadow-inner border border-surface-200 dark:border-surface-800">
            <div className="absolute inset-0 opacity-30 dark:opacity-20 pointer-events-none">
              <svg className="w-full h-full" viewBox="0 0 1000 500" xmlns="http://www.w3.org/2000/svg">
                <path d="M100 100 Q 300 50 500 200 T 900 100" stroke="currentColor" strokeWidth="2" fill="none" className="text-slate-300 dark:text-slate-700" />
                <path d="M50 400 Q 250 350 450 450 T 850 400" stroke="currentColor" strokeWidth="2" fill="none" className="text-slate-300 dark:text-slate-700" />
              </svg>
            </div>

            {locations.map((loc, i) => (
              <motion.div key={loc.name} initial={{ opacity: 0, scale: 0 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.3, type: "spring" }} className="absolute z-30 cursor-pointer group" style={{ top: loc.top, left: loc.left }} onClick={() => openInGoogleMaps(loc.coords.lat, loc.coords.lng)}>
                <div className="relative">
                  <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-white dark:bg-surface-800 px-4 py-2 rounded-xl shadow-xl opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border border-surface-100 dark:border-surface-700">
                    <p className="font-bold text-slate-900 dark:text-white text-sm">{loc.name}</p>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400">{t.stores.directions}</p>
                  </div>
                  <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center shadow-lg group-hover:scale-125 transition-transform">
                    <MapPin className="text-white w-5 h-5" />
                  </div>
                  <div className="absolute inset-0 w-8 h-8 bg-primary-600 rounded-full animate-ping opacity-25"></div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="grid md:grid-cols-3 gap-8 mt-12">
            {locations.map((loc) => (
              <motion.div key={loc.name} whileHover={{ y: -10 }} onClick={() => openInGoogleMaps(loc.coords.lat, loc.coords.lng)} className="glass p-6 rounded-3xl cursor-pointer border-transparent hover:border-primary-500/30 transition-all text-center group">
                <h4 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{loc.name}</h4>
                <p className="text-slate-600 dark:text-slate-400 text-sm mb-4">{loc.desc}</p>
                <div className="text-primary-600 dark:text-primary-400 text-sm font-bold flex items-center justify-center gap-2 group-hover:gap-3 transition-all">
                  {t.stores.openMaps} <ArrowRight className={`w-4 h-4 ${lang === 'ar' ? 'rotate-180' : ''}`} />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-surface-100 dark:bg-surface-900/30 transition-colors duration-500">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-black text-slate-900 dark:text-white mb-6">{t.testimonials.title}</h2>
            <div className="flex justify-center gap-1">
              {[...Array(5)].map((_, i) => <Star key={i} className="w-6 h-6 text-primary-500 fill-primary-500" />)}
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {testimonials.map((t, i) => (
              <motion.div key={i} initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="bg-white dark:bg-surface-900 p-8 rounded-[40px] shadow-xl relative group hover:bg-primary-500 transition-all duration-500">
                <Quote className="absolute top-8 right-8 w-12 h-12 text-slate-100 dark:text-slate-800 group-hover:text-black/10 transition-colors" />
                <p className="text-slate-600 dark:text-slate-300 mb-8 italic leading-relaxed group-hover:text-black transition-colors font-medium">"{t.text}"</p>
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white text-lg group-hover:text-black transition-colors">{t.name}</h4>
                  <p className="text-primary-600 dark:text-primary-400 text-sm group-hover:text-black/70 transition-colors font-bold">{t.role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-surface-50 dark:bg-surface-950 transition-colors duration-500">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="bg-primary-500 rounded-[60px] p-12 lg:p-20 text-center text-black relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 w-96 h-96 bg-white/20 blur-[100px] rounded-full translate-x-1/2 -translate-y-1/2"></div>
            <div className="relative z-10">
              <h2 className="text-4xl lg:text-6xl font-black mb-8">{t.cta.title}</h2>
              <p className="text-xl text-black/70 mb-12 max-w-2xl mx-auto font-bold">{t.cta.desc}</p>
              <div className="flex flex-wrap justify-center gap-6">
                <a href={`tel:${locations[0]?.phone || ''}`} className="bg-black text-white px-10 py-5 rounded-full font-black text-xl hover:scale-105 transition-transform flex items-center gap-3">
                  <Phone className="w-6 h-6" />
                  {t.cta.callUs}
                </a>
                <a href={`https://wa.me/${whatsappNumbers[region]}`} target="_blank" rel="noreferrer" className="bg-white text-black px-10 py-5 rounded-full font-black text-xl hover:scale-105 transition-transform flex items-center gap-3">
                  <WhatsappIcon className="w-6 h-6" />
                  {t.cta.whatsapp}
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <footer className="pt-20 pb-10 bg-black text-white border-t border-white/5 relative overflow-hidden">
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
              <p className="text-slate-400/80 mb-8 max-w-sm text-sm leading-loose font-medium">
                {lang === 'ar' ? 'نصنع الحلويات بحب وشغف لنجعل كل لحظاتكم مميزة وطعم لا ينسى.' : 'Crafting premium sweets with love and passion to make every moment special and unforgettable.'}
              </p>
              <div className="flex items-center gap-4">
                <a href="https://www.instagram.com/burj__alkhaleej/" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-slate-300 hover:bg-primary-500 hover:text-black transition-all">
                  <Instagram className="w-4 h-4" />
                </a>
                <a href="https://facebook.com/burj__alkhaleej/" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-slate-300 hover:bg-primary-500 hover:text-black transition-all">
                  <Facebook className="w-4 h-4" />
                </a>
                <a href="https://twitter.com/burj__alkhaleej/" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-slate-300 hover:bg-primary-500 hover:text-black transition-all">
                  <Twitter className="w-4 h-4" />
                </a>
                <a href="mailto:burjalkhaleej@gmail.com" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-slate-300 hover:bg-primary-500 hover:text-black transition-all">
                  <Mail className="w-4 h-4" />
                </a>
              </div>
            </div>

            <div className="md:col-span-2 md:col-start-8">
              <h4 className="text-sm font-black text-white uppercase tracking-widest mb-6">{t.footer.links}</h4>
              <ul className="space-y-4">
                <li><Link to="/" className="text-slate-400/80 hover:text-primary-500 text-sm font-medium transition-colors">{t.nav.home}</Link></li>
                <li><Link to="/menu" className="text-slate-400/80 hover:text-primary-500 text-sm font-medium transition-colors">{t.nav.menu}</Link></li>
              </ul>
            </div>

            <div className="md:col-span-3">
              <h4 className="text-sm font-black text-white uppercase tracking-widest mb-6">{lang === 'ar' ? 'تواصل معنا' : 'Contact'}</h4>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-primary-500 shrink-0 mt-0.5" />
                  <span className="text-slate-400/80 text-sm font-medium">{locations[0]?.name || 'Main Outlet'}, {regions[region]?.name || ''}</span>
                </li>
                <li className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-primary-500 shrink-0" />
                  <span className="text-slate-400/80 text-sm font-medium">{locations[0]?.phone || ''}</span>
                </li>
                <li className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-primary-500 shrink-0" />
                  <a href="mailto:contact@burjalkhaleej.com" className="text-slate-400/80 hover:text-primary-500 text-sm font-medium transition-colors">contact@burjalkhaleej.com</a>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-slate-500/60 text-xs font-medium uppercase tracking-widest">&copy; {new Date().getFullYear()} Burj Al Khaleej. All rights reserved.</p>
            <div className="flex items-center gap-6">
              <Link to="/login" className="text-slate-500/60 hover:text-primary-500 text-xs font-bold uppercase tracking-[0.2em] transition-colors">
                Staff Login
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
