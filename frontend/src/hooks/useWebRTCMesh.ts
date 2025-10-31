import { useEffect, useRef, useState, useCallback } from 'react';
import { Socket } from 'socket.io-client';
import { rtcConfig, mediaConstraints } from '../utils/webrtc-config';

interface UseWebRTCMeshProps {
  socket: Socket | null;
  licenseId: string;
  nickname: string;
}

interface RemotePeer {
  socketId: string;
  nickname: string;
  stream: MediaStream;
}

interface UseWebRTCMeshReturn {
  localStream: MediaStream | null;
  remotePeers: RemotePeer[];
  isCallActive: boolean;
  isMuted: boolean;
  isVideoOff: boolean;
  isWaiting: boolean;
  error: string | null;
  toggleMute: () => void;
  toggleVideo: () => void;
  endCall: () => void;
}

/**
 * Custom hook for WebRTC mesh networking (supports 3+ users)
 * Each peer maintains connections to all other peers
 */
export const useWebRTCMesh = ({ socket, licenseId, nickname }: UseWebRTCMeshProps): UseWebRTCMeshReturn => {
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remotePeers, setRemotePeers] = useState<RemotePeer[]>([]);
  const [isCallActive, setIsCallActive] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isWaiting, setIsWaiting] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Map of socketId -> RTCPeerConnection
  const peerConnectionsRef = useRef<Map<string, RTCPeerConnection>>(new Map());
  const localStreamRef = useRef<MediaStream | null>(null);

  /**
   * Toggle mute
   */
  const toggleMute = useCallback(() => {
    if (localStream) {
      const audioTrack = localStream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsMuted(!audioTrack.enabled);
        console.log('Audio', audioTrack.enabled ? 'unmuted' : 'muted');
      }
    }
  }, [localStream]);

  /**
   * Toggle video
   */
  const toggleVideo = useCallback(() => {
    if (localStream) {
      const videoTrack = localStream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsVideoOff(!videoTrack.enabled);
        console.log('Video', videoTrack.enabled ? 'on' : 'off');
      }
    }
  }, [localStream]);

  /**
   * End call
   */
  const endCall = useCallback(() => {
    console.log('Ending call...');

    // Stop local stream
    if (localStream) {
      localStream.getTracks().forEach(track => {
        track.stop();
        console.log('Stopped track:', track.kind);
      });
    }

    // Close all peer connections
    peerConnectionsRef.current.forEach((pc, socketId) => {
      pc.close();
      console.log('Closed connection to:', socketId);
    });
    peerConnectionsRef.current.clear();

    // Leave room
    if (socket) {
      socket.emit('leave-room', { licenseId });
    }

    setLocalStream(null);
    setRemotePeers([]);
    setIsCallActive(false);
    setIsWaiting(false);
  }, [localStream, socket, licenseId]);

  /**
   * Create peer connection for a specific remote peer
   */
  const createPeerConnection = useCallback((remoteSocketId: string, remoteNickname: string): RTCPeerConnection => {
    console.log('Creating peer connection for:', remoteSocketId);

    const pc = new RTCPeerConnection(rtcConfig);

    // Add local stream tracks
    if (localStreamRef.current && localStreamRef.current.getTracks().length > 0) {
      localStreamRef.current.getTracks().forEach(track => {
        pc.addTrack(track, localStreamRef.current!);
        console.log('Added track to peer connection:', track.kind);
      });
    }

    // Handle incoming remote stream
    pc.ontrack = (event) => {
      console.log('Received remote track from:', remoteSocketId, event.track.kind);
      const [remoteStream] = event.streams;
      
      setRemotePeers(prev => {
        const existing = prev.find(p => p.socketId === remoteSocketId);
        if (existing) {
          // Update existing peer's stream
          return prev.map(p => 
            p.socketId === remoteSocketId 
              ? { ...p, stream: remoteStream }
              : p
          );
        } else {
          // Add new peer
          return [...prev, { socketId: remoteSocketId, nickname: remoteNickname, stream: remoteStream }];
        }
      });
      
      setIsCallActive(true);
      setIsWaiting(false);
    };

    // Handle ICE candidates
    pc.onicecandidate = (event) => {
      if (event.candidate && socket) {
        console.log('Sending ICE candidate to:', remoteSocketId);
        socket.emit('ice-candidate', {
          licenseId,
          candidate: event.candidate,
          targetSocketId: remoteSocketId
        });
      }
    };

    // Handle connection state changes
    pc.onconnectionstatechange = () => {
      console.log('Connection state with', remoteSocketId, ':', pc.connectionState);
      if (pc.connectionState === 'failed' || pc.connectionState === 'disconnected') {
        // Remove peer
        setRemotePeers(prev => prev.filter(p => p.socketId !== remoteSocketId));
        peerConnectionsRef.current.delete(remoteSocketId);
      }
    };

    peerConnectionsRef.current.set(remoteSocketId, pc);
    return pc;
  }, [socket, licenseId]);

  /**
   * Initialize WebRTC on mount
   */
  useEffect(() => {
    if (!socket || !licenseId) return;

    let mounted = true;

    const initialize = async () => {
      try {
        // Try to get camera and microphone
        let stream: MediaStream;
        
        try {
          stream = await navigator.mediaDevices.getUserMedia(mediaConstraints);
          console.log('Camera and microphone access granted');
        } catch (err) {
          console.warn('Camera/microphone not available, joining as viewer:', err);
          stream = new MediaStream();
        }
        
        if (!mounted) {
          stream.getTracks().forEach(track => track.stop());
          return;
        }

        localStreamRef.current = stream;
        setLocalStream(stream);
        console.log('Local media stream initialized');

        // Join room
        socket.emit('join-room', { licenseId, nickname });

      } catch (err) {
        console.error('Initialization error:', err);
        if (mounted) {
          setError('Failed to initialize connection. Please refresh and try again.');
        }
      }
    };

    initialize();

    // Socket event listeners
    const handleJoinedRoom = (data: { licenseId: string; nickname: string; roomSize: number }) => {
      console.log('Joined room:', data);
      if (data.roomSize === 1) {
        setIsWaiting(true);
      }
    };

    // Handle existing users in room
    const handleExistingUsers = async (users: Array<{ socketId: string; nickname: string }>) => {
      console.log('Existing users:', users);
      
      // Create connections to all existing users
      for (const user of users) {
        const pc = createPeerConnection(user.socketId, user.nickname);
        
        try {
          // Create and send offer
          const offer = await pc.createOffer();
          await pc.setLocalDescription(offer);
          
          socket.emit('offer', {
            licenseId,
            offer,
            targetSocketId: user.socketId
          });
          
          console.log('Sent offer to:', user.socketId);
        } catch (err) {
          console.error('Error creating offer for:', user.socketId, err);
        }
      }
    };

    // Handle new user joining
    const handleUserJoined = (data: { socketId: string; nickname: string }) => {
      console.log('User joined:', data.socketId);
      // Don't create connection yet - wait for their offer
    };

    // Handle incoming offer
    const handleOffer = async (data: { offer: RTCSessionDescriptionInit; socketId: string }) => {
      console.log('Received offer from:', data.socketId);
      
      try {
        // Get or create peer connection
        let pc = peerConnectionsRef.current.get(data.socketId);
        if (!pc) {
          pc = createPeerConnection(data.socketId, 'Anonymous');
        }

        await pc.setRemoteDescription(new RTCSessionDescription(data.offer));
        
        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);
        
        socket.emit('answer', {
          licenseId,
          answer,
          targetSocketId: data.socketId
        });
        
        console.log('Sent answer to:', data.socketId);
      } catch (err) {
        console.error('Error handling offer:', err);
      }
    };

    // Handle incoming answer
    const handleAnswer = async (data: { answer: RTCSessionDescriptionInit; socketId: string }) => {
      console.log('Received answer from:', data.socketId);
      
      const pc = peerConnectionsRef.current.get(data.socketId);
      if (pc && pc.signalingState === 'have-local-offer') {
        try {
          await pc.setRemoteDescription(new RTCSessionDescription(data.answer));
        } catch (err) {
          console.error('Error setting remote description:', err);
        }
      }
    };

    // Handle incoming ICE candidate
    const handleIceCandidate = async (data: { candidate: RTCIceCandidateInit; socketId: string }) => {
      console.log('Received ICE candidate from:', data.socketId);
      
      const pc = peerConnectionsRef.current.get(data.socketId);
      if (pc) {
        try {
          await pc.addIceCandidate(new RTCIceCandidate(data.candidate));
        } catch (err) {
          console.error('Error adding ICE candidate:', err);
        }
      }
    };

    // Handle user leaving
    const handleUserLeft = (data: { socketId: string }) => {
      console.log('User left:', data.socketId);
      
      const pc = peerConnectionsRef.current.get(data.socketId);
      if (pc) {
        pc.close();
        peerConnectionsRef.current.delete(data.socketId);
      }
      
      setRemotePeers(prev => prev.filter(p => p.socketId !== data.socketId));
    };

    socket.on('joined-room', handleJoinedRoom);
    socket.on('existing-users', handleExistingUsers);
    socket.on('user-joined', handleUserJoined);
    socket.on('offer', handleOffer);
    socket.on('answer', handleAnswer);
    socket.on('ice-candidate', handleIceCandidate);
    socket.on('user-left', handleUserLeft);

    return () => {
      mounted = false;
      
      socket.off('joined-room', handleJoinedRoom);
      socket.off('existing-users', handleExistingUsers);
      socket.off('user-joined', handleUserJoined);
      socket.off('offer', handleOffer);
      socket.off('answer', handleAnswer);
      socket.off('ice-candidate', handleIceCandidate);
      socket.off('user-left', handleUserLeft);

      // Clean up connections
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach(track => track.stop());
      }
      
      peerConnectionsRef.current.forEach(pc => pc.close());
      peerConnectionsRef.current.clear();
    };
  }, [socket, licenseId, nickname, createPeerConnection]);

  return {
    localStream,
    remotePeers,
    isCallActive,
    isMuted,
    isVideoOff,
    isWaiting,
    error,
    toggleMute,
    toggleVideo,
    endCall
  };
};
