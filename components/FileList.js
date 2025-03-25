// components/FileList.js
import React from 'react';
import TranslatedText from './i18n/TranslatedText';

export default function FileList({ 
  files, 
  onPreview, 
  onConvert, 
  onDownload, 
  onDelete, 
  conversionStatus 
}) {
  return (
    <div className="mt-6">
      <h3 className="text-lg font-medium mb-3">
        {files.length > 0 ? `${files.length} file(s)` : 'No files uploaded'}
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {files.map((file, index) => {
          const isConverted = conversionStatus[file.id]?.status === 'completed';
          const isConverting = conversionStatus[file.id]?.status === 'processing';
          const progress = conversionStatus[file.id]?.progress || 0;
          
          return (
            <div 
              key={file.id} 
              className="border rounded-lg overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="aspect-w-16 aspect-h-9 bg-gray-100 relative">
                {file.preview ? (
                  <img 
                    src={file.preview} 
                    alt={file.name}
                    className="object-contain w-full h-full"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <svg className="w-12 h-12 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
                
                {isConverting && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-white mx-auto"></div>
                      <p className="text-white mt-2">
                        <TranslatedText textKey="processing" />
                        {progress > 0 && ` ${progress}%`}
                      </p>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="p-3">
                <p className="font-medium text-gray-900 truncate" title={file.name}>
                  {file.name}
                </p>
                
                <div className="flex flex-wrap gap-2 mt-3">
                  <button
                    type="button"
                    onClick={() => onPreview(file)}
                    className="btn btn-secondary text-sm py-1 px-3"
                  >
                    <TranslatedText textKey="preview" />
                  </button>
                  
                  {!isConverted && !isConverting && (
                    <button
                      type="button"
                      onClick={() => onConvert(file)}
                      className="btn btn-primary text-sm py-1 px-3"
                    >
                      <TranslatedText textKey="convert" />
                    </button>
                  )}
                  
                  {isConverted && (
                    <button
                      type="button"
                      onClick={() => onDownload(file)}
                      className="btn btn-success text-sm py-1 px-3"
                    >
                      <TranslatedText textKey="download" />
                    </button>
                  )}
                  
                  <button
                    type="button"
                    onClick={() => onDelete(file)}
                    className="btn btn-danger text-sm py-1 px-3"
                  >
                    <TranslatedText textKey="delete" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
