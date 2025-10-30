# Product Requirements Document: Mind Express 5 Accessible Video Call App

## 1. Product Overview

### 1.1 Purpose
A browser-based video calling platform specifically designed for Mind Express 5 AAC (Augmentative and Alternative Communication) users, enabling simple and accessible video communication between users, therapists, teachers, parents, and peers.

### 1.2 Target Users
- Primary: Mind Express 5 AAC users (individuals using switch control, eye gaze, or touch input)
- Secondary: Therapists, teachers, parents, caregivers, and peers connecting with AAC users

### 1.3 Core Value Proposition
- **Simplicity**: Minimal UI with only essential controls
- **Accessibility**: Optimized for eye-gaze, switch control, and touch input
- **Privacy**: License-based room system ensures private sessions
- **Zero Friction**: No account creation, just enter license code and connect

## 2. Functional Requirements

### 2.1 Authentication & Room Access
- **FR-1.1**: Users must enter a valid Mind Express License ID (format: ME + 5 digits, e.g., ME51245)
- **FR-1.2**: License ID validation accepts any ID starting with "ME" followed by 5 digits (mock validation for MVP)
- **FR-1.3**: Optional nickname entry field (max 20 characters)
- **FR-1.4**: Each license ID creates/joins a unique "room"
- **FR-1.5**: Room URL structure: `https://me-call.app/room/{LICENSE_ID}`

### 2.2 Video Call Core Features
- **FR-2.1**: Peer-to-peer video/audio streaming using WebRTC
- **FR-2.2**: Automatic connection when two users join the same room
- **FR-2.3**: "Waiting for other user..." state when only one user is present
- **FR-2.4**: Start Call / End Call button
- **FR-2.5**: Mute / Unmute audio toggle
- **FR-2.6**: Camera On/Off toggle
- **FR-2.7**: Full screen mode toggle
- **FR-2.8**: Auto-accept calls option (for users who cannot click to accept)

### 2.3 Connection Management
- **FR-3.1**: WebRTC signaling via Socket.io
- **FR-3.2**: STUN/TURN server configuration for firewall traversal
- **FR-3.3**: Automatic reconnection on temporary disconnection
- **FR-3.4**: Room expiration after 30 minutes of inactivity
- **FR-3.5**: Maximum 2 users per room

### 2.4 Optional Enhancements (Phase 2)
- **FR-4.1**: "Share my code" button to copy room URL to clipboard
- **FR-4.2**: Text chat panel for typed communication
- **FR-4.3**: Live captions using Web Speech API
- **FR-4.4**: Session timer display
- **FR-4.5**: End-session summary with call duration

## 3. Non-Functional Requirements

### 3.1 Accessibility (WCAG 2.1 AA Compliance)
- **NFR-1.1**: All interactive elements must be keyboard/switch navigable
- **NFR-1.2**: Minimum touch target size: 44x44px (WCAG 2.5.5)
- **NFR-1.3**: High contrast ratio: 4.5:1 for text, 3:1 for UI components
- **NFR-1.4**: Large, clear labels with both icons and text
- **NFR-1.5**: Focus indicators clearly visible (3px outline)
- **NFR-1.6**: Tab order follows logical flow
- **NFR-1.7**: ARIA labels for all interactive elements
- **NFR-1.8**: Screen reader compatible

### 3.2 Performance
- **NFR-2.1**: Initial page load < 2 seconds
- **NFR-2.2**: Time to establish WebRTC connection < 3 seconds
- **NFR-2.3**: Video latency < 500ms
- **NFR-2.4**: Support 720p video quality minimum

### 3.3 Compatibility
- **NFR-3.1**: Chrome, Edge, Firefox, Safari (latest 2 versions)
- **NFR-3.2**: Responsive design: Desktop (1920x1080), Tablet (iPad), Mobile (optional)
- **NFR-3.3**: Windows 10/11, macOS, iOS, Android

### 3.4 Security
- **NFR-4.1**: HTTPS only (TLS 1.3)
- **NFR-4.2**: Secure WebSocket connections (WSS)
- **NFR-4.3**: No persistent storage of video/audio data
- **NFR-4.4**: License ID acts as room key (no public room listing)
- **NFR-4.5**: TURN server authentication

### 3.5 Scalability
- **NFR-5.1**: Support 100 concurrent rooms (MVP)
- **NFR-5.2**: Horizontal scaling capability for signaling server

## 4. Technical Architecture

### 4.1 Frontend Stack
- **React 18** with functional components and hooks
- **TailwindCSS** for styling and responsive design
- **Framer Motion** for smooth transitions
- **Socket.io-client** for signaling
- **WebRTC API** for peer-to-peer communication
- **React Router** for navigation

### 4.2 Backend Stack
- **Node.js 18+** with Express
- **Socket.io** for WebSocket signaling
- **Redis** (optional) for room state management
- **CORS** configuration for cross-origin requests

### 4.3 Infrastructure
- **Frontend**: Vercel (static hosting, CDN, automatic HTTPS)
- **Backend**: Render or Heroku (WebSocket support)
- **STUN/TURN**: Public STUN servers (Google) + optional TURN server

## 5. User Flows

### 5.1 Primary User Flow: Joining a Call
1. User opens `https://me-call.app`
2. Sees login page with single input field: "Enter your Mind Express License ID"
3. Types license ID (e.g., ME51245) and optional nickname
4. Clicks large "Join" button
5. Redirected to `/room/ME51245`
6. If alone: sees "Waiting for other user to join ME51245..."
7. When second user joins: automatic WebRTC connection established
8. Video call interface appears with both video streams
9. User can mute/unmute, toggle camera, or end call
10. Clicking "End Call" returns to login page

### 5.2 Error Flows
- Invalid license format: Show error "Please enter a valid Mind Express License ID (e.g., ME12345)"
- Camera/microphone permission denied: Show error with instructions to enable permissions
- WebRTC connection failure: Show "Connection failed. Please check your internet connection and try again."
- User disconnects: Show "Other user disconnected" and option to wait or leave

## 6. UI/UX Specifications

### 6.1 Login Page
- **Layout**: Centered card on full-screen background
- **Input Field**: Large (60px height), clear placeholder text
- **Join Button**: 80px height, full width, high contrast
- **Color Scheme**: High contrast (dark text on light background or vice versa)
- **Spacing**: Generous padding (minimum 24px between elements)

### 6.2 Call Page
- **Video Layout**: 
  - Remote video: Full screen or large primary view
  - Local video: Picture-in-picture (bottom-right, draggable optional)
- **Controls**: Bottom bar with 4-5 large buttons
  - End Call (red, prominent)
  - Mute/Unmute (icon changes)
  - Camera On/Off (icon changes)
  - Full Screen toggle
  - Share Code (optional)
- **Button Size**: Minimum 80x80px
- **Button Spacing**: 16px gap between buttons
- **Labels**: Icon + text label below

### 6.3 Accessibility Features
- **Focus Management**: Auto-focus on primary action
- **Keyboard Shortcuts**: 
  - Space: Mute/Unmute
  - C: Toggle camera
  - F: Full screen
  - Esc: End call
- **Visual Feedback**: Button states (hover, focus, active, disabled)
- **Loading States**: Clear loading indicators
- **Error Messages**: Large, clear, actionable

## 7. Success Metrics (Phase 1)

- **Usability**: 90% of users can join a call within 30 seconds
- **Accessibility**: 100% keyboard navigable, passes WCAG 2.1 AA
- **Reliability**: 95% successful connection rate
- **Performance**: < 3 second connection establishment
- **User Satisfaction**: Positive feedback from AAC user testing

## 8. Development Phases

### Phase 1: MVP (Week 1-2)
- Basic login with license validation
- WebRTC video/audio connection
- Essential controls (mute, camera, end call)
- Accessibility basics (keyboard nav, large buttons)
- Deployment to Vercel + Render

### Phase 2: Enhanced Features (Week 3-4)
- Share code functionality
- Text chat panel
- Session timer
- Auto-accept calls option
- Improved error handling

### Phase 3: Advanced Accessibility (Week 5-6)
- Live captions/transcription
- Eye-gaze optimization testing
- Switch control testing
- Screen reader optimization
- User testing with AAC users

## 9. Out of Scope (Future Considerations)
- Group calls (3+ participants)
- Recording functionality
- Screen sharing
- Virtual backgrounds
- Real Mind Express API integration (using mock validation for MVP)
- User accounts/profiles
- Call history
- Scheduling/calendar integration

## 10. Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| WebRTC connection failures behind strict firewalls | High | Implement TURN server fallback |
| Browser compatibility issues | Medium | Test on all major browsers, provide compatibility warnings |
| Accessibility not meeting AAC user needs | High | Early testing with target users, iterative improvements |
| Signaling server downtime | High | Health checks, auto-restart, status page |
| License ID collision | Low | Use longer IDs or add timestamp-based room expiration |

## 11. Compliance & Legal
- **Privacy**: No data collection, no cookies (except session), no analytics (MVP)
- **GDPR**: Not applicable (no personal data stored)
- **Accessibility**: WCAG 2.1 AA compliance target
- **Terms of Service**: Basic terms for acceptable use
- **Mind Express Licensing**: Coordinate with Jabbla for official license validation API (future)
