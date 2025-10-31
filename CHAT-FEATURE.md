# 💬 Text Chat Feature

## Overview
Added real-time text chat to the video calling app! Perfect for Mind Express 5 users to communicate via text alongside or instead of video/audio.

## Features

### ✅ Real-Time Messaging
- Send and receive text messages instantly
- Messages appear in both users' chat windows
- Auto-scrolls to latest message

### ✅ Accessible Design
- Large, clear text (18px+)
- High contrast colors
- Easy-to-tap buttons (48px+)
- Keyboard accessible (Enter to send)

### ✅ Smart UI
- Floating chat button in top-right corner
- Badge shows unread message count
- Chat panel slides in/out smoothly
- Auto-opens when message received

### ✅ Message Display
- Shows sender name
- Timestamp for each message
- Your messages: Blue (right side)
- Their messages: White (left side)
- Empty state with helpful prompt

## How to Use

### For Mind Express 5 Users:

1. **Join a video call** (with or without camera/mic)
2. **Click the chat icon** (💬) in top-right corner
3. **Type your message** in the text box
4. **Press Enter** or click Send button
5. **Message appears** for both users instantly!

### Integration with Mind Express 5:

Mind Express 5 can send text to the chat in two ways:

#### Option 1: Copy-Paste
1. User types in Mind Express 5
2. Copy the text (Ctrl+C)
3. Click in chat input box
4. Paste (Ctrl+V)
5. Press Enter

#### Option 2: Direct Integration (Future)
Mind Express 5 developers could add a button that:
- Captures the current text from Mind Express 5
- Automatically pastes it into the chat input
- Sends it immediately

This would require Mind Express 5 to have access to the browser's JavaScript API.

## Technical Details

### Frontend
- **Component**: `ChatBox.tsx`
- **Socket Events**: 
  - `chat-message` (send/receive)
- **Features**:
  - Real-time messaging
  - Auto-scroll
  - Unread count badge
  - Responsive design

### Backend
- **Handler**: Added to `server.js`
- **Broadcasts** messages to all users in the same room
- **Logs** all chat messages for debugging

## Benefits for AAC Users

1. **Alternative Communication**: Can chat if camera/mic unavailable
2. **Permanent Record**: Messages stay visible (unlike spoken words)
3. **No Audio Issues**: Works even with poor connection
4. **Accessible**: Large text, high contrast, keyboard friendly
5. **Flexible**: Use alongside video or instead of it

## URLs

**Latest Deployment**: https://frontend-jgyjpn7lc-jakedalerourke-gmailcoms-projects.vercel.app

**Backend**: https://mind-express-video-1.onrender.com

## Next Steps

To fully integrate with Mind Express 5:
1. Contact Mind Express 5 developers
2. Request API access to:
   - Get current text from Mind Express 5
   - Inject text into web page input fields
3. Create a custom button in Mind Express 5 that:
   - Reads the current text
   - Sends it to the chat
   - Clears the Mind Express 5 text area (optional)

This would create a seamless experience where AAC users can type in Mind Express 5 and have it appear in the video call chat instantly!

## Testing

1. Open the app in two browser windows
2. Join the same room (e.g., ME12345)
3. Click the chat icon in one window
4. Type a message and send
5. See it appear in both windows!

Perfect for testing the full communication flow! 🎉
