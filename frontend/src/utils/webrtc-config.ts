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
 * Echo cancellation DISABLED for Mind Express 5 TTS compatibility
 */
export const mediaConstraints: MediaStreamConstraints = {
  video: {
    width: { ideal: 1280 },
    height: { ideal: 720 },
    frameRate: { ideal: 30 }
  },
  audio: {
    echoCancellation: false,  // DISABLED for TTS audio
    noiseSuppression: false,   // DISABLED for TTS audio
    autoGainControl: false     // DISABLED for TTS audio
  }
};

/**
 * Alternative constraints to try capturing system audio (Chrome only)
 */
export const systemAudioConstraints: MediaStreamConstraints = {
  video: {
    width: { ideal: 1280 },
    height: { ideal: 720 },
    frameRate: { ideal: 30 }
  },
  audio: {
    // @ts-ignore - Chrome experimental feature
    chromeMediaSource: 'system',
    echoCancellation: false,
    noiseSuppression: false,
    autoGainControl: false
  }
};

/**
 * Get socket URL from environment or default
 */
export const getSocketUrl = (): string => {
  return import.meta.env.VITE_SOCKET_URL || 'http://localhost:3001';
};
