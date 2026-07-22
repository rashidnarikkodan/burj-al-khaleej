import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Package, Plus, Edit2, Trash2, CheckCircle2, XCircle, Loader2, Search, SlidersHorizontal, ArrowUpDown, X, RotateCcw } from 'lucide-react';
import { useProducts, useDeleteProduct, useToggleAvailability } from '../hooks';
import { useCategories } from '../../categories/hooks';
import { useLanguage } from '../../../context/LanguageContext';
import ProductModal from './ProductModal';

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

const DeleteBtn = ({ product, showConfirm, showToast, lang }) => {
  const del = useDeleteProduct();
  return (
    <button
      onClick={() => {
        showConfirm(
          lang === 'ar' ? 'حذف المنتج؟' : 'Delete Product?',
          lang === 'ar' ? `هل أنت متأكد من حذف "${product.name}"؟` : `Are you sure you want to delete "${product.name}"? This action cannot be undone.`,
          () => {
            del.mutate(product.id, {
              onSuccess: () => showToast(lang === 'ar' ? 'تم حذف المنتج' : 'Product deleted successfully'),
              onError: () => showToast(lang === 'ar' ? 'فشل حذف المنتج' : 'Failed to delete product', 'error')
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

const ProductManager = ({ lang, showToast, showConfirm }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  
  // Search, Filter & Sort State
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all'); // 'all', 'available', 'soldout'
  const [sortBy, setSortBy] = useState('newest'); // 'newest', 'name-asc', 'name-desc', 'price-low', 'price-high'

  const { data: products, isLoading } = useProducts(selectedCategoryId);
  const { data: categories } = useCategories();
  const { formatPrice } = useLanguage();

  // Processed Products Pipeline (Filter + Search + Sort)
  const filteredProducts = useMemo(() => {
    if (!products) return [];
    let list = [...products];

    // Search Query Filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        p => p.name?.toLowerCase().includes(q) || p.description?.toLowerCase().includes(q)
      );
    }

    // Availability Status Filter
    if (statusFilter === 'available') {
      list = list.filter(p => p.isAvailable);
    } else if (statusFilter === 'soldout') {
      list = list.filter(p => !p.isAvailable);
    }

    // Sorting
    list.sort((a, b) => {
      switch (sortBy) {
        case 'name-asc':
          return (a.name || '').localeCompare(b.name || '');
        case 'name-desc':
          return (b.name || '').localeCompare(a.name || '');
        case 'price-low':
          return (parseFloat(a.price) || 0) - (parseFloat(b.price) || 0);
        case 'price-high':
          return (parseFloat(b.price) || 0) - (parseFloat(a.price) || 0);
        case 'newest':
        default:
          return 0;
      }
    });

    return list;
  }, [products, searchQuery, statusFilter, sortBy]);

  const hasActiveFilters = searchQuery !== '' || statusFilter !== 'all' || sortBy !== 'newest';

  const resetFilters = () => {
    setSearchQuery('');
    setStatusFilter('all');
    setSortBy('newest');
  };

  return (
    <div className="w-full">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">
            {lang === 'ar' ? 'إدارة المنتجات' : 'Product Inventory'}
          </h2>
          <p className="text-slate-500 dark:text-slate-400 mt-1 font-bold text-xs sm:text-sm">
            {lang === 'ar'
              ? `إجمالي ${filteredProducts.length} من ${products?.length || 0} منتج`
              : `Showing ${filteredProducts.length} of ${products?.length || 0} items`}
          </p>
        </div>
        <button
          onClick={() => {
            setEditingProduct(null);
            setIsModalOpen(true);
          }}
          className="btn-primary w-full sm:w-auto"
        >
          <Plus className="w-5 h-5" />
          {lang === 'ar' ? 'إضافة منتج جديد' : 'Add Product'}
        </button>
      </div>

      {/* Category Pills Bar */}
      <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide">
        <button
          onClick={() => setSelectedCategoryId(null)}
          className={`px-5 py-2.5 rounded-2xl font-bold text-xs sm:text-sm transition-all whitespace-nowrap ${
            selectedCategoryId === null
              ? 'bg-primary-500 text-black shadow-lg shadow-primary-500/20'
              : 'bg-white dark:bg-surface-900 text-surface-500 hover:bg-surface-50 dark:hover:bg-surface-800 border border-surface-200 dark:border-surface-800'
          }`}
        >
          {lang === 'ar' ? 'جميع الفئات' : 'All Categories'}
        </button>
        {categories?.map(cat => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategoryId(cat.id)}
            className={`px-5 py-2.5 rounded-2xl font-bold text-xs sm:text-sm transition-all whitespace-nowrap ${
              selectedCategoryId === cat.id
                ? 'bg-primary-500 text-black shadow-lg shadow-primary-500/20'
                : 'bg-white dark:bg-surface-900 text-surface-500 hover:bg-surface-50 dark:hover:bg-surface-800 border border-surface-200 dark:border-surface-800'
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Admin Search, Filter & Sort Controls Toolbar */}
      <div className="bg-white dark:bg-surface-900 p-4 rounded-3xl shadow-sm border border-surface-100 dark:border-surface-800 mb-6 flex flex-col md:flex-row gap-3">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className={`absolute ${lang === 'ar' ? 'right-3.5' : 'left-3.5'} top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400`} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={lang === 'ar' ? 'ابحث باسم المنتج...' : 'Search by product name...'}
            className={`w-full ${lang === 'ar' ? 'pr-10 pl-9' : 'pl-10 pr-9'} py-2.5 bg-surface-50 dark:bg-surface-950 text-slate-900 dark:text-white rounded-2xl text-xs sm:text-sm font-medium border border-surface-200 dark:border-surface-800 focus:border-primary-500 outline-none transition-all`}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className={`absolute ${lang === 'ar' ? 'left-3' : 'right-3'} top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200`}
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-slate-400 shrink-0 hidden sm:block" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full md:w-auto px-4 py-2.5 bg-surface-50 dark:bg-surface-950 text-slate-900 dark:text-white rounded-2xl text-xs sm:text-sm font-bold border border-surface-200 dark:border-surface-800 focus:border-primary-500 outline-none cursor-pointer"
          >
            <option value="all">{lang === 'ar' ? 'كل الحالات' : 'All Statuses'}</option>
            <option value="available">{lang === 'ar' ? 'المتوفر فقط' : 'Available Only'}</option>
            <option value="soldout">{lang === 'ar' ? 'غير متوفر (نفذت)' : 'Sold Out Only'}</option>
          </select>
        </div>

        {/* Sort Options */}
        <div className="flex items-center gap-2">
          <ArrowUpDown className="w-4 h-4 text-slate-400 shrink-0 hidden sm:block" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full md:w-auto px-4 py-2.5 bg-surface-50 dark:bg-surface-950 text-slate-900 dark:text-white rounded-2xl text-xs sm:text-sm font-bold border border-surface-200 dark:border-surface-800 focus:border-primary-500 outline-none cursor-pointer"
          >
            <option value="newest">{lang === 'ar' ? 'الترتيب الافتراضي' : 'Default / Newest'}</option>
            <option value="name-asc">{lang === 'ar' ? 'الاسم: أ - ي' : 'Name: A to Z'}</option>
            <option value="name-desc">{lang === 'ar' ? 'الاسم: ي - أ' : 'Name: Z to A'}</option>
            <option value="price-low">{lang === 'ar' ? 'السعر: من الأقل' : 'Price: Low to High'}</option>
            <option value="price-high">{lang === 'ar' ? 'السعر: من الأعلى' : 'Price: High to Low'}</option>
          </select>
        </div>

        {/* Reset Filter Button */}
        {hasActiveFilters && (
          <button
            onClick={resetFilters}
            className="px-3.5 py-2.5 bg-amber-500/10 text-amber-600 dark:text-amber-400 hover:bg-amber-500/20 rounded-2xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all"
            title="Reset Filters"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{lang === 'ar' ? 'إعادة ضبط' : 'Reset'}</span>
          </button>
        )}
      </div>

      {/* Product Grid List */}
      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-10 h-10 animate-spin text-primary-500" />
        </div>
      ) : filteredProducts?.length === 0 ? (
        <div className="text-center py-20 bg-white dark:bg-surface-900 rounded-[32px] border border-dashed border-surface-200 dark:border-surface-800">
          <Package className="w-16 h-16 text-surface-200 dark:text-surface-800 mx-auto mb-4" />
          <p className="text-surface-500 font-bold mb-3">
            {lang === 'ar' ? 'لم يتم العثور على منتجات مطابقة' : 'No matching products found.'}
          </p>
          {hasActiveFilters && (
            <button
              onClick={resetFilters}
              className="px-5 py-2 bg-primary-500 text-black rounded-full font-bold text-xs"
            >
              {lang === 'ar' ? 'إلغاء التصفية' : 'Clear Filters'}
            </button>
          )}
        </div>
      ) : (
        <div className="grid gap-3 sm:gap-4">
          {filteredProducts?.map(product => (
            <motion.div
              layout
              key={product.id}
              className="bg-white dark:bg-surface-900 p-3 sm:p-5 rounded-2xl shadow-sm border border-surface-100 dark:border-surface-800 flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 break-words"
            >
              <div className="flex items-center gap-4 flex-1">
                <img src={product.imageUrl || 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&q=80&w=800'} alt={product.name} className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl object-cover" />
                <div className="break-words">
                  <h3 className="font-bold text-slate-900 dark:text-white text-sm sm:text-base break-words">{product.name}</h3>
                  <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm font-bold break-words">
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
                  <DeleteBtn product={product} showConfirm={showConfirm} showToast={showToast} lang={lang} />
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

export default ProductManager;
