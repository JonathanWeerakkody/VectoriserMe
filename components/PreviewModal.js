// components/PreviewModal.js
import React from 'react';
import TranslatedText from './i18n/TranslatedText';

export default function PreviewModal({ isOpen, onClose, image, title, isSvg = false }) {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 opacity-75" onClick={onClose}></div>
        </div>

        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
        
        <div 
          className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full"
          role="dialog" 
          aria-modal="true" 
          aria-labelledby="modal-headline"
        >
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-headline">
                  {title}
                </h3>
                <div className="mt-4 max-h-[70vh] overflow-auto">
                  {isSvg ? (
                    <div 
                      className="w-full bg-gray-100 p-2 rounded"
                      dangerouslySetInnerHTML={{ __html: image }} 
                    />
                  ) : (
                    <img 
                      src={image} 
                      alt={title} 
                      className="max-w-full h-auto mx-auto"
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button 
              type="button" 
              className="btn btn-primary sm:ml-3"
              onClick={onClose}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
