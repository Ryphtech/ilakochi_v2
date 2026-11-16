import React, { useState, useRef, useEffect } from 'react';
import { restaurantData } from '../../data/restaurantData';
import { getR2Url } from '../../lib/r2';
import {
  MapPin,
  Calendar,
  Utensils,
  Leaf,
  Star,
  Clock,
  ArrowDown,
  Volume2,
  VolumeX,
  Play,
  Pause,
  Sparkles,
  Compass,
} from 'lucide-react';

interface HeroProps {
  onExploreMenu: () => void;
  onDiscoverStory: () => void;
  onOpenReservation?: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  onExploreMenu,
  onDiscoverStory,
  onOpenReservation,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(true);
  const [videoLoaded, setVideoLoaded] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => setIsPlaying(true))
        .catch(() => setIsPlaying(false));
    }
  }, []);

  const toggleSound = () => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    setIsMuted(video.muted);
  };

  const togglePlayback = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      video.play();
      setIsPlaying(true);
    } else {
      video.pause();
      setIsPlaying(false);
    }
  };

  return (
    <section
      id="home"
      className="relative w-full min-h-screen flex flex-col justify-between items-center overflow-hidden bg-[#05130D] text-[#F8F6EE]"
      aria-label="Ila Kochi — Luxury Coastal Kerala Dining"
    >
      {/* =========================================================================
          100% BLEED CINEMATIC BACKGROUND: Video Loop + Multi-layer Vignettes
          ========================================================================= */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none select-none">
        {/* High-definition cooking video loop (R2 CDN with local fallback) */}
        <video
          ref={videoRef}
          autoPlay
          loop
          muted={isMuted}
          playsInline
          preload="auto"
          onLoadedData={() => setVideoLoaded(true)}
          poster="https://lh3.googleusercontent.com/aida/ALJJyrAanhjb8tcI01Q34Gd8cm4VdN5f_vXnq7M3qkOFKcIKZKBnI3qGqT-EvNs5w2d_qRPamIyMd5peONlf8YmeFc75au_Tx1rMHVyYJI2BhcA7Y_Ru1t8RmS7zgc7UhMd_NrrrzXmvR6f2L7FBim8BDYL91_Dwu1jRa_bjROVrKdGrnsRi6hM5IQQHpp-r04BqYykKyEVSfrxslr99xYZX1c0_FFE_gtSilvi2XkccOXaq_092e--jwAxKWw"
          className={`w-full h-full object-cover object-center filter brightness-[0.40] contrast-[1.12] saturate-[1.15] scale-105 transition-opacity duration-1000 ${
            videoLoaded ? 'opacity-100' : 'opacity-60'
          }`}
        >
          <source src={getR2Url('ila-kochi-reel.mp4')} type="video/mp4" />
          <source src="/assets/ila-kochi-reel.mp4" type="video/mp4" />
          <source src="/assets/videos/fish-cooking-sizzle.mp4" type="video/mp4" />
        </video>

        {/* Cinematic Vignette Overlay (Dark edges, clear center for typography) */}
        <div className="absolute inset-0 hero-vignette mix-blend-multiply" />

        {/* Vertical gradient contrast blankets for navbar & bottom stats */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#05130D]/90 via-[#0B291E]/35 to-[#05130D]/95" />

        {/* Warm Golden Ambient Glow Bloom behind headline */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] md:w-[850px] h-[400px] md:h-[550px] bg-[#C5A46D]/10 rounded-full blur-[140px]" />
      </div>

      {/* Floating Video Audio & Playback Controls (Discrete, bottom-right) */}
      <div className="absolute top-24 sm:top-28 right-4 sm:right-8 z-30 flex items-center gap-2">
        <button
          onClick={toggleSound}
          className="group flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#0B291E]/80 hover:bg-[#123D2A] border border-[#C5A46D]/40 hover:border-[#C5A46D] backdrop-blur-md text-[#F8F6EE] text-[11px] font-sans-ui uppercase tracking-wider transition-all duration-300 shadow-lg cursor-pointer"
          title={isMuted ? 'Unmute authentic kitchen audio' : 'Mute audio'}
          aria-label={isMuted ? 'Unmute video audio' : 'Mute video audio'}
        >
          {isMuted ? (
            <>
              <VolumeX className="w-3.5 h-3.5 text-[#C5A46D]" />
              <span className="hidden sm:inline text-[#DCE8D5]/90">Sound Off</span>
            </>
          ) : (
            <>
              <Volume2 className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
              <span className="hidden sm:inline text-emerald-400 font-semibold">Sound On 🔊</span>
            </>
          )}
        </button>

        <button
          onClick={togglePlayback}
          className="p-2 rounded-full bg-[#0B291E]/80 hover:bg-[#123D2A] border border-[#C5A46D]/40 hover:border-[#C5A46D] backdrop-blur-md text-[#C5A46D] transition-all duration-300 shadow-lg cursor-pointer"
          title={isPlaying ? 'Pause background reel' : 'Play background reel'}
          aria-label={isPlaying ? 'Pause background reel' : 'Play background reel'}
        >
          {isPlaying ? (
            <Pause className="w-3.5 h-3.5" />
          ) : (
            <Play className="w-3.5 h-3.5 fill-current" />
          )}
        </button>
      </div>

      {/* =========================================================================
          CENTER HERO STACK (Single column, centered vertical alignment)
          ========================================================================= */}
      <div className="relative z-20 flex-1 flex flex-col items-center justify-center text-center max-w-5xl mx-auto px-4 sm:px-6 pt-32 pb-12 sm:pt-36 sm:pb-16 w-full">
        
        {/* 1. Location & Live Status Pill */}
        <div className="inline-flex items-center gap-2.5 sm:gap-3.5 px-4 sm:px-5 py-1.5 sm:py-2 rounded-full bg-[#0B291E]/75 backdrop-blur-md border border-[#C5A46D]/35 text-[11px] sm:text-xs tracking-wider uppercase shadow-[0_4px_25px_rgba(0,0,0,0.6)] mb-5 animate-subtle-pulse">
          <div className="flex items-center gap-1.5 text-[#E6C587] font-medium tracking-[0.14em]">
            <MapPin className="w-3.5 h-3.5 text-[#C5A46D]" />
            <span>Pathadipalam, Pillar 350, Kochi</span>
          </div>
          <span className="w-[1px] h-3.5 bg-[#C5A46D]/30" />
          <div className="flex items-center gap-1.5 sm:gap-2 text-emerald-400 font-semibold tracking-[0.12em]">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500 shadow-[0_0_8px_#10B981]" />
            </span>
            <span>Open Now • Till 11:00 PM</span>
          </div>
        </div>

        {/* 2. Restaurant Brand Emblem Logo */}
        <div className="mb-3 transform hover:scale-105 transition-transform duration-500">
          <img
            src="/assets/ila-kochi-logo-white.png"
            alt="ILA KOCHI Official Emblem"
            className="h-20 sm:h-28 md:h-32 w-auto object-contain drop-shadow-[0_8px_32px_rgba(197,164,109,0.4)] select-none"
          />
        </div>

        {/* 3. Traditional Malayalam Script Callout */}
        <div className="flex items-center justify-center gap-3 sm:gap-4 mb-2">
          <span className="w-8 sm:w-16 h-[1px] bg-gradient-to-r from-transparent to-[#C5A46D]/70" />
          <h2 className="text-xl sm:text-2xl md:text-3xl font-serif text-[#E6C587] font-normal tracking-wide gold-subtle-glow opacity-95">
            {restaurantData.nameMalayalam} വിരുന്ന്
          </h2>
          <span className="w-8 sm:w-16 h-[1px] bg-gradient-to-l from-transparent to-[#C5A46D]/70" />
        </div>

        {/* 4. Massive Bold Headline with Gold Gradient */}
        <h1 className="font-serif-display text-5xl sm:text-7xl md:text-8xl lg:text-[102px] font-black uppercase tracking-tight leading-[0.95] gold-gradient-text gold-subtle-glow mb-4 select-none">
          {restaurantData.name}
        </h1>

        {/* 5. Brand Tagline with Ultra-wide Spacing */}
        <p className="font-sans-ui text-xs sm:text-sm md:text-[15px] font-semibold tracking-[0.28em] uppercase text-[#F8F6EE]/90 mb-4 max-w-2xl text-center">
          {restaurantData.tagline}
        </p>

        {/* 6. Culinary Narrative Snippet */}
        <p className="text-xs sm:text-sm text-[#DCE8D5]/80 font-light max-w-xl mx-auto leading-relaxed mb-8 hidden sm:block">
          Fresh Harbour Catch slow-cooked in traditional unglazed clay pots (Meen Chatti) &amp; served steaming hot on living tender plantain leaf.
        </p>

        {/* 7. Action CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 sm:gap-5 w-full max-w-md pt-1">
          {onOpenReservation && (
            <button
              onClick={onOpenReservation}
              className="w-full sm:w-auto min-w-[200px] inline-flex items-center justify-center gap-2.5 px-8 py-3.5 sm:py-4 rounded-full bg-gradient-to-r from-[#C5A46D] via-[#D8B87B] to-[#C5A46D] hover:from-[#D8B87B] hover:to-[#EBD4A8] text-[#05130D] font-sans-ui font-bold text-xs uppercase tracking-[0.22em] shadow-[0_8px_30px_rgba(197,164,109,0.4)] hover:shadow-[0_8px_35px_rgba(216,184,123,0.6)] transition-all duration-300 hover:scale-105 active:scale-95 border border-[#F8F6EE]/30 cursor-pointer"
            >
              <Calendar className="w-4 h-4 text-[#05130D]" />
              <span>Reserve a Table</span>
            </button>
          )}

          <button
            onClick={onExploreMenu}
            className="w-full sm:w-auto min-w-[200px] inline-flex items-center justify-center gap-2.5 px-8 py-3.5 sm:py-4 rounded-full bg-[#0B291E]/60 hover:bg-[#123D2A]/80 backdrop-blur-md text-[#F8F6EE] hover:text-[#E6C587] font-sans-ui font-semibold text-xs uppercase tracking-[0.22em] border border-[#C5A46D]/60 hover:border-[#E6C587] shadow-[0_8px_30px_rgba(0,0,0,0.4)] transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer group"
          >
            <Leaf className="w-4 h-4 text-[#C5A46D] group-hover:rotate-12 transition-transform" />
            <span>Explore Menu</span>
          </button>
        </div>

        {/* Secondary Story Link */}
        <button
          onClick={onDiscoverStory}
          className="inline-flex items-center gap-1.5 text-xs text-[#A8BFA0] hover:text-[#C5A46D] uppercase tracking-[0.18em] transition-colors mt-5 cursor-pointer"
        >
          <Compass className="w-3.5 h-3.5 text-[#C5A46D]" />
          <span>Our Heritage Story</span>
        </button>
      </div>

      {/* =========================================================================
          BOTTOM SECTION: Horizontal Stats Strip & Floating Scroll Indicator
          ========================================================================= */}
      <div className="relative z-20 w-full max-w-6xl mx-auto px-4 sm:px-6 pb-6 pt-2 flex flex-col items-center gap-4">
        
        {/* Horizontal 3-Column Stats Strip (Divided by gold lines) */}
        <div className="w-full backdrop-blur-md bg-[#082117]/75 border border-[#C5A46D]/25 rounded-2xl py-3.5 px-4 sm:px-8 shadow-[0_12px_40px_rgba(0,0,0,0.6)]">
          <div className="grid grid-cols-1 md:grid-cols-3 items-center divide-y md:divide-y-0 md:divide-x divide-[#C5A46D]/25 text-center gap-2 md:gap-0">
            
            {/* Stat 1: Google Rating */}
            <div className="flex items-center justify-center gap-3 py-2 px-3">
              <div className="w-9 h-9 rounded-full bg-[#C5A46D]/15 border border-[#C5A46D]/35 flex items-center justify-center text-[#E6C587]">
                <Star className="w-4 h-4 fill-current" />
              </div>
              <div className="text-left">
                <div className="flex items-center gap-1.5">
                  <span className="font-serif-display font-bold text-base sm:text-lg text-[#F8F6EE]">
                    {restaurantData.stats.rating}
                  </span>
                  <div className="flex text-amber-400 text-xs">
                    {'★★★★'.split('').map((s, i) => (
                      <span key={i}>{s}</span>
                    ))}
                    <span className="text-[#C5A46D]/40">★</span>
                  </div>
                </div>
                <p className="text-[11px] uppercase tracking-wider text-[#DCE8D5]/75 font-medium">
                  {restaurantData.stats.reviewsCount} Google Reviews
                </p>
              </div>
            </div>

            {/* Stat 2: Pricing */}
            <div className="flex items-center justify-center gap-3 py-2 px-3">
              <div className="w-9 h-9 rounded-full bg-[#C5A46D]/15 border border-[#C5A46D]/35 flex items-center justify-center text-[#E6C587]">
                <span className="text-sm font-bold">₹</span>
              </div>
              <div className="text-left">
                <span className="font-serif-display font-bold text-base sm:text-lg text-[#F8F6EE] tracking-tight">
                  {restaurantData.stats.priceRange}
                </span>
                <p className="text-[11px] uppercase tracking-wider text-[#DCE8D5]/75 font-medium">
                  Average Per Person
                </p>
              </div>
            </div>

            {/* Stat 3: Timings */}
            <div className="flex items-center justify-center gap-3 py-2 px-3">
              <div className="w-9 h-9 rounded-full bg-[#C5A46D]/15 border border-[#C5A46D]/35 flex items-center justify-center text-[#E6C587]">
                <Clock className="w-4 h-4" />
              </div>
              <div className="text-left">
                <span className="font-serif-display font-bold text-base sm:text-lg text-[#F8F6EE]">
                  {restaurantData.timings.allDay}
                </span>
                <p className="text-[11px] uppercase tracking-wider text-[#DCE8D5]/75 font-medium">
                  Open All 7 Days • Fresh Catch Daily
                </p>
              </div>
            </div>

          </div>
        </div>

        {/* Scroll Cue Indicator */}
        <button
          onClick={onDiscoverStory}
          className="inline-flex flex-col items-center gap-1 text-[#DCE8D5]/75 hover:text-[#C5A46D] transition-colors cursor-pointer py-1 group focus:outline-none"
          aria-label="Scroll down to discover more about Ila Kochi"
        >
          <span className="text-[10px] uppercase tracking-[0.25em] font-medium font-sans-ui opacity-80 group-hover:opacity-100 transition-opacity">
            Discover More
          </span>
          <div className="w-6 h-6 rounded-full border border-[#C5A46D]/40 flex items-center justify-center animate-float group-hover:border-[#C5A46D] group-hover:bg-[#123D2A]/50 transition-all">
            <ArrowDown className="w-3.5 h-3.5 text-[#C5A46D]" />
          </div>
        </button>

      </div>
    </section>
  );
};

export default Hero;
