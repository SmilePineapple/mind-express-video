import { useEffect, useRef, useState, useCallback } from 'react';
import { Socket } from 'socket.io-client';
import { rtcConfig, mediaConstraints } from '../utils/webrtc-config';

interface UseWebRTCProps {
  socket: Socket | null;
  licenseId: string;
  nickname: string;
}

interface UseWebRTCReturn {
  localStream: MediaStream | null;
  remoteStream: MediaStream | null;
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
 * Custom hook for WebRTC peer connection management
 */
export const useWebRTC = ({ socket, licenseId, nickname }: UseWebRTCProps): UseWebRTCReturn => {
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [isCallActive, setIsCallActive] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isWaiting, setIsWaiting] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const remoteSocketIdRef = useRef<string | null>(null);

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

    // Close peer connection
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
      peerConnectionRef.current = null;
    }

    // Leave room
    if (socket) {
      socket.emit('leave-room', { licenseId });
    }

    setLocalStream(null);
    setRemoteStream(null);
    setIsCallActive(false);
    setIsWaiting(false);
  }, [localStream, socket, licenseId]);

  /**
   * Initialize WebRTC on mount
   */
  useEffect(() => {
    if (!socket || !licenseId) return;

    let mounted = true;
    let localStreamRef: MediaStream | null = null;

    const initialize = async () => {
      try {
        // Try to get local media, but don't fail if denied
        let stream: MediaStream | null = null;
        
        try {
          stream = await navigator.mediaDevices.getUserMedia(mediaConstraints);
          console.log('Local media stream initialized');
        } catch (mediaErr) {
          console.warn('Camera/microphone access denied, joining without media:', mediaErr);
          // Create empty stream so we can still join
          stream = new MediaStream();
        }
        
        if (!mounted) {
          if (stream) {
            stream.getTracks().forEach(track => track.stop());
          }
          return;
        }

        localStreamRef = stream;
        setLocalStream(stream);

        // Join room (even without camera/mic)
        socket.emit('join-room', { licenseId, nickname });

        // Create peer connection
        const pc = new RTCPeerConnection(rtcConfig);

        // Add local stream tracks to peer connection (if any)
        if (stream && stream.getTracks().length > 0) {
          stream.getTracks().forEach(track => {
            pc.addTrack(track, stream);
            console.log('Added track to peer connection:', track.kind);
          });
        } else {
          console.log('No local tracks to add - joining as viewer only');
        }

        // Handle incoming remote stream
        pc.ontrack = (event) => {
          console.log('Received remote track:', event.track.kind);
          const [remoteStream] = event.streams;
          if (mounted) {
            setRemoteStream(remoteStream);
            setIsCallActive(true);
            setIsWaiting(false);
          }
        };

        // Handle ICE candidates
        pc.onicecandidate = (event) => {
          if (event.candidate && remoteSocketIdRef.current) {
            console.log('Sending ICE candidate');
            socket.emit('ice-candidate', {
              licenseId,
              candidate: event.candidate,
              targetSocketId: remoteSocketIdRef.current
            });
          }
        };

        // Handle connection state changes
        pc.onconnectionstatechange = () => {
          console.log('Connection state:', pc.connectionState);
          if (pc.connectionState === 'disconnected' || pc.connectionState === 'failed') {
            if (mounted) {
              setError('Connection lost. Please try again.');
              setIsCallActive(false);
            }
          }
        };

        peerConnectionRef.current = pc;
      } catch (err) {
        console.error('Initialization error:', err);
        if (mounted) {
          setError('Failed to initialize. Please refresh and try again.');
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

    const handleExistingUsers = async (users: Array<{ socketId: string; nickname: string }>) => {
      console.log('Existing users:', users);
      if (users.length > 0 && peerConnectionRef.current) {
        remoteSocketIdRef.current = users[0].socketId;
        setIsWaiting(false);
        
        // NEW USER creates offer when joining existing users
        try {
          const offer = await peerConnectionRef.current.createOffer();
          await peerConnectionRef.current.setLocalDescription(offer);
          socket.emit('offer', {
            licenseId,
            offer,
            targetSocketId: users[0].socketId
          });
        } catch (err) {
          console.error('Error creating offer:', err);
        }
      }
    };

    const handleUserJoined = async (data: { socketId: string; nickname: string }) => {
      console.log('User joined:', data);
      remoteSocketIdRef.current = data.socketId;
      setIsWaiting(false);
      
      // EXISTING USER waits for offer from new user (don't create offer here)
      console.log('Waiting for offer from new user...');
    };

    const handleOfferReceived = async (data: { offer: RTCSessionDescriptionInit; socketId: string }) => {
      console.log('Received offer from:', data.socketId);
      if (peerConnectionRef.current) {
        try {
          remoteSocketIdRef.current = data.socketId;
          await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(data.offer));
          const answer = await peerConnectionRef.current.createAnswer();
          await peerConnectionRef.current.setLocalDescription(answer);
          socket.emit('answer', {
            licenseId,
            answer,
            targetSocketId: data.socketId
          });
        } catch (err) {
          console.error('Error handling offer:', err);
        }
      }
    };

    const handleAnswerReceived = async (data: { answer: RTCSessionDescriptionInit; socketId: string }) => {
      console.log('Received answer from:', data.socketId);
      if (peerConnectionRef.current) {
        try {
          // Only set remote description if we're in the right state
          if (peerConnectionRef.current.signalingState === 'have-local-offer') {
            await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(data.answer));
          } else {
            console.warn('Ignoring answer - wrong signaling state:', peerConnectionRef.current.signalingState);
          }
        } catch (err) {
          console.error('Error handling answer:', err);
        }
      }
    };

    const handleIceCandidateReceived = async (data: { candidate: RTCIceCandidateInit; socketId: string }) => {
      console.log('Received ICE candidate from:', data.socketId);
      if (peerConnectionRef.current) {
        try {
          await peerConnectionRef.current.addIceCandidate(new RTCIceCandidate(data.candidate));
        } catch (err) {
          console.error('Error adding ICE candidate:', err);
        }
      }
    };

    const handleUserLeft = () => {
      console.log('User left the call');
      if (mounted) {
        setError('Other user disconnected');
        setIsCallActive(false);
        setRemoteStream(null);
        setIsWaiting(true);
      }
    };

    socket.on('joined-room', handleJoinedRoom);
    socket.on('existing-users', handleExistingUsers);
    socket.on('user-joined', handleUserJoined);
    socket.on('offer', handleOfferReceived);
    socket.on('answer', handleAnswerReceived);
    socket.on('ice-candidate', handleIceCandidateReceived);
    socket.on('user-left', handleUserLeft);

    // Cleanup
    return () => {
      mounted = false;
      console.log('Cleaning up WebRTC...');

      // Remove socket listeners
      socket.off('joined-room', handleJoinedRoom);
      socket.off('existing-users', handleExistingUsers);
      socket.off('user-joined', handleUserJoined);
      socket.off('offer', handleOfferReceived);
      socket.off('answer', handleAnswerReceived);
      socket.off('ice-candidate', handleIceCandidateReceived);
      socket.off('user-left', handleUserLeft);

      // Stop local stream
      if (localStreamRef) {
        localStreamRef.getTracks().forEach(track => {
          track.stop();
          console.log('Stopped track:', track.kind);
        });
      }

      // Close peer connection
      if (peerConnectionRef.current) {
        peerConnectionRef.current.close();
        peerConnectionRef.current = null;
      }

      // Leave room
      socket.emit('leave-room', { licenseId });
    };
  }, [socket, licenseId, nickname]);

  return {
    localStream,
    remoteStream,
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
