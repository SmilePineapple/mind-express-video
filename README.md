# Mind Express 5 Accessible Video Call App

A browser-based video calling platform specifically designed for Mind Express 5 AAC users, enabling simple and accessible video communication.

## 🎯 Project Overview

This application provides an extremely simple, visually clear, and fully accessible video calling experience optimized for users with:
- Switch control
- Eye gaze input
- Touch input
- Other assistive technologies

## 🏗️ Architecture

### Frontend
- **Framework**: React 18
- **Styling**: TailwindCSS
- **Animations**: Framer Motion
- **Routing**: React Router
- **Real-time**: Socket.io-client
- **Video**: WebRTC API

### Backend
- **Runtime**: Node.js 18+
- **Framework**: Express
- **WebSocket**: Socket.io
- **State**: In-memory (Redis optional)

### Infrastructure
- **Frontend Hosting**: Vercel
- **Backend Hosting**: Render/Heroku
- **STUN/TURN**: Public STUN servers + optional TURN

## 📁 Project Structure

```
mind-express-video/
├── frontend/                 # React frontend application
│   ├── public/
│   ├── src/
│   │   ├── components/      # React components
│   │   │   ├── LoginPage.jsx
│   │   │   ├── CallPage.jsx
│   │   │   ├── VideoControls.jsx
│   │   │   └── WaitingRoom.jsx
│   │   ├── hooks/           # Custom React hooks
│   │   │   ├── useWebRTC.js
│   │   │   └── useSocket.js
│   │   ├── utils/           # Utility functions
│   │   │   ├── validation.js
│   │   │   └── webrtc-config.js
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.js
│
├── backend/                  # Node.js signaling server
│   ├── src/
│   │   ├── server.js        # Express + Socket.io setup
│   │   ├── roomManager.js   # Room state management
│   │   └── config.js        # Configuration
│   ├── package.json
│   └── .env.example
│
├── docs/                     # Documentation
│   └── accessibility-guide.md
│
├── PRD.md                    # Product Requirements Document
└── README.md                 # This file
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm
- Modern web browser (Chrome, Edge, Firefox, Safari)
- Camera and microphone permissions

### Installation

#### 1. Clone the repository
```bash
cd "c:/Users/jaket/Desktop/Mind Express Video"
```

#### 2. Set up the backend
```bash
cd backend
npm install
```

Create `.env` file:
```env
PORT=3001
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173
```

Start the signaling server:
```bash
npm run dev
```

#### 3. Set up the frontend
```bash
cd frontend
npm install
```

Create `.env` file:
```env
VITE_SOCKET_URL=http://localhost:3001
```

Start the development server:
```bash
npm run dev
```

#### 4. Open the app
Navigate to `http://localhost:5173`

## 🎮 Usage

### Joining a Call
1. Open the app in your browser
2. Enter your Mind Express License ID (format: ME12345)
3. Optionally enter a nickname
4. Click "Join"
5. Share your license ID with the person you want to call
6. When they join, the call starts automatically

### During a Call
- **Mute/Unmute**: Toggle your microphone
- **Camera On/Off**: Toggle your video
- **Full Screen**: Expand to full screen mode
- **End Call**: Leave the session

### Keyboard Shortcuts
- `Space`: Mute/Unmute
- `C`: Toggle camera
- `F`: Full screen
- `Esc`: End call
- `Tab`: Navigate between controls

## ♿ Accessibility Features

### Design Principles
- **Large Touch Targets**: All buttons minimum 80x80px
- **High Contrast**: 4.5:1 text contrast, 3:1 UI contrast
- **Clear Labels**: Icons with text labels
- **Keyboard Navigation**: Full keyboard/switch control support
- **Focus Indicators**: 3px visible focus outlines
- **Screen Reader Support**: ARIA labels on all interactive elements

### Assistive Technology Support
- ✅ Eye-gaze systems
- ✅ Switch control
- ✅ Touch input
- ✅ Keyboard navigation
- ✅ Screen readers

## 🔧 Configuration

### WebRTC Configuration
STUN servers are configured in `frontend/src/utils/webrtc-config.js`:
```javascript
export const rtcConfig = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' }
  ]
};
```

### Room Settings
- **Max Users**: 2 per room
- **Room Expiration**: 30 minutes of inactivity
- **Auto-Accept**: Configurable per user

## 🧪 Testing

### Manual Testing Checklist
- [ ] License validation (valid/invalid formats)
- [ ] Room creation and joining
- [ ] WebRTC connection establishment
- [ ] Audio/video controls
- [ ] Keyboard navigation
- [ ] Screen reader compatibility
- [ ] Mobile/tablet responsiveness
- [ ] Error handling (permissions, connection failures)

### Accessibility Testing
- [ ] Keyboard-only navigation
- [ ] Screen reader (NVDA/JAWS)
- [ ] High contrast mode
- [ ] Zoom to 200%
- [ ] Switch control simulation

## 📦 Deployment

### Frontend (Vercel)
```bash
cd frontend
npm run build
vercel --prod
```

### Backend (Render)
1. Create new Web Service on Render
2. Connect GitHub repository
3. Set build command: `cd backend && npm install`
4. Set start command: `cd backend && npm start`
5. Add environment variables

## 🔒 Security

- **HTTPS Only**: All connections use TLS
- **Secure WebSockets**: WSS protocol
- **No Data Storage**: No video/audio recording
- **Private Rooms**: License ID acts as room key
- **No Public Listing**: Rooms not discoverable

## 🛠️ Technology Stack

| Category | Technology |
|----------|-----------|
| Frontend Framework | React 18 |
| Styling | TailwindCSS |
| Animation | Framer Motion |
| Routing | React Router |
| Build Tool | Vite |
| Backend Runtime | Node.js 18+ |
| Backend Framework | Express |
| WebSocket | Socket.io |
| Video/Audio | WebRTC |
| Hosting (Frontend) | Vercel |
| Hosting (Backend) | Render |

## 📋 Development Patterns

### Component Structure
- Functional components with hooks
- Custom hooks for complex logic (WebRTC, Socket)
- Prop validation with PropTypes
- Accessible by default (ARIA, semantic HTML)

### State Management
- React Context for global state (user info, room state)
- Local state for UI interactions
- Socket.io for real-time synchronization

### Styling Conventions
- TailwindCSS utility classes
- Custom accessibility utilities
- Responsive design (mobile-first)
- High contrast mode support

### Error Handling
- Try-catch blocks for async operations
- User-friendly error messages
- Graceful degradation
- Retry logic for connection failures

## 🐛 Known Issues & Limitations

- **Safari iOS**: WebRTC support may require specific handling
- **Firewall Restrictions**: May need TURN server for some networks
- **Browser Permissions**: Users must manually grant camera/mic access
- **License Validation**: Currently mock validation (ME + 5 digits)

## 🗺️ Roadmap

### Phase 1: MVP (Current)
- [x] Basic login with license validation
- [x] WebRTC video/audio connection
- [x] Essential controls
- [x] Accessibility basics

### Phase 2: Enhanced Features
- [ ] Share code functionality
- [ ] Text chat panel
- [ ] Session timer
- [ ] Auto-accept calls option

### Phase 3: Advanced Accessibility
- [ ] Live captions/transcription
- [ ] Eye-gaze optimization
- [ ] Switch control testing
- [ ] User testing with AAC users

## 📄 License

This project is proprietary software designed for Mind Express 5 users.

## 🤝 Contributing

This is a private project. For questions or support, contact the development team.

## 📞 Support

For technical issues or accessibility concerns, please create an issue in the repository.

---

**Built with ❤️ for the AAC community**
