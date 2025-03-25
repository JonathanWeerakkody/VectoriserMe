# Vectorise.Me - Image to Vector Conversion Application

This application merges a modern front-end design with powerful vectorization functionality from the vtracer library, allowing users to convert raster images to SVG vector graphics.

## Features

- **User-Friendly Upload**: Drag-and-drop or paste from clipboard, supporting up to 10 images at once
- **Advanced Settings**: Fine-tune your vectorization with options for B/W or color mode, smoothing, path simplification, and more
- **Interactive Preview**: Compare original and vectorized images with an interactive slider
- **Flexible Download**: Download individual SVGs or batch download multiple files as a zip
- **Multilingual Support**: Available in 17 languages
- **Temporary Storage**: Files are automatically deleted after one hour for privacy
- **Responsive Design**: Works on desktop and mobile devices

## Project Structure

```
vectorise-me/
├── components/       # React components
│   ├── i18n/         # Internationalization components
│   └── ...           # UI components
├── pages/            # Next.js pages
├── public/           # Static assets
├── styles/           # CSS styles
├── api/              # API routes for frontend-backend communication
├── lib/              # Utility functions
└── backend/          # Rust backend for image vectorization
    └── server/       # Rust server implementation
```

## Technology Stack

### Frontend
- Next.js (React framework)
- Tailwind CSS for styling
- JSZip for batch downloads
- React Dropzone for file uploads

### Backend
- Rust programming language
- Actix-web framework
- Vtracer library for vectorization
- Docker for containerization

## Getting Started

### Prerequisites
- Node.js 14.x or later
- npm or yarn
- Rust 1.85.1 or later (for backend development)

### Development Setup

1. Clone the repository
2. Install frontend dependencies:
```bash
cd vectorise-me
npm install
```

3. Start the frontend development server:
```bash
npm run dev
```

4. Build and run the backend server:
```bash
cd backend/server
cargo run
```

## Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions.

## Requirements Verification

See [REQUIREMENTS_VERIFICATION.md](./REQUIREMENTS_VERIFICATION.md) for a checklist of implemented requirements.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [vtracer](https://github.com/visioncortex/vtracer) for the vectorization library
- Original frontend design by Jonathan Weerakkody
