// pages/api/download.js
import { saveAs } from 'file-saver';
import JSZip from 'jszip';

// Function to download a single SVG file
export function downloadSvg(svgData, fileName) {
  const blob = new Blob([svgData], { type: 'image/svg+xml' });
  saveAs(blob, `${fileName}.svg`);
}

// Function to download multiple SVG files as a zip
export async function downloadBatchAsZip(files, conversionStatus) {
  // Create a new JSZip instance
  const zip = new JSZip();
  
  // Add each converted SVG to the zip
  files.forEach(file => {
    const status = conversionStatus[file.id];
    if (status?.status === 'completed' && status?.svgData) {
      // Get file name without extension
      const fileName = file.name.replace(/\.[^/.]+$/, '');
      
      // Add SVG to zip
      zip.file(`${fileName}.svg`, status.svgData);
    }
  });
  
  // Generate the zip file
  const content = await zip.generateAsync({ type: 'blob' });
  
  // Download the zip file
  saveAs(content, 'vectorised-images.zip');
}

// Function to handle preview of SVG
export function previewSvg(svgData, fileName, setPreviewModal) {
  setPreviewModal({
    isOpen: true,
    image: svgData,
    title: `${fileName} (SVG)`,
    isSvg: true
  });
}

// Function to handle preview of original image
export function previewImage(imageUrl, fileName, setPreviewModal) {
  setPreviewModal({
    isOpen: true,
    image: imageUrl,
    title: fileName,
    isSvg: false
  });
}

// Function to create a before/after comparison
export function createBeforeAfterComparison(originalImage, svgData, fileName, setPreviewModal) {
  // Create a data URL for the SVG
  const svgBlob = new Blob([svgData], { type: 'image/svg+xml' });
  const svgUrl = URL.createObjectURL(svgBlob);
  
  setPreviewModal({
    isOpen: true,
    beforeImage: originalImage,
    afterImage: svgUrl,
    title: `${fileName} - Before/After Comparison`,
    isComparison: true
  });
  
  // Return the URL so it can be revoked later
  return svgUrl;
}
