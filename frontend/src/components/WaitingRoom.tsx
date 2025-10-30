import { useState } from 'react';
import { motion } from 'framer-motion';

interface WaitingRoomProps {
  licenseId: string;
  onCancel: () => void;
}

export const WaitingRoom = ({ licenseId, onCancel }: WaitingRoomProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(licenseId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 bg-gray-900 bg-opacity-95 backdrop-blur-sm z-50 flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className="bg-white rounded-3xl p-8 md:p-12 max-w-2xl w-full text-center"
      >
        {/* Animated Icon */}
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, 5, -5, 0]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6"
        >
          <svg className="w-12 h-12 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
        </motion.div>

        {/* Title */}
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
          Waiting for other user...
        </h2>
        
        <p className="text-lg text-gray-600 mb-8">
          Share your room code with someone to start the call
        </p>

        {/* License ID Display */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 mb-6">
          <p className="text-sm font-semibold text-gray-700 mb-2">Your Room Code</p>
          <div className="flex items-center justify-center gap-3">
            <p className="text-4xl md:text-5xl font-bold text-blue-600 tracking-wider">
              {licenseId}
            </p>
          </div>
        </div>

        {/* Copy Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleCopyCode}
          className="w-full h-16 bg-blue-500 hover:bg-blue-600 text-white text-xl font-semibold rounded-xl mb-4 flex items-center justify-center gap-3 transition-colors focus:outline-none focus:ring-4 focus:ring-blue-300"
          aria-label="Copy room code to clipboard"
        >
          {copied ? (
            <>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Copied!
            </>
          ) : (
            <>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              Copy Room Code
            </>
          )}
        </motion.button>

        {/* Cancel Button */}
        <button
          onClick={onCancel}
          className="w-full h-16 bg-gray-200 hover:bg-gray-300 text-gray-800 text-xl font-semibold rounded-xl transition-colors focus:outline-none focus:ring-4 focus:ring-gray-300"
          aria-label="Cancel and return to home"
        >
          Cancel
        </button>

        {/* Loading Dots */}
        <div className="flex items-center justify-center gap-2 mt-8">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.3, 1, 0.3]
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: i * 0.2
              }}
              className="w-3 h-3 bg-blue-500 rounded-full"
            />
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
};
