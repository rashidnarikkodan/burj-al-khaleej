import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, Loader2, Image as ImageIcon, X } from 'lucide-react';
import { useAddCategory, useUpdateCategory } from '../hooks';
import { uploadToCloudinary } from '../../../lib/cloudinary';

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
      showToast(lang === 'ar' ? 'خطأ في الحفظ' : 'Save failed', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-surface-950/60 backdrop-blur-sm">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white dark:bg-surface-900 w-full max-w-md rounded-[32px] p-6 sm:p-8 shadow-2xl border border-surface-100 dark:border-surface-800"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">
            {category ? (lang === 'ar' ? 'تعديل الفئة' : 'Edit Category') : (lang === 'ar' ? 'إضافة فئة' : 'Add Category')}
          </h3>
          <button onClick={onClose} className="p-2 hover:bg-surface-100 dark:hover:bg-surface-800 rounded-xl transition-colors text-slate-400">
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

export default CategoryModal;
