# Test Backend Directly

Open this URL in your browser to test if the backend is working:

https://mind-express-video-aawds2mh0-jakedalerourke-gmailcoms-projects.vercel.app/api/health

**Expected result:**
```json
{
  "status": "ok",
  "timestamp": "2025-10-30T...",
  "service": "Mind Express Video Signaling",
  "version": "2.0.0",
  "pusher": "enabled"
}
```

If you see this, the backend is working but CORS is the issue.
If you see an error, the API functions aren't deploying correctly.

Please paste what you see!
