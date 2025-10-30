# ⚡ Quick Pusher Setup Guide

## What Changed?

The app now uses **Pusher** instead of Socket.io, which means it can deploy entirely on Vercel!

---

## 🚀 3-Step Deployment

### Step 1: Get Pusher Credentials (2 minutes)

1. Go to: **https://dashboard.pusher.com/accounts/sign_up**
2. Sign up (free, no credit card)
3. Create new app:
   - Name: `mind-express-video`
   - Cluster: `us2` (or closest to you)
4. **Copy these credentials:**
   - app_id: `1234567`
   - key: `abc123...`
   - secret: `xyz789...`
   - cluster: `us2`

---

### Step 2: Deploy Backend to Vercel (5 minutes)

```bash
cd backend
npm install -g vercel
vercel login
vercel --prod
```

**Add environment variables:**
```bash
vercel env add PUSHER_APP_ID production
# Paste your app_id

vercel env add PUSHER_KEY production
# Paste your key

vercel env add PUSHER_SECRET production
# Paste your secret

vercel env add PUSHER_CLUSTER production
# Enter: us2

vercel env add CORS_ORIGIN production
# Enter: *

# Redeploy
vercel --prod
```

**Copy your backend URL**: `https://your-backend.vercel.app`

---

### Step 3: Deploy Frontend to Vercel (5 minutes)

```bash
cd frontend
vercel --prod
```

**Add environment variables:**
```bash
vercel env add VITE_PUSHER_KEY production
# Paste your Pusher key

vercel env add VITE_PUSHER_CLUSTER production
# Enter: us2

vercel env add VITE_API_URL production
# Paste your backend URL

# Redeploy
vercel --prod
```

**Done!** 🎉

---

## ✅ Test It

1. Visit your frontend URL
2. Enter license: `ME12345`
3. Open incognito window
4. Enter same license: `ME12345`
5. **Call connects!**

---

## 💰 Cost

**$0/month** - Everything is free tier!

- Vercel Frontend: FREE
- Vercel Backend: FREE
- Pusher: FREE (100 connections, 200k messages/day)

---

## 📚 Full Guide

See **VERCEL-DEPLOYMENT.md** for complete step-by-step instructions with screenshots and troubleshooting.

---

## 🆘 Quick Troubleshooting

**Can't connect?**
- Check all environment variables are set
- Redeploy both frontend and backend
- Check browser console (F12) for errors

**CORS error?**
- Update `CORS_ORIGIN` in backend to your frontend URL
- Redeploy backend

---

**That's it!** Your app is now live on Vercel! 🚀
