import React from 'react';
import { Waves, Sparkles, Flame, Leaf } from 'lucide-react';
import { ScrollReveal } from '../Common/ScrollReveal';

export const BrandIntro: React.FC = () => {
  return (
    <section
      id="intro"
      className="relative py-20 sm:py-24 lg:py-28 bg-gradient-to-b from-[#0B291E] via-[#123D2A] to-[#0B291E] text-[#F8F6EE] overflow-hidden"
    >
      {/* Subtle background flourishes */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#176B45]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#C5A46D]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Editorial Storytelling */}
          <div className="lg:col-span-6 space-y-7">
            <ScrollReveal direction="left" distance={60} duration={1.0}>
              <div className="space-y-3">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#123D2A] border border-[#176B45]/50 text-xs uppercase tracking-[0.2em] text-[#C5A46D] font-sans-ui">
                  <Leaf className="w-3.5 h-3.5 text-[#A8BFA0]" />
                  <span>The Culinary Soul of Kochi</span>
                </div>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif-display font-medium tracking-tight text-[#F8F6EE] leading-tight text-balance">
                  More than a meal. <br />
                  <span className="italic font-editorial text-[#C5A46D]">A living taste of Kerala.</span>
                </h2>
              </div>
            </ScrollReveal>

            <ScrollReveal direction="left" distance={50} delay={0.15}>
              <p className="text-base sm:text-lg text-[#DCE8D5] font-light leading-relaxed">
                At ILA KOCHI, our kitchen is governed by the tides, the soil, and centuries of unhurried coastal wisdom. We believe food is living poetry — best savoured upon freshly cut plantain leaves that gently perfume every grain of steamed Matta rice and every ladle of slow-bubbled fish curry.
              </p>
            </ScrollReveal>

            <ScrollReveal direction="left" distance={40} delay={0.25}>
              <p className="text-sm sm:text-base text-[#A8BFA0] font-light leading-relaxed">
                From our location near Pathadipalam Metro Station, we bridge time-honoured Malabar and Travancore recipes with modern culinary elegance. Every catch arrives fresh from coastal fishing harbours, seasoned with hand-pounded spices, cold-pressed coconut oil, and cooked with genuine love.
              </p>
            </ScrollReveal>

            {/* Three Pillar Cards */}
            <ScrollReveal direction="up" distance={35} delay={0.35}>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-5 border-t border-[#176B45]/40">
                <div className="space-y-1.5 p-3.5 rounded-xl bg-[#0B291E]/60 border border-[#176B45]/40 hover:border-[#C5A46D]/50 transition-colors">
                  <div className="flex items-center gap-2 text-[#C5A46D]">
                    <Waves className="w-4 h-4" />
                    <span className="text-xs font-semibold uppercase tracking-wider">Fresh Catch</span>
                  </div>
                  <p className="text-xs text-[#DCE8D5]/80 leading-relaxed">
                    Daily sea bass, kingfish, prawns, squid, and pearl spot straight from harbor to tawa.
                  </p>
                </div>

                <div className="space-y-1.5 p-3.5 rounded-xl bg-[#0B291E]/60 border border-[#176B45]/40 hover:border-[#C5A46D]/50 transition-colors">
                  <div className="flex items-center gap-2 text-[#C5A46D]">
                    <Flame className="w-4 h-4" />
                    <span className="text-xs font-semibold uppercase tracking-wider">Cast Iron &amp; Clay</span>
                  </div>
                  <p className="text-xs text-[#DCE8D5]/80 leading-relaxed">
                    Traditional clay chattis and heavy cast-iron skillets preserving authentic smoky aroma.
                  </p>
                </div>

                <div className="space-y-1.5 p-3.5 rounded-xl bg-[#0B291E]/60 border border-[#176B45]/40 hover:border-[#C5A46D]/50 transition-colors">
                  <div className="flex items-center gap-2 text-[#C5A46D]">
                    <Sparkles className="w-4 h-4" />
                    <span className="text-xs font-semibold uppercase tracking-wider">Leaf Dining</span>
                  </div>
                  <p className="text-xs text-[#DCE8D5]/80 leading-relaxed">
                    The ancient ritual of eating hot meals off green banana leaves for natural aroma and wellness.
                  </p>
                </div>
              </div>
            </ScrollReveal>
          </div>

          {/* Right Column: Layered Editorial Imagery */}
          <div className="lg:col-span-6 relative">
            <ScrollReveal direction="right" distance={60} duration={1.0}>
              <div className="relative mx-auto max-w-md lg:max-w-none">
                {/* Primary Image: Seafood Sadhya / Feast on Leaf */}
                <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-[#176B45]/60 aspect-[4/3] group">
                  <img
                    src="https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?auto=format&fit=crop&w=1000&q=80"
                    alt="Authentic Kerala Seafood Sadhya Meal on Green Banana Leaf"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
                    decoding="async"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0B291E]/90 via-black/20 to-transparent" />
                  <div className="absolute bottom-5 left-5 right-5 text-xs text-[#F8F6EE]">
                    <span className="uppercase tracking-widest text-[#C5A46D] text-[10px] block font-mono">
                      Traditional Presentation
                    </span>
                    <p className="font-editorial text-base sm:text-lg italic mt-0.5">
                      Steamed Matta rice, fish curry gravy, thoran, and roasted accompaniments on fresh leaf.
                    </p>
                  </div>
                </div>

                {/* Contained Accent Card: Tawa Fry (Safe positioning without overflow) */}
                <div className="absolute -bottom-6 left-4 sm:left-6 w-48 sm:w-56 rounded-2xl overflow-hidden shadow-2xl border border-[#C5A46D]/50 bg-[#123D2A] p-2 backdrop-blur-md hidden sm:block">
                  <div className="relative rounded-xl overflow-hidden aspect-[4/3]">
                    <img
                      src="https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=500&q=80"
                      alt="Kerala Style Fish Tawa Fry with Curry Leaves"
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                    <div className="absolute top-1.5 right-1.5 px-2 py-0.5 rounded bg-[#0B291E]/80 text-[10px] text-[#C5A46D] font-mono">
                      Tawa Fry
                    </div>
                  </div>
                  <div className="pt-2 px-1 text-left">
                    <span className="text-xs font-serif-display font-medium text-[#F8F6EE] block">
                      Kalanji &amp; Hamur Sizzle
                    </span>
                    <span className="text-[10px] text-[#A8BFA0] uppercase tracking-wider block">
                      With fresh curry leaves
                    </span>
                  </div>
                </div>

                {/* Cultural Quote Floating Badge */}
                <div className="absolute -top-5 right-3 sm:right-5 p-3.5 rounded-2xl bg-[#0B291E]/95 border border-[#176B45]/80 shadow-xl backdrop-blur-md max-w-[13rem] text-right">
                  <span className="text-lg font-serif-display text-[#C5A46D] block leading-tight">
                    "ഇലയിൽ വിളമ്പിയ സ്നേഹം"
                  </span>
                  <span className="text-[10px] text-[#DCE8D5]/70 italic block mt-1">
                    "Love served upon the leaf — the eternal heart of Kerala dining."
                  </span>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </div>
    </section>
  );
};
