import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import { RoomManager } from './roomManager.js';

dotenv.config();

const app = express();
const httpServer = createServer(app);

// CORS configuration
const corsOptions = {
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  methods: ['GET', 'POST'],
  credentials: true
};

app.use(cors(corsOptions));
app.use(express.json());

// Socket.io setup
const io = new Server(httpServer, {
  cors: corsOptions,
  pingTimeout: 60000,
  pingInterval: 25000
});

const roomManager = new RoomManager();

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    activeRooms: roomManager.getActiveRoomsCount(),
    connectedClients: io.engine.clientsCount
  });
});

// Socket.io connection handling
io.on('connection', (socket) => {
  console.log(`Client connected: ${socket.id}`);

  // Join room with license ID
  socket.on('join-room', ({ licenseId, nickname }) => {
    console.log(`${socket.id} joining room: ${licenseId} as ${nickname || 'Anonymous'}`);
    
    // Validate license format (ME + 5 digits)
    if (!licenseId || !/^ME\d{5}$/.test(licenseId)) {
      socket.emit('error', { message: 'Invalid license ID format. Use ME12345.' });
      return;
    }

    // Check if room is full
    if (roomManager.isRoomFull(licenseId)) {
      socket.emit('error', { message: 'Room is full. Maximum 2 users per room.' });
      return;
    }

    // Add user to room
    const user = {
      socketId: socket.id,
      licenseId,
      nickname: nickname || 'Anonymous',
      joinedAt: new Date().toISOString()
    };

    roomManager.addUserToRoom(licenseId, user);
    socket.join(licenseId);

    // Notify user they joined successfully
    socket.emit('joined-room', { 
      licenseId, 
      nickname: user.nickname,
      roomSize: roomManager.getRoomSize(licenseId)
    });

    // Get other users in room
    const otherUsers = roomManager.getOtherUsersInRoom(licenseId, socket.id);
    
    if (otherUsers.length > 0) {
      // Notify existing user about new user
      socket.to(licenseId).emit('user-joined', {
        socketId: socket.id,
        nickname: user.nickname
      });

      // Send existing user info to new user
      socket.emit('existing-users', otherUsers);
      
      console.log(`Room ${licenseId} now has ${roomManager.getRoomSize(licenseId)} users`);
    } else {
      console.log(`${socket.id} is waiting in room ${licenseId}`);
    }
  });

  // WebRTC signaling: offer
  socket.on('offer', ({ licenseId, offer, targetSocketId }) => {
    console.log(`Offer from ${socket.id} to ${targetSocketId} in room ${licenseId}`);
    socket.to(targetSocketId).emit('offer', {
      offer,
      socketId: socket.id
    });
  });

  // WebRTC signaling: answer
  socket.on('answer', ({ licenseId, answer, targetSocketId }) => {
    console.log(`Answer from ${socket.id} to ${targetSocketId} in room ${licenseId}`);
    socket.to(targetSocketId).emit('answer', {
      answer,
      socketId: socket.id
    });
  });

  // WebRTC signaling: ICE candidate
  socket.on('ice-candidate', ({ licenseId, candidate, targetSocketId }) => {
    console.log(`ICE candidate from ${socket.id} to ${targetSocketId}`);
    socket.to(targetSocketId).emit('ice-candidate', {
      candidate,
      socketId: socket.id
    });
  });

  // User disconnection
  socket.on('disconnect', () => {
    console.log(`Client disconnected: ${socket.id}`);
    
    const userRoom = roomManager.getUserRoom(socket.id);
    if (userRoom) {
      // Notify other users in room
      socket.to(userRoom.licenseId).emit('user-left', {
        socketId: socket.id
      });

      // Remove user from room
      roomManager.removeUserFromRoom(userRoom.licenseId, socket.id);
      console.log(`User ${socket.id} left room ${userRoom.licenseId}`);
    }
  });

  // Explicit leave room
  socket.on('leave-room', ({ licenseId }) => {
    console.log(`${socket.id} leaving room: ${licenseId}`);
    
    socket.to(licenseId).emit('user-left', {
      socketId: socket.id
    });

    socket.leave(licenseId);
    roomManager.removeUserFromRoom(licenseId, socket.id);
  });
});

// Clean up inactive rooms every 5 minutes
setInterval(() => {
  const cleaned = roomManager.cleanInactiveRooms(30); // 30 minutes timeout
  if (cleaned > 0) {
    console.log(`Cleaned ${cleaned} inactive rooms`);
  }
}, 5 * 60 * 1000);

const PORT = process.env.PORT || 3001;

httpServer.listen(PORT, () => {
  console.log(`🚀 Signaling server running on port ${PORT}`);
  console.log(`📡 CORS enabled for: ${corsOptions.origin}`);
  console.log(`🏥 Health check: http://localhost:${PORT}/health`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, closing server...');
  httpServer.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});
