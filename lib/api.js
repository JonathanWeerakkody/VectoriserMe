// lib/api.js
import axios from 'axios';

// Get the API URL from environment variable or use a default for development
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

// Create axios instance with base URL
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'multipart/form-data',
  },
});

// Function to convert image to SVG
export async function convertImageToSvg(file, settings) {
  const formData = new FormData();
  formData.append('image', file);
  formData.append('settings', JSON.stringify(settings));
  
  try {
    const response = await apiClient.post('/api/convert', formData, {
      onUploadProgress: (progressEvent) => {
        const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        // You can use this to update progress state
        console.log(`Upload Progress: ${percentCompleted}%`);
      }
    });
    
    return response.data;
  } catch (error) {
    console.error('Error converting image:', error);
    throw error;
  }
}

// Function to check server health
export async function checkServerHealth() {
  try {
    const response = await apiClient.get('/api/health');
    return response.data;
  } catch (error) {
    console.error('Error checking server health:', error);
    throw error;
  }
}

// Function to download multiple SVGs as a zip file
export async function downloadBatchAsSvg(fileIds) {
  try {
    const response = await apiClient.post('/api/download-batch', { fileIds }, {
      responseType: 'blob',
    });
    
    return response.data;
  } catch (error) {
    console.error('Error downloading batch:', error);
    throw error;
  }
}

export default {
  convertImageToSvg,
  checkServerHealth,
  downloadBatchAsSvg,
};
