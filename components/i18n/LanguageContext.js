// components/i18n/LanguageContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState('en');

  useEffect(() => {
    // Check if there's a saved language preference in localStorage
    const savedLanguage = localStorage.getItem('language');
    if (savedLanguage) {
      setLanguage(savedLanguage);
    } else {
      // Try to detect browser language
      const browserLang = navigator.language.split('-')[0];
      const supportedLanguages = ['en', 'es', 'fr', 'de', 'it', 'pt', 'ru', 'zh', 'ja', 'ko', 'ar', 'hi', 'nl', 'sv', 'pl', 'tr', 'uk'];
      if (supportedLanguages.includes(browserLang)) {
        setLanguage(browserLang);
        localStorage.setItem('language', browserLang);
      }
    }
  }, []);

  const changeLanguage = (newLanguage) => {
    setLanguage(newLanguage);
    localStorage.setItem('language', newLanguage);
  };

  return (
    <LanguageContext.Provider value={{ language, changeLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}

export default LanguageContext;
