import { useEffect, useRef } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useSocket } from '../hooks/useSocket';
import { useWebRTCMesh } from '../hooks/useWebRTCMesh';
import { VideoControls } from './VideoControls';
import { WaitingRoom } from './WaitingRoom';
import { AudioLevelIndicator } from './AudioLevelIndicator';

export const CallPageMesh = () => {
  const { licenseId } = useParams<{ licenseId: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  
  const nickname = location.state?.nickname || 'Anonymous';
  
  const { socket, isConnected, error: socketError } = useSocket();
  const {
    localStream,
    remotePeers,
    isCallActive,
    isMuted,
    isVideoOff,
    isWaiting,
    error: webrtcError,
    toggleMute,
    toggleVideo,
    endCall
  } = useWebRTCMesh({
    socket,
    licenseId: licenseId || '',
    nickname
  });

  const localVideoRef = useRef<HTMLVideoElement>(null);

  // Set up local video
  useEffect(() => {
    if (localVideoRef.current && localStream) {
      localVideoRef.current.srcObject = localStream;
    }
  }, [localStream]);

  // Handle end call
  const handleEndCall = () => {
    endCall();
    navigate('/');
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      switch (e.key.toLowerCase()) {
        case ' ':
          e.preventDefault();
          toggleMute();
          break;
        case 'c':
          e.preventDefault();
          toggleVideo();
          break;
        case 'escape':
          e.preventDefault();
          handleEndCall();
          break;
        case 'f':
          e.preventDefault();
          if (document.fullscreenElement) {
            document.exitFullscreen();
          } else {
            document.documentElement.requestFullscreen();
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [toggleMute, toggleVideo]);

  // Show error if socket not connected
  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl p-8 max-w-md text-center">
          <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Connecting...</h2>
          <p className="text-gray-600">Please wait while we connect to the server.</p>
        </div>
      </div>
    );
  }

  // Show error if any
  const error = socketError || webrtcError;
  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl p-8 max-w-md text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Connection Error</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => navigate('/')}
            className="px-8 py-4 bg-blue-500 text-white text-lg font-semibold rounded-xl hover:bg-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-300"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  // Calculate grid layout based on number of participants
  const totalParticipants = 1 + remotePeers.length; // 1 for local + remote peers
  const gridCols = totalParticipants <= 2 ? 'grid-cols-1' : totalParticipants <= 4 ? 'grid-cols-2' : 'grid-cols-3';

  return (
    <div className="min-h-screen bg-gray-900 relative overflow-hidden">
      {/* Waiting Room Overlay */}
      <AnimatePresence>
        {isWaiting && (
          <WaitingRoom licenseId={licenseId || ''} onCancel={handleEndCall} />
        )}
      </AnimatePresence>

      {/* Video Grid Container */}
      <div className="relative w-full h-screen p-6">
        <div className={`grid ${gridCols} gap-4 h-full`}>
          {/* Local Video */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative bg-black rounded-2xl overflow-hidden shadow-2xl"
          >
            {localStream && localStream.getVideoTracks().length > 0 ? (
              <video
                ref={localVideoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover mirror"
                aria-label="Your video"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-800">
                <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
            )}
            
            {/* Video Off Indicator */}
            {isVideoOff && (
              <div className="absolute inset-0 bg-gray-900 flex items-center justify-center">
                <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  <line x1="1" y1="1" x2="23" y2="23" strokeWidth={2} />
                </svg>
              </div>
            )}

            {/* Name Badge */}
            <div className="absolute bottom-4 left-4 bg-black bg-opacity-70 text-white px-4 py-2 rounded-lg backdrop-blur-sm">
              <p className="text-sm font-semibold">{nickname} (You)</p>
            </div>

            {/* Audio Level Indicator */}
            <div className="absolute top-4 left-4">
              <AudioLevelIndicator stream={localStream} label="Your Mic" />
            </div>
          </motion.div>

          {/* Remote Videos */}
          {remotePeers.map((peer, index) => (
            <RemoteVideo key={peer.socketId} peer={peer} index={index} />
          ))}
        </div>

        {/* Room Info Badge */}
        <div className="absolute top-6 left-6 bg-black bg-opacity-70 text-white px-6 py-3 rounded-xl backdrop-blur-sm z-10">
          <p className="text-sm font-medium">Room: {licenseId}</p>
          <p className="text-xs text-gray-300">{totalParticipants} participant{totalParticipants !== 1 ? 's' : ''}</p>
        </div>

        {/* TTS Audio Tip */}
        <div className="absolute bottom-24 left-6 bg-blue-600 bg-opacity-90 text-white px-6 py-4 rounded-xl backdrop-blur-sm z-10 max-w-md">
          <div className="flex items-start gap-3">
            <svg className="w-6 h-6 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <p className="text-sm font-semibold mb-1">Mind Express 5 TTS Tip</p>
              <p className="text-xs leading-relaxed">
                For TTS audio to work: Let the <strong>browser</strong> access your microphone (not ME5). 
                ME5 TTS will play through speakers and be captured by the mic. 
                Turn up speaker volume if needed.
              </p>
            </div>
          </div>
        </div>

        {/* Call Status Indicator */}
        {isCallActive && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute top-6 right-6 bg-green-500 text-white px-4 py-2 rounded-full flex items-center gap-2 z-10"
          >
            <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
            <span className="text-sm font-semibold">Connected</span>
          </motion.div>
        )}
      </div>

      {/* Video Controls */}
      <VideoControls
        isMuted={isMuted}
        isVideoOff={isVideoOff}
        onToggleMute={toggleMute}
        onToggleVideo={toggleVideo}
        onEndCall={handleEndCall}
      />
    </div>
  );
};

// Remote Video Component
interface RemoteVideoProps {
  peer: {
    socketId: string;
    nickname: string;
    stream: MediaStream;
  };
  index: number;
}

const RemoteVideo = ({ peer, index }: RemoteVideoProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current && peer.stream) {
      videoRef.current.srcObject = peer.stream;
    }
  }, [peer.stream]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.1 }}
      className="relative bg-black rounded-2xl overflow-hidden shadow-2xl"
    >
      <video
        ref={videoRef}
        autoPlay
        playsInline
        className="w-full h-full object-cover"
        aria-label={`${peer.nickname}'s video`}
      />

      {/* Name Badge */}
      <div className="absolute bottom-4 left-4 bg-black bg-opacity-70 text-white px-4 py-2 rounded-lg backdrop-blur-sm">
        <p className="text-sm font-semibold">{peer.nickname}</p>
      </div>

      {/* Audio Level Indicator */}
      <div className="absolute top-4 left-4">
        <AudioLevelIndicator stream={peer.stream} label={peer.nickname} />
      </div>
    </motion.div>
  );
};
