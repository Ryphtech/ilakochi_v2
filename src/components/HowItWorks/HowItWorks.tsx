import React, { useState, useEffect, useRef } from 'react';
import { Leaf, ChevronLeft, ChevronRight } from 'lucide-react';
import { ScrollReveal } from '../Common/ScrollReveal';

import dawnHarbourImg from '../../assets/Dawn Harbour Catch.jpg';
import castIronImg from '../../assets/Cast Iron & Clay Hearth.jpg';
import livingLeafImg from '../../assets/Served on Living Leaf.jpg';

interface JourneySlide {
  step: string;
  title: string;
  malayalamTitle: string;
  para: string;
  image: string;
}

export const HowItWorks: React.FC = () => {
  const slides: JourneySlide[] = [
    {
      step: '01',
      title: 'Dawn Harbour Catch',
      malayalamTitle: 'പുലർച്ചെ എത്തുന്ന മീൻ',
      para: 'പുലർച്ചെ കൊച്ചി തീരത്തെത്തുന്ന ഏറ്റവും പുതിയ മീനുകൾ, കടലിന്റെ തനത് രുചിയും പുതുമയും ഒട്ടും ചോരാതെ നേരിട്ട് ഞങ്ങളുടെ അടുക്കളയിലേക്ക് എത്തുന്നു.',
      image: dawnHarbourImg,
    },
    {
      step: '02',
      title: 'Cast Iron & Clay Hearth',
      malayalamTitle: 'മൺചട്ടിയും തവയും',
      para: 'പാരമ്പര്യത്തിന്റെ തനിമ നിലനിർത്തിക്കൊണ്ട്, മൺചട്ടികളിലും ഇരുമ്പുചട്ടികളിലും കല്ലിൽ അരച്ചെടുത്ത മസാലക്കൂട്ടുകൾ ചേർത്താണ് ഞങ്ങൾ ഓരോ വിഭവവും പാകം ചെയ്യുന്നത്.',
      image: castIronImg,
    },
    {
      step: '03',
      title: 'Served on Living Leaf',
      malayalamTitle: 'വാഴയിലയിൽ ഊണ്',
      para: 'കേരളീയ ആതിഥ്യമര്യാദയുടെ പ്രതീകമായ പച്ച വാഴയിലയിൽ, ആവി പറക്കുന്ന വിഭവങ്ങൾ അതിന്റെ തനത് സുഗന്ധത്തോടും രുചിയോടും കൂടി ഞങ്ങൾ വിളമ്പുന്നു.',
      image: livingLeafImg,
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const touchStartX = useRef<number | null>(null);

  // Auto-advance every 5 seconds with crossfade
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [currentIndex, slides.length]);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEndX;

    if (diff > 50) {
      handleNext();
    } else if (diff < -50) {
      handlePrev();
    }
    touchStartX.current = null;
  };

  return (
    <section
      id="journey"
      className="py-16 sm:py-20 lg:py-24 bg-black border-t border-white/10 relative overflow-hidden select-none"
      aria-label="Harbour to Plate Journey"
    >
      {/* Section Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10 sm:mb-14">
        <ScrollReveal direction="up" distance={30}>
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/5 border border-white/10 text-xs uppercase tracking-[0.2em] text-[#C5A46D] font-sans-ui">
              <Leaf className="w-3.5 h-3.5 text-[#C5A46D]" />
              <span>Harbour to Plate Journey</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif-display font-medium tracking-tight text-[#F8F6EE] leading-tight text-balance">
              How the feast unfolds.
            </h2>
            <p className="text-sm sm:text-base text-[#DCE8D5]/80 font-light leading-relaxed text-pretty">
              Three unhurried steps from the morning tides of Kochi to your living banana leaf table.
            </p>
          </div>
        </ScrollReveal>
      </div>

      {/* Full-Width Carousel Stage */}
      <div
        className="relative w-full aspect-[4/5] sm:aspect-[16/10] lg:aspect-[21/9] min-h-[460px] sm:min-h-[520px] lg:min-h-[580px] overflow-hidden bg-black border-y border-white/10"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* Slides with 5-second fade-out/fade-in transitions */}
        {slides.map((slide, index) => {
          const isActive = index === currentIndex;
          return (
            <div
              key={slide.title}
              className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out ${
                isActive ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
              }`}
              aria-hidden={!isActive}
            >
              {/* Background Image */}
              <img
                src={slide.image}
                alt={slide.title}
                className={`w-full h-full object-cover object-center transition-transform duration-[6000ms] ease-out ${
                  isActive ? 'scale-105' : 'scale-100'
                }`}
                loading={index === 0 ? 'eager' : 'lazy'}
                decoding="async"
              />

              {/* Cinematic Vignettes for Legibility */}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent pointer-events-none" />
              <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/25 to-transparent pointer-events-none" />

              {/* Content Positioned at Bottom Left */}
              <div className="absolute bottom-0 inset-x-0 p-6 sm:p-10 lg:p-14 z-20">
                <div className="max-w-4xl space-y-3 sm:space-y-4 text-left">
                  {/* Step Pill */}
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/75 border border-[#C5A46D]/40 backdrop-blur-md text-[11px] font-mono uppercase tracking-widest text-[#C5A46D]">
                    <span>Step {slide.step} of 03</span>
                    <span className="text-white/40">&bull;</span>
                    <span className="font-malayalam text-white/90 font-sans-ui">
                      {slide.malayalamTitle}
                    </span>
                  </div>

                  {/* Heading Bottom Left */}
                  <h3 className="font-serif-display text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-medium text-white tracking-tight leading-tight">
                    {slide.title}
                  </h3>

                  {/* Paragraph Followed Directly Below Heading */}
                  <p className="font-malayalam text-sm sm:text-base md:text-lg text-[#DCE8D5] font-light leading-relaxed max-w-3xl drop-shadow-[0_2px_8px_rgba(0,0,0,0.85)]">
                    {slide.para}
                  </p>
                </div>
              </div>
            </div>
          );
        })}

        {/* Carousel Navigation Arrows */}
        <button
          onClick={handlePrev}
          className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 z-30 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/60 hover:bg-black/90 border border-white/20 hover:border-[#C5A46D] text-white flex items-center justify-center backdrop-blur-md transition-all cursor-pointer opacity-75 hover:opacity-100 hover:scale-105"
          aria-label="Previous step"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <button
          onClick={handleNext}
          className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 z-30 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/60 hover:bg-black/90 border border-white/20 hover:border-[#C5A46D] text-white flex items-center justify-center backdrop-blur-md transition-all cursor-pointer opacity-75 hover:opacity-100 hover:scale-105"
          aria-label="Next step"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* Carousel Progress Indicators (Bottom Right) */}
        <div className="absolute bottom-6 right-6 sm:bottom-10 sm:right-10 z-30 flex items-center gap-2">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`h-1.5 rounded-full transition-all duration-500 cursor-pointer ${
                idx === currentIndex
                  ? 'w-8 bg-[#C5A46D]'
                  : 'w-2 bg-white/30 hover:bg-white/60'
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
