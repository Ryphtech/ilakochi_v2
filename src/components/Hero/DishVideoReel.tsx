import React, { useRef, useState, useEffect } from 'react';
import { Volume2, VolumeX, Play, Sparkles, Flame } from 'lucide-react';

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
    <div className="relative w-full max-w-none select-none">
      {/* Luxury Ambient Halo Glow behind video (Desktop/Tablets only) */}
      <div className="hidden md:block absolute -inset-6 bg-gradient-to-tr from-[#C5A46D]/15 via-white/5 to-transparent rounded-[32px] blur-3xl -z-10 opacity-75" />

      {/* Floating Accent Badge Top-Right (Desktop/Tablets only) */}
      <div className="absolute -top-3 -right-3 z-30 hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/90 border border-[#C5A46D]/60 shadow-xl backdrop-blur-md">
        <Flame className="w-3.5 h-3.5 text-[#C5A46D] animate-bounce" />
        <span className="text-[10px] font-sans-ui uppercase tracking-widest text-[#F8F6EE] font-medium">
          Fresh Harbour Catch
        </span>
      </div>

      {/* Main Video: Full Screen Width on Mobile (no container/rounded/borders), Landscape (16:9) on Tablets & Desktops */}
      <div
        onClick={togglePlay}
        className="group relative aspect-[9/16] md:aspect-video w-full rounded-none md:rounded-3xl overflow-hidden bg-black border-y md:border-2 border-white/10 md:border-white/15 hover:border-[#C5A46D]/60 transition-all duration-500 shadow-2xl md:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.85)] cursor-pointer"
        role="region"
        aria-label="Ila Kochi Authentic Dish Video"
      >
        {/* Video Element with Cloudflare R2 CDN & Local Fallback */}
        <video
          ref={videoRef}
          autoPlay
          loop
          muted={isMuted}
          playsInline
          preload="metadata"
          onLoadedData={() => setIsLoaded(true)}
          className={`w-full h-full object-cover object-center transition-opacity duration-700 ${isLoaded ? 'opacity-100' : 'opacity-30'
            }`}
        >
          <source src={videoSrc} type="video/mp4" />
          <source src="/assets/ila-kochi-reel.mp4" type="video/mp4" />
        </video>

        {/* Cinematic Vignette Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/50 pointer-events-none" />

        {/* Top Header Information inside Video */}
        <div className="absolute top-3.5 inset-x-3.5 md:top-4 md:inset-x-5 z-20 flex items-center justify-between pointer-events-none">
          {/* Live Kitchen Badge */}
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-black/75 backdrop-blur-md border border-white/15">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-[10px] md:text-xs font-sans-ui uppercase tracking-wider text-[#F8F6EE] font-semibold">
              Live at Ila Kochi
            </span>
          </div>

          {/* Sound Toggle Button (Clickable) */}
          <button
            onClick={toggleMute}
            className="pointer-events-auto p-2 md:px-3 md:py-1.5 rounded-full bg-black/75 hover:bg-black/90 text-[#F8F6EE] border border-white/20 hover:border-[#C5A46D] transition-all duration-300 shadow-lg group/btn cursor-pointer backdrop-blur-md"
            aria-label={isMuted ? 'Unmute video audio' : 'Mute video audio'}
            title={isMuted ? 'Click to hear sizzle audio' : 'Mute audio'}
          >
            {isMuted ? (
              <div className="flex items-center gap-1.5">
                <VolumeX className="w-3.5 h-3.5 text-[#C5A46D]" />
                <span className="text-[9px] md:text-[10px] uppercase tracking-wider text-[#DCE8D5]">Sound</span>
              </div>
            ) : (
              <div className="flex items-center gap-1.5">
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

        {/* Center Play/Pause Indicator (Shown when paused) */}
        {!isPlaying && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-[2px] z-20">
            <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-black/90 border border-[#C5A46D] flex items-center justify-center text-[#C5A46D] shadow-2xl transform scale-105 transition-transform">
              <Play className="w-7 h-7 md:w-9 md:h-9 fill-current translate-x-0.5" />
            </div>
          </div>
        )}

        {/* Bottom Story & Dish Details Glass Overlay */}
        <div className="absolute bottom-3 inset-x-3 md:bottom-4 md:inset-x-4 z-20 p-3 sm:p-3.5 rounded-2xl bg-black/85 border border-white/15 backdrop-blur-md pointer-events-none">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2 text-[10px] text-[#C5A46D] font-mono tracking-wider">
                <span className="flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-[#C5A46D]" />
                  Authentic Sadhya &amp; Tawa Fry
                </span>
                <span className="text-[#A8BFA0] font-sans-ui text-[9px]">@ila_kochi_</span>
              </div>
              <p className="text-xs text-[#F8F6EE] font-serif-display leading-snug line-clamp-1">
                Steaming rice &amp; fresh sea catch served on living banana leaf.
              </p>
            </div>

            <div className="pt-1 md:pt-0 flex items-center justify-between md:justify-end gap-3 text-[10px] text-[#A8BFA0] border-t md:border-t-0 border-white/10 pointer-events-auto flex-shrink-0">
              <span className="text-[10px] text-[#DCE8D5]/80">
                {isMuted ? 'Tap for sound' : 'Sound active 🔊'}
              </span>
              {onExploreMenu && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onExploreMenu();
                  }}
                  className="text-[10px] md:text-[11px] font-sans-ui font-medium uppercase tracking-wider text-[#C5A46D] hover:text-[#f3e3c3] inline-flex items-center gap-1 underline underline-offset-2 cursor-pointer"
                >
                  <span>View Dishes</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Unmute Prompt Hint for First-time Viewers */}
        {isMuted && !hasInteracted && (
          <div className="absolute top-14 left-1/2 -translate-x-1/2 z-20 px-3 py-1 rounded-full bg-[#C5A46D]/95 text-black text-[10px] font-semibold uppercase tracking-wider shadow-lg animate-bounce pointer-events-none">
            Tap Sound for Audio 🔊
          </div>
        )}
      </div>
    </div>
  );
};
