# 🚀 CodeSync AI Deployment Guide

## 📋 Overview
This guide will help you deploy your CodeSync AI application with:
- **Frontend**: Already deployed on Vercel ✅
- **Backend**: Deploy to Railway (Recommended) or Render

## 🎯 Deployment Strategy

### Frontend (Vercel) - ✅ Already Done
Your frontend is already deployed on Vercel and working.

### Backend Deployment Options

## 🥇 Option 1: Railway (RECOMMENDED)

### Why Railway?
- ✅ Free tier (500 hours/month)
- ✅ Zero configuration
- ✅ Built-in MongoDB support
- ✅ Socket.io support
- ✅ Automatic HTTPS

### Steps:
1. **Go to [railway.app](https://railway.app)**
2. **Sign up with GitHub**
3. **Click "New Project" → "Deploy from GitHub repo"**
4. **Select your repository**
5. **Set Root Directory to `backend`**
6. **Add Environment Variables:**
   ```
   MONGODB_URI=your_mongodb_connection_string
   GEMINI_API_KEY=your_gemini_api_key
   CORS_ORIGIN=https://your-frontend-domain.vercel.app
   NODE_ENV=production
   PORT=5000
   ```
7. **Deploy!**

## 🥈 Option 2: Render

### Steps:
1. **Go to [render.com](https://render.com)**
2. **Sign up with GitHub**
3. **Click "New +" → "Web Service"**
4. **Connect your repository**
5. **Configure:**
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
6. **Add Environment Variables** (same as above)
7. **Deploy!**

## 🥉 Option 3: DigitalOcean App Platform

### Steps:
1. **Go to [DigitalOcean App Platform](https://cloud.digitalocean.com/apps)**
2. **Create new app**
3. **Connect GitHub repository**
4. **Configure:**
   - **Source Directory**: `backend`
   - **Build Command**: `npm install`
   - **Run Command**: `npm start`
5. **Add Environment Variables**
6. **Deploy!**

## 🔧 After Backend Deployment

### Update Frontend API URL
Once your backend is deployed, update your frontend to use the new backend URL:

1. **Find your backend URL** (e.g., `https://your-app.railway.app`)
2. **Update frontend API configuration**
3. **Redeploy frontend** (if needed)

## 🧪 Testing Your Deployment

### Test Backend:
```bash
curl https://your-backend-url.railway.app/api/health
```

### Test Frontend:
- Visit your Vercel frontend URL
- Check if it connects to the backend
- Test the collaborative features

## 🚨 Important Notes

1. **Environment Variables**: Make sure all required variables are set
2. **CORS**: Update CORS_ORIGIN to your frontend domain
3. **Database**: Use the same MongoDB database for consistency
4. **API Keys**: Use production API keys, not development ones

## 📞 Need Help?

If you encounter any issues:
1. Check the deployment logs
2. Verify environment variables
3. Test the backend health endpoint
4. Check CORS configuration

## 🎉 Success!

Once deployed, your CodeSync AI will be live with:
- ✅ Real-time collaboration
- ✅ AI-powered debugging
- ✅ Multi-user support
- ✅ File management
