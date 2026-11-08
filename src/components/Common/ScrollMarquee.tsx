import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface ScrollMarqueeProps {
  textTop?: string;
  textBottom?: string;
  speed?: number;
}

export const ScrollMarquee: React.FC<ScrollMarqueeProps> = ({
  textTop = 'AUTHENTIC KERALA SEAFOOD • BANANA LEAF DINING • FRESH HARBOUR CATCH • ILA KOCHI •',
  textBottom = 'ഇല കൊച്ചി • ROOTED IN NATURE • INSPIRED BY THE COAST • THE ART OF COASTAL COOKING •',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const track1Ref = useRef<HTMLDivElement>(null);
  const track2Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const track1 = track1Ref.current;
    const track2 = track2Ref.current;

    if (!container || !track1 || !track2) return;

    // ScrollTrigger scrub to move tracks horizontally on scroll like Paragon
    const ctx = gsap.context(() => {
      // Top track moves to the left as you scroll down
      gsap.to(track1, {
        xPercent: -25,
        ease: 'none',
        scrollTrigger: {
          trigger: container,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 0.8,
        },
      });

      // Bottom track moves to the right in opposite direction as you scroll down
      gsap.to(track2, {
        xPercent: 25,
        ease: 'none',
        scrollTrigger: {
          trigger: container,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 0.8,
        },
      });
    }, container);

    return () => ctx.revert();
  }, []);

  // Repeat text to make seamless infinite ribbon
  const repeatedTop = Array(4).fill(textTop).join(' ');
  const repeatedBottom = Array(4).fill(textBottom).join(' ');

  return (
    <div
      ref={containerRef}
      className="relative py-12 md:py-16 overflow-hidden bg-[#0B291E] border-y border-[#176B45]/30 select-none z-10 pointer-events-none"
      aria-hidden="true"
    >
      {/* Subtle background glow */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#0B291E] via-transparent to-[#0B291E] z-10 pointer-events-none" />

      {/* Track 1: Gliding Left */}
      <div className="flex whitespace-nowrap mb-3 will-change-transform">
        <div
          ref={track1Ref}
          className="text-4xl sm:text-6xl md:text-7xl font-serif-display font-medium tracking-[0.15em] uppercase text-[#F8F6EE]/15 hover:text-[#F8F6EE]/30 transition-colors whitespace-nowrap"
        >
          {repeatedTop}
        </div>
      </div>

      {/* Track 2: Gliding Right (Opposite Direction) */}
      <div className="flex whitespace-nowrap will-change-transform">
        <div
          ref={track2Ref}
          className="text-3xl sm:text-5xl md:text-6xl font-serif-display italic tracking-[0.18em] text-[#C5A46D]/25 whitespace-nowrap"
          style={{ transform: 'translateX(-30%)' }}
        >
          {repeatedBottom}
        </div>
      </div>
    </div>
  );
};

