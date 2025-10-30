import { useEffect, useRef, useState, useCallback } from 'react';
import type { PresenceChannel } from 'pusher-js';
import { rtcConfig, mediaConstraints } from '../utils/webrtc-config';

interface UseWebRTCPusherProps {
  channel: PresenceChannel | null;
  members: Map<string, any>;
}

interface UseWebRTCPusherReturn {
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
 * Custom hook for WebRTC with Pusher signaling
 */
export const useWebRTCPusher = ({ channel, members }: UseWebRTCPusherProps): UseWebRTCPusherReturn => {
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [isCallActive, setIsCallActive] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isWaiting, setIsWaiting] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const remoteUserIdRef = useRef<string | null>(null);

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

    if (localStream) {
      localStream.getTracks().forEach(track => {
        track.stop();
        console.log('Stopped track:', track.kind);
      });
    }

    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
      peerConnectionRef.current = null;
    }

    setLocalStream(null);
    setRemoteStream(null);
    setIsCallActive(false);
    setIsWaiting(false);
  }, [localStream]);

  /**
   * Initialize WebRTC with Pusher signaling
   */
  useEffect(() => {
    if (!channel) return;

    let mounted = true;
    let localStreamRef: MediaStream | null = null;

    const initialize = async () => {
      try {
        // Get local media
        const stream = await navigator.mediaDevices.getUserMedia(mediaConstraints);
        
        if (!mounted) {
          stream.getTracks().forEach(track => track.stop());
          return;
        }

        localStreamRef = stream;
        setLocalStream(stream);
        console.log('Local media stream initialized');

        // Create peer connection
        const pc = new RTCPeerConnection(rtcConfig);

        // Add local stream tracks
        stream.getTracks().forEach(track => {
          pc.addTrack(track, stream);
          console.log('Added track to peer connection:', track.kind);
        });

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
          if (event.candidate && remoteUserIdRef.current) {
            console.log('Sending ICE candidate');
            channel.trigger(`client-ice-candidate-${remoteUserIdRef.current}`, {
              candidate: event.candidate,
              from: channel.members.myID
            });
          }
        };

        // Handle connection state
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
          setError('Camera/microphone access denied. Please enable permissions and refresh.');
        }
      }
    };

    initialize();

    // Handle WebRTC signaling events
    const handleOffer = async (data: { offer: RTCSessionDescriptionInit; from: string }) => {
      console.log('Received offer from:', data.from);
      if (!peerConnectionRef.current) return;

      try {
        remoteUserIdRef.current = data.from;
        await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(data.offer));
        const answer = await peerConnectionRef.current.createAnswer();
        await peerConnectionRef.current.setLocalDescription(answer);

        channel.trigger(`client-answer-${data.from}`, {
          answer,
          from: channel.members.myID
        });
      } catch (err) {
        console.error('Error handling offer:', err);
      }
    };

    const handleAnswer = async (data: { answer: RTCSessionDescriptionInit; from: string }) => {
      console.log('Received answer from:', data.from);
      if (!peerConnectionRef.current) return;

      try {
        await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(data.answer));
      } catch (err) {
        console.error('Error handling answer:', err);
      }
    };

    const handleIceCandidate = async (data: { candidate: RTCIceCandidateInit; from: string }) => {
      console.log('Received ICE candidate from:', data.from);
      if (!peerConnectionRef.current) return;

      try {
        await peerConnectionRef.current.addIceCandidate(new RTCIceCandidate(data.candidate));
      } catch (err) {
        console.error('Error adding ICE candidate:', err);
      }
    };

    // Bind Pusher events
    const myId = channel.members.myID;
    channel.bind(`client-offer-${myId}`, handleOffer);
    channel.bind(`client-answer-${myId}`, handleAnswer);
    channel.bind(`client-ice-candidate-${myId}`, handleIceCandidate);

    // Cleanup
    return () => {
      mounted = false;
      console.log('Cleaning up WebRTC...');

      channel.unbind(`client-offer-${myId}`, handleOffer);
      channel.unbind(`client-answer-${myId}`, handleAnswer);
      channel.unbind(`client-ice-candidate-${myId}`, handleIceCandidate);

      if (localStreamRef) {
        localStreamRef.getTracks().forEach(track => track.stop());
      }

      if (peerConnectionRef.current) {
        peerConnectionRef.current.close();
        peerConnectionRef.current = null;
      }
    };
  }, [channel]);

  /**
   * Handle member changes - initiate call when second user joins
   */
  useEffect(() => {
    if (!channel || !peerConnectionRef.current || members.size < 2) {
      setIsWaiting(members.size < 2);
      return;
    }

    const myId = channel.members.myID;
    const otherMembers = Array.from(members.keys()).filter(id => id !== myId);

    if (otherMembers.length > 0 && !remoteUserIdRef.current) {
      const remoteUserId = otherMembers[0];
      remoteUserIdRef.current = remoteUserId;
      setIsWaiting(false);

      // Create and send offer
      (async () => {
        if (!peerConnectionRef.current) return;
        
        try {
          const offer = await peerConnectionRef.current.createOffer();
          await peerConnectionRef.current.setLocalDescription(offer);

          console.log('Sending offer to:', remoteUserId);
          channel.trigger(`client-offer-${remoteUserId}`, {
            offer,
            from: myId
          });
        } catch (err) {
          console.error('Error creating offer:', err);
        }
      })();
    }
  }, [channel, members]);

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
