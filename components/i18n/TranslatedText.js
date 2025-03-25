// components/i18n/TranslatedText.js
import React from 'react';
import { useLanguage } from './LanguageContext';
import translations from './translations';

export default function TranslatedText({ textKey, fallback = '', values = {} }) {
  const { language } = useLanguage();
  
  // Get the translation for the current language, or fallback to English
  const translation = 
    (translations[language] && translations[language][textKey]) || 
    translations.en[textKey] || 
    fallback || 
    textKey;
  
  // Replace any placeholders with values
  let finalText = translation;
  Object.entries(values).forEach(([key, value]) => {
    finalText = finalText.replace(`{${key}}`, value);
  });
  
  return <>{finalText}</>;
}
