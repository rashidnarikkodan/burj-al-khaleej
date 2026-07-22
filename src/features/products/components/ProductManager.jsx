import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Package, Plus, Edit2, Trash2, CheckCircle2, XCircle, Loader2 } from 'lucide-react';
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
  const { data: products, isLoading } = useProducts(selectedCategoryId);
  const { data: categories } = useCategories();
  const { formatPrice } = useLanguage();

  return (
    <div className="w-full">
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
                <img src={product.imageUrl || 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&q=80&w=800'} alt={product.name} className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl object-cover" />
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
