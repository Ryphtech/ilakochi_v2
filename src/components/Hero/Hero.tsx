import React from 'react';
import { DishVideoReel } from './DishVideoReel';
import { restaurantData } from '../../data/restaurantData';
import { getR2Url } from '../../lib/r2';
import { ArrowDown, Compass, Utensils, Star, MapPin, Calendar, Clock } from 'lucide-react';

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
  return (
    <section
      id="home"
      className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-[#0B291E]"
      aria-label="Welcome to ILA KOCHI"
    >
      {/* Atmospheric Background Layers (No 3D Canvas) */}
      <div className="absolute inset-0 bg-radial-vignette pointer-events-none z-0 opacity-70" />
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-[#176B45]/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-[32rem] h-[32rem] bg-[#123D2A]/60 rounded-full blur-3xl pointer-events-none" />

      {/* Subtle organic watermark in background */}
      <div className="absolute right-6 md:right-24 top-1/2 -translate-y-1/2 select-none pointer-events-none opacity-[0.03] text-[20vw] font-serif-display leading-none text-[#F8F6EE]">
        ഇല
      </div>

      {/* Main Content Container: 2-Column Responsive Layout */}
      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16 md:pt-36 md:pb-24 flex flex-col lg:flex-row items-center justify-between gap-10 lg:gap-14">
        {/* Left Column: Brand Story & CTAs */}
        <div className="w-full lg:w-7/12 text-center lg:text-left space-y-6">
          {/* Heritage Pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#123D2A]/90 border border-[#176B45]/60 backdrop-blur-sm shadow-md">
            <span className="w-2 h-2 rounded-full bg-[#C5A46D] animate-pulse" />
            <span className="text-[11px] sm:text-xs font-sans-ui tracking-[0.25em] uppercase text-[#DCE8D5]">
              Authentic Kerala Seafood &middot; ഇല കൊച്ചി
            </span>
          </div>

          {/* Main Brand Logo Statement */}
          <div className="space-y-3">
            <h1 className="sr-only">ILA KOCHI — Traditional Kerala Seafood &amp; Banana Leaf Dining</h1>
            <div className="flex items-center justify-center lg:justify-start">
              <img
                src="/assets/ila-kochi-logo-white.png"
                alt="ILA KOCHI Emblem"
                className="h-28 sm:h-36 md:h-40 w-auto object-contain drop-shadow-[0_8px_28px_rgba(197,164,109,0.35)] filter brightness-105 transition-transform duration-500 hover:scale-105 select-none"
              />
            </div>
            <p className="text-sm sm:text-base lg:text-lg font-sans-ui uppercase tracking-[0.28em] text-[#C5A46D] font-medium pt-1">
              {restaurantData.tagline}
            </p>
          </div>

          {/* Heading Statement */}
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-serif-display tracking-tight text-[#F8F6EE] leading-tight text-balance">
            Fresh Catch from the Harbour. <br />
            <span className="italic font-editorial text-[#C5A46D]">Served on Living Banana Leaf.</span>
          </h2>

          {/* Pitch & Philosophy */}
          <p className="text-sm sm:text-base text-[#DCE8D5]/90 font-light leading-relaxed max-w-xl mx-auto lg:mx-0">
            {restaurantData.heroPitch}
          </p>

          {/* Social Proof & Location Badges */}
          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2.5 pt-1 text-xs text-[#A8BFA0]">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#123D2A]/80 border border-[#176B45]/40 shadow-sm">
              <Star className="w-3.5 h-3.5 text-[#C5A46D] fill-[#C5A46D]" />
              <span className="text-[#F8F6EE] font-medium">{restaurantData.stats.rating}</span>
              <span>({restaurantData.stats.reviewsCount} Google Reviews)</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#123D2A]/80 border border-[#176B45]/40 shadow-sm">
              <MapPin className="w-3.5 h-3.5 text-[#C5A46D]" />
              <span>Pathadipalam Metro Pillar 350</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#123D2A]/80 border border-[#176B45]/40 shadow-sm">
              <Clock className="w-3.5 h-3.5 text-[#C5A46D]" />
              <span>Daily 11:30 AM &ndash; 11:00 PM</span>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-3">
            {onOpenReservation && (
              <button
                onClick={onOpenReservation}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-full text-xs sm:text-sm font-semibold uppercase tracking-[0.18em] text-[#0B291E] bg-[#C5A46D] hover:bg-[#d8b982] transition-all duration-300 shadow-xl shadow-[#0B291E]/70 hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
              >
                <Calendar className="w-4 h-4" />
                <span>Reserve Your Table</span>
              </button>
            )}

            <button
              onClick={onExploreMenu}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-full text-xs sm:text-sm font-medium uppercase tracking-[0.18em] text-[#F8F6EE] border border-[#176B45] hover:border-[#C5A46D] bg-[#123D2A]/70 hover:bg-[#123D2A] transition-all duration-300 backdrop-blur-sm cursor-pointer"
            >
              <Utensils className="w-4 h-4 text-[#C5A46D]" />
              <span>Explore Our Menu</span>
            </button>

            <button
              onClick={onDiscoverStory}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3.5 text-xs font-medium uppercase tracking-[0.16em] text-[#A8BFA0] hover:text-[#C5A46D] transition-colors cursor-pointer"
            >
              <Compass className="w-4 h-4 text-[#C5A46D]" />
              <span>Our Story</span>
            </button>
          </div>
        </div>

        {/* Right Column: Authentic Dish Video Reel Showcase */}
        <div className="w-full lg:w-5/12 flex flex-col items-center justify-center pt-4 lg:pt-0">
          <DishVideoReel
            videoSrc={getR2Url('ila-kochi-reel.mp4')}
            onExploreMenu={onExploreMenu}
          />
        </div>
      </div>

      {/* Scroll Down Indicator */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-1 pointer-events-auto">
        <button
          onClick={onDiscoverStory}
          className="group flex flex-col items-center gap-1 text-center focus:outline-none cursor-pointer"
          aria-label="Scroll to learn more about Ila Kochi"
        >
          <span className="text-[10px] uppercase tracking-[0.3em] text-[#A8BFA0] group-hover:text-[#C5A46D] transition-colors">
            Scroll to Explore
          </span>
          <div className="w-7 h-7 rounded-full border border-[#176B45]/60 flex items-center justify-center group-hover:border-[#C5A46D] group-hover:bg-[#123D2A]/60 transition-all">
            <ArrowDown className="w-3.5 h-3.5 text-[#C5A46D] animate-bounce" />
          </div>
        </button>
      </div>
    </section>
  );
};
