import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin as MapPinIcon, Plus, Edit2, Trash2, Loader2 } from 'lucide-react';
import { useLocations, useDeleteLocation } from '../hooks';
import StoreModal from './StoreModal';

const StoreManager = ({ lang, showToast, showConfirm }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStore, setEditingStore] = useState(null);
  const { data: stores, isLoading } = useLocations();
  const delMutation = useDeleteLocation();

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 sm:mb-10">
        <div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">
            {lang === 'ar' ? 'الفروع' : 'Stores'}
          </h2>
          <p className="text-slate-500 dark:text-slate-400 mt-1 font-bold text-sm sm:text-base">
            {lang === 'ar' ? 'إدارة فروع المخبز ومعلومات التواصل' : 'Manage your bakery stores and contact info'}
          </p>
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
          {stores?.map((store) => (
            <motion.div
              layout
              key={store.id}
              className="bg-white dark:bg-surface-900 p-4 sm:p-5 rounded-2xl shadow-sm border border-surface-100 dark:border-surface-800 flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6"
            >
              <div className="flex items-center gap-4 flex-1">
                <div className="w-12 h-12 bg-primary-500/10 rounded-xl flex items-center justify-center text-primary-600 shrink-0">
                  <MapPinIcon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-sm sm:text-base">{store.name}</h3>
                  <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm font-bold">
                    {store.region} • {store.phone}
                  </p>
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
                      lang === 'ar'
                        ? `هل أنت متأكد من حذف فرع "${store.name}"؟`
                        : `Are you sure you want to delete "${store.name}" store?`,
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

export default StoreManager;
