/**
 * WebRTC configuration for peer connections
 */

export const rtcConfig: RTCConfiguration = {
  iceServers: [
    {
      urls: 'stun:stun.l.google.com:19302'
    },
    {
      urls: 'stun:stun1.l.google.com:19302'
    },
    {
      urls: 'stun:stun2.l.google.com:19302'
    }
  ],
  iceCandidatePoolSize: 10
};

/**
 * Media constraints for getUserMedia
 */
export const mediaConstraints: MediaStreamConstraints = {
  video: {
    width: { ideal: 1280 },
    height: { ideal: 720 },
    frameRate: { ideal: 30 }
  },
  audio: {
    echoCancellation: true,
    noiseSuppression: true,
    autoGainControl: true
  }
};

/**
 * Get socket URL from environment or default
 */
export const getSocketUrl = (): string => {
  return import.meta.env.VITE_SOCKET_URL || 'http://localhost:3001';
};
