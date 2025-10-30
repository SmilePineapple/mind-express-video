# Quick Start Guide - Mind Express Video Call App

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ installed
- Modern web browser (Chrome, Edge, Firefox recommended)
- Camera and microphone

### Starting the Application

#### 1. Start the Backend Server (Terminal 1)
```bash
cd backend
npm run dev
```

You should see:
```
🚀 Signaling server running on port 3001
📡 CORS enabled for: http://localhost:5173
🏥 Health check: http://localhost:3001/health
```

#### 2. Start the Frontend (Terminal 2)
```bash
cd frontend
npm run dev
```

You should see:
```
VITE ready in XXXms
➜  Local:   http://localhost:5173/
```

#### 3. Open the App
Navigate to: **http://localhost:5173**

## 📱 Testing the Video Call

### Single Device Testing (Quick Test)
1. Open the app in your browser
2. Enter a license ID (e.g., `ME12345`)
3. Click "Join"
4. You'll see "Waiting for other user..."
5. Open a new **incognito/private window**
6. Go to http://localhost:5173
7. Enter the **same license ID** (`ME12345`)
8. Click "Join"
9. The call should connect automatically!

### Two Device Testing (Real Scenario)
1. **Device 1**: Open http://localhost:5173
   - Enter license: `ME12345`
   - Click "Join"
   - Copy the room code

2. **Device 2**: Open http://localhost:5173
   - Enter the same license: `ME12345`
   - Click "Join"
   - Call connects!

## 🎮 Using the App

### Login Page
- **License ID**: Enter format `ME` + 5 digits (e.g., ME12345, ME99999)
- **Nickname**: Optional, max 20 characters
- Click **"Join Call"** button

### During a Call
- **Mute/Unmute**: Toggle your microphone
- **Camera On/Off**: Toggle your video
- **Full Screen**: Expand to full screen
- **End Call**: Leave the session

### Keyboard Shortcuts
- `Space`: Mute/Unmute
- `C`: Toggle camera
- `F`: Full screen
- `Esc`: End call

## 🔧 Troubleshooting

### Camera/Microphone Not Working
1. Check browser permissions (click the camera icon in address bar)
2. Allow camera and microphone access
3. Refresh the page

### Connection Failed
1. Make sure backend server is running on port 3001
2. Check console for errors (F12)
3. Try refreshing both browser windows

### "Waiting for other user..." Forever
- Make sure both users entered the **exact same license ID**
- Check that both are connected to the same backend server
- Try using a different license ID

### Port Already in Use
**Backend (3001):**
```bash
# Windows
netstat -ano | findstr :3001
taskkill /PID <PID> /F
```

**Frontend (5173):**
```bash
# Windows
netstat -ano | findstr :5173
taskkill /PID <PID> /F
```

## 📋 Valid License ID Examples
- ✅ ME12345
- ✅ ME00001
- ✅ ME99999
- ❌ ME1234 (too short)
- ❌ ME123456 (too long)
- ❌ M12345 (missing E)
- ❌ me12345 (will be auto-converted to ME12345)

## 🎯 Testing Checklist

### Basic Functionality
- [ ] Login page loads
- [ ] License validation works (try invalid formats)
- [ ] Can join a room
- [ ] Waiting room displays
- [ ] Second user can join same room
- [ ] Video call connects
- [ ] Both video streams visible
- [ ] Audio works both ways

### Controls
- [ ] Mute/unmute works
- [ ] Camera on/off works
- [ ] Full screen works
- [ ] End call returns to home
- [ ] Keyboard shortcuts work

### Accessibility
- [ ] Can navigate with Tab key
- [ ] Focus indicators visible
- [ ] Buttons large enough for touch
- [ ] Screen reader compatible (test with NVDA/JAWS)

## 🌐 Network Configuration

### For Local Network Testing
If testing across devices on the same network:

1. Find your local IP:
```bash
# Windows
ipconfig
# Look for IPv4 Address (e.g., 192.168.1.100)
```

2. Update frontend `.env`:
```env
VITE_SOCKET_URL=http://192.168.1.100:3001
```

3. Update backend `.env`:
```env
CORS_ORIGIN=http://192.168.1.100:5173
```

4. Restart both servers

5. Access from other devices:
```
http://192.168.1.100:5173
```

## 📊 Health Check

Check if backend is running:
```
http://localhost:3001/health
```

Should return:
```json
{
  "status": "ok",
  "timestamp": "2025-10-30T15:30:00.000Z",
  "activeRooms": 0,
  "connectedClients": 0
}
```

## 🐛 Debug Mode

### Enable Verbose Logging
Open browser console (F12) to see:
- Socket connection status
- WebRTC connection events
- ICE candidate exchanges
- Room join/leave events

### Backend Logs
The backend terminal shows:
- Client connections/disconnections
- Room joins/leaves
- Signaling messages (offers/answers/ICE)

## 🎨 Customization

### Change Colors
Edit `frontend/tailwind.config.js`:
```javascript
theme: {
  extend: {
    colors: {
      primary: {
        500: '#YOUR_COLOR',
      },
    },
  },
}
```

### Change Port
**Backend:** Edit `backend/.env`
```env
PORT=3002
```

**Frontend:** Edit `frontend/.env`
```env
VITE_SOCKET_URL=http://localhost:3002
```

## 📞 Support

For issues:
1. Check browser console (F12)
2. Check backend terminal logs
3. Verify both servers are running
4. Test with a different browser
5. Try a different license ID

## 🎉 Success!

If you can see and hear each other, congratulations! The app is working perfectly.

---

**Built for accessibility • Optimized for AAC users • Simple by design**
