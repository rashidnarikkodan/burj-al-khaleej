import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Grid, Plus, Edit2, Trash2, Loader2 } from 'lucide-react';
import { useCategories, useDeleteCategory } from '../hooks';
import CategoryModal from './CategoryModal';

const CategoryManager = ({ lang, showToast, showConfirm }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const { data: categories, isLoading } = useCategories();
  const delMutation = useDeleteCategory();

  return (
    <div className="w-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 sm:mb-10">
        <div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">
            {lang === 'ar' ? 'الفئات' : 'Categories'}
          </h2>
          <p className="text-slate-500 dark:text-slate-400 mt-1 font-bold text-sm sm:text-base">
            {lang === 'ar' ? 'تنظيم المنتجات حسب الفئات' : 'Organize your products with categories'}
          </p>
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
        <div className="w-full text-center py-16 bg-white dark:bg-surface-900 rounded-[32px] border border-dashed border-surface-200 dark:border-surface-800">
          <Grid className="w-12 h-12 text-surface-200 dark:text-surface-800 mx-auto mb-4" />
          <p className="text-surface-500 font-bold">{lang === 'ar' ? 'لا توجد فئات' : 'No categories found'}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {categories?.map((cat) => (
            <motion.div
              layout
              key={cat.id}
              className="bg-white dark:bg-surface-900 p-4 rounded-2xl shadow-sm border border-surface-100 dark:border-surface-800 flex items-center justify-between gap-4"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl overflow-hidden shadow-sm bg-surface-100 dark:bg-surface-800 shrink-0">
                  {cat.imageUrl ? (
                    <img src={cat.imageUrl} alt={cat.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-primary-500/10 flex items-center justify-center text-primary-600 font-bold uppercase">
                      {cat.name.charAt(0)}
                    </div>
                  )}
                </div>
                <h3 className="font-bold text-slate-900 dark:text-white">{cat.name}</h3>
              </div>
              <div className="flex items-center gap-1">
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
                      lang === 'ar'
                        ? `هل أنت متأكد من حذف فئة "${cat.name}"؟`
                        : `Are you sure you want to delete "${cat.name}"?`,
                      () => {
                        delMutation.mutate(cat.id, {
                          onSuccess: () => showToast(lang === 'ar' ? 'تم حذف الفئة' : 'Category deleted'),
                          onError: () => showToast(lang === 'ar' ? 'خطأ في حذف الفئة' : 'Failed to delete category', 'error')
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

export default CategoryManager;
