# Vercel Deployment Guide

## Environment Variables Setup

Set these environment variables in your Vercel dashboard:

1. **MONGODB_URI**: Your MongoDB connection string
2. **GEMINI_API_KEY**: Your Google Gemini API key
3. **NODE_ENV**: Set to "production"
4. **CORS_ORIGIN**: Your frontend domain (e.g., https://your-app.vercel.app)

## Deployment Steps

1. **Deploy Backend**:
   - Connect your repository to Vercel
   - Set the root directory to your project root
   - Vercel will automatically detect the `vercel.json` configuration

2. **Deploy Frontend**:
   - Deploy the frontend separately
   - Update the API URL in your frontend to point to your backend Vercel URL

## Important Notes

- Socket.io functionality is disabled in production (Vercel serverless doesn't support persistent connections)
- Real-time collaboration will not work in the Vercel deployment
- For full functionality, consider using Railway, Render, or Heroku for the backend

## Alternative Deployment Options

### Option 1: Railway (Recommended for full functionality)
- Supports Socket.io
- Easy MongoDB integration
- Better for real-time features

### Option 2: Render
- Free tier available
- Supports persistent connections
- Good for Node.js applications

### Option 3: Heroku
- Traditional hosting
- Full Socket.io support
- Requires paid plan for production
