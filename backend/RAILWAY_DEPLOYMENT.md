# 🚀 Railway Deployment Guide for CodeSync Backend

## 📋 Prerequisites
- GitHub repository with your code
- Railway account (free)
- Environment variables ready

## 🚀 Step-by-Step Deployment

### 1. Go to Railway
- Visit [railway.app](https://railway.app)
- Click **"Start a New Project"**
- Sign up with GitHub

### 2. Deploy from GitHub
- Select **"Deploy from GitHub repo"**
- Choose your repository: `codeSync-1`
- **IMPORTANT**: Set **Root Directory** to `backend`
- Click **"Deploy"**

### 3. Configure Environment Variables
In Railway dashboard → Your Project → **Variables** tab, add:

```env
MONGODB_URI=mongodb+srv://Anshul_User_1:Anshul_MongoDB@cluster0.1balow3.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
GEMINI_API_KEY=AIzaSyDPuFtcwuut3ZqC9ZL3YQ7Lx2Lhm4Lvnqo
CORS_ORIGIN=https://your-frontend-domain.vercel.app
NODE_ENV=production
PORT=5000
RATE_LIMIT_WINDOW=60000
RATE_LIMIT_MAX_REQUESTS=10
```

### 4. Deploy Settings
- **Build Command**: `npm install` (auto-detected)
- **Start Command**: `npm start` (auto-detected)
- **Health Check**: `/api/health` (configured in railway.json)

### 5. Get Your Backend URL
- Railway will provide a URL like: `https://your-app-name.railway.app`
- Test it: `https://your-app-name.railway.app/api/health`

## 🔧 Configuration Files Added

### `railway.json`
- Configures Railway-specific settings
- Sets health check endpoint
- Configures restart policy

### `Procfile`
- Tells Railway how to start your app
- Uses `web: npm start`

### `.railwayignore`
- Excludes unnecessary files from deployment
- Reduces deployment size

## 🧪 Testing Your Deployment

### 1. Health Check
```bash
curl https://your-app-name.railway.app/api/health
```

### 2. Test API Endpoints
```bash
# Test project creation
curl -X POST https://your-app-name.railway.app/api/projects \
  -H "Content-Type: application/json" \
  -d '{"projectName": "Test Project", "language": "javascript"}'
```

## 🔄 After Deployment

### Update Frontend
1. **Get your Railway backend URL**
2. **Update frontend API configuration**
3. **Test the connection**

### Frontend API Update
In your frontend code, update the API base URL:
```javascript
// In frontend/src/utils/api.js
const API_BASE_URL = 'https://your-app-name.railway.app';
```

## 🆓 Free Tier Limits
- **500 hours/month** usage
- **$5 credit monthly**
- **Your app should stay within free limits**

## 🚨 Troubleshooting

### Common Issues:
1. **Build fails**: Check environment variables
2. **App won't start**: Check logs in Railway dashboard
3. **CORS errors**: Update CORS_ORIGIN variable
4. **Database connection**: Check MONGODB_URI

### Check Logs:
- Go to Railway dashboard
- Click on your project
- View **Deployments** tab for logs

## ✅ Success!
Once deployed, your backend will be live at:
`https://your-app-name.railway.app`

Your CodeSync AI backend is now ready for production! 🎉
