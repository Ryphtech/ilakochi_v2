import React, { useRef, useState, useEffect } from 'react';
import { Volume2, VolumeX, Play, Pause, Sparkles, Flame, Eye } from 'lucide-react';

interface DishVideoReelProps {
  videoSrc?: string;
  onExploreMenu?: () => void;
}

export const DishVideoReel: React.FC<DishVideoReelProps> = ({
  videoSrc = '/assets/ila-kochi-reel.mp4',
  onExploreMenu,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Ensure autoplay starts smoothly
    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          setIsPlaying(true);
        })
        .catch(() => {
          // Fallback if autoplay policy kicks in
          setIsPlaying(false);
        });
    }
  }, []);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      video.play();
      setIsPlaying(true);
    } else {
      video.pause();
      setIsPlaying(false);
    }
    setHasInteracted(true);
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    const video = videoRef.current;
    if (!video) return;

    video.muted = !video.muted;
    setIsMuted(video.muted);
    setHasInteracted(true);
  };

  return (
    <div className="relative w-full max-w-[300px] sm:max-w-[340px] md:max-w-[360px] lg:max-w-[380px] mx-auto select-none">
      {/* Luxury Ambient Halo Glow behind video */}
      <div className="absolute -inset-4 bg-gradient-to-tr from-[#176B45]/40 via-[#C5A46D]/20 to-[#123D2A]/60 rounded-[36px] blur-2xl -z-10 opacity-75 animate-pulse" />

      {/* Floating Accent Badge Top-Right */}
      <div className="absolute -top-3 -right-3 z-30 hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#123D2A]/90 border border-[#C5A46D]/60 shadow-xl backdrop-blur-md">
        <Flame className="w-3.5 h-3.5 text-[#C5A46D] animate-bounce" />
        <span className="text-[10px] font-sans-ui uppercase tracking-widest text-[#F8F6EE] font-medium">
          Fresh Harbour Catch
        </span>
      </div>

      {/* Main Reel Card Container (9:16 Aspect Ratio) */}
      <div
        onClick={togglePlay}
        className="group relative aspect-[9/16] w-full rounded-3xl overflow-hidden bg-[#071B14] border-2 border-[#176B45]/60 hover:border-[#C5A46D]/60 transition-all duration-500 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.85)] cursor-pointer"
        role="region"
        aria-label="Ila Kochi Authentic Dish Video Reel"
      >
        {/* Video Element */}
        <video
          ref={videoRef}
          src={videoSrc}
          autoPlay
          loop
          muted={isMuted}
          playsInline
          preload="metadata"
          onLoadedData={() => setIsLoaded(true)}
          className={`w-full h-full object-cover transition-opacity duration-700 ${
            isLoaded ? 'opacity-100' : 'opacity-30'
          }`}
        />

        {/* Cinematic Vignette Overlay (Leaves video bright in center, smooth dark edges for text) */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B291E] via-transparent to-black/40 pointer-events-none" />

        {/* Top Header Information inside Video */}
        <div className="absolute top-3.5 inset-x-3.5 z-20 flex items-center justify-between pointer-events-none">
          {/* Live Kitchen Badge */}
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/15">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-[10px] font-sans-ui uppercase tracking-wider text-[#F8F6EE] font-semibold">
              Live at Ila Kochi
            </span>
          </div>

          {/* Sound Toggle Button (Clickable) */}
          <button
            onClick={toggleMute}
            className="pointer-events-auto p-2 rounded-full bg-black/60 hover:bg-[#123D2A] text-[#F8F6EE] border border-white/20 hover:border-[#C5A46D] transition-all duration-300 shadow-lg group/btn cursor-pointer"
            aria-label={isMuted ? 'Unmute video audio' : 'Mute video audio'}
            title={isMuted ? 'Click to hear sizzle audio' : 'Mute audio'}
          >
            {isMuted ? (
              <div className="flex items-center gap-1.5 px-1">
                <VolumeX className="w-3.5 h-3.5 text-[#C5A46D]" />
                <span className="text-[9px] uppercase tracking-wider text-[#DCE8D5] hidden xs:inline">Sound</span>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 px-1">
                <Volume2 className="w-3.5 h-3.5 text-emerald-400" />
                <div className="flex items-end gap-0.5 h-3">
                  <span className="w-0.5 h-2 bg-emerald-400 animate-pulse" />
                  <span className="w-0.5 h-3 bg-emerald-400 animate-pulse delay-75" />
                  <span className="w-0.5 h-1.5 bg-emerald-400 animate-pulse delay-150" />
                </div>
              </div>
            )}
          </button>
        </div>

        {/* Center Play/Pause Indicator (Shown when paused or momentarily on hover) */}
        {!isPlaying && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-[2px] z-20">
            <div className="w-16 h-16 rounded-full bg-[#123D2A]/90 border border-[#C5A46D] flex items-center justify-center text-[#C5A46D] shadow-2xl transform scale-105 transition-transform">
              <Play className="w-7 h-7 fill-current translate-x-0.5" />
            </div>
          </div>
        )}

        {/* Bottom Story & Dish Details Glass Overlay */}
        <div className="absolute bottom-3 inset-x-3 z-20 p-3 sm:p-3.5 rounded-2xl bg-[#0B291E]/90 border border-[#176B45]/60 backdrop-blur-md space-y-2 pointer-events-none">
          <div className="flex items-center justify-between text-[10px] text-[#C5A46D] font-mono tracking-wider">
            <span className="flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-[#C5A46D]" />
              Authentic Sadhya &amp; Tawa Fry
            </span>
            <span className="text-[#A8BFA0] font-sans-ui text-[9px]">@ila_kochi_</span>
          </div>

          <p className="text-xs text-[#F8F6EE] font-serif-display leading-snug line-clamp-2">
            Steaming rice, wood-pressed coconut oil roast &amp; fresh sea catch served on living banana leaf.
          </p>

          <div className="pt-1 flex items-center justify-between text-[10px] text-[#A8BFA0] border-t border-[#176B45]/40 pointer-events-auto">
            <span className="text-[10px] text-[#DCE8D5]/80">
              {isMuted ? 'Tap reel to toggle • Unmute for sizzle' : 'Sound active 🔊'}
            </span>
            {onExploreMenu && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onExploreMenu();
                }}
                className="text-[10px] font-sans-ui font-medium uppercase tracking-wider text-[#C5A46D] hover:text-[#f3e3c3] inline-flex items-center gap-1 underline underline-offset-2 cursor-pointer"
              >
                <span>View Dishes</span>
              </button>
            )}
          </div>
        </div>

        {/* Unmute Prompt Hint for First-time Viewers */}
        {isMuted && !hasInteracted && (
          <div className="absolute top-14 left-1/2 -translate-x-1/2 z-20 px-3 py-1 rounded-full bg-[#C5A46D]/90 text-[#0B291E] text-[10px] font-semibold uppercase tracking-wider shadow-lg animate-bounce pointer-events-none">
            Tap Sound for Audio 🔊
          </div>
        )}
      </div>
    </div>
  );
};

