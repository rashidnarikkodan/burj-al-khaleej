import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  LayoutDashboard, 
  Package, 
  Grid, 
  LogOut, 
  Plus, 
  Edit2, 
  Trash2, 
  CheckCircle2, 
  XCircle,
  Upload,
  Loader2,
  Image as ImageIcon,
  ChevronLeft,
  X,
  Menu as MenuIcon,
  MapPin as MapPinIcon,
  Phone as PhoneIcon,
  Globe
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCategories, useAddCategory, useUpdateCategory, useDeleteCategory } from '../features/categories/hooks';
import { useProducts, useAddProduct, useUpdateProduct, useDeleteProduct, useToggleAvailability } from '../features/products/hooks';
import { uploadToCloudinary } from '../lib/cloudinary';
import { useLocations, useAddLocation, useUpdateLocation, useDeleteLocation } from '../features/locations/hooks';
import ThemeToggle from '../components/ui/ThemeToggle';
import LanguageToggle from '../components/ui/LanguageToggle';
import { useLanguage } from '../context/LanguageContext';
import { motion, AnimatePresence } from 'framer-motion';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import Toast from '../components/ui/Toast';

const Admin = () => {
  const { logout } = useAuth();
  const { lang } = useLanguage();
  const [activeTab, setActiveTab] = useState('products');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  // Custom Alert/Confirm States
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

      {/* Main Content */}
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

      {/* Global Modals */}
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

const ProductManager = ({ lang, showToast, showConfirm }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const { data: products, isLoading } = useProducts(selectedCategoryId);
  const { data: categories } = useCategories();
  const { formatPrice } = useLanguage();
  
  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 sm:mb-10">
        <div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">{lang === 'ar' ? 'المنتجات' : 'Products'}</h2>
          <p className="text-slate-500 dark:text-slate-400 mt-1 font-bold text-sm sm:text-base">{lang === 'ar' ? 'إدارة أصناف المخبز وتوفرها' : 'Manage your bakery items and availability'}</p>
        </div>
        <button 
          onClick={() => {
            setEditingProduct(null);
            setIsModalOpen(true);
          }}
          className="btn-primary w-full sm:w-auto"
        >
          <Plus className="w-5 h-5" />
          {lang === 'ar' ? 'إضافة منتج' : 'Add Product'}
        </button>
      </div>

      {/* Category Filter */}
      <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-2 scrollbar-hide">
        <button
          onClick={() => setSelectedCategoryId(null)}
          className={`px-5 py-2.5 rounded-2xl font-bold transition-all whitespace-nowrap ${
            selectedCategoryId === null 
            ? 'bg-primary-500 text-black shadow-lg shadow-primary-500/20' 
            : 'bg-white dark:bg-surface-900 text-surface-500 hover:bg-surface-50 dark:hover:bg-surface-800'
          }`}
        >
          {lang === 'ar' ? 'الكل' : 'All'}
        </button>
        {categories?.map(cat => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategoryId(cat.id)}
            className={`px-5 py-2.5 rounded-2xl font-bold transition-all whitespace-nowrap ${
              selectedCategoryId === cat.id 
              ? 'bg-primary-500 text-black shadow-lg shadow-primary-500/20' 
              : 'bg-white dark:bg-surface-900 text-surface-500 hover:bg-surface-50 dark:hover:bg-surface-800'
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-10 h-10 animate-spin text-primary-500" />
        </div>
      ) : products?.length === 0 ? (
        <div className="text-center py-20 bg-white dark:bg-surface-900 rounded-[32px] border border-dashed border-surface-200 dark:border-surface-800">
           <Package className="w-16 h-16 text-surface-200 dark:text-surface-800 mx-auto mb-4" />
           <p className="text-surface-500 font-bold">{lang === 'ar' ? 'لا يوجد منتجات حالياً' : 'No products found. Add your first item!'}</p>
        </div>
      ) : (
        <div className="grid gap-3 sm:gap-4">
          {products?.map(product => (
            <motion.div 
              layout
              key={product.id} 
              className="bg-white dark:bg-surface-900 p-3 sm:p-5 rounded-2xl shadow-sm border border-surface-100 dark:border-surface-800 flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6"
            >
              <div className="flex items-center gap-4 flex-1">
                <img src={product.imageUrl} alt={product.name} className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl object-cover" />
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-sm sm:text-base">{product.name}</h3>
                  <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm font-bold">
                    {categories?.find(c => c.id === product.categoryId)?.name || 'Uncategorized'} • {formatPrice(product.price)}
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-between sm:justify-end gap-4 border-t sm:border-0 pt-3 sm:pt-0">
                <ToggleBtn product={product} lang={lang} />
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => {
                      setEditingProduct(product);
                      setIsModalOpen(true);
                    }}
                    className="p-2 text-slate-400 hover:text-primary-500 transition-colors"
                  >
                    <Edit2 className="w-5 h-5" />
                  </button>
                  <DeleteBtn product={product} showConfirm={showConfirm} showToast={showToast} />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {isModalOpen && (
        <ProductModal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
          product={editingProduct}
          categories={categories}
          defaultCategoryId={selectedCategoryId}
          lang={lang}
          showToast={showToast}
        />
      )}
    </div>
  );
};

const ToggleBtn = ({ product, lang }) => {
  const toggle = useToggleAvailability();
  return (
    <button 
      onClick={() => toggle.mutate({ id: product.id, currentStatus: product.isAvailable })}
      disabled={toggle.isPending}
      className={`px-3 sm:px-4 py-1.5 rounded-full text-[10px] sm:text-xs font-black uppercase tracking-wider flex items-center gap-2 transition-all ${
        product.isAvailable ? 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400' : 'bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400'
      }`}
    >
      {toggle.isPending ? <Loader2 className="w-3 h-3 animate-spin" /> : product.isAvailable ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
      {product.isAvailable ? (lang === 'ar' ? 'متوفر' : 'Available') : (lang === 'ar' ? 'نفذت' : 'Sold Out')}
    </button>
  );
};

const DeleteBtn = ({ product, showConfirm, showToast }) => {
  const del = useDeleteProduct();
  return (
    <button 
      onClick={() => {
        showConfirm(
          'Delete Product?',
          `Are you sure you want to delete "${product.name}"? This action cannot be undone.`,
          () => {
            del.mutate(product.id, {
              onSuccess: () => showToast('Product deleted successfully'),
              onError: () => showToast('Failed to delete product', 'error')
            });
          }
        );
      }}
      disabled={del.isPending}
      className="p-2 text-slate-400 hover:text-red-500 transition-colors"
    >
      {del.isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Trash2 className="w-5 h-5" />}
    </button>
  );
};

const ProductModal = ({ product, onClose, categories, defaultCategoryId, lang, showToast }) => {
  const [name, setName] = useState(product?.name || '');
  const [price, setPrice] = useState(product?.price || '');
  const [categoryId, setCategoryId] = useState(product?.categoryId || defaultCategoryId || '');
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(product?.imageUrl || '');
  const [isUploading, setIsUploading] = useState(false);
  
  const [isSaving, setIsSaving] = useState(false);
  
  const addMutation = useAddProduct();
  const updateMutation = useUpdateProduct();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      let imageUrl = product?.imageUrl || '';
      if (imageFile) {
        imageUrl = await uploadToCloudinary(imageFile);
      }

      const data = {
        name,
        price: parseFloat(price),
        categoryId,
        imageUrl,
        isAvailable: product ? product.isAvailable : true
      };

      if (product) {
        await updateMutation.mutateAsync({ id: product.id, data });
        showToast(lang === 'ar' ? 'تم تحديث المنتج بنجاح' : 'Product updated successfully');
      } else {
        await addMutation.mutateAsync(data);
        showToast(lang === 'ar' ? 'تم إضافة المنتج بنجاح' : 'Product added successfully');
      }
      onClose();
    } catch (err) {
      console.error("Error saving product:", err);
      showToast(lang === 'ar' ? 'خطأ في حفظ المنتج' : 'Error saving product', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-surface-950/60 backdrop-blur-sm animate-reveal">
      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white dark:bg-surface-900 w-full max-w-xl rounded-[32px] p-6 sm:p-8 shadow-2xl overflow-y-auto max-h-[90vh] border border-surface-100 dark:border-surface-800">
        <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mb-6 uppercase tracking-tighter">
          {product ? (lang === 'ar' ? 'تعديل المنتج' : 'Edit Product') : (lang === 'ar' ? 'إضافة منتج جديد' : 'Add New Product')}
        </h3>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex flex-col items-center gap-4 p-4 sm:p-6 border-2 border-dashed border-slate-100 dark:border-white/10 rounded-3xl bg-slate-50 dark:bg-black/20">
            {preview ? (
              <img src={preview} alt="Preview" className="w-32 h-32 sm:w-40 sm:h-40 object-cover rounded-2xl shadow-lg" />
            ) : (
              <div className="w-32 h-32 sm:w-40 sm:h-40 bg-slate-200 dark:bg-white/5 rounded-2xl flex items-center justify-center">
                <ImageIcon className="w-10 h-10 sm:w-12 sm:h-12 text-slate-400 dark:text-slate-600" />
              </div>
            )}
            <label className="btn-secondary text-sm cursor-pointer py-2 px-4">
              <Upload className="w-4 h-4" />
              {lang === 'ar' ? 'رفع صورة' : 'Upload Image'}
              <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
            </label>
          </div>

          <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">{lang === 'ar' ? 'اسم المنتج' : 'Product Name'}</label>
              <input required value={name} onChange={(e) => setName(e.target.value)} className="input-field" placeholder="e.g. Red Velvet" />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">{lang === 'ar' ? 'السعر' : 'Price'}</label>
              <input required type="number" step="0.001" value={price} onChange={(e) => setPrice(e.target.value)} className="input-field" placeholder="0.000" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">{lang === 'ar' ? 'الفئة' : 'Category'}</label>
            <select required value={categoryId} onChange={(e) => setCategoryId(e.target.value)} className="input-field">
              <option value="">{lang === 'ar' ? 'اختر فئة' : 'Select a category'}</option>
              {categories?.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
            </select>
          </div>

          <div className="flex gap-4 pt-4">
            <button type="button" onClick={onClose} disabled={isSaving} className="btn-secondary flex-1">{lang === 'ar' ? 'إلغاء' : 'Cancel'}</button>
            <button type="submit" disabled={isSaving} className="btn-primary flex-[2]">
              {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : product ? (lang === 'ar' ? 'تحديث' : 'Update') : (lang === 'ar' ? 'إضافة' : 'Add Product')}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

const CategoryManager = ({ lang, showToast, showConfirm }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const { data: categories, isLoading } = useCategories();
  const delMutation = useDeleteCategory();

  return (
    <div className="max-w-4xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 sm:mb-10">
        <div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">{lang === 'ar' ? 'الفئات' : 'Categories'}</h2>
          <p className="text-slate-500 dark:text-slate-400 mt-1 font-bold text-sm sm:text-base">{lang === 'ar' ? 'تنظيم المنتجات حسب الفئات' : 'Organize your products with categories'}</p>
        </div>
        <button 
          onClick={() => {
            setEditingCategory(null);
            setIsModalOpen(true);
          }}
          className="btn-primary w-full sm:w-auto"
        >
          <Plus className="w-5 h-5" />
          {lang === 'ar' ? 'إضافة فئة' : 'Add Category'}
        </button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-40">
          <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
        </div>
      ) : categories?.length === 0 ? (
        <div className="text-center py-10 bg-white dark:bg-surface-900 rounded-[32px] border border-dashed border-surface-200 dark:border-surface-800">
           <Grid className="w-12 h-12 text-surface-200 dark:text-surface-800 mx-auto mb-4" />
           <p className="text-surface-500 font-bold">{lang === 'ar' ? 'لا يوجد فئات' : 'No categories found'}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories?.map(cat => (
            <motion.div 
              layout
              key={cat.id} 
              className="bg-white dark:bg-surface-900 p-4 rounded-2xl shadow-sm border border-surface-100 dark:border-surface-800 flex items-center justify-between gap-4"
            >
                <div className="w-10 h-10 rounded-xl overflow-hidden shadow-sm">
                  {cat.imageUrl ? (
                    <img src={cat.imageUrl} alt={cat.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-primary-100 dark:bg-primary-900/20 flex items-center justify-center text-primary-600 font-bold uppercase">
                      {cat.name.charAt(0)}
                    </div>
                  )}
                </div>
                <h3 className="font-bold text-slate-900 dark:text-white">{cat.name}</h3>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => {
                    setEditingCategory(cat);
                    setIsModalOpen(true);
                  }}
                  className="p-2 text-slate-400 hover:text-primary-500 transition-colors"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => {
                    showConfirm(
                      lang === 'ar' ? 'حذف الفئة؟' : 'Delete Category?',
                      lang === 'ar' ? `هل أنت متأكد من حذف فئة "${cat.name}"؟ سيتم إلغاء تصنيف جميع المنتجات المرتبطة بها.` : `Are you sure you want to delete "${cat.name}"? This will leave products in this category uncategorized.`,
                      () => {
                        delMutation.mutate(cat.id, {
                          onSuccess: () => showToast(lang === 'ar' ? 'تم حذف الفئة' : 'Category deleted'),
                          onError: (err) => {
                            console.error("Delete category error:", err);
                            showToast(lang === 'ar' ? 'خطأ في حذف الفئة. تحقق من صلاحيات Firestore.' : 'Failed to delete category. Check Firestore rules.', 'error');
                          }
                        });
                      }
                    );
                  }}
                  disabled={delMutation.isPending}
                  className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                >
                  {delMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {isModalOpen && (
        <CategoryModal 
          isOpen={isModalOpen} 
          onClose={() => {
            setIsModalOpen(false);
            setEditingCategory(null);
          }} 
          category={editingCategory}
          lang={lang}
          showToast={showToast}
        />
      )}
    </div>
  );
};

const CategoryModal = ({ category, onClose, lang, showToast }) => {
  const [name, setName] = useState(category?.name || '');
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(category?.imageUrl || '');
  const [isSaving, setIsSaving] = useState(false);
  
  const addMutation = useAddCategory();
  const updateMutation = useUpdateCategory();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      let imageUrl = category?.imageUrl || '';
      if (imageFile) {
        imageUrl = await uploadToCloudinary(imageFile);
      }

      const data = { name, imageUrl };

      if (category) {
        await updateMutation.mutateAsync({ id: category.id, data });
        showToast(lang === 'ar' ? 'تم تحديث الفئة' : 'Category updated');
      } else {
        await addMutation.mutateAsync(data);
        showToast(lang === 'ar' ? 'تم إضافة الفئة' : 'Category added');
      }
      onClose();
    } catch (err) {
      console.error("Category save error:", err);
      showToast(lang === 'ar' ? 'خطأ في الحفظ. تحقق من قواعد Firestore.' : 'Save failed. Check Firestore rules.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-surface-950/60 backdrop-blur-sm animate-reveal">
      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white dark:bg-surface-900 w-full max-w-md rounded-[32px] p-6 sm:p-8 shadow-2xl border border-surface-100 dark:border-surface-800">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">
            {category ? (lang === 'ar' ? 'تعديل الفئة' : 'Edit Category') : (lang === 'ar' ? 'إضافة فئة' : 'Add Category')}
          </h3>
          <button onClick={onClose} className="p-2 hover:bg-surface-100 dark:hover:bg-surface-800 rounded-xl transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex flex-col items-center gap-4 p-4 sm:p-6 border-2 border-dashed border-slate-100 dark:border-white/10 rounded-3xl bg-slate-50 dark:bg-black/20">
            {preview ? (
              <img src={preview} alt="Preview" className="w-32 h-32 object-cover rounded-2xl shadow-lg" />
            ) : (
              <div className="w-32 h-32 bg-slate-200 dark:bg-white/5 rounded-2xl flex items-center justify-center">
                <ImageIcon className="w-8 h-8 text-slate-400 dark:text-slate-600" />
              </div>
            )}
            <label className="btn-secondary text-sm cursor-pointer py-2 px-4">
              <Upload className="w-4 h-4" />
              {lang === 'ar' ? 'رفع صورة' : 'Upload Image'}
              <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
            </label>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">{lang === 'ar' ? 'اسم الفئة' : 'Category Name'}</label>
            <input required value={name} onChange={(e) => setName(e.target.value)} className="input-field" placeholder="e.g. Cakes" />
          </div>
          <div className="flex gap-4">
            <button type="button" onClick={onClose} disabled={isSaving} className="btn-secondary flex-1">{lang === 'ar' ? 'إلغاء' : 'Cancel'}</button>
            <button type="submit" disabled={isSaving} className="btn-primary flex-[2]">
              {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : (lang === 'ar' ? 'حفظ' : 'Save')}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

const StoreManager = ({ lang, showToast, showConfirm }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStore, setEditingStore] = useState(null);
  const { data: stores, isLoading } = useLocations();
  const delMutation = useDeleteLocation();

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 sm:mb-10">
        <div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">{lang === 'ar' ? 'الفروع' : 'Stores'}</h2>
          <p className="text-slate-500 dark:text-slate-400 mt-1 font-bold text-sm sm:text-base">{lang === 'ar' ? 'إدارة فروع المخبز ومعلومات التواصل' : 'Manage your bakery stores and contact info'}</p>
        </div>
        <button 
          onClick={() => {
            setEditingStore(null);
            setIsModalOpen(true);
          }}
          className="btn-primary w-full sm:w-auto"
        >
          <Plus className="w-5 h-5" />
          {lang === 'ar' ? 'إضافة فرع' : 'Add Store'}
        </button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-10 h-10 animate-spin text-primary-500" />
        </div>
      ) : stores?.length === 0 ? (
        <div className="text-center py-20 bg-white dark:bg-surface-900 rounded-[32px] border border-dashed border-surface-200 dark:border-surface-800">
           <MapPinIcon className="w-16 h-16 text-surface-200 dark:text-surface-800 mx-auto mb-4" />
           <p className="text-surface-500 font-bold">{lang === 'ar' ? 'لا يوجد فروع' : 'No stores found'}</p>
        </div>
      ) : (
        <div className="grid gap-3 sm:gap-4">
          {stores?.map(store => (
            <motion.div 
              layout
              key={store.id} 
              className="bg-white dark:bg-surface-900 p-4 sm:p-5 rounded-2xl shadow-sm border border-surface-100 dark:border-surface-800 flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6"
            >
              <div className="flex items-center gap-4 flex-1">
                <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/20 rounded-xl flex items-center justify-center text-primary-600">
                  <MapPinIcon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-sm sm:text-base">{store.name}</h3>
                  <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm font-bold">{store.region} • {store.phone}</p>
                </div>
              </div>
              <div className="flex items-center justify-end gap-2">
                <button 
                  onClick={() => {
                    setEditingStore(store);
                    setIsModalOpen(true);
                  }}
                  className="p-2 text-slate-400 hover:text-primary-500 transition-colors"
                >
                  <Edit2 className="w-5 h-5" />
                </button>
                <button 
                  onClick={() => {
                    showConfirm(
                      lang === 'ar' ? 'حذف الفرع؟' : 'Delete Store?',
                      lang === 'ar' ? `هل أنت متأكد من حذف فرع "${store.name}"؟` : `Are you sure you want to delete "${store.name}" store?`,
                      () => {
                        delMutation.mutate(store.id, {
                          onSuccess: () => showToast(lang === 'ar' ? 'تم حذف الفرع' : 'Store deleted'),
                          onError: () => showToast(lang === 'ar' ? 'خطأ في حذف الفرع' : 'Error deleting store', 'error')
                        });
                      }
                    );
                  }}
                  disabled={delMutation.isPending}
                  className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                >
                  {delMutation.isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Trash2 className="w-5 h-5" />}
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {isModalOpen && (
        <StoreModal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
          store={editingStore}
          lang={lang}
          showToast={showToast}
        />
      )}
    </div>
  );
};

const StoreModal = ({ store, onClose, lang, showToast }) => {
  const [name, setName] = useState(store?.name || '');
  const [desc, setDesc] = useState(store?.desc || '');
  const [phone, setPhone] = useState(store?.phone || '');
  const [regionCode, setRegionCode] = useState(store?.region || 'OM');
  const [lat, setLat] = useState(store?.coords?.lat || '');
  const [lng, setLng] = useState(store?.coords?.lng || '');
  const [top, setTop] = useState(store?.top || '50%');
  const [left, setLeft] = useState(store?.left || '50%');
  
  const [isSaving, setIsSaving] = useState(false);
  
  const addMutation = useAddLocation();
  const updateMutation = useUpdateLocation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    const parsedLat = parseFloat(lat);
    const parsedLng = parseFloat(lng);

    if (isNaN(parsedLat) || isNaN(parsedLng)) {
      showToast('Please enter valid coordinates', 'error');
      setIsSaving(false);
      return;
    }

    const data = {
      name,
      desc,
      phone,
      region: regionCode,
      coords: { lat: parsedLat, lng: parsedLng },
      top: top.includes('%') ? top : `${top}%`,
      left: left.includes('%') ? left : `${left}%`
    };

    try {
      if (store) {
        await updateMutation.mutateAsync({ id: store.id, data });
        showToast(lang === 'ar' ? 'تم تحديث الفرع بنجاح' : 'Store updated successfully');
      } else {
        await addMutation.mutateAsync(data);
        showToast(lang === 'ar' ? 'تم إضافة الفرع بنجاح' : 'Store added successfully');
      }
      onClose();
    } catch (err) {
      console.error("Error saving store:", err);
      showToast(err.message || (lang === 'ar' ? 'خطأ في حفظ الفرع' : 'Error saving store'), 'error');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-surface-950/60 backdrop-blur-sm animate-reveal">
      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white dark:bg-surface-900 w-full max-w-xl rounded-[32px] p-6 sm:p-8 shadow-2xl overflow-y-auto max-h-[90vh] border border-surface-100 dark:border-surface-800">
        <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mb-6 uppercase tracking-tighter">
          {store ? (lang === 'ar' ? 'تعديل الفرع' : 'Edit Store') : (lang === 'ar' ? 'إضافة فرع جديد' : 'Add New Store')}
        </h3>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold mb-2">{lang === 'ar' ? 'الاسم' : 'Store Name'}</label>
              <input required value={name} onChange={(e) => setName(e.target.value)} className="input-field" placeholder={lang === 'ar' ? 'اسم الفرع' : 'Al Bidayah'} />
            </div>
            <div>
              <label className="block text-sm font-bold mb-2">{lang === 'ar' ? 'الهاتف' : 'Phone'}</label>
              <input required value={phone} onChange={(e) => setPhone(e.target.value)} className="input-field" placeholder="+968 0000 0000" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-bold mb-2">{lang === 'ar' ? 'الوصف / العنوان' : 'Description / Address'}</label>
            <input required value={desc} onChange={(e) => setDesc(e.target.value)} className="input-field" placeholder={lang === 'ar' ? 'الشارع الرئيسي، البداية' : 'Main Street, Al Bidayah'} />
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold mb-2">{lang === 'ar' ? 'المنطقة' : 'Region'}</label>
              <select value={regionCode} onChange={(e) => setRegionCode(e.target.value)} className="input-field">
                <option value="OM">{lang === 'ar' ? 'عمان' : 'Oman'}</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold mb-2">{lang === 'ar' ? 'الإحداثيات (خط العرض/الطول)' : 'Location (Lat/Lng)'}</label>
              <div className="flex gap-2">
                <input required value={lat} onChange={(e) => setLat(e.target.value)} className="input-field" placeholder="Lat" />
                <input required value={lng} onChange={(e) => setLng(e.target.value)} className="input-field" placeholder="Lng" />
              </div>
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
               <label className="block text-sm font-bold mb-2">{lang === 'ar' ? 'موقع الخريطة (أعلى %)' : 'Map Top (%)'}</label>
               <input required value={top} onChange={(e) => setTop(e.target.value)} className="input-field" placeholder="40%" />
            </div>
            <div>
               <label className="block text-sm font-bold mb-2">{lang === 'ar' ? 'موقع الخريطة (يسار %)' : 'Map Left (%)'}</label>
               <input required value={left} onChange={(e) => setLeft(e.target.value)} className="input-field" placeholder="35%" />
            </div>
          </div>
          <div className="flex gap-4 pt-4">
            <button type="button" onClick={onClose} disabled={isSaving} className="btn-secondary flex-1">{lang === 'ar' ? 'إلغاء' : 'Cancel'}</button>
            <button type="submit" disabled={isSaving} className="btn-primary flex-[2]">
              {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : (lang === 'ar' ? 'حفظ الفرع' : 'Save Store')}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default Admin;
