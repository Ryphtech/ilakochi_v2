import React from 'react';
import { DishVideoReel } from './DishVideoReel';
import { restaurantData } from '../../data/restaurantData';
import { getR2Url } from '../../lib/r2';
import { ArrowDown, Compass, Utensils, Star, MapPin, Calendar, Clock, Leaf, Play, Sparkles } from 'lucide-react';

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
      className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-[#061710] text-[#F8F6EE]"
      aria-label="Welcome to ILA KOCHI"
    >
      {/* Google Stitch Ambient Background: Multi-layer radial foliage glow */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-[10%] left-[10%] w-[36rem] h-[36rem] bg-[#123D2A]/40 rounded-full blur-[120px]" />
        <div className="absolute bottom-[10%] right-[10%] w-[40rem] h-[40rem] bg-[#C5A46D]/10 rounded-full blur-[140px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[50rem] h-[30rem] bg-[#0B291E]/70 rounded-full blur-[100px]" />
      </div>

      {/* Background Malayalam Calligraphy Watermark */}
      <div className="absolute right-4 md:right-16 top-1/2 -translate-y-1/2 select-none pointer-events-none opacity-[0.04] text-[22vw] font-serif-display leading-none text-[#F8F6EE]">
        ഇല
      </div>

      {/* Main Content Stage: 2-Column Responsive Layout */}
      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16 md:pt-36 md:pb-24 flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-14">
        
        {/* Left Column: Brand Identity, Malayalam Script, Headlines, CTAs & Heritage Pillars */}
        <div className="w-full lg:w-7/12 text-center lg:text-left space-y-6">
          
          {/* Top Location & Live Status Strip (Google Stitch specification) */}
          <div className="flex items-center justify-between bg-[#082117]/90 border border-[#C5A46D]/30 rounded-full py-1.5 px-4 shadow-lg backdrop-blur-md max-w-md mx-auto lg:mx-0">
            <div className="flex items-center gap-2 truncate">
              <MapPin className="w-3.5 h-3.5 text-[#C5A46D] flex-shrink-0" />
              <span className="text-[11px] font-sans-ui text-[#DCE8D5] truncate">
                Pathadipalam, Pillar 350, Kochi
              </span>
            </div>
            <div className="flex items-center gap-1.5 shrink-0 pl-3 border-l border-white/10">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <span className="text-[10px] uppercase font-semibold tracking-wider text-emerald-400">
                Open Now • 11:30 PM
              </span>
            </div>
          </div>

          {/* Accolade & Trust Rating Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#123D2A]/70 border border-[#C5A46D]/40 backdrop-blur-md shadow-sm">
            <div className="flex items-center text-amber-400 text-xs">
              <span className="text-[#E5C378] font-bold text-[11px] mr-1.5">⭐ 4.0</span>
              <span className="text-[10px] text-[#DCE8D5]/90 font-light">({restaurantData.stats.reviewsCount} Google Reviews)</span>
            </div>
            <span className="w-1 h-1 rounded-full bg-[#C5A46D]/50" />
            <span className="text-[10px] uppercase font-semibold tracking-widest text-[#E5C378]">
              Kochi's Seafood Destination
            </span>
          </div>

          {/* Malayalam Calligraphy Ribbon & Official Emblem Logo */}
          <div className="space-y-3">
            <div className="flex items-center justify-center lg:justify-start gap-2.5">
              <div className="h-[1px] w-8 bg-gradient-to-r from-transparent to-[#C5A46D]/70" />
              <span className="text-xl sm:text-2xl font-serif font-bold text-[#E5C378] tracking-wide drop-shadow-[0_2px_8px_rgba(212,175,55,0.35)]">
                ഇല കൊച്ചി വിരുന്ന്
              </span>
              <div className="h-[1px] w-8 bg-gradient-to-l from-transparent to-[#C5A46D]/70" />
            </div>

            <div className="flex items-center justify-center lg:justify-start">
              <img
                src="/assets/ila-kochi-logo-white.png"
                alt="ILA KOCHI Emblem"
                className="h-24 sm:h-32 md:h-36 w-auto object-contain drop-shadow-[0_8px_28px_rgba(197,164,109,0.35)] filter brightness-105 transition-transform duration-500 hover:scale-105 select-none"
              />
            </div>
            <p className="text-xs sm:text-sm font-sans-ui uppercase tracking-[0.28em] text-[#C5A46D] font-medium">
              Kitchen &amp; Coastal Banana Leaf Dining
            </p>
          </div>

          {/* Primary Editorial Headline */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif-display font-semibold text-white tracking-tight leading-[1.15] text-balance">
            Fresh Catch from the Harbour. <br />
            <span className="block gold-gradient-text italic font-editorial font-normal mt-1">
              Served on Living Banana Leaf.
            </span>
          </h1>

          {/* Philosophy & Narrative */}
          <p className="text-sm sm:text-base text-[#DCE8D5]/90 font-light leading-relaxed max-w-xl mx-auto lg:mx-0">
            Rooted in Nature. Inspired by the Malabar Coast. Slow-cooked seafood delicacies prepared in traditional unglazed clay pots (Meen Chatti) and unwrapped steaming hot on tender plantain leaf.
          </p>

          {/* Action Call-to-Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2">
            {onOpenReservation && (
              <button
                onClick={onOpenReservation}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-xl font-semibold text-xs sm:text-sm tracking-wider uppercase bg-gradient-to-r from-[#C5A46D] via-[#D4AF37] to-[#E5C378] text-[#05140e] pulse-gold hover:scale-[1.03] active:scale-[0.98] transition-all shadow-xl shadow-[#C5A46D]/20 cursor-pointer"
              >
                <Utensils className="w-4 h-4" />
                <span>Reserve a Table</span>
              </button>
            )}

            <button
              onClick={onExploreMenu}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-xl bg-[#0B291E]/60 border border-[#C5A46D]/50 text-[#E5C378] hover:text-white hover:border-[#E5C378] hover:bg-[#123D2A]/70 font-semibold text-xs sm:text-sm tracking-wider uppercase backdrop-blur-sm active:scale-[0.98] transition-all cursor-pointer"
            >
              <Leaf className="w-4 h-4 text-[#C5A46D]" />
              <span>Explore Menu</span>
            </button>

            <button
              onClick={onDiscoverStory}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3.5 text-xs font-medium uppercase tracking-[0.16em] text-[#A8BFA0] hover:text-[#C5A46D] transition-colors cursor-pointer"
            >
              <Compass className="w-4 h-4 text-[#C5A46D]" />
              <span>Our Story</span>
            </button>
          </div>

          {/* Google Stitch Heritage Pillars Quick Bar */}
          <div className="grid grid-cols-3 gap-2.5 pt-4 max-w-lg mx-auto lg:mx-0">
            <div className="p-3 rounded-2xl bg-[#123D2A]/50 border border-[#C5A46D]/20 text-center space-y-1 hover:border-[#C5A46D]/50 transition-colors">
              <div className="text-lg">🍃</div>
              <h3 className="text-[11px] font-semibold text-[#E5C378] uppercase tracking-wider">Living Leaf</h3>
              <p className="text-[9.5px] text-[#A8BFA0] leading-tight">100% Organic Plantain Service</p>
            </div>
            <div className="p-3 rounded-2xl bg-[#123D2A]/50 border border-[#C5A46D]/20 text-center space-y-1 hover:border-[#C5A46D]/50 transition-colors">
              <div className="text-lg">🏺</div>
              <h3 className="text-[11px] font-semibold text-[#E5C378] uppercase tracking-wider">Clay Pots</h3>
              <p className="text-[9.5px] text-[#A8BFA0] leading-tight">Meen Chatti Slow-Fired Stews</p>
            </div>
            <div className="p-3 rounded-2xl bg-[#123D2A]/50 border border-[#C5A46D]/20 text-center space-y-1 hover:border-[#C5A46D]/50 transition-colors">
              <div className="text-lg">🥥</div>
              <h3 className="text-[11px] font-semibold text-[#E5C378] uppercase tracking-wider">Cold-Pressed</h3>
              <p className="text-[9.5px] text-[#A8BFA0] leading-tight">Virgin Coconut Oil &amp; Spices</p>
            </div>
          </div>
        </div>

        {/* Right Column: Google Stitch Interactive Dish Video Reel Showcase */}
        <div className="w-full lg:w-5/12 flex flex-col items-center justify-center space-y-4 pt-2 lg:pt-0">
          {/* Main Reel Card */}
          <DishVideoReel
            videoSrc={getR2Url('ila-kochi-reel.mp4')}
            onExploreMenu={onExploreMenu}
          />

          {/* Google Stitch Video Story Featurette Footnote Card */}
          <div className="w-full max-w-[340px] sm:max-w-[360px] p-3.5 rounded-2xl bg-[#082117]/85 border border-[#C5A46D]/25 backdrop-blur-md flex items-center gap-3 shadow-xl hover:border-[#C5A46D]/50 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-[#123D2A] border border-[#C5A46D]/40 flex items-center justify-center flex-shrink-0 text-[#C5A46D] shadow-inner">
              <Sparkles className="w-6 h-6 animate-pulse" />
            </div>
            <div className="space-y-0.5 text-left flex-1 min-w-0">
              <span className="text-[9.5px] uppercase tracking-wider text-[#C5A46D] font-semibold block">
                Behind the Hearth
              </span>
              <h4 className="text-xs font-serif font-bold text-white truncate">
                Authentic Meen Chatti Simmering
              </h4>
              <p className="text-[10px] text-[#A8BFA0] leading-tight line-clamp-1">
                Slow-simmered Alleppey fish curry in pottery with roasted coconut milk.
              </p>
            </div>
          </div>
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

export default Hero;
