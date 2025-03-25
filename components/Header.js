// components/Header.js
import React from 'react';
import Link from 'next/link';
import LanguageSelector from './i18n/LanguageSelector';
import TranslatedText from './i18n/TranslatedText';

export default function Header() {
  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-bold text-primary-600 hover:text-primary-700">
              <TranslatedText textKey="appName" />
            </Link>
          </div>
          
          <div className="flex items-center space-x-4">
            <LanguageSelector />
            <Link href="/contact" className="text-gray-600 hover:text-primary-600">
              <TranslatedText textKey="contactUs" />
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
