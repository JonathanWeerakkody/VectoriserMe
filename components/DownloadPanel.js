import React from 'react';
import TranslatedText from './i18n/TranslatedText';

export default function DownloadPanel({ svgUrl, isReady, multipleFiles = false, onDownloadAll }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-4">
        {/* Single file download button */}
        <a
          href={svgUrl}
          download="vectorise-me-converted.svg"
          className={`inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary ${
            !isReady ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''
          }`}
          onClick={(e) => !isReady && e.preventDefault()}
        >
          <svg
            className="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
            />
          </svg>
          <TranslatedText id="downloadSVG" defaultText="Download SVG" />
        </a>
        
        {/* Download All button - only show if multiple files are available */}
        {multipleFiles && (
          <button
            onClick={onDownloadAll}
            className={`inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
              !isReady ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            disabled={!isReady}
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 9l-7 7-7-7"
              />
            </svg>
            <TranslatedText id="downloadAllZip" defaultText="Download All" />
          </button>
        )}
      </div>

      {/* Ad placement below download buttons */}
      <GoogleAd 
        slot="2345678901" 
        format="fluid" 
        className="py-2 bg-gray-50 rounded-lg"
      />
    </div>
  );
}
