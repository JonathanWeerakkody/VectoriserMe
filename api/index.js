// api/index.js
const express = require('express');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const { exec } = require('child_process');
const JSZip = require('jszip');
const cron = require('node-cron');

// Create Express app
const app = express();
const port = process.env.PORT || 8080;

// Enable CORS
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Parse JSON bodies
app.use(express.json());

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, 'uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});

const upload = multer({ 
  storage,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

// Create output directory for SVGs
const outputDir = path.join(__dirname, 'output');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Store file metadata
const fileStore = {};

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

// Convert image to SVG endpoint
app.post('/api/convert', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  try {
    const settings = req.body.settings ? JSON.parse(req.body.settings) : {};
    const inputPath = req.file.path;
    const fileId = path.basename(inputPath, path.extname(inputPath));
    const outputPath = path.join(outputDir, `${fileId}.svg`);

    // Store file metadata with timestamp
    fileStore[fileId] = {
      originalName: req.file.originalname,
      inputPath,
      outputPath,
      timestamp: Date.now(),
      settings
    };

    // In a real implementation, this would call the Rust backend
    // For now, we'll simulate the conversion with a simple SVG
    const svgData = generateSvg(settings);
    fs.writeFileSync(outputPath, svgData);

    res.json({
      fileId,
      svgData,
      message: 'Conversion successful'
    });
  } catch (error) {
    console.error('Conversion error:', error);
    res.status(500).json({ error: 'Conversion failed', details: error.message });
  }
});

// Download a single SVG
app.get('/api/download/:fileId', (req, res) => {
  const { fileId } = req.params;
  const fileData = fileStore[fileId];

  if (!fileData || !fs.existsSync(fileData.outputPath)) {
    return res.status(404).json({ error: 'File not found' });
  }

  res.download(fileData.outputPath, `${path.basename(fileData.originalName, path.extname(fileData.originalName))}.svg`);
});

// Download multiple SVGs as a zip
app.post('/api/download-batch', (req, res) => {
  const { fileIds } = req.body;

  if (!fileIds || !Array.isArray(fileIds) || fileIds.length === 0) {
    return res.status(400).json({ error: 'No file IDs provided' });
  }

  try {
    const zip = new JSZip();

    // Add each SVG to the zip
    fileIds.forEach(fileId => {
      const fileData = fileStore[fileId];
      if (fileData && fs.existsSync(fileData.outputPath)) {
        const svgData = fs.readFileSync(fileData.outputPath, 'utf8');
        const fileName = `${path.basename(fileData.originalName, path.extname(fileData.originalName))}.svg`;
        zip.file(fileName, svgData);
      }
    });

    // Generate the zip file
    zip.generateAsync({ type: 'nodebuffer' })
      .then(content => {
        res.setHeader('Content-Type', 'application/zip');
        res.setHeader('Content-Disposition', 'attachment; filename=vectorised-images.zip');
        res.send(content);
      });
  } catch (error) {
    console.error('Batch download error:', error);
    res.status(500).json({ error: 'Batch download failed', details: error.message });
  }
});

// Schedule cleanup of old files (run every hour)
cron.schedule('0 * * * *', () => {
  console.log('Running scheduled cleanup...');
  const now = Date.now();
  const oneHour = 60 * 60 * 1000; // 1 hour in milliseconds

  Object.keys(fileStore).forEach(fileId => {
    const fileData = fileStore[fileId];
    if (now - fileData.timestamp > oneHour) {
      // Delete input file
      if (fs.existsSync(fileData.inputPath)) {
        fs.unlinkSync(fileData.inputPath);
      }
      
      // Delete output file
      if (fs.existsSync(fileData.outputPath)) {
        fs.unlinkSync(fileData.outputPath);
      }
      
      // Remove from file store
      delete fileStore[fileId];
      console.log(`Cleaned up files for ${fileId}`);
    }
  });
});

// Helper function to generate a simple SVG based on settings
function generateSvg(settings) {
  const { outputMode, threshold, colorCount, backgroundTransparency } = settings;
  
  let fill = '#000000';
  let background = backgroundTransparency ? 'none' : '#ffffff';
  
  if (outputMode === 'color') {
    // Generate a random color for demo purposes
    fill = `#${Math.floor(Math.random()*16777215).toString(16)}`;
  }
  
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="400" height="400" xmlns="http://www.w3.org/2000/svg">
  <rect width="400" height="400" fill="${background}" />
  <circle cx="200" cy="200" r="150" fill="${fill}" />
  <text x="200" y="200" font-family="Arial" font-size="20" text-anchor="middle" fill="${outputMode === 'bw' ? '#ffffff' : '#000000'}">
    Vectorise.Me
  </text>
</svg>`;
}

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

module.exports = app;
