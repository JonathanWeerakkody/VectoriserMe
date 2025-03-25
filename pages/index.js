// pages/index.js - Updated with ComparisonModal integration
import { useState, useCallback, useEffect } from 'react';
import Head from 'next/head';
import { v4 as uuidv4 } from 'uuid';
import Header from '../components/Header';
import Footer from '../components/Footer';
import EnhancedUploadArea from '../components/EnhancedUploadArea';
import FileList from '../components/FileList';
import EnhancedSettingsPanel from '../components/EnhancedSettingsPanel';
import BatchDownloadPanel from '../components/BatchDownloadPanel';
import PreviewModal from '../components/PreviewModal';
import ComparisonModal from '../components/ComparisonModal';
import ConversionProgress from '../components/ConversionProgress';
import TranslatedText from '../components/i18n/TranslatedText';
import { useLanguage } from '../components/i18n/LanguageContext';
import api from '../lib/api';
import { downloadSvg, downloadBatchAsZip, previewSvg, previewImage, createBeforeAfterComparison } from '../lib/download';

export default function Home() {
  const { language } = useLanguage();
  
  // State for file handling
  const [files, setFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [conversionStatus, setConversionStatus] = useState({});
  const [previewModal, setPreviewModal] = useState({ isOpen: false, image: null, title: '', isSvg: false });
  const [comparisonModal, setComparisonModal] = useState({ isOpen: false, beforeImage: null, afterImage: null, title: '' });
  
  // Settings state
  const [settings, setSettings] = useState({
    outputMode: 'bw',
    threshold: 128,
    colorCount: 8,
    smoothing: 5,
    pathSimplification: 5,
    noiseReduction: 4,
    backgroundTransparency: false,
    brightness: 0,
    contrast: 0,
    gamma: 1.0,
    cornerThreshold: 60,
    curveMode: 'spline',
  });
  
  // Handle file upload
  const handleUpload = useCallback((acceptedFiles) => {
    setIsUploading(true);
    
    // Simulate upload progress
    let progress = 0;
    const interval = setInterval(() => {
      progress += 5;
      setUploadProgress(progress);
      if (progress >= 100) {
        clearInterval(interval);
        setIsUploading(false);
        setUploadProgress(0);
        
        // Process the files
        const newFiles = acceptedFiles.map(file => ({
          id: uuidv4(),
          name: file.name,
          size: file.size,
          type: file.type,
          file: file,
          preview: URL.createObjectURL(file),
          settings: { ...settings },
        }));
        
        setFiles(prev => [...prev, ...newFiles]);
      }
    }, 50);
  }, [settings]);
  
  // Clean up previews when component unmounts
  useEffect(() => {
    return () => {
      files.forEach(file => {
        if (file.preview) URL.revokeObjectURL(file.preview);
      });
    };
  }, [files]);
  
  // Handle file preview
  const handlePreview = (file) => {
    previewImage(file.preview, file.name, setPreviewModal);
  };
  
  // Handle SVG preview
  const handleSvgPreview = (file) => {
    if (conversionStatus[file.id]?.svgData) {
      previewSvg(conversionStatus[file.id].svgData, file.name, setPreviewModal);
    }
  };
  
  // Handle before/after comparison
  const handleComparison = (file) => {
    if (conversionStatus[file.id]?.svgData) {
      setComparisonModal({
        isOpen: true,
        beforeImage: file.preview,
        afterImage: conversionStatus[file.id].svgData,
        title: `${file.name} - Before/After Comparison`
      });
    }
  };
  
  // Handle file conversion
  const handleConvert = async (file) => {
    try {
      // Update conversion status
      setConversionStatus(prev => ({
        ...prev,
        [file.id]: {
          ...prev[file.id],
          status: 'processing',
          progress: 0
        }
      }));
      
      // Simulate conversion progress
      let progress = 0;
      const interval = setInterval(() => {
        progress += 5;
        setConversionStatus(prev => ({
          ...prev,
          [file.id]: {
            ...prev[file.id],
            progress
          }
        }));
        
        if (progress >= 100) {
          clearInterval(interval);
          
          // In a real implementation, this would be the actual SVG data from the API
          const svgData = `<svg width="100" height="100" xmlns="http://www.w3.org/2000/svg">
            <rect width="100" height="100" fill="#f0f0f0" />
            <circle cx="50" cy="50" r="40" stroke="black" stroke-width="2" fill="#8b5cf6" />
          </svg>`;
          
          setConversionStatus(prev => ({
            ...prev,
            [file.id]: {
              ...prev[file.id],
              status: 'completed',
              progress: 100,
              svgData
            }
          }));
        }
      }, 100);
      
      // In a real implementation, this would be an API call
      // const result = await api.convertImageToSvg(file.file, file.settings);
      // setConversionStatus(prev => ({
      //   ...prev,
      //   [file.id]: {
      //     status: 'completed',
      //     progress: 100,
      //     svgData: result.svgData
      //   }
      // }));
    } catch (error) {
      console.error('Conversion error:', error);
      setConversionStatus(prev => ({
        ...prev,
        [file.id]: {
          ...prev[file.id],
          status: 'error',
          error: error.message
        }
      }));
    }
  };
  
  // Handle file download
  const handleDownload = (file) => {
    if (conversionStatus[file.id]?.status !== 'completed') return;
    
    const svgData = conversionStatus[file.id].svgData;
    const fileName = file.name.replace(/\.[^/.]+$/, '');
    downloadSvg(svgData, fileName);
  };
  
  // Handle batch download
  const handleDownloadAll = async () => {
    const convertedFiles = files.filter(file => 
      conversionStatus[file.id]?.status === 'completed'
    );
    
    if (convertedFiles.length === 0) return;
    
    await downloadBatchAsZip(convertedFiles, conversionStatus);
  };
  
  // Handle file deletion
  const handleDelete = (file) => {
    setFiles(prev => prev.filter(f => f.id !== file.id));
    setConversionStatus(prev => {
      const newStatus = { ...prev };
      delete newStatus[file.id];
      return newStatus;
    });
    
    if (file.preview) URL.revokeObjectURL(file.preview);
  };
  
  // Handle settings change for a specific file
  const handleSettingsChange = (newSettings) => {
    if (selectedFile) {
      setFiles(prev => prev.map(file => 
        file.id === selectedFile.id 
          ? { ...file, settings: newSettings }
          : file
      ));
      setSelectedFile(prev => prev ? { ...prev, settings: newSettings } : null);
    } else {
      setSettings(newSettings);
    }
  };
  
  // Apply settings to all files
  const handleApplySettingsToAll = () => {
    if (selectedFile) {
      setFiles(prev => prev.map(file => ({
        ...file,
        settings: { ...selectedFile.settings }
      })));
    }
  };
  
  // Select a file to edit its settings
  const handleSelectFile = (file) => {
    setSelectedFile(file);
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Head>
        <title>Vectorise.Me</title>
        <meta name="description" content="Convert images to vector graphics" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <Header />
      
      <main className="flex-grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold text-center mb-8">
            <TranslatedText textKey="appName" />
          </h1>
          
          {/* Upload Area */}
          {files.length === 0 && (
            <EnhancedUploadArea 
              onUpload={handleUpload} 
              isUploading={isUploading}
              uploadProgress={uploadProgress}
            />
          )}
          
          {/* File List */}
          {files.length > 0 && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                {/* Small Upload Area when files exist */}
                <div className="mb-6">
                  <EnhancedUploadArea 
                    onUpload={handleUpload} 
                    isUploading={isUploading}
                    uploadProgress={uploadProgress}
                  />
                </div>
                
                {/* Batch Download Panel */}
                <BatchDownloadPanel 
                  files={files}
                  conversionStatus={conversionStatus}
                  onDownloadAll={handleDownloadAll}
                />
                
                {/* File List */}
                <FileList 
                  files={files}
                  onPreview={handlePreview}
                  onConvert={handleConvert}
                  onDownload={handleDownload}
                  onDelete={handleDelete}
                  onCompare={handleComparison}
                  conversionStatus={conversionStatus}
                />
              </div>
              
              {/* Settings Panel */}
              <div>
                <EnhancedSettingsPanel 
                  settings={selectedFile ? selectedFile.settings : settings}
                  onChange={handleSettingsChange}
                  onApplyToAll={files.length > 1 ? handleApplySettingsToAll : undefined}
                />
              </div>
            </div>
          )}
        </div>
      </main>
      
      {/* Preview Modal */}
      <PreviewModal 
        isOpen={previewModal.isOpen}
        onClose={() => setPreviewModal({ isOpen: false, image: null, title: '', isSvg: false })}
        image={previewModal.image}
        title={previewModal.title}
        isSvg={previewModal.isSvg}
      />
      
      {/* Comparison Modal */}
      <ComparisonModal 
        isOpen={comparisonModal.isOpen}
        onClose={() => setComparisonModal({ isOpen: false, beforeImage: null, afterImage: null, title: '' })}
        beforeImage={comparisonModal.beforeImage}
        afterImage={comparisonModal.afterImage}
        title={comparisonModal.title}
      />
      
      <Footer />
    </div>
  );
}
