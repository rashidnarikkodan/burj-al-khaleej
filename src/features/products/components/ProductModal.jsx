import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, Loader2, Image as ImageIcon, X } from 'lucide-react';
import { useAddProduct, useUpdateProduct } from '../hooks';
import { uploadToCloudinary } from '../../../lib/cloudinary';

const ProductModal = ({ product, onClose, categories, defaultCategoryId, lang, showToast }) => {
  const [name, setName] = useState(product?.name || '');
  const [description, setDescription] = useState(product?.description || '');
  const [price, setPrice] = useState(product?.price || '');
  const [categoryId, setCategoryId] = useState(product?.categoryId || defaultCategoryId || '');
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(product?.imageUrl || '');
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
        description,
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
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-surface-950/60 backdrop-blur-sm">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white dark:bg-surface-900 w-full max-w-xl rounded-[32px] p-6 sm:p-8 shadow-2xl overflow-y-auto max-h-[90vh] border border-surface-100 dark:border-surface-800"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">
            {product ? (lang === 'ar' ? 'تعديل المنتج' : 'Edit Product') : (lang === 'ar' ? 'إضافة منتج جديد' : 'Add New Product')}
          </h3>
          <button onClick={onClose} className="p-2 hover:bg-surface-100 dark:hover:bg-surface-800 rounded-xl transition-colors text-slate-400">
            <X className="w-5 h-5" />
          </button>
        </div>

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
              <input required value={name} onChange={(e) => setName(e.target.value)} className="input-field" placeholder="e.g. Red Velvet Cake" />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">{lang === 'ar' ? 'السعر' : 'Price'}</label>
              <input required type="number" step="0.001" value={price} onChange={(e) => setPrice(e.target.value)} className="input-field" placeholder="0.000" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">{lang === 'ar' ? 'الوصف' : 'Description'}</label>
            <textarea rows="3" value={description} onChange={(e) => setDescription(e.target.value)} className="input-field" placeholder={lang === 'ar' ? 'وصف للمنتج، المكونات، تفاصيل الطلب...' : 'Product description, ingredients, details...'} />
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

export default ProductModal;
