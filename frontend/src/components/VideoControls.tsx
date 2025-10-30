import { motion } from 'framer-motion';

interface VideoControlsProps {
  isMuted: boolean;
  isVideoOff: boolean;
  onToggleMute: () => void;
  onToggleVideo: () => void;
  onEndCall: () => void;
}

export const VideoControls = ({
  isMuted,
  isVideoOff,
  onToggleMute,
  onToggleVideo,
  onEndCall
}: VideoControlsProps) => {
  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.3 }}
      className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/80 to-transparent p-6"
    >
      <div className="max-w-5xl mx-auto flex items-center justify-center gap-6">
        {/* Mute/Unmute Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onToggleMute}
          className={`w-28 h-28 rounded-full flex flex-col items-center justify-center gap-2 transition-all focus:outline-none focus:ring-4 focus:ring-white shadow-xl ${
            isMuted
              ? 'bg-red-500 hover:bg-red-600'
              : 'bg-gray-700 hover:bg-gray-600'
          }`}
          aria-label={isMuted ? 'Unmute microphone' : 'Mute microphone'}
          aria-pressed={isMuted}
        >
          {isMuted ? (
            <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
            </svg>
          ) : (
            <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
            </svg>
          )}
          <span className="text-sm text-white font-bold">
            {isMuted ? 'Unmute' : 'Mute'}
          </span>
        </motion.button>

        {/* End Call Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onEndCall}
          className="w-32 h-32 bg-red-600 hover:bg-red-700 rounded-full flex flex-col items-center justify-center gap-2 transition-all focus:outline-none focus:ring-4 focus:ring-white shadow-2xl"
          aria-label="End call"
        >
          <svg className="w-14 h-14 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
            <path d="M21 6.5l-4-4-1.5 1.5 4 4-4 4L17 13.5l4-4 4 4L26.5 12l-4-4 4-4L25 2.5z" transform="translate(-2 -2) scale(0.8)" />
          </svg>
          <span className="text-base text-white font-bold">End Call</span>
        </motion.button>

        {/* Camera On/Off Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onToggleVideo}
          className={`w-28 h-28 rounded-full flex flex-col items-center justify-center gap-2 transition-all focus:outline-none focus:ring-4 focus:ring-white shadow-xl ${
            isVideoOff
              ? 'bg-red-500 hover:bg-red-600'
              : 'bg-gray-700 hover:bg-gray-600'
          }`}
          aria-label={isVideoOff ? 'Turn camera on' : 'Turn camera off'}
          aria-pressed={isVideoOff}
        >
          {isVideoOff ? (
            <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              <line x1="1" y1="1" x2="23" y2="23" strokeWidth={2} />
            </svg>
          ) : (
            <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          )}
          <span className="text-sm text-white font-bold">
            {isVideoOff ? 'Camera' : 'Camera'}
          </span>
        </motion.button>

        {/* Fullscreen Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            if (document.fullscreenElement) {
              document.exitFullscreen();
            } else {
              document.documentElement.requestFullscreen();
            }
          }}
          className="w-28 h-28 bg-gray-700 hover:bg-gray-600 rounded-full flex flex-col items-center justify-center gap-2 transition-all focus:outline-none focus:ring-4 focus:ring-white shadow-xl"
          aria-label="Toggle fullscreen"
        >
          <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
          </svg>
          <span className="text-sm text-white font-bold">Full</span>
        </motion.button>
      </div>

      {/* Keyboard Shortcuts Help */}
      <div className="mt-4 text-center">
        <p className="text-xs text-gray-400">
          Shortcuts: <span className="font-semibold">Space</span> = Mute • <span className="font-semibold">C</span> = Camera • <span className="font-semibold">F</span> = Fullscreen • <span className="font-semibold">Esc</span> = End
        </p>
      </div>
    </motion.div>
  );
};
