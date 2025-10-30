import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { getSocketUrl } from '../utils/webrtc-config';

interface UseSocketReturn {
  socket: Socket | null;
  isConnected: boolean;
  error: string | null;
}

/**
 * Custom hook for Socket.io connection management
 */
export const useSocket = (): UseSocketReturn => {
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    const socketUrl = getSocketUrl();
    
    console.log('Connecting to signaling server:', socketUrl);
    
    const socket = io(socketUrl, {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000
    });

    socket.on('connect', () => {
      console.log('Connected to signaling server');
      setIsConnected(true);
      setError(null);
    });

    socket.on('disconnect', (reason) => {
      console.log('Disconnected from signaling server:', reason);
      setIsConnected(false);
    });

    socket.on('connect_error', (err) => {
      console.error('Connection error:', err);
      setError('Failed to connect to server. Please check your connection.');
    });

    socket.on('error', (data: { message: string }) => {
      console.error('Socket error:', data.message);
      setError(data.message);
    });

    socketRef.current = socket;

    return () => {
      console.log('Cleaning up socket connection');
      socket.disconnect();
    };
  }, []);

  return {
    socket: socketRef.current,
    isConnected,
    error
  };
};
