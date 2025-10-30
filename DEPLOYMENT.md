# Deployment Guide - Vercel

## 🚀 Quick Deployment Steps

### Prerequisites
1. **Vercel Account**: Sign up at https://vercel.com
2. **Vercel CLI**: Install globally
   ```bash
   npm install -g vercel
   ```
3. **Git Repository** (optional but recommended)

---

## 📦 Option 1: Deploy via Vercel CLI (Recommended)

### Step 1: Deploy Backend (Signaling Server)

**Important**: Vercel has limitations with WebSocket connections. For production, we recommend deploying the backend to **Render** or **Railway** instead.

#### Deploy to Render (Recommended for Backend)

1. Go to https://render.com and sign up
2. Click "New +" → "Web Service"
3. Connect your GitHub repository (or upload manually)
4. Configure:
   - **Name**: `mind-express-signaling`
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Environment Variables**:
     ```
     NODE_ENV=production
     PORT=10000
     CORS_ORIGIN=https://your-frontend-url.vercel.app
     ```
5. Click "Create Web Service"
6. **Copy the deployment URL** (e.g., `https://mind-express-signaling.onrender.com`)

### Step 2: Deploy Frontend to Vercel

```bash
# Navigate to frontend directory
cd frontend

# Login to Vercel (first time only)
vercel login

# Deploy to production
vercel --prod
```

**During deployment, you'll be asked:**
1. **Set up and deploy?** → Yes
2. **Which scope?** → Your account
3. **Link to existing project?** → No
4. **Project name?** → `mind-express-video` (or your choice)
5. **Directory?** → `./` (current directory)
6. **Override settings?** → No

### Step 3: Configure Environment Variables

After deployment, add environment variable:

```bash
# Add the backend URL
vercel env add VITE_SOCKET_URL production
# Enter: https://mind-express-signaling.onrender.com (your backend URL)
```

Or via Vercel Dashboard:
1. Go to your project on vercel.com
2. Settings → Environment Variables
3. Add: `VITE_SOCKET_URL` = `https://your-backend-url.onrender.com`
4. Redeploy: `vercel --prod`

### Step 4: Update Backend CORS

Update backend `.env` on Render:
```
CORS_ORIGIN=https://your-frontend-url.vercel.app
```

---

## 📦 Option 2: Deploy via Vercel Dashboard

### Frontend Deployment

1. **Go to**: https://vercel.com/new
2. **Import Git Repository** or **Upload Project**
3. **Configure Project**:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. **Environment Variables**:
   - `VITE_SOCKET_URL`: Your backend URL
5. **Deploy**

### Backend Deployment (Use Render Instead)

Since Vercel has WebSocket limitations, deploy backend to Render:
1. Go to https://render.com
2. Follow "Deploy to Render" steps above

---

## 🔧 Alternative Backend Hosting Options

### Option A: Railway.app

1. Go to https://railway.app
2. "New Project" → "Deploy from GitHub"
3. Select `backend` folder
4. Add environment variables:
   ```
   NODE_ENV=production
   PORT=3001
   CORS_ORIGIN=https://your-frontend-url.vercel.app
   ```
5. Deploy

### Option B: Heroku

```bash
cd backend

# Login to Heroku
heroku login

# Create app
heroku create mind-express-signaling

# Set environment variables
heroku config:set NODE_ENV=production
heroku config:set CORS_ORIGIN=https://your-frontend-url.vercel.app

# Deploy
git init
git add .
git commit -m "Deploy backend"
heroku git:remote -a mind-express-signaling
git push heroku main
```

### Option C: DigitalOcean App Platform

1. Go to https://cloud.digitalocean.com/apps
2. "Create App" → "GitHub" or "Upload"
3. Select `backend` folder
4. Configure environment variables
5. Deploy

---

## 🌐 Custom Domain (Optional)

### Add Custom Domain to Vercel

1. Go to your project on Vercel
2. Settings → Domains
3. Add your domain (e.g., `video.mindexpress.com`)
4. Follow DNS configuration instructions
5. SSL certificate is automatic

### Add Custom Domain to Render

1. Go to your service on Render
2. Settings → Custom Domain
3. Add domain and configure DNS
4. SSL certificate is automatic

---

## ✅ Post-Deployment Checklist

### Test Deployment

1. **Open Frontend URL**: `https://your-app.vercel.app`
2. **Check Console**: No errors (F12)
3. **Test Login**: Enter license ID (e.g., ME12345)
4. **Test Connection**: Open incognito window, join same room
5. **Test Video/Audio**: Verify camera and microphone work
6. **Test Controls**: Mute, camera, fullscreen, end call

### Verify Environment Variables

**Frontend** (Vercel):
```bash
vercel env ls
```
Should show: `VITE_SOCKET_URL`

**Backend** (Render):
Check dashboard → Environment → Environment Variables

### Monitor Logs

**Frontend** (Vercel):
```bash
vercel logs
```

**Backend** (Render):
- Dashboard → Logs tab
- Real-time log streaming

---

## 🔒 Security Configuration

### Update CORS Origins

**Backend `.env` on Render**:
```env
NODE_ENV=production
PORT=10000
CORS_ORIGIN=https://your-actual-frontend-url.vercel.app
```

### HTTPS Enforcement

Both Vercel and Render provide automatic HTTPS:
- ✅ SSL certificates auto-generated
- ✅ HTTP → HTTPS redirect enabled
- ✅ WebSocket connections use WSS

---

## 📊 Monitoring & Analytics

### Vercel Analytics (Frontend)

1. Go to project on Vercel
2. Analytics tab
3. Enable Web Analytics (free)

### Render Metrics (Backend)

1. Go to service on Render
2. Metrics tab
3. Monitor CPU, memory, requests

---

## 🐛 Troubleshooting

### Issue: "Failed to connect to signaling server"

**Solution**:
1. Check `VITE_SOCKET_URL` is set correctly
2. Verify backend is running (visit health endpoint)
3. Check CORS_ORIGIN matches frontend URL
4. Ensure backend allows WebSocket connections

### Issue: "Camera/microphone not working"

**Solution**:
1. Ensure site is served over HTTPS (Vercel does this automatically)
2. Check browser permissions
3. Test on different browser

### Issue: "Room not connecting"

**Solution**:
1. Check both users entered same license ID
2. Verify backend logs for connection
3. Check browser console for errors
4. Test with different license ID

---

## 💰 Cost Estimates

### Vercel (Frontend)
- **Hobby Plan**: FREE
  - 100GB bandwidth/month
  - Unlimited deployments
  - Automatic HTTPS
  - Perfect for this project

### Render (Backend)
- **Free Tier**: $0/month
  - 750 hours/month
  - Automatic sleep after 15 min inactivity
  - Good for testing
- **Starter Plan**: $7/month
  - Always on
  - Better for production

### Total Cost
- **Development/Testing**: FREE (Vercel Free + Render Free)
- **Production**: $7/month (Vercel Free + Render Starter)

---

## 🚀 Continuous Deployment

### Auto-Deploy on Git Push

1. **Connect GitHub to Vercel**:
   - Vercel Dashboard → Import Project → GitHub
   - Auto-deploys on every push to `main`

2. **Connect GitHub to Render**:
   - Render Dashboard → New Web Service → GitHub
   - Auto-deploys on every push to `main`

### Branch Previews

**Vercel** automatically creates preview deployments for:
- Pull requests
- Feature branches
- Each preview gets unique URL

---

## 📝 Environment Variables Summary

### Frontend (Vercel)
```env
VITE_SOCKET_URL=https://your-backend-url.onrender.com
```

### Backend (Render)
```env
NODE_ENV=production
PORT=10000
CORS_ORIGIN=https://your-frontend-url.vercel.app
```

---

## 🎯 Quick Start Commands

```bash
# Frontend deployment
cd frontend
vercel --prod

# Check deployment
vercel ls

# View logs
vercel logs

# Add environment variable
vercel env add VITE_SOCKET_URL production
```

---

## ✅ Success Indicators

After successful deployment:
- ✅ Frontend accessible at Vercel URL
- ✅ Backend accessible at Render URL
- ✅ Health check returns OK: `https://backend-url/health`
- ✅ Video calls connect successfully
- ✅ Camera and audio work
- ✅ No console errors

---

## 📞 Support

If you encounter issues:
1. Check Vercel deployment logs
2. Check Render service logs
3. Verify environment variables
4. Test locally first
5. Check browser console (F12)

---

**Ready to deploy!** Start with the backend on Render, then deploy the frontend to Vercel. 🚀
