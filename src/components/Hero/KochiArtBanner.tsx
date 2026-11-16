import React from 'react';
import kochiArt from '../../assets/kochi-art.png';

export const KochiArtBanner: React.FC = () => {
  return (
    <section
      id="kochi-art"
      className="relative w-full max-w-full bg-black border-y border-white/10 overflow-hidden select-none py-6 sm:py-10 md:py-14"
      aria-label="Historic Kochi Architectural Line Art Banner"
    >
      {/* Subtle warm ambient glow behind the sketch */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-32 bg-[#C5A46D]/5 rounded-full blur-3xl pointer-events-none -z-0" />

      {/* Pure Full-Width Line Art Image with Zero Container */}
      <div className="w-full max-w-full overflow-hidden">
        <img
          src={kochiArt}
          alt="Historic Port of Kochi - Hand-drawn Heritage Architectural Line Art"
          className="w-full max-w-full h-auto block object-cover filter contrast-125 brightness-110 drop-shadow-[0_10px_30px_rgba(0,0,0,0.85)] pointer-events-none"
          loading="lazy"
          decoding="async"
        />
      </div>
    </section>
  );
};
