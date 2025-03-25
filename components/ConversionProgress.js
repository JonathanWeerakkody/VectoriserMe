// components/ConversionProgress.js
import React from 'react';
import TranslatedText from './i18n/TranslatedText';

export default function ConversionProgress({ progress, status }) {
  return (
    <div className="mt-4 bg-white border rounded-lg p-4 shadow-sm">
      <h3 className="text-lg font-medium mb-2">
        <TranslatedText textKey="processing" />
      </h3>
      
      <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
        <div 
          className="bg-primary-600 h-2.5 rounded-full transition-all duration-300 ease-in-out" 
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      
      <p className="text-sm text-gray-600">
        {status} ({progress}%)
      </p>
    </div>
  );
}
