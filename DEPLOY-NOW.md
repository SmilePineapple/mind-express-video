# 🚀 Deploy Now - Quick Guide (Vercel + Pusher)

## ✅ Everything on Vercel!

The app has been refactored to use **Pusher** for WebSocket signaling, which means:
- ✅ **Frontend**: Vercel
- ✅ **Backend**: Vercel Serverless Functions
- ✅ **WebSocket**: Pusher (Free Tier)
- ✅ **Total Cost**: $0/month!

---

## 🎯 Fastest Deployment Path (15 minutes total)

### Step 1: Create Pusher Account (5 minutes)

1. **Go to**: https://render.com/
2. **Sign up/Login** with GitHub
3. **Click**: "New +" → "Web Service"
4. **Choose**: "Build and deploy from a Git repository"
5. **Connect** your GitHub account (or use "Public Git repository")
6. **Configure**:
   ```
   Name: mind-express-signaling
   Root Directory: backend
   Environment: Node
   Build Command: npm install
   Start Command: npm start
   ```
7. **Add Environment Variables**:
   ```
   NODE_ENV=production
   PORT=10000
   CORS_ORIGIN=https://your-app-name.vercel.app
   ```
   *(You'll update CORS_ORIGIN after frontend deployment)*

8. **Click**: "Create Web Service"
9. **Wait** for deployment (~2 minutes)
10. **Copy the URL**: `https://mind-express-signaling.onrender.com`

---

### Step 2: Deploy Frontend to Vercel (3 minutes)

#### Option A: Via Vercel CLI (Recommended)

```bash
# Install Vercel CLI (if not installed)
npm install -g vercel

# Navigate to frontend
cd frontend

# Login to Vercel
vercel login

# Deploy to production
vercel --prod
```

**When prompted**:
- Set up and deploy? → **Yes**
- Which scope? → **Your account**
- Link to existing project? → **No**
- Project name? → **mind-express-video**
- Directory? → **./frontend** (or just press Enter if already in frontend folder)
- Override settings? → **No**

#### Option B: Via Vercel Dashboard

1. **Go to**: https://vercel.com/new
2. **Click**: "Import Project"
3. **Select**: Your Git repository (or "Import Third-Party Git Repository")
4. **Configure**:
   ```
   Framework Preset: Vite
   Root Directory: frontend
   Build Command: npm run build
   Output Directory: dist
   ```
5. **Click**: "Deploy"

---

### Step 3: Configure Environment Variables

#### Add Backend URL to Frontend

**Via CLI**:
```bash
cd frontend
vercel env add VITE_SOCKET_URL production
# Paste your Render backend URL: https://mind-express-signaling.onrender.com
```

**Via Dashboard**:
1. Go to your Vercel project
2. **Settings** → **Environment Variables**
3. Add:
   - **Name**: `VITE_SOCKET_URL`
   - **Value**: `https://mind-express-signaling.onrender.com`
   - **Environment**: Production
4. **Redeploy**: `vercel --prod`

#### Update Backend CORS

1. Go to your Render dashboard
2. Select your backend service
3. **Environment** → **Environment Variables**
4. Edit `CORS_ORIGIN`:
   - **Value**: `https://your-app-name.vercel.app` (your actual Vercel URL)
5. Service will auto-redeploy

---

## ✅ Verify Deployment

### Test Backend
Visit: `https://your-backend-url.onrender.com/health`

Should return:
```json
{
  "status": "ok",
  "timestamp": "2025-10-30T...",
  "activeRooms": 0,
  "connectedClients": 0
}
```

### Test Frontend
1. Visit: `https://your-app-name.vercel.app`
2. Enter license: `ME12345`
3. Click "Join"
4. Open incognito: `https://your-app-name.vercel.app`
5. Enter same license: `ME12345`
6. **Call should connect!** 🎉

---

## 🔧 If You Don't Want to Use Git

### Manual Deployment

#### Backend (Render)
1. Go to Render dashboard
2. "New +" → "Web Service"
3. Choose "Deploy an existing image from a registry" → **Skip this**
4. Instead: "Build and deploy from a Git repository"
5. Use "Public Git repository" option
6. Or: Zip your `backend` folder and upload

#### Frontend (Vercel)
```bash
cd frontend
vercel --prod
# Follow prompts
```

---

## 💡 Quick Troubleshooting

### Issue: Frontend can't connect to backend
**Fix**: Check `VITE_SOCKET_URL` environment variable in Vercel

### Issue: CORS error
**Fix**: Update `CORS_ORIGIN` in Render to match your Vercel URL exactly

### Issue: Backend sleeping (Render Free Tier)
**Fix**: 
- Render free tier sleeps after 15 min inactivity
- Upgrade to Starter ($7/month) for always-on
- Or: Use Railway.app free tier (no sleep)

---

## 🎯 Alternative: Railway.app (No Sleep on Free Tier)

If you want the backend to stay awake on free tier:

1. **Go to**: https://railway.app/
2. **Sign up** with GitHub
3. **New Project** → "Deploy from GitHub repo"
4. **Select** your repository
5. **Configure**:
   - Root directory: `backend`
   - Start command: `npm start`
6. **Add variables**:
   ```
   NODE_ENV=production
   CORS_ORIGIN=https://your-vercel-url.vercel.app
   ```
7. **Deploy**
8. **Copy URL** and use it in Vercel's `VITE_SOCKET_URL`

---

## 📝 Deployment Checklist

- [ ] Backend deployed to Render/Railway
- [ ] Backend health check returns OK
- [ ] Frontend deployed to Vercel
- [ ] `VITE_SOCKET_URL` set in Vercel
- [ ] `CORS_ORIGIN` set in backend
- [ ] Test: Can join a room
- [ ] Test: Two users can connect
- [ ] Test: Video and audio work
- [ ] Test: All controls work (mute, camera, end call)

---

## 🎉 You're Live!

Once deployed, share your app:
- **URL**: `https://your-app-name.vercel.app`
- **License Format**: ME + 5 digits (e.g., ME12345)
- **Usage**: Two users enter same license ID to connect

---

## 💰 Cost Summary

- **Vercel (Frontend)**: FREE forever
- **Render Free (Backend)**: FREE (sleeps after 15 min)
- **Render Starter (Backend)**: $7/month (always on)
- **Railway (Backend)**: FREE (no sleep, $5 credit/month)

**Recommended for Production**: Vercel (free) + Render Starter ($7/month) = **$7/month total**

---

## 🚀 Ready? Let's Deploy!

```bash
# 1. Deploy backend to Render (via dashboard)
# 2. Deploy frontend to Vercel:
cd frontend
npm install -g vercel
vercel login
vercel --prod

# 3. Add environment variable:
vercel env add VITE_SOCKET_URL production
# Paste your Render URL

# 4. Redeploy:
vercel --prod

# Done! 🎉
```
