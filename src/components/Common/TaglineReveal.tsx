import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface TaglineRevealProps {
  phrase?: string;
  subphrase?: string;
}

export const TaglineReveal: React.FC<TaglineRevealProps> = ({
  phrase = 'Where the ancient warmth of Kerala dining meets the daily fresh catch of the Arabian Sea.',
  subphrase = 'Every dish is crafted with stone ground spices, cold pressed coconut oil, and served steaming upon living plantain leaves.',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const wordsRef = useRef<HTMLSpanElement[]>([]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Check for user's reduced motion preference (B11 accessibility rule)
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      wordsRef.current.forEach((word) => {
        if (word) word.style.opacity = '1';
      });
      return;
    }

    const ctx = gsap.context(() => {
      // Word by word scroll activation on the B7 base curve
      wordsRef.current.forEach((word) => {
        if (!word) return;
        gsap.fromTo(
          word,
          { opacity: 0.22, y: 10 },
          {
            opacity: 1,
            y: 0,
            duration: 0.5,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: word,
              start: 'top 85%',
              end: 'top 55%',
              scrub: 0.5,
            },
          }
        );
      });
    }, container);

    return () => ctx.revert();
  }, []);

  const phraseWords = phrase.split(' ');
  const subphraseWords = subphrase.split(' ');

  return (
    <section
      ref={containerRef}
      className="py-20 sm:py-24 lg:py-28 px-4 sm:px-6 lg:px-8 bg-[#0B291E] border-y border-[#176B45]/30 relative overflow-hidden select-none"
      aria-label="Core Brand Tagline"
    >
      <div className="max-w-5xl mx-auto text-center space-y-6">
        {/* Subtle Pill */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#123D2A] border border-[#176B45]/50 text-xs font-sans-ui uppercase tracking-[0.2em] text-[#C5A46D]">
          <span>The Ila Philosophy</span>
        </div>

        {/* Primary Animated Heading (B11 word-by-word reveal) */}
        <h2 className="text-2xl sm:text-4xl md:text-5xl font-serif-display font-medium tracking-tight text-[#F8F6EE] leading-[1.25] text-balance">
          {phraseWords.map((word, idx) => (
            <span
              key={idx}
              ref={(el) => {
                if (el) wordsRef.current[idx] = el;
              }}
              className="inline-block mx-1 sm:mx-1.5 opacity-20 will-change-transform"
            >
              {word}
            </span>
          ))}
        </h2>

        {/* Supporting Narrative */}
        <p className="text-sm sm:text-base md:text-lg text-[#DCE8D5]/90 font-light max-w-2xl mx-auto leading-relaxed text-pretty pt-2">
          {subphraseWords.map((word, idx) => {
            const overallIndex = phraseWords.length + idx;
            return (
              <span
                key={overallIndex}
                ref={(el) => {
                  if (el) wordsRef.current[overallIndex] = el;
                }}
                className="inline-block mx-0.5 sm:mx-1 opacity-20 will-change-transform"
              >
                {word}
              </span>
            );
          })}
        </p>
      </div>
    </section>
  );
};
