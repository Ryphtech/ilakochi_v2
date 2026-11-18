import React, { useState, useEffect, useRef } from 'react';
import { restaurantData } from '../../data/restaurantData';
import { useHeadings } from '../../lib/headings';
import {
  HeroConfig,
  defaultHeroConfig,
  subscribeHeroConfig,
} from '../../lib/firebase';
import {
  ArrowDown,
  Compass,
  Utensils,
  Calendar,
  ArrowRight,
  Volume2,
  VolumeX,
} from 'lucide-react';

interface HeroProps {
  onExploreMenu: () => void;
  onDiscoverStory: () => void;
  onOpenReservation?: () => void;
  intervalMs?: number;
}

export const Hero: React.FC<HeroProps> = ({
  onExploreMenu,
  onDiscoverStory,
  onOpenReservation,
  intervalMs: propIntervalMs,
}) => {
  const { headings } = useHeadings();
  const [heroConfig, setHeroConfig] = useState<HeroConfig>(defaultHeroConfig);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Subscribe to live Firestore hero configuration
  useEffect(() => {
    const unsubscribe = subscribeHeroConfig((liveConfig) => {
      setHeroConfig(liveConfig);
    });
    return () => unsubscribe();
  }, []);

  const activeMode = heroConfig.mode || 'images';
  const activeImages =
    heroConfig.images && heroConfig.images.length > 0
      ? heroConfig.images
      : defaultHeroConfig.images;
  const activeInterval =
    propIntervalMs || heroConfig.intervalMs || 5000;

  // Automatic slide rotation when in images mode
  useEffect(() => {
    if (activeMode !== 'images' || isPaused || activeImages.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % activeImages.length);
    }, activeInterval);

    return () => clearInterval(timer);
  }, [activeMode, isPaused, activeImages.length, activeInterval]);

  // Autoplay video when in video mode
  useEffect(() => {
    if (activeMode === 'video' && videoRef.current) {
      videoRef.current.play().catch(() => {});
    }
  }, [activeMode, heroConfig.videoUrl]);

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !videoRef.current.muted;
    setIsMuted(videoRef.current.muted);
  };

  return (
    <section
      id="home"
      className="relative min-h-[100dvh] lg:min-h-[750px] xl:min-h-[820px] w-full flex items-center justify-center overflow-hidden bg-black"
      aria-label="Welcome to ILA KOCHI"
    >
      {/* 01. FULL-WIDTH DYNAMIC BACKGROUND (Configured by Admin: Images or Video) */}
      <div
        className="absolute inset-0 w-full h-full overflow-hidden z-0"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        role="region"
        aria-roledescription="carousel"
        aria-label="Hero Background Media"
      >
        {activeMode === 'video' ? (
          /* VIDEO MODE: Looping Full-Bleed Video from Cloudflare R2 / Admin */
          <div className="absolute inset-0 w-full h-full bg-black">
            <video
              ref={videoRef}
              src={heroConfig.videoUrl}
              poster={heroConfig.videoPoster}
              autoPlay
              loop
              muted={isMuted}
              playsInline
              preload="auto"
              className="w-full h-full object-cover object-center filter brightness-95 contrast-105"
            />
          </div>
        ) : (
          /* IMAGES MODE: Smooth Crossfade Slideshow */
          activeImages.map((img, index) => {
            const isActive = index === currentSlide;
            return (
              <div
                key={img.url + index}
                className={`absolute inset-0 bg-cover bg-center transition-all duration-1000 ease-in-out ${
                  isActive
                    ? 'opacity-100 scale-105 z-10'
                    : 'opacity-0 scale-100 z-0 pointer-events-none'
                }`}
                style={{
                  backgroundImage: `url('${img.url}')`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
                role="group"
                aria-roledescription="slide"
                aria-label={`${index + 1} of ${activeImages.length}: ${img.caption}`}
                aria-hidden={!isActive}
              />
            );
          })
        )}

        {/* Clean, Neutral Dark Scrim (NO green color, NO green wash, purely neutral contrast for text) */}
        <div className="absolute inset-0 bg-black/40 z-20 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/55 to-black/25 z-20 pointer-events-none" />
        {/* Soft top gradient under navbar */}
        <div className="absolute inset-x-0 top-0 h-28 sm:h-36 bg-gradient-to-b from-black/75 to-transparent z-20 pointer-events-none" />
        {/* Soft bottom gradient */}
        <div className="absolute inset-x-0 bottom-0 h-28 sm:h-36 bg-gradient-to-t from-black/80 to-transparent z-20 pointer-events-none" />
      </div>

      {/* 02. MAIN CONTENT CONTAINER */}
      <div className="relative z-20 max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 pt-28 pb-20 sm:pt-32 sm:pb-24 lg:pt-28 lg:pb-20 w-full flex items-center">
        <div className="w-full lg:w-7/12 xl:w-3/5 text-center lg:text-left space-y-4 sm:space-y-5">
          <h1 className="sr-only">ILA KOCHI — Traditional Kerala Seafood &amp; Banana Leaf Dining</h1>

          {/* ILA KOCHI Brand Logo Emblem */}
          <div className="flex items-center justify-center lg:justify-start">
            <div className="relative inline-flex items-center justify-center">
              <div className="absolute -inset-4 bg-[#C5A46D]/20 rounded-full blur-2xl pointer-events-none" />
              <img
                src="/assets/ila-kochi-logo-white.png"
                alt="ILA KOCHI Emblem"
                className="relative h-24 sm:h-32 md:h-36 lg:h-44 w-auto object-contain drop-shadow-[0_8px_32px_rgba(197,164,109,0.4)] filter brightness-105 hover:scale-105 transition-transform duration-500 select-none"
              />
            </div>
          </div>

          {/* Tagline Eyebrow Pill */}
          <div>
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-black/60 border border-white/20 backdrop-blur-md shadow-md">
              <span className="w-1.5 h-1.5 rounded-full bg-[#C5A46D] animate-pulse" />
              <span className="text-[11px] sm:text-xs font-sans-ui uppercase tracking-[0.24em] text-[#C5A46D] font-semibold">
                {headings.hero?.eyebrow || restaurantData.tagline}
              </span>
            </div>
          </div>

          {/* Heading Statement: Grand Editorial Styling with Balanced Line Heights */}
          <div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.4rem] xl:text-[3.9rem] font-serif-display font-medium tracking-tight text-[#F8F6EE] leading-[1.14] text-balance">
              {headings.hero?.title || 'Fresh Catch from the Harbour.'}
              {headings.hero?.subtitle && (
                <span className="block font-editorial italic font-normal text-transparent bg-clip-text bg-gradient-to-r from-[#D8B982] via-[#F8F6EE] to-[#C5A46D] drop-shadow-[0_2px_15px_rgba(197,164,109,0.25)] pt-1 sm:pt-1.5">
                  {headings.hero.subtitle}
                </span>
              )}
            </h2>
          </div>

          {/* Desktop/Tablet 3-Pillar Strip */}
          <div className="hidden sm:grid grid-cols-3 gap-3 sm:gap-4 py-3 sm:py-3.5 my-2 border-y border-white/15 max-w-lg mx-auto lg:mx-0 text-left backdrop-blur-[2px]">
            <div className="space-y-0.5">
              <span className="block text-[10px] sm:text-[11px] font-mono uppercase tracking-wider text-[#C5A46D] font-semibold">
                01 &middot; Harbour Catch
              </span>
              <span className="block text-[11px] sm:text-xs text-[#E5E5E5]/90 font-light leading-snug">
                Daily sea harvest
              </span>
            </div>

            <div className="space-y-0.5 border-l border-white/15 pl-3 sm:pl-4">
              <span className="block text-[10px] sm:text-[11px] font-mono uppercase tracking-wider text-[#C5A46D] font-semibold">
                02 &middot; Cast Iron
              </span>
              <span className="block text-[11px] sm:text-xs text-[#E5E5E5]/90 font-light leading-snug">
                Coconut oil roast
              </span>
            </div>

            <div className="space-y-0.5 border-l border-white/15 pl-3 sm:pl-4">
              <span className="block text-[10px] sm:text-[11px] font-mono uppercase tracking-wider text-[#C5A46D] font-semibold">
                03 &middot; Plantain Leaf
              </span>
              <span className="block text-[11px] sm:text-xs text-[#E5E5E5]/90 font-light leading-snug">
                Green leaf dining
              </span>
            </div>
          </div>

          {/* Mobile Single-Row Culinary Tags */}
          <div className="flex sm:hidden items-center justify-center gap-2.5 py-2 border-y border-white/15 text-[11px] font-mono text-[#E5E5E5]/90 backdrop-blur-[2px]">
            <span className="text-[#C5A46D]">Daily Catch</span>
            <span className="text-white/40">&bull;</span>
            <span>Cast Iron Roast</span>
            <span className="text-white/40">&bull;</span>
            <span className="text-[#C5A46D]">Banana Leaf</span>
          </div>

          {/* Action CTAs: High Converting, Balanced Hierarchy */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center lg:justify-start gap-3 sm:gap-3.5 pt-1 w-full sm:w-auto">
            {onOpenReservation && (
              <button
                onClick={onOpenReservation}
                className="group w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-3.5 sm:px-8 sm:py-4 rounded-full text-xs sm:text-sm font-semibold uppercase tracking-[0.18em] text-[#050505] bg-[#C5A46D] hover:bg-[#d8b982] transition-all duration-300 shadow-xl shadow-black/80 hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
              >
                <Calendar className="w-4 h-4 text-[#050505]" />
                <span>Reserve Your Table</span>
                <ArrowRight className="w-4 h-4 text-[#050505] transition-transform duration-300 group-hover:translate-x-1" />
              </button>
            )}

            <button
              onClick={onExploreMenu}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 sm:px-7 sm:py-4 rounded-full text-xs sm:text-sm font-medium uppercase tracking-[0.18em] text-[#F8F6EE] border border-white/25 hover:border-[#C5A46D] bg-black/50 hover:bg-black/70 transition-all duration-300 backdrop-blur-md cursor-pointer hover:-translate-y-0.5 shadow-lg"
            >
              <Utensils className="w-4 h-4 text-[#C5A46D]" />
              <span>Explore Menu</span>
            </button>
          </div>

          {/* Story Link */}
          <div className="pt-1 flex justify-center lg:justify-start">
            <button
              onClick={onDiscoverStory}
              className="group inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.16em] text-[#E5E5E5]/80 hover:text-[#C5A46D] transition-colors cursor-pointer py-1"
            >
              <Compass className="w-3.5 h-3.5 text-[#C5A46D] transition-transform duration-300 group-hover:rotate-45" />
              <span className="border-b border-transparent group-hover:border-[#C5A46D] pb-0.5 transition-all">
                Our Story
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* 03. INTERACTIVE CORNER CONTROLS (Bottom Right) */}
      <div className="absolute bottom-6 right-6 sm:bottom-8 sm:right-8 z-30 flex items-center gap-3">
        {activeMode === 'video' ? (
          /* Video Sound Toggle Button */
          <button
            onClick={toggleMute}
            className="p-3 sm:px-4 sm:py-2 rounded-full bg-black/60 hover:bg-black/80 text-[#F8F6EE] border border-white/20 hover:border-[#C5A46D] backdrop-blur-md transition-all shadow-xl flex items-center gap-2 cursor-pointer group"
            aria-label={isMuted ? 'Unmute video audio' : 'Mute video audio'}
          >
            {isMuted ? (
              <>
                <VolumeX className="w-4 h-4 text-[#C5A46D] group-hover:scale-110 transition-transform" />
                <span className="hidden sm:inline text-xs font-sans-ui uppercase tracking-wider text-[#E5E5E5]">
                  Unmute Sound
                </span>
              </>
            ) : (
              <>
                <Volume2 className="w-4 h-4 text-[#C5A46D] group-hover:scale-110 transition-transform" />
                <span className="hidden sm:inline text-xs font-sans-ui uppercase tracking-wider text-[#E5E5E5]">
                  Audio Playing
                </span>
              </>
            )}
          </button>
        ) : (
          /* Images Mode: Slide Indicators with Caption */
          <div className="flex items-center gap-2 px-3.5 py-1.5 sm:py-2 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-xs shadow-xl">
            <span className="text-[10px] sm:text-[11px] font-mono text-[#C5A46D] font-medium pr-1">
              {activeImages[currentSlide]?.caption}
            </span>
            <div className="flex items-center gap-1.5" role="tablist" aria-label="Slideshow pagination">
              {activeImages.map((img, idx) => (
                <button
                  key={img.url + idx}
                  onClick={() => setCurrentSlide(idx)}
                  className={`transition-all duration-300 rounded-full cursor-pointer focus:outline-none focus:ring-1 focus:ring-[#C5A46D] ${
                    idx === currentSlide
                      ? 'w-5 h-1.5 bg-[#C5A46D]'
                      : 'w-1.5 h-1.5 bg-white/40 hover:bg-white'
                  }`}
                  role="tab"
                  aria-selected={idx === currentSlide}
                  aria-label={`Slide ${idx + 1}: ${img.caption}`}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 04. Scroll Down Indicator */}
      <div className="hidden sm:flex absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex-col items-center gap-1 pointer-events-auto">
        <button
          onClick={onDiscoverStory}
          className="group flex flex-col items-center gap-1 text-center focus:outline-none cursor-pointer"
          aria-label="Scroll to learn more about Ila Kochi"
        >
          <span className="text-[9px] sm:text-[10px] uppercase tracking-[0.3em] text-[#A3A3A3] group-hover:text-[#C5A46D] transition-colors">
            Scroll to Explore
          </span>
          <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full border border-white/20 flex items-center justify-center group-hover:border-[#C5A46D] group-hover:bg-black/60 transition-all">
            <ArrowDown className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#C5A46D] animate-bounce" />
          </div>
        </button>
      </div>
    </section>
  );
};
