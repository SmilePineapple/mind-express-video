import { useEffect, useRef, useState } from 'react';

interface AudioLevelIndicatorProps {
  stream: MediaStream | null;
  label: string;
}

export const AudioLevelIndicator = ({ stream, label }: AudioLevelIndicatorProps) => {
  const [level, setLevel] = useState(0);
  const animationFrameRef = useRef<number>();

  useEffect(() => {
    if (!stream) {
      setLevel(0);
      return;
    }

    const audioTrack = stream.getAudioTracks()[0];
    if (!audioTrack) {
      setLevel(0);
      return;
    }

    // Create audio context and analyzer
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const source = audioContext.createMediaStreamSource(stream);
    const analyzer = audioContext.createAnalyser();
    analyzer.fftSize = 256;
    source.connect(analyzer);

    const dataArray = new Uint8Array(analyzer.frequencyBinCount);

    const updateLevel = () => {
      analyzer.getByteFrequencyData(dataArray);
      
      // Calculate average volume
      const average = dataArray.reduce((sum, value) => sum + value, 0) / dataArray.length;
      const normalized = Math.min(100, (average / 128) * 100);
      
      setLevel(normalized);
      animationFrameRef.current = requestAnimationFrame(updateLevel);
    };

    updateLevel();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      audioContext.close();
    };
  }, [stream]);

  return (
    <div className="flex items-center gap-2 bg-black bg-opacity-50 px-3 py-2 rounded-lg">
      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
      </svg>
      <div className="flex flex-col gap-1">
        <span className="text-xs text-white font-medium">{label}</span>
        <div className="w-32 h-2 bg-gray-700 rounded-full overflow-hidden">
          <div 
            className={`h-full transition-all duration-100 ${
              level > 50 ? 'bg-green-500' : level > 20 ? 'bg-yellow-500' : 'bg-red-500'
            }`}
            style={{ width: `${level}%` }}
          />
        </div>
      </div>
      <span className="text-xs text-white font-mono">{Math.round(level)}%</span>
    </div>
  );
};
