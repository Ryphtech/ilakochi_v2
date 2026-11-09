import React, { useEffect, useState } from 'react';
import { Sparkles, Leaf } from 'lucide-react';

interface WebsitePreloaderProps {
  onComplete: () => void;
}

export const WebsitePreloader: React.FC<WebsitePreloaderProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [isExiting, setIsExiting] = useState(false);
  const [statusMessage, setStatusMessage] = useState('Selecting dawn harbour catch...');

  useEffect(() => {
    // Lock body scroll while preloading
    document.body.style.overflow = 'hidden';

    // Status messages based on progress
    const messages = [
      { at: 0, text: 'Selecting dawn harbour catch...' },
      { at: 35, text: 'Firing cast iron & clay hearths...' },
      { at: 70, text: 'Unfolding fresh banana leaves...' },
      { at: 92, text: 'Welcome to ILA KOCHI...' },
    ];

    const startTime = Date.now();
    const duration = 1400; // 1.4 seconds smooth luxury count

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const rawProgress = Math.min(100, Math.floor((elapsed / duration) * 100));

      setProgress(rawProgress);

      const currentMsg = messages.reduce((prev, curr) =>
        rawProgress >= curr.at ? curr : prev
      );
      setStatusMessage(currentMsg.text);

      if (rawProgress >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          setIsExiting(true);
          setTimeout(() => {
            document.body.style.overflow = '';
            onComplete();
          }, 600); // Wait for slide-up exit transition
        }, 250);
      }
    }, 25);

    return () => {
      clearInterval(interval);
      document.body.style.overflow = '';
    };
  }, [onComplete]);

  return (
    <div
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#071B14] text-[#F8F6EE] transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${
        isExiting ? '-translate-y-full opacity-0 pointer-events-none' : 'translate-y-0 opacity-100'
      }`}
      aria-hidden={isExiting}
      role="progressbar"
      aria-valuenow={progress}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label="Website loading screen"
    >
      {/* Ambient background glows */}
      <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-[#176B45]/20 rounded-full blur-3xl pointer-events-none animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-[#C5A46D]/15 rounded-full blur-3xl pointer-events-none animate-pulse delay-700" />

      {/* Centerpiece Container */}
      <div className="relative z-10 flex flex-col items-center max-w-sm px-6 text-center space-y-6">
        {/* Animated Brand Emblem */}
        <div className="relative flex items-center justify-center">
          <div className="absolute inset-0 bg-[#C5A46D]/20 rounded-full blur-xl animate-ping" />
          <img
            src="/assets/ila-kochi-logo-white.png"
            alt="ILA KOCHI"
            className="h-24 sm:h-28 w-auto object-contain drop-shadow-[0_0_35px_rgba(197,164,109,0.5)] transition-transform duration-700 hover:scale-105 select-none"
          />
        </div>

        {/* Malayalam & English Wordmark */}
        <div className="space-y-1.5">
          <span className="text-xl sm:text-2xl font-serif-display tracking-[0.25em] text-[#F8F6EE] block uppercase font-medium">
            ILA KOCHI
          </span>
          <span className="text-[11px] font-sans-ui tracking-[0.3em] uppercase text-[#C5A46D] block font-medium">
            Coastal Kitchen &middot; ഇല കൊച്ചി
          </span>
        </div>

        {/* Dynamic Culinary Status */}
        <div className="h-6 flex items-center justify-center">
          <p className="text-xs text-[#DCE8D5]/80 font-light italic transition-opacity duration-300 flex items-center gap-1.5">
            <Sparkles className="w-3 h-3 text-[#C5A46D] animate-spin" />
            <span>{statusMessage}</span>
          </p>
        </div>

        {/* Progress Bar & Percentage */}
        <div className="w-48 sm:w-56 space-y-2 pt-2">
          {/* Track */}
          <div className="w-full h-1 bg-[#123D2A] rounded-full overflow-hidden border border-[#176B45]/40 p-0.5">
            <div
              className="h-full bg-gradient-to-r from-[#176B45] via-[#C5A46D] to-[#F8F6EE] rounded-full transition-all duration-75 ease-out shadow-[0_0_10px_#C5A46D]"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Number Counter */}
          <div className="flex items-center justify-between text-[10px] font-mono text-[#A8BFA0]">
            <span className="flex items-center gap-1">
              <Leaf className="w-3 h-3 text-[#176B45]" />
              <span>Living Leaf Dining</span>
            </span>
            <span className="text-[#C5A46D] font-bold">{progress}%</span>
          </div>
        </div>
      </div>

      {/* Bottom Subtitle Heritage */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-center text-[10px] uppercase tracking-[0.3em] text-[#A8BFA0]/60 font-sans-ui whitespace-nowrap">
        Pathadipalam Metro Pillar 350 &bull; Kochi
      </div>
    </div>
  );
};

