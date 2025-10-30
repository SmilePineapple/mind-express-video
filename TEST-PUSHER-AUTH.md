# Test Pusher Auth Endpoint

Try accessing this URL directly in your browser:

https://mind-express-video-kqxgua4qa-jakedalerourke-gmailcoms-projects.vercel.app/api/pusher-auth

You should see either:
- An error message (because it expects POST, not GET)
- OR a CORS error

This will tell us if the endpoint is working at all.

Also try with a POST request using this curl command in PowerShell:

```powershell
Invoke-WebRequest -Uri "https://mind-express-video-kqxgua4qa-jakedalerourke-gmailcoms-projects.vercel.app/api/pusher-auth" -Method POST -ContentType "application/json" -Body '{"socket_id":"test","channel_name":"presence-room-ME12345","nickname":"Test"}' | Select-Object -ExpandProperty Content
```

Please try both and tell me what you see!
