import { useEffect, useState } from 'react';

export const BrowserDetection = () => {
  const [showWarning, setShowWarning] = useState(false);
  const [currentUrl, setCurrentUrl] = useState('');

  useEffect(() => {
    setCurrentUrl(window.location.href);
    
    // Check if running in an embedded browser (iframe)
    const isEmbedded = window.self !== window.top;
    
    // Only show warning if embedded AND we can't access media
    if (isEmbedded) {
      navigator.mediaDevices.getUserMedia({ video: true, audio: true })
        .then(() => {
          // Permissions granted, don't show warning
          setShowWarning(false);
        })
        .catch(() => {
          // Permissions denied in embedded browser
          setShowWarning(true);
        });
    }
  }, []);

  const openInBrowser = () => {
    // Try to open in external browser
    window.open(currentUrl, '_blank');
  };

  if (!showWarning) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-slate-900/95 z-50 flex items-center justify-center p-8">
      <div className="bg-white rounded-3xl p-12 max-w-2xl text-center shadow-2xl">
        <div className="text-8xl mb-8">🌐</div>
        
        <h1 className="text-4xl font-bold text-slate-900 mb-6">
          Open in Browser
        </h1>
        
        <p className="text-2xl text-slate-600 mb-8 leading-relaxed">
          Video calls need camera and microphone access.
          <br />
          Please open this page in your web browser.
        </p>
        
        <button
          onClick={openInBrowser}
          className="bg-blue-600 hover:bg-blue-700 text-white text-3xl font-bold py-6 px-12 rounded-2xl transition-all transform hover:scale-105 shadow-lg"
        >
          Open in Browser
        </button>
        
        <p className="text-xl text-slate-500 mt-8">
          Copy this link to your browser:
        </p>
        <div className="bg-slate-100 rounded-xl p-4 mt-4 text-xl text-slate-700 font-mono break-all">
          {currentUrl}
        </div>
      </div>
    </div>
  );
};
