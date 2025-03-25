import { useState, useCallback } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Header from '../components/Header';
import Footer from '../components/Footer';
import TranslatedText from '../components/i18n/TranslatedText';
import { useLanguage } from '../components/i18n/LanguageContext';
import EnhancedUploadArea from '../components/EnhancedUploadArea';
import FileList from '../components/FileList';
import EnhancedSettingsPanel from '../components/EnhancedSettingsPanel';
import BeforeAfterSlider from '../components/BeforeAfterSlider';
import ConversionProgress from '../components/ConversionProgress';
import DownloadPanel from '../components/DownloadPanel';
import PreviewModal from '../components/PreviewModal';

export default function Editor() {
  const router = useRouter();
  const { language } = useLanguage();
  
  // State for file handling
  const [files, setFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [conversionStatus, setConversionStatus] = useState({});
  const [previewModal, setPreviewModal] = useState({ isOpen: false, image: null, title: '' });
  
  // Settings state
  const [settings, setSettings] = useState({
    mode: 'shape',
    tolerance: 3,
    colorQuantization: 8,
    layerMode: 'stacked',
    pathSimplification: 5,
    curveAccuracy: 5,
    strokeWidthDetection: true,
    backgroundTransparency: false
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
        
        // Process files
        const newFiles = acceptedFiles.map(file => {
          const id = `file-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
          return {
            id,
            name: file.name,
            size: file.size,
            type: file.type,
            original: URL.createObjectURL(file),
            preview: URL.createObjectURL(file),
            fileSize: (file.size / 1024).toFixed(2) + ' KB'
          };
        });
        
        setFiles(prev => [...prev, ...newFiles]);
        
        // Select the first file if none is selected
        if (!selectedFile) {
          setSelectedFile(newFiles[0]);
          simulateConversion(newFiles[0].id);
        }
      }
    }, 50);
  }, [selectedFile]);
  
  // Handle file selection
  const handleSelectFile = useCallback((file) => {
    setSelectedFile(file);
    
    // Start conversion if not already done
    if (!conversionStatus[file.id] || conversionStatus[file.id].status !== 'completed') {
      simulateConversion(file.id);
    }
  }, [conversionStatus]);
  
  // Handle preview
  const handlePreview = useCallback((file, type) => {
    setPreviewModal({
      isOpen: true,
      image: type === 'original' ? file.original : file.svg,
      title: `${file.name} (${type === 'original' ? 'Original' : 'SVG'})`
    });
  }, []);
  
  // Handle settings change
  const handleSettingsChange = useCallback((newSettings) => {
    setSettings(newSettings);
    
    if (selectedFile) {
      // Start conversion with new settings
      simulateConversion(selectedFile.id, newSettings);
    }
  }, [selectedFile]);
  
  // Simulate conversion
  const simulateConversion = useCallback((fileId, customSettings = null) => {
    setConversionStatus(prev => ({
      ...prev,
      [fileId]: { status: 'converting', progress: 0 }
    }));
    
    let progress = 0;
    const interval = setInterval(() => {
      progress += 5;
      
      setConversionStatus(prev => ({
        ...prev,
        [fileId]: { status: 'converting', progress }
      }));
      
      if (progress >= 100) {
        clearInterval(interval);
        
        // Update file with SVG result
        setFiles(prev => prev.map(file => {
          if (file.id === fileId) {
            return {
              ...file,
              svg: file.original // In a real app, this would be the converted SVG
            };
          }
          return file;
        }));
        
        setConversionStatus(prev => ({
          ...prev,
          [fileId]: { status: 'completed', progress: 100 }
        }));
      }
    }, 50);
  }, []);
  
  return (
    <div className="min-h-screen bg-white">
      <Head>
        <title>Editor - Vectorise.Me</title>
        <meta name="description" content="Convert and edit your images to SVG with our powerful online editor." />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-8">
          <TranslatedText id="editorTitle" defaultText="Image to SVG Editor" />
        </h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-1">
            {/* Upload Area */}
            <div className="mb-8">
              <h2 className="text-lg font-medium text-gray-900 mb-4">
                <TranslatedText id="uploadImages" defaultText="Upload Images" />
              </h2>
              <EnhancedUploadArea 
                onUpload={handleUpload} 
                isUploading={isUploading}
                uploadProgress={uploadProgress}
                compact={true}
              />
            </div>
            
            {/* File List */}
            {files.length > 0 && (
              <div>
                <h2 className="text-lg font-medium text-gray-900 mb-4">
                  <TranslatedText id="yourImages" defaultText="Your Images" />
                </h2>
                <FileList 
                  files={files} 
                  onSelect={handleSelectFile} 
                  selectedFile={selectedFile}
                  onPreview={handlePreview}
                  conversionStatus={conversionStatus}
                  compact={true}
                />
              </div>
            )}
          </div>
          
          {/* Right Column */}
          <div className="lg:col-span-3">
            {selectedFile ? (
              <>
                {/* Before/After Slider */}
                <div className="mb-8">
                  <h2 className="text-lg font-medium text-gray-900 mb-4">
                    <TranslatedText id="preview" defaultText="Preview" />
                  </h2>
                  <BeforeAfterSlider 
                    originalImage={selectedFile.original} 
                    svgImage={selectedFile.svg} 
                    isProcessing={conversionStatus[selectedFile.id]?.status === 'converting'}
                  />
                </div>
                
                {/* Conversion Progress */}
                {conversionStatus[selectedFile.id]?.status === 'converting' && (
                  <div className="mb-8">
                    <ConversionProgress 
                      progress={conversionStatus[selectedFile.id]?.progress || 0}
                      status={<TranslatedText id="converting" defaultText="Converting image to SVG..." />}
                    />
                  </div>
                )}
                
                {/* Settings and Download */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="md:col-span-2">
                    <h2 className="text-lg font-medium text-gray-900 mb-4">
                      <TranslatedText id="settings" defaultText="Settings" />
                    </h2>
                    <EnhancedSettingsPanel 
                      settings={settings} 
                      onChange={handleSettingsChange} 
                      isProcessing={conversionStatus[selectedFile.id]?.status === 'converting'}
                    />
                  </div>
                  <div>
                    <h2 className="text-lg font-medium text-gray-900 mb-4">
                      <TranslatedText id="download" defaultText="Download" />
                    </h2>
                    <DownloadPanel 
                      svgUrl={selectedFile.svg} 
                      fileSize={selectedFile.fileSize} 
                      isReady={!!selectedFile.svg && conversionStatus[selectedFile.id]?.status === 'completed'} 
                    />
                  </div>
                </div>
              </>
            ) : (
              <div className="bg-gray-50 rounded-lg p-8 text-center">
                <svg className="mx-auto h-12 w-12 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">
                  <TranslatedText id="noImageSelected" defaultText="No image selected" />
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  <TranslatedText id="uploadOrSelectImage" defaultText="Upload a new image or select one from your list to start editing." />
                </p>
              </div>
            ) }
          </div>
        </div>
        
        {/* Preview Modal */}
        {previewModal.isOpen && (
          <PreviewModal 
            isOpen={previewModal.isOpen}
            onClose={() => setPreviewModal({ isOpen: false, image: null, title: '' })}
            image={previewModal.image}
            title={previewModal.title}
          />
        )}
      </main>
      
      <Footer />
    </div>
  );
}
