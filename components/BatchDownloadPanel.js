// components/BatchDownloadPanel.js
import React from 'react';
import TranslatedText from './i18n/TranslatedText';

export default function BatchDownloadPanel({ 
  files, 
  conversionStatus, 
  onDownloadAll 
}) {
  // Count how many files are converted
  const convertedCount = Object.values(conversionStatus).filter(
    status => status.status === 'completed'
  ).length;
  
  // Check if any files are converted
  const hasConvertedFiles = convertedCount > 0;
  
  // Check if all files are converted
  const allFilesConverted = files.length > 0 && convertedCount === files.length;
  
  return (
    <div className="mt-6 bg-white border rounded-lg p-4 shadow-sm">
      <div className="flex flex-col sm:flex-row justify-between items-center">
        <div>
          <h3 className="text-lg font-medium">
            {convertedCount} / {files.length} <TranslatedText textKey="conversionSuccess" />
          </h3>
          <p className="text-gray-600 text-sm mt-1">
            {allFilesConverted 
              ? 'All files have been converted successfully.' 
              : hasConvertedFiles 
                ? 'Some files have been converted and are ready for download.' 
                : 'No files have been converted yet.'}
          </p>
        </div>
        
        <button
          type="button"
          onClick={onDownloadAll}
          disabled={!hasConvertedFiles}
          className={`mt-3 sm:mt-0 btn ${
            hasConvertedFiles ? 'btn-success' : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          } px-6 py-2`}
        >
          <TranslatedText textKey="downloadAll" />
        </button>
      </div>
    </div>
  );
}
