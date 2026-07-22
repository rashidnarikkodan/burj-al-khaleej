import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Loader2, X } from 'lucide-react';
import { useAddLocation, useUpdateLocation } from '../hooks';
import MapPicker from '../../../components/ui/MapPicker';

const StoreModal = ({ store, onClose, lang, showToast }) => {
  const [name, setName] = useState(store?.name || '');
  const [desc, setDesc] = useState(store?.desc || '');
  const [phone, setPhone] = useState(store?.phone || '');
  const [regionCode, setRegionCode] = useState(store?.region || 'OM');
  const [lat, setLat] = useState(store?.coords?.lat ?? '');
  const [lng, setLng] = useState(store?.coords?.lng ?? '');

  const [isSaving, setIsSaving] = useState(false);

  const addMutation = useAddLocation();
  const updateMutation = useUpdateLocation();

  const handleSelectLocation = ({ lat: newLat, lng: newLng }) => {
    setLat(newLat);
    setLng(newLng);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    const parsedLat = parseFloat(lat);
    const parsedLng = parseFloat(lng);

    if (isNaN(parsedLat) || isNaN(parsedLng)) {
      showToast(lang === 'ar' ? 'يرجى إدخال إحداثيات صحيحة أو تحديد الموقع على الخريطة' : 'Please select a valid location on the map', 'error');
      setIsSaving(false);
      return;
    }

    const data = {
      name,
      desc,
      phone,
      region: regionCode,
      coords: { lat: parsedLat, lng: parsedLng }
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
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-surface-950/60 backdrop-blur-sm">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white dark:bg-surface-900 w-full max-w-3xl rounded-[32px] p-6 sm:p-8 shadow-2xl overflow-y-auto max-h-[90vh] border border-surface-100 dark:border-surface-800"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">
            {store ? (lang === 'ar' ? 'تعديل الفرع' : 'Edit Store') : (lang === 'ar' ? 'إضافة فرع جديد' : 'Add New Store')}
          </h3>
          <button onClick={onClose} className="p-2 hover:bg-surface-100 dark:hover:bg-surface-800 rounded-xl transition-colors text-slate-400">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">{lang === 'ar' ? 'اسم الفرع' : 'Store Name'}</label>
              <input required value={name} onChange={(e) => setName(e.target.value)} className="input-field" placeholder={lang === 'ar' ? 'فرع البداية' : 'Al Bidayah Branch'} />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">{lang === 'ar' ? 'الهاتف' : 'Phone'}</label>
              <input required value={phone} onChange={(e) => setPhone(e.target.value)} className="input-field" placeholder="+968 97668570" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">{lang === 'ar' ? 'الوصف / العنوان' : 'Description / Address'}</label>
            <input required value={desc} onChange={(e) => setDesc(e.target.value)} className="input-field" placeholder={lang === 'ar' ? 'الشارع الرئيسي، البداية، عمان' : 'Main Street, Al Bidayah, Oman'} />
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">{lang === 'ar' ? 'المنطقة' : 'Region'}</label>
              <select value={regionCode} onChange={(e) => setRegionCode(e.target.value)} className="input-field">
                <option value="OM">{lang === 'ar' ? 'عمان' : 'Oman'}</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">{lang === 'ar' ? 'الإحداثيات' : 'Coordinates (Lat, Lng)'}</label>
              <div className="flex gap-2">
                <input required value={lat} onChange={(e) => setLat(e.target.value)} className="input-field font-mono text-xs" placeholder="Lat" />
                <input required value={lng} onChange={(e) => setLng(e.target.value)} className="input-field font-mono text-xs" placeholder="Lng" />
              </div>
            </div>
          </div>

          {/* Interactive Map Location Selector */}
          <MapPicker
            lat={lat}
            lng={lng}
            onSelectLocation={handleSelectLocation}
            lang={lang}
          />

          <div className="flex gap-4 pt-2">
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

export default StoreModal;
