import React from 'react';
import { Star, Quote } from 'lucide-react';
import { ScrollReveal } from '../Common/ScrollReveal';

export const ReviewsSection: React.FC = () => {
  const reviews = [
    {
      author: 'Arun K. Pillai',
      role: 'Local Food Enthusiast · Google Review',
      rating: 5,
      dish: 'Kalanji Tawa Fry & Sadhya',
      text: 'The best place near Kalamassery to get authentic Kerala fish meals on a fresh banana leaf. The Kalanji tawa fry was fried crisp with curry leaves and coconut oil — incredible flavour profile!',
    },
    {
      author: 'Sneha Mohan',
      role: 'Dined with Family · Google Review',
      rating: 5,
      dish: 'Chemmeen Ghee Roast & Karimeen',
      text: 'Their Karimeen Pollichathu wrapped in charred banana leaf is an absolute masterpiece. The shallots and kokum masala seeped deep into the fish. Authentic Kochi coastal taste.',
    },
    {
      author: 'Vipin George',
      role: 'Daily Office Luncher · Google Review',
      rating: 5,
      dish: 'Ila Seafood Meals & Koonthal',
      text: 'Right by Metro Pillar 350. The hot Matta rice served on leaf with meen peera, moru, and fish gravy is pure comfort food. Pocket-friendly and super fresh catch every time.',
    },
  ];

  return (
    <section className="py-20 sm:py-24 lg:py-28 px-4 sm:px-6 lg:px-8 bg-[#123D2A] border-t border-[#176B45]/30 relative overflow-hidden">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <ScrollReveal direction="up" distance={40}>
          <div className="text-center max-w-2xl mx-auto space-y-3 mb-12 sm:mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0B291E] border border-[#176B45]/50 text-xs uppercase tracking-[0.2em] text-[#C5A46D] font-sans-ui">
              <Star className="w-3.5 h-3.5 fill-[#C5A46D]" />
              <span>Verified Patron Experiences</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif-display font-medium tracking-tight text-[#F8F6EE] leading-tight text-balance">
              Loved across Kochi.
            </h2>
            <div className="flex items-center justify-center gap-2 pt-1 text-xs text-[#A8BFA0]">
              <div className="flex items-center text-[#C5A46D]">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-current" />
                ))}
              </div>
              <span className="font-semibold text-[#F8F6EE]">4.0 Rating</span>
              <span>&bull;</span>
              <span>Over 700+ Google Reviews</span>
            </div>
          </div>
        </ScrollReveal>

        {/* 3 Review Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {reviews.map((rev, idx) => (
            <ScrollReveal
              key={idx}
              direction={idx === 0 ? 'left' : idx === 2 ? 'right' : 'up'}
              distance={40}
              delay={idx * 0.1}
              className="h-full"
            >
              <div className="h-full p-6 sm:p-7 rounded-3xl bg-[#0B291E]/90 border border-[#176B45]/50 hover:border-[#C5A46D]/60 transition-all duration-300 shadow-xl flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex text-[#C5A46D]">
                      {[...Array(rev.rating)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-current" />
                      ))}
                    </div>
                    <Quote className="w-5 h-5 text-[#176B45]/60" />
                  </div>

                  <p className="text-xs sm:text-sm text-[#DCE8D5]/90 font-light leading-relaxed">
                    "{rev.text}"
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-[#176B45]/30 flex items-center justify-between gap-2">
                  <div>
                    <h4 className="text-sm font-serif-display font-medium text-[#F8F6EE]">
                      {rev.author}
                    </h4>
                    <span className="text-[11px] text-[#A8BFA0] block mt-0.5">
                      {rev.role}
                    </span>
                  </div>

                  <span className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-[#123D2A] border border-[#176B45]/50 text-[#C5A46D] flex-shrink-0">
                    {rev.dish}
                  </span>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
};
