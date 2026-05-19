import React, { createContext, useContext, useEffect, useState } from 'react';

const LanguageContext = createContext();

export const regions = {
  OM: { name: 'Oman', currency: 'OMR', flag: '🇴🇲' }
};

export const languages = {
  en: { name: 'English', dir: 'ltr' },
  ar: { name: 'العربية', dir: 'rtl' }
};

export const LanguageProvider = ({ children }) => {
  const [lang, setLang] = useState(() => localStorage.getItem('lang') || 'en');
  const [region, setRegion] = useState(() => localStorage.getItem('region') || 'OM');

  useEffect(() => {
    const dir = languages[lang]?.dir || 'ltr';
    document.documentElement.dir = dir;
    document.documentElement.lang = lang;
    localStorage.setItem('lang', lang);
  }, [lang]);

  useEffect(() => {
    localStorage.setItem('region', region);
  }, [region]);

  const toggleLang = () => {
    const langKeys = Object.keys(languages);
    const currentIndex = langKeys.indexOf(lang);
    const nextIndex = (currentIndex + 1) % langKeys.length;
    setLang(langKeys[nextIndex]);
  };

  const formatPrice = (amount) => {
    const curr = regions[region].currency;
    if (curr === 'OMR') return `${amount.toFixed(3)} ${curr}`;
    return `${curr} ${amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, toggleLang, region, setRegion, formatPrice }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
