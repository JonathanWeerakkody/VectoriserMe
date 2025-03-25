// components/EnhancedUploadArea.js
import { useCallback, useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import TranslatedText from './i18n/TranslatedText';

export default function EnhancedUploadArea({ onUpload, isUploading, uploadProgress }) {
  const [clipboardSupported, setClipboardSupported] = useState(false);
  
  useEffect(() => {
    // Check if clipboard API is supported
    setClipboardSupported(
      navigator && 
      navigator.clipboard && 
      typeof navigator.clipboard.read === 'function'
    );
  }, []);

  // Handle paste from clipboard
  useEffect(() => {
    const handlePaste = async (event) => {
      if (isUploading) return;
      
      const items = event.clipboardData?.items;
      if (!items) return;
      
      const imageItems = Array.from(items).filter(item => item.type.indexOf('image') !== -1);
      if (imageItems.length === 0) return;
      
      const files = imageItems.map(item => item.getAsFile()).filter(Boolean);
      if (files.length > 0) {
        onUpload(files);
        event.preventDefault();
      }
    };
    
    document.addEventListener('paste', handlePaste);
    return () => {
      document.removeEventListener('paste', handlePaste);
    };
  }, [onUpload, isUploading]);

  const onDrop = useCallback(acceptedFiles => {
    if (acceptedFiles?.length > 0) {
      onUpload(acceptedFiles);
    }
  }, [onUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.bmp', '.webp']
    },
    maxFiles: 10,
    maxSize: 5 * 1024 * 1024, // 5MB
  });

  return (
    <div 
      {...getRootProps()} 
      className={`upload-area ${isDragActive ? 'active' : ''} ${isUploading ? 'opacity-50 pointer-events-none' : ''}`}
    >
      <input {...getInputProps()} />
      
      <div className="flex flex-col items-center justify-center h-full">
        {/* Floating icons */}
        <div className="relative w-full h-32 mb-4">
          <div className="absolute left-1/4 top-0 float upload-icon opacity-80">
            <svg className="w-10 h-10 text-primary-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293l-1.121-1.121A2 2 0 0011.172 3H8.828a2 2 0 00-1.414.586L6.293 4.707A1 1 0 015.586 5H4zm6 9a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="absolute right-1/4 top-1/3 float upload-icon opacity-80" style={{animationDelay: '0.5s'}}>
            <svg className="w-8 h-8 text-primary-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="absolute left-1/3 bottom-0 float upload-icon opacity-80" style={{animationDelay: '1s'}}>
            <svg className="w-9 h-9 text-primary-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
            </svg>
          </div>
        </div>
        
        <h2 className="text-xl font-semibold mb-2">
          <TranslatedText textKey="uploadTitle" />
        </h2>
        
        <p className="text-gray-600 mb-4">
          <TranslatedText textKey="uploadSubtitle" />
        </p>
        
        <button 
          type="button" 
          className="btn btn-primary"
          onClick={(e) => e.stopPropagation()}
        >
          <TranslatedText textKey="uploadButton" />
        </button>
        
        <p className="text-gray-500 text-sm mt-4">
          <TranslatedText textKey="uploadLimit" />
        </p>
        
        {clipboardSupported && (
          <p className="text-gray-500 text-sm mt-2">
            <TranslatedText textKey="pasteHint" />
          </p>
        )}
        
        {isUploading && (
          <div className="w-full mt-4">
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div 
                className="bg-primary-600 h-2.5 rounded-full" 
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
            <p className="text-sm text-gray-600 mt-1 text-center">
              {uploadProgress}%
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
