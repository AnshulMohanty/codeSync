# 🚀 Render Deployment Guide for CodeSync Backend

## 📋 Prerequisites
- GitHub repository with your code
- Render account (free)
- Environment variables ready

## 🚀 Step-by-Step Deployment

### 1. Go to Render
- Visit [render.com](https://render.com)
- Click **"Get Started for Free"**
- Sign up with GitHub

### 2. Create New Web Service
- Click **"New +"** → **"Web Service"**
- Connect your GitHub repository: `codeSync-1`
- Click **"Connect"**

### 3. Configure Service Settings
- **Name**: `codesync-backend` (or any name you prefer)
- **Environment**: `Node`
- **Region**: Choose closest to your users
- **Branch**: `main` (or your default branch)
- **Root Directory**: `backend` ⚠️ **IMPORTANT!**
- **Build Command**: `npm install`
- **Start Command**: `npm start`

### 4. Add Environment Variables
In the **Environment Variables** section, add:

```env
MONGODB_URI=mongodb+srv://Anshul_User_1:Anshul_MongoDB@cluster0.1balow3.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
GEMINI_API_KEY=AIzaSyDPuFtcwuut3ZqC9ZL3YQ7Lx2Lhm4Lvnqo
CORS_ORIGIN=https://your-frontend-domain.vercel.app
NODE_ENV=production
PORT=5000
RATE_LIMIT_WINDOW=60000
RATE_LIMIT_MAX_REQUESTS=10
```

### 5. Deploy Settings
- **Plan**: Free (750 hours/month)
- **Auto-Deploy**: Yes (deploys on every push)
- **Health Check**: `/api/health`

### 6. Deploy!
- Click **"Create Web Service"**
- Render will build and deploy your backend
- You'll get a URL like: `https://codesync-backend.onrender.com`

## 🔧 Configuration Files Added

### `render.yaml`
- Configures Render-specific settings
- Sets build and start commands
- Configures health check

### `.renderignore`
- Excludes unnecessary files from deployment
- Reduces deployment size

## 🧪 Testing Your Deployment

### 1. Health Check
```bash
curl https://your-app-name.onrender.com/api/health
```

### 2. Test API Endpoints
```bash
# Test project creation
curl -X POST https://your-app-name.onrender.com/api/projects \
  -H "Content-Type: application/json" \
  -d '{"projectName": "Test Project", "language": "javascript"}'
```

## 🆓 Free Tier Details

### What's Free:
- ✅ **750 hours/month** usage
- ✅ **Automatic deployments** from GitHub
- ✅ **Built-in HTTPS** and custom domains
- ✅ **Environment variables** support
- ✅ **Health checks** and monitoring
- ✅ **Sleep after 15 minutes** of inactivity (wakes up on request)

### Important Notes:
- **Free tier sleeps after 15 minutes** of inactivity
- **First request after sleep takes ~30 seconds** to wake up
- **Perfect for development and small projects**

## 🔄 After Deployment

### Update Frontend
1. **Get your Render backend URL**
2. **Update frontend API configuration**
3. **Test the connection**

### Frontend API Update
In your frontend code, update the API base URL:
```javascript
// In frontend/src/utils/api.js
const API_BASE_URL = 'https://your-app-name.onrender.com';
```

## 🚨 Troubleshooting

### Common Issues:
1. **Build fails**: Check environment variables
2. **App won't start**: Check logs in Render dashboard
3. **CORS errors**: Update CORS_ORIGIN variable
4. **Database connection**: Check MONGODB_URI
5. **Slow first request**: Normal for free tier (sleep/wake cycle)

### Check Logs:
- Go to Render dashboard
- Click on your service
- View **Logs** tab for real-time logs

### Free Tier Limitations:
- **Sleeps after 15 minutes** of inactivity
- **30-second wake-up time** for first request
- **750 hours/month** usage limit

## 🎯 Render vs Railway

| Feature | Render | Railway |
|---------|--------|---------|
| Free Hours | 750/month | 500/month |
| Sleep Mode | Yes (15 min) | No |
| Wake Time | ~30 seconds | Instant |
| Best For | Small projects | Always-on apps |

## ✅ Success!
Once deployed, your backend will be live at:
`https://your-app-name.onrender.com`

Your CodeSync AI backend is now ready for production! 🎉

## 💡 Pro Tips:
1. **Monitor usage** in Render dashboard
2. **Set up custom domain** if needed
3. **Use health checks** for monitoring
4. **Consider upgrading** if you need always-on service
