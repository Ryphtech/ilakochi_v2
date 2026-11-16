import React, { useState, useEffect } from 'react';
import { HeroLiveStats } from './HeroLiveStats';

interface HeroProps {
  onExploreMenu: () => void;
  onDiscoverStory: () => void;
  onOpenReservation?: () => void;
}

// Dynamically discover all poster images placed in src/assets/hero_poster/
const posterModules = import.meta.glob<{ default: string }>(
  '../../assets/hero_poster/*.{png,jpg,jpeg,webp,avif,PNG,JPG,JPEG,WEBP,AVIF}',
  { eager: true }
);

const posters = Object.entries(posterModules)
  .sort(([a], [b]) => a.localeCompare(b, undefined, { numeric: true }))
  .map(([, mod]) => mod.default);

export const Hero: React.FC<HeroProps> = ({
  onExploreMenu,
  onDiscoverStory,
  onOpenReservation,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto-advance carousel every 5 seconds with smooth crossfade (one fades out, other fades in)
  useEffect(() => {
    if (posters.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % posters.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [posters.length, currentIndex]);

  return (
    <section
      id="home"
      className="relative w-full bg-black select-none overflow-hidden"
      aria-label="Welcome to ILA KOCHI"
    >
      {/* Accessible Hidden SEO Headings */}
      <h1 className="sr-only">
        ഇതാണ് കൊച്ചിയുടെ രുചി! - Ila Kochi Authentic Kerala Seafood Restaurant
      </h1>
      <h2 className="sr-only">
        കേരളത്തിന്റെ തനിമ, ഓരോ ഇലയിലും.
      </h2>

      {/* Hero Showcase Stage: Native 16:9 Aspect Ratio to match posters without cropping */}
      <div className="relative w-full aspect-[16/9] overflow-hidden bg-black flex items-center justify-center">
        {/* Pure Crossfading Poster Images */}
        {posters.map((posterUrl, index) => {
          const isActive = index === currentIndex;
          return (
            <div
              key={`full-poster-${index}`}
              className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out ${
                isActive ? 'opacity-100 z-0' : 'opacity-0 z-0 pointer-events-none'
              }`}
              aria-hidden={!isActive}
            >
              <img
                src={posterUrl}
                alt={`Ila Kochi Showcase Poster ${index + 1}`}
                className="w-full h-full object-cover object-center"
                loading={index === 0 ? 'eager' : 'lazy'}
                decoding="async"
              />
            </div>
          );
        })}

        {/* Inverted Downside-Up Brick Red Bookmark (Touching Bottom-Left of the Hero Image) */}
        <div
          className="absolute bottom-0 left-4 sm:left-6 md:left-10 z-30 select-none pointer-events-auto"
          aria-label={`Slide ${currentIndex + 1} of ${posters.length || 5}`}
        >
          <div className="relative flex flex-col items-center justify-end w-10 sm:w-12 md:w-14 h-14 sm:h-16 md:h-20 drop-shadow-[0_-4px_16px_rgba(0,0,0,0.5)] hover:h-[4.25rem] md:hover:h-[5.5rem] transition-all duration-300">
            {/* Inverted Bookmark SVG Shape (Swallowtail notch cut at top, perfectly flat at bottom) */}
            <svg
              viewBox="0 0 52 72"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="absolute inset-0 w-full h-full"
              preserveAspectRatio="none"
            >
              <path
                d="M0 0 L26 14 L52 0 L52 72 L0 72 Z"
                fill="#B23B2A"
              />
              <path
                d="M1 1 L26 15 L51 1 L51 72"
                stroke="rgba(255, 255, 255, 0.25)"
                strokeWidth="1"
              />
            </svg>

            {/* Slide Indicator Text inside bookmark (e.g. 1/5 to 5/5) */}
            <div className="relative z-10 pb-2 sm:pb-3 md:pb-4 flex flex-col items-center justify-center">
              <span
                key={currentIndex}
                className="font-mono font-bold text-white text-[10px] sm:text-xs md:text-sm tracking-wider drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]"
              >
                {currentIndex + 1}/{posters.length || 5}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Title & Live Stats after Hero Image */}
      <div className="relative w-full pt-12 sm:pt-16 lg:pt-20 pb-14 sm:pb-20 bg-[#041a10] border-b border-[#17442a]/60 overflow-hidden">
        {/* Atmospheric dark botanical green depth & glows */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#03130c] via-[#062417] to-[#03130c] pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[52rem] h-[28rem] bg-[#0e3d26]/35 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -top-20 right-10 w-96 h-96 bg-[#164a30]/20 rounded-full blur-3xl pointer-events-none" />

        {/* Centered Main Title: കൊച്ചിയുടെ തനി നാടൻ രുചി */}
        <div className="relative z-10 text-center px-4 max-w-7xl mx-auto mb-10 sm:mb-14 lg:mb-16">
          <h2 className="font-malayalam text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-[5rem] font-bold text-white tracking-tight leading-[1.2] sm:leading-[1.15]">
            കൊച്ചിയുടെ തനി നാടൻ രുചി
          </h2>
          <div className="w-24 sm:w-32 md:w-36 h-1 sm:h-1.5 bg-[#C5A46D] mx-auto mt-4 sm:mt-6 rounded-full" />
        </div>

        {/* Live Running Metrics & Sept 2022 Experience Live Clock */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <HeroLiveStats />
        </div>
      </div>
    </section>
  );
};
