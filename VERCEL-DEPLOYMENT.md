# 🚀 Vercel Deployment Guide (with Pusher)

## Overview

The app is now configured to deploy entirely on Vercel using Pusher for WebSocket signaling.

**Architecture:**
- **Frontend**: Vercel (Static Site)
- **Backend**: Vercel Serverless Functions
- **WebSocket/Signaling**: Pusher (Free Tier)

---

## Step 1: Create Pusher Account (5 minutes)

### 1.1 Sign Up for Pusher

1. Go to: https://dashboard.pusher.com/accounts/sign_up
2. Sign up with GitHub or email
3. Verify your email

### 1.2 Create a Pusher Channels App

1. Click "Create app"
2. **App name**: `mind-express-video`
3. **Cluster**: Choose closest to your users (e.g., `us2` for US, `eu` for Europe)
4. **Tech stack**: 
   - Frontend: React
   - Backend: Node.js
5. Click "Create app"

### 1.3 Get Your Credentials

On your app dashboard, you'll see:
- **app_id**: `1234567`
- **key**: `abc123def456`
- **secret**: `xyz789secret`
- **cluster**: `us2`

**Copy these - you'll need them!**

---

## Step 2: Deploy Backend to Vercel (3 minutes)

### 2.1 Install Vercel CLI

```bash
npm install -g vercel
```

### 2.2 Deploy Backend

```bash
cd backend
vercel login
vercel --prod
```

**When prompted:**
- Project name: `mind-express-backend`
- Directory: `./` (current)
- Override settings: No

### 2.3 Add Environment Variables

```bash
# Add Pusher credentials
vercel env add PUSHER_APP_ID production
# Paste your app_id

vercel env add PUSHER_KEY production
# Paste your key

vercel env add PUSHER_SECRET production
# Paste your secret

vercel env add PUSHER_CLUSTER production
# Paste your cluster (e.g., us2)

vercel env add NODE_ENV production
# Enter: production

vercel env add CORS_ORIGIN production
# Enter: * (we'll update this after frontend deployment)
```

### 2.4 Redeploy with Environment Variables

```bash
vercel --prod
```

**Copy your backend URL**: `https://mind-express-backend.vercel.app`

---

## Step 3: Deploy Frontend to Vercel (3 minutes)

### 3.1 Update Frontend Environment

Edit `frontend/.env`:
```env
VITE_PUSHER_KEY=your_pusher_key_here
VITE_PUSHER_CLUSTER=us2
VITE_API_URL=https://mind-express-backend.vercel.app
```

### 3.2 Deploy Frontend

```bash
cd frontend
vercel --prod
```

**When prompted:**
- Project name: `mind-express-video`
- Directory: `./`
- Override settings: No

### 3.3 Add Environment Variables

```bash
vercel env add VITE_PUSHER_KEY production
# Paste your Pusher key

vercel env add VITE_PUSHER_CLUSTER production
# Paste your cluster

vercel env add VITE_API_URL production
# Paste your backend URL: https://mind-express-backend.vercel.app
```

### 3.4 Redeploy

```bash
vercel --prod
```

**Copy your frontend URL**: `https://mind-express-video.vercel.app`

---

## Step 4: Update CORS (1 minute)

### 4.1 Update Backend CORS

```bash
cd backend
vercel env add CORS_ORIGIN production
# Enter your frontend URL: https://mind-express-video.vercel.app

vercel --prod
```

---

## Step 5: Test Your Deployment ✅

### 5.1 Test Backend Health

Visit: `https://mind-express-backend.vercel.app/api/health`

Should return:
```json
{
  "status": "ok",
  "timestamp": "2025-10-30T...",
  "service": "Mind Express Video Signaling",
  "version": "2.0.0",
  "pusher": "enabled"
}
```

### 5.2 Test Frontend

1. Visit: `https://mind-express-video.vercel.app`
2. Enter license: `ME12345`
3. Click "Join"
4. Open incognito window
5. Go to same URL, enter `ME12345`
6. **Call should connect!** 🎉

---

## 📊 Pusher Free Tier Limits

Pusher Channels Free Tier includes:
- ✅ **100 max connections**
- ✅ **200,000 messages/day**
- ✅ **Unlimited channels**
- ✅ **SSL included**
- ✅ **No credit card required**

**Perfect for:**
- Development and testing
- Small-scale production (up to 50 concurrent calls)
- Personal/educational use

**Upgrade if you need:**
- More than 100 concurrent connections
- More than 200k messages/day
- Starts at $49/month for 500 connections

---

## 🔧 Alternative: Via Vercel Dashboard

### Backend Deployment

1. Go to: https://vercel.com/new
2. Import your Git repository
3. **Root Directory**: `backend`
4. **Framework Preset**: Other
5. **Build Command**: (leave empty)
6. **Output Directory**: (leave empty)
7. **Environment Variables**:
   ```
   PUSHER_APP_ID=your_app_id
   PUSHER_KEY=your_key
   PUSHER_SECRET=your_secret
   PUSHER_CLUSTER=us2
   NODE_ENV=production
   CORS_ORIGIN=*
   ```
8. Click "Deploy"

### Frontend Deployment

1. Go to: https://vercel.com/new
2. Import same repository
3. **Root Directory**: `frontend`
4. **Framework Preset**: Vite
5. **Build Command**: `npm run build`
6. **Output Directory**: `dist`
7. **Environment Variables**:
   ```
   VITE_PUSHER_KEY=your_pusher_key
   VITE_PUSHER_CLUSTER=us2
   VITE_API_URL=https://your-backend.vercel.app
   ```
8. Click "Deploy"

---

## 🎯 Quick Reference

### Environment Variables Summary

**Backend (Vercel)**:
```env
PUSHER_APP_ID=1234567
PUSHER_KEY=abc123def456
PUSHER_SECRET=xyz789secret
PUSHER_CLUSTER=us2
NODE_ENV=production
CORS_ORIGIN=https://your-frontend.vercel.app
```

**Frontend (Vercel)**:
```env
VITE_PUSHER_KEY=abc123def456
VITE_PUSHER_CLUSTER=us2
VITE_API_URL=https://your-backend.vercel.app
```

---

## 🐛 Troubleshooting

### Issue: "Pusher key not configured"

**Fix**: 
1. Check `VITE_PUSHER_KEY` is set in Vercel frontend environment variables
2. Redeploy frontend: `vercel --prod`

### Issue: "Authentication failed"

**Fix**:
1. Verify all Pusher credentials are correct
2. Check backend environment variables
3. Redeploy backend: `cd backend && vercel --prod`

### Issue: "CORS error"

**Fix**:
1. Update `CORS_ORIGIN` in backend to match frontend URL exactly
2. Redeploy backend

### Issue: "Can't connect to other user"

**Fix**:
1. Check browser console for errors (F12)
2. Verify both users entered same license ID
3. Check Pusher dashboard for active connections
4. Ensure camera/microphone permissions granted

---

## 💰 Cost Breakdown

### Free Forever
- ✅ Vercel Frontend: FREE
- ✅ Vercel Backend: FREE (100GB bandwidth, 100GB-hrs compute)
- ✅ Pusher: FREE (100 connections, 200k messages/day)

**Total: $0/month** for development and small-scale production!

### If You Need More
- Vercel Pro: $20/month (more bandwidth, priority support)
- Pusher Startup: $49/month (500 connections)

---

## 🚀 Continuous Deployment

### Auto-Deploy on Git Push

1. Connect GitHub to Vercel (both frontend and backend projects)
2. Every push to `main` branch auto-deploys
3. Pull requests get preview deployments
4. Zero-downtime deployments

---

## ✅ Deployment Checklist

- [ ] Pusher account created
- [ ] Pusher app created and credentials copied
- [ ] Backend deployed to Vercel
- [ ] Backend environment variables set
- [ ] Frontend deployed to Vercel
- [ ] Frontend environment variables set
- [ ] CORS_ORIGIN updated in backend
- [ ] Health check returns OK
- [ ] Can join a room
- [ ] Two users can connect
- [ ] Video and audio work

---

## 🎉 Success!

Your Mind Express Video Call app is now live on Vercel!

**Share your app:**
- URL: `https://your-app.vercel.app`
- License format: ME + 5 digits (e.g., ME12345)

**Monitor usage:**
- Vercel Dashboard: https://vercel.com/dashboard
- Pusher Dashboard: https://dashboard.pusher.com

---

## 📞 Need Help?

- **Vercel Docs**: https://vercel.com/docs
- **Pusher Docs**: https://pusher.com/docs/channels
- **Check logs**: `vercel logs` or Vercel Dashboard → Functions → Logs
