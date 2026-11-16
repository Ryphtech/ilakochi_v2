import React from 'react';
import { DishVideoReel } from './DishVideoReel';
import { getR2Url } from '../../lib/r2';
import { Compass, Utensils, Calendar } from 'lucide-react';

interface HeroVideoSectionProps {
  onExploreMenu: () => void;
  onOpenReservation?: () => void;
}

export const HeroVideoSection: React.FC<HeroVideoSectionProps> = ({
  onExploreMenu,
  onOpenReservation,
}) => {
  return (
    <section
      id="video-experience"
      className="relative w-full py-12 sm:py-16 lg:py-24 bg-black border-b border-white/10 overflow-hidden"
      aria-label="Kochi Maritime Heritage and Ila Kochi Video"
    >
      {/* Ambient background glow */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 bg-[#C5A46D]/5 rounded-full blur-3xl pointer-events-none -z-0" />
      <div className="absolute -bottom-20 right-10 w-[30rem] h-[30rem] bg-white/[0.02] rounded-full blur-3xl pointer-events-none -z-0" />

      {/* Subtle organic Malayalam watermark */}
      <div className="absolute right-4 top-1/2 -translate-y-1/2 select-none pointer-events-none opacity-[0.02] text-[18vw] font-serif-display leading-none text-white">
        തീരം
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-0 md:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
          
          {/* Left Column: Video (Full Screen Width on Mobile, Landscape on Desktop/Tablets) */}
          <div className="lg:col-span-6 w-full flex flex-col items-center justify-center order-1">
            <DishVideoReel
              videoSrc={getR2Url('ila-kochi-reel.mp4')}
              onExploreMenu={onExploreMenu}
            />
          </div>

          {/* Right Column: Kochi Maritime & Spice Heritage Editorial Text */}
          <div className="lg:col-span-6 flex flex-col justify-center space-y-6 text-center lg:text-left order-2 px-5 sm:px-8 lg:px-0">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 w-fit mx-auto lg:mx-0">
              <Compass className="w-3.5 h-3.5 text-[#C5A46D]" />
              <span className="text-[11px] font-sans-ui uppercase tracking-[0.25em] text-[#C5A46D] font-semibold">
                Living Maritime Heritage &bull; Spice Gateway
              </span>
            </div>

            <div className="space-y-3">
              <h2 className="font-malayalam text-3xl sm:text-4xl lg:text-[2.65rem] font-bold text-white leading-tight">
                തീരവും രുചിയും ചേരുന്ന കൊച്ചി പാരമ്പര്യം
              </h2>
              <p className="font-serif-display text-xl sm:text-2xl text-[#C5A46D] italic leading-snug">
                From Historic Spice Ports to the Soul of Ila Kochi.
              </p>
            </div>

            <p className="text-sm sm:text-base text-[#DCE8D5]/90 font-light leading-relaxed">
              For centuries, the historic port of Kochi has stood as the gateway where the Arabian Sea meets the world’s richest spice routes. Shaped by seafarers, coastal fishermen, and generations of timeless trade, Kochi’s culinary soul was born on its shores. At Ila Kochi, we honour this living maritime history—bringing the morning’s freshest ocean catch, heirloom coastal spices, and traditional heirloom recipes together on a fresh banana leaf.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
              <button
                onClick={onExploreMenu}
                className="px-7 py-3.5 rounded-full bg-[#C5A46D] hover:bg-[#d8b982] text-black text-xs uppercase tracking-widest font-semibold transition-all duration-300 shadow-[0_10px_30px_rgba(197,164,109,0.3)] hover:scale-105 flex items-center gap-2 cursor-pointer"
              >
                <Utensils className="w-4 h-4" />
                <span>Explore Food Menu</span>
              </button>

              {onOpenReservation && (
                <button
                  onClick={onOpenReservation}
                  className="px-7 py-3.5 rounded-full bg-[#0a0a0a] hover:bg-white/10 text-white border border-white/20 hover:border-[#C5A46D] text-xs uppercase tracking-widest font-medium transition-all duration-300 flex items-center gap-2 cursor-pointer"
                >
                  <Calendar className="w-4 h-4 text-[#C5A46D]" />
                  <span>Reserve a Table</span>
                </button>
              )}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
