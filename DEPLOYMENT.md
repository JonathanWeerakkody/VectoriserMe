# Deployment Guide for Vectorise.Me

This guide provides detailed instructions for deploying the Vectorise.Me application, which consists of a Next.js frontend and a Rust backend.

## Prerequisites

- GitHub account
- Vercel account (for frontend deployment)
- Render.com account (for backend deployment)
- Git installed on your local machine

## Frontend Deployment (Vercel)

Vercel is the recommended platform for deploying the Next.js frontend due to its seamless integration with Next.js and excellent performance.

### Step 1: Push Frontend Code to GitHub

1. Create a new GitHub repository for your frontend code
2. Initialize Git in your local frontend directory:
   ```bash
   cd /path/to/integrated-app
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/yourusername/vectorise-me-frontend.git
   git push -u origin main
   ```

### Step 2: Deploy to Vercel

1. Log in to your Vercel account: https://vercel.com/login
2. Click "Add New" > "Project"
3. Import your GitHub repository
4. Configure the project:
   - Framework Preset: Next.js
   - Build Command: `npm run build`
   - Output Directory: `.next`
   - Install Command: `npm install`
5. Add Environment Variables:
   - `NEXT_PUBLIC_API_URL`: URL of your backend API (from Render.com)
6. Click "Deploy"

### Step 3: Verify Frontend Deployment

1. Once deployment is complete, Vercel will provide a URL for your application
2. Open the URL in your browser to verify the frontend is working correctly
3. Note: The application won't be fully functional until the backend is deployed

## Backend Deployment (Render.com)

Render.com is recommended for the backend deployment due to its support for Docker and Rust applications.

### Step 1: Push Backend Code to GitHub

1. Create a new GitHub repository for your backend code
2. Initialize Git in your local backend directory:
   ```bash
   cd /path/to/integrated-app/backend
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/yourusername/vectorise-me-backend.git
   git push -u origin main
   ```

### Step 2: Deploy to Render.com

1. Log in to your Render.com account: https://dashboard.render.com/
2. Click "New" > "Web Service"
3. Connect your GitHub repository
4. Configure the service:
   - Name: vectorise-me-backend
   - Environment: Docker
   - Branch: main
   - Region: Choose the region closest to your users
   - Plan: Starter (or higher based on your needs)
   - Health Check Path: /api/health
5. Add Environment Variables:
   - `RUST_LOG`: info
   - `PORT`: 8080
   - `FRONTEND_URL`: Your Vercel frontend URL (from Step 2)
6. Click "Create Web Service"

### Step 3: Verify Backend Deployment

1. Once deployment is complete, Render.com will provide a URL for your backend service
2. Test the health check endpoint: `https://your-backend-url.onrender.com/api/health`
3. You should receive a JSON response: `{"status":"ok","message":"Server is running"}`

## Connecting Frontend and Backend

After both services are deployed, you need to connect them:

1. Copy the URL of your backend service from Render.com
2. Go to your Vercel project settings
3. Update the `NEXT_PUBLIC_API_URL` environment variable with the backend URL
4. Redeploy your frontend application

## Testing the Complete Application

1. Open your Vercel frontend URL in a browser
2. Upload an image
3. Adjust settings and convert the image
4. Verify that the preview and download features work correctly

## Troubleshooting

### Frontend Issues

- Check browser console for errors
- Verify that the `NEXT_PUBLIC_API_URL` is set correctly
- Ensure the frontend can access the backend (CORS issues)

### Backend Issues

- Check Render.com logs for errors
- Verify that the Docker build completed successfully
- Ensure the `FRONTEND_URL` is set correctly for CORS

## Maintenance

- Both Vercel and Render.com provide automatic deployments when you push changes to your GitHub repositories
- Monitor your Render.com usage to ensure you stay within the limits of your chosen plan
- The backend automatically cleans up files after one hour, so no manual maintenance is required for storage

## Cost Considerations

- Vercel offers a generous free tier that should be sufficient for moderate usage
- Render.com's Starter plan ($7/month) is recommended for the backend to ensure reliable performance
- For higher traffic, consider upgrading to higher plans on both platforms
