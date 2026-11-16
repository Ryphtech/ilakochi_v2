import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface TaglineRevealProps {
  phrase?: string;
  subphrase?: string;
}

export const TaglineReveal: React.FC<TaglineRevealProps> = ({
  phrase = 'കൊച്ചിയുടെ തനത് രുചിപ്പാരമ്പര്യം വാഴയിലയുടെ നൈർമ്മല്യത്തിൽ വിളമ്പുന്ന ഒരിടം.',
  subphrase = "കല്ലിൽ അരച്ചെടുത്ത മസാലക്കൂട്ടുകളും ശുദ്ധമായ വെളിച്ചെണ്ണയും ചേർത്ത്, പഴമയുടെ തനിമ ഒട്ടും ചോരാതെ 'ഇല കൊച്ചി' നിങ്ങൾക്കായി ഒരുക്കുന്ന തനി നാടൻ വിരുന്ന്.",
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const wordsRef = useRef<HTMLSpanElement[]>([]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Check for user's reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      wordsRef.current.forEach((word) => {
        if (word) word.style.opacity = '1';
      });
      return;
    }

    const ctx = gsap.context(() => {
      // Crisp staggered reveal on scroll that triggers once and stays permanently visible
      const validWords = wordsRef.current.filter(Boolean);
      gsap.fromTo(
        validWords,
        { opacity: 0.25, y: 12 },
        {
          opacity: 1,
          y: 0,
          duration: 0.45,
          stagger: 0.02,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: container,
            start: 'top 85%',
            once: true,
            toggleActions: 'play none none none',
          },
        }
      );
    }, container);

    return () => ctx.revert();
  }, []);

  const phraseWords = phrase.split(' ');
  const subphraseWords = subphrase.split(' ');

  return (
    <section
      ref={containerRef}
      className="py-20 sm:py-24 lg:py-28 px-4 sm:px-6 lg:px-8 bg-[#041a10] border-y border-[#17442a]/60 relative overflow-hidden select-none"
      aria-label="Core Brand Tagline"
    >
      {/* Atmospheric dark botanical green depth & glows */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#03130c] via-[#062417] to-[#03130c] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[44rem] h-[24rem] bg-[#0e3d26]/35 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -top-20 right-10 w-80 h-80 bg-[#164a30]/20 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-5xl mx-auto text-center space-y-6">
        {/* Subtle Pill */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/40 border border-[#A8BFA0]/30 text-xs font-sans-ui uppercase tracking-[0.2em] text-[#C5A46D] backdrop-blur-sm">
          <span>The Ila Philosophy</span>
        </div>

        {/* Primary Animated Heading */}
        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-[2.65rem] font-malayalam font-bold tracking-tight text-white leading-snug sm:leading-tight text-balance">
          {phraseWords.map((word, idx) => (
            <span
              key={idx}
              ref={(el) => {
                if (el) wordsRef.current[idx] = el;
              }}
              className="inline-block mx-1 sm:mx-1.5 will-change-transform"
            >
              {word}
            </span>
          ))}
        </h2>

        {/* Supporting Narrative */}
        <p className="text-base sm:text-lg md:text-xl font-malayalam text-[#DCE8D5] font-light max-w-3xl mx-auto leading-relaxed text-pretty pt-2">
          {subphraseWords.map((word, idx) => {
            const overallIndex = phraseWords.length + idx;
            return (
              <span
                key={overallIndex}
                ref={(el) => {
                  if (el) wordsRef.current[overallIndex] = el;
                }}
                className="inline-block mx-0.5 sm:mx-1 will-change-transform"
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
