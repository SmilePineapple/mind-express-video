import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface TranscriptLine {
  id: string;
  text: string;
  speaker: 'You' | 'Remote';
  timestamp: number;
  isFinal: boolean;
}

interface LiveTranscriptProps {
  localStream: MediaStream | null;
  remoteStream: MediaStream | null;
  nickname: string;
}

export const LiveTranscript = ({ localStream, remoteStream, nickname }: LiveTranscriptProps) => {
  const [transcript, setTranscript] = useState<TranscriptLine[]>([]);
  const [isListening, setIsListening] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const transcriptEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    transcriptEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [transcript]);

  // Initialize speech recognition
  useEffect(() => {
    // Check if browser supports speech recognition
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      console.warn('Speech recognition not supported in this browser');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-GB'; // UK English for Mind Express 5 users

    recognition.onresult = (event: any) => {
      const results = Array.from(event.results);
      const latestResult: any = results[results.length - 1];
      const transcript = latestResult[0].transcript;
      const isFinal = latestResult.isFinal;

      const newLine: TranscriptLine = {
        id: `${Date.now()}-${Math.random()}`,
        text: transcript,
        speaker: 'You',
        timestamp: Date.now(),
        isFinal
      };

      setTranscript(prev => {
        // Remove previous interim result for this speaker
        const filtered = prev.filter(line => line.isFinal || line.speaker !== 'You');
        return [...filtered, newLine];
      });
    };

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      if (event.error === 'no-speech') {
        // Restart if no speech detected
        setTimeout(() => {
          if (isListening) {
            recognition.start();
          }
        }, 1000);
      }
    };

    recognition.onend = () => {
      // Auto-restart if still listening
      if (isListening) {
        setTimeout(() => {
          try {
            recognition.start();
          } catch (err) {
            console.error('Failed to restart recognition:', err);
          }
        }, 100);
      }
    };

    recognitionRef.current = recognition;

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [isListening]);

  // Start/stop listening based on local stream
  useEffect(() => {
    if (localStream && localStream.getAudioTracks().length > 0) {
      setIsListening(true);
      if (recognitionRef.current) {
        try {
          recognitionRef.current.start();
        } catch (err) {
          // Already started
          console.log('Recognition already started');
        }
      }
    } else {
      setIsListening(false);
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    }
  }, [localStream]);

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  const clearTranscript = () => {
    setTranscript([]);
  };

  if (!localStream && !remoteStream) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`fixed bottom-24 left-6 bg-white rounded-3xl shadow-2xl z-20 transition-all ${
        isMinimized ? 'w-64' : 'w-[500px]'
      }`}
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-4 rounded-t-3xl flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`w-3 h-3 rounded-full ${isListening ? 'bg-green-400 animate-pulse' : 'bg-gray-400'}`} />
          <div>
            <h3 className="text-lg font-bold">Live Transcript</h3>
            <p className="text-xs text-purple-100">
              {isListening ? 'Listening...' : 'Not listening'}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          {transcript.length > 0 && (
            <button
              onClick={clearTranscript}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              aria-label="Clear transcript"
              title="Clear transcript"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          )}
          <button
            onClick={toggleMinimize}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            aria-label={isMinimized ? 'Expand' : 'Minimize'}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMinimized ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Transcript Content */}
      <AnimatePresence>
        {!isMinimized && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: 'auto' }}
            exit={{ height: 0 }}
            className="overflow-hidden"
          >
            <div className="max-h-64 overflow-y-auto p-4 space-y-3 bg-gray-50">
              {transcript.length === 0 ? (
                <div className="text-center text-gray-400 py-8">
                  <svg className="w-12 h-12 mx-auto mb-3 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                  </svg>
                  <p className="text-sm">Start speaking to see transcript</p>
                </div>
              ) : (
                transcript.map((line) => (
                  <motion.div
                    key={line.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: line.isFinal ? 1 : 0.6, x: 0 }}
                    className={`p-3 rounded-xl ${
                      line.speaker === 'You'
                        ? 'bg-blue-100 text-blue-900'
                        : 'bg-purple-100 text-purple-900'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <p className="text-xs font-semibold mb-1 opacity-70">
                          {line.speaker === 'You' ? nickname : 'Remote'}
                        </p>
                        <p className={`text-base ${!line.isFinal && 'italic'}`}>
                          {line.text}
                        </p>
                      </div>
                      <span className="text-xs opacity-50 whitespace-nowrap">
                        {new Date(line.timestamp).toLocaleTimeString([], { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </span>
                    </div>
                  </motion.div>
                ))
              )}
              <div ref={transcriptEndRef} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Browser Support Warning */}
      {!('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) && (
        <div className="p-4 bg-yellow-50 border-t border-yellow-200">
          <p className="text-sm text-yellow-800">
            ⚠️ Live transcription requires Chrome, Edge, or Safari
          </p>
        </div>
      )}
    </motion.div>
  );
};
