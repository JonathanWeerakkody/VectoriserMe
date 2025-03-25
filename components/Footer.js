// components/Footer.js
import React from 'react';
import Link from 'next/link';
import TranslatedText from './i18n/TranslatedText';

export default function Footer() {
  return (
    <footer className="bg-gray-100 mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p className="text-gray-600">
              <TranslatedText textKey="copyright" />
            </p>
            <p className="text-gray-500 text-sm mt-1">
              jonkarystudio@gmail.com | 2036872785
            </p>
          </div>
          
          <div className="flex flex-wrap justify-center space-x-4">
            <Link href="/privacy" className="text-gray-600 hover:text-primary-600 text-sm">
              <TranslatedText textKey="privacyPolicy" />
            </Link>
            <Link href="/cookies" className="text-gray-600 hover:text-primary-600 text-sm">
              <TranslatedText textKey="cookiePolicy" />
            </Link>
            <Link href="/terms" className="text-gray-600 hover:text-primary-600 text-sm">
              <TranslatedText textKey="termsOfService" />
            </Link>
            <Link href="/faq" className="text-gray-600 hover:text-primary-600 text-sm">
              <TranslatedText textKey="faq" />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
