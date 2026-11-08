import React, { useState } from 'react';
import { menuItems, MenuItem } from '../../data/menuData';
import { Flame, Sparkles, Leaf, ArrowRight, Waves } from 'lucide-react';
import { ScrollReveal } from '../Common/ScrollReveal';

interface SignatureDishesProps {
  onSelectDish?: (dish: MenuItem) => void;
}

export const SignatureDishes: React.FC<SignatureDishesProps> = ({ onSelectDish }) => {
  // Select key signature dishes
  const karimeen = menuItems.find((d) => d.id === 'karimeen-pollichathu') || menuItems[2];
  const kalanji = menuItems.find((d) => d.id === 'kalanji-tawa-fry') || menuItems[0];
  const hamur = menuItems.find((d) => d.id === 'hamur-tawa-fry') || menuItems[1];
  const chemmeen = menuItems.find((d) => d.id === 'chemmeen-ghee-roast') || menuItems[3];
  const koonthal = menuItems.find((d) => d.id === 'koonthal-ghee-roast') || menuItems[5];

  // Hero toggle between Karimeen and Kalanji
  const [activeHeroId, setActiveHeroId] = useState<string>('karimeen-pollichathu');
  const activeHeroDish = activeHeroId === 'kalanji-tawa-fry' ? kalanji : karimeen;

  const sideDishes = [
    activeHeroId === 'kalanji-tawa-fry' ? karimeen : kalanji,
    hamur,
    chemmeen,
    koonthal,
  ];

  return (
    <section id="signatures" className="relative py-20 sm:py-24 lg:py-28 bg-[#123D2A] text-[#F8F6EE] overflow-hidden">
      {/* Background Malayalam Calligraphy Watermark */}
      <div className="absolute -top-10 right-8 text-[16vw] font-serif-display text-[#176B45]/10 select-none pointer-events-none leading-none">
        തീരം
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header: Left Info + Right Switcher Tabs */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 sm:mb-16 gap-6">
          <ScrollReveal direction="left" distance={60} duration={1.0}>
            <div className="space-y-3 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0B291E] border border-[#176B45]/50 text-xs uppercase tracking-[0.2em] text-[#C5A46D] font-sans-ui">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Harbour to Hearth</span>
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif-display tracking-tight text-[#F8F6EE] leading-tight text-balance">
                The essence of the coast.
              </h2>
              <p className="text-sm sm:text-base text-[#DCE8D5] font-light leading-relaxed text-pretty">
                Every morning, wild catch arrives from local Kochi fishing boats. By noon and night, our heavy cast-iron tawas and clay chattis sizzle with cold-pressed coconut oil, charred banana leaves, and stone-ground spices.
              </p>
            </div>
          </ScrollReveal>

          {/* Quick Hero Switcher Tabs */}
          <ScrollReveal direction="right" distance={45} delay={0.2}>
            <div className="flex items-center gap-1.5 p-1.5 rounded-full bg-[#0B291E]/90 border border-[#176B45]/60 self-start md:self-end shadow-lg">
              <button
                onClick={() => setActiveHeroId('karimeen-pollichathu')}
                className={`px-4 py-2 rounded-full text-xs font-sans-ui uppercase tracking-wider transition-all cursor-pointer ${
                  activeHeroId === 'karimeen-pollichathu'
                    ? 'bg-[#C5A46D] text-[#0B291E] font-semibold shadow-md'
                    : 'text-[#DCE8D5] hover:text-[#F8F6EE]'
                }`}
              >
                Pearl Spot &bull; Pollichathu
              </button>
              <button
                onClick={() => setActiveHeroId('kalanji-tawa-fry')}
                className={`px-4 py-2 rounded-full text-xs font-sans-ui uppercase tracking-wider transition-all cursor-pointer ${
                  activeHeroId === 'kalanji-tawa-fry'
                    ? 'bg-[#C5A46D] text-[#0B291E] font-semibold shadow-md'
                    : 'text-[#DCE8D5] hover:text-[#F8F6EE]'
                }`}
              >
                Kalanji &bull; Tawa Fry
              </button>
            </div>
          </ScrollReveal>
        </div>

        {/* 7:5 Masterpiece Asymmetrical Editorial Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch">
          {/* Main Hero Spotlight (7 Columns) */}
          <div className="lg:col-span-7 h-full">
            <ScrollReveal direction="left" distance={60} duration={1.0} className="h-full">
              <div
                onClick={() => onSelectDish && onSelectDish(activeHeroDish)}
                className="group relative rounded-3xl overflow-hidden bg-[#0B291E] border border-[#176B45]/60 hover:border-[#C5A46D]/80 transition-all duration-500 shadow-2xl flex flex-col justify-between cursor-pointer h-full"
              >
                {/* Visual Header & Image */}
                <div className="relative aspect-[16/10] sm:aspect-[16/11] w-full overflow-hidden">
                  <img
                    src={activeHeroDish.image}
                    alt={activeHeroDish.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0B291E] via-[#0B291E]/30 to-black/30" />

                  {/* Badges Overlay */}
                  <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                    <span className="px-3.5 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider bg-[#0B291E]/90 text-[#C5A46D] border border-[#C5A46D]/40 backdrop-blur-md">
                      {activeHeroDish.badge || 'Chef Signature'}
                    </span>
                    <span className="px-4 py-1.5 rounded-full text-sm font-mono font-bold bg-[#176B45]/90 text-[#F8F6EE] border border-[#A8BFA0]/40 backdrop-blur-sm shadow-lg">
                      {activeHeroDish.price}
                    </span>
                  </div>

                  {/* Bottom Tag over Image */}
                  <div className="absolute bottom-4 left-5 right-5 sm:left-6 sm:right-6">
                    <span className="text-[11px] font-mono uppercase tracking-[0.25em] text-[#C5A46D] block">
                      Kerala Hearth Tradition
                    </span>
                    <h3 className="text-2xl sm:text-3xl lg:text-4xl font-serif-display font-medium text-[#F8F6EE] group-hover:text-[#C5A46D] transition-colors leading-tight">
                      {activeHeroDish.name}
                    </h3>
                    {activeHeroDish.malayalamName && (
                      <span className="text-sm sm:text-base text-[#A8BFA0] font-sans-ui block mt-1">
                        {activeHeroDish.malayalamName}
                      </span>
                    )}
                  </div>
                </div>

                {/* Editorial Narrative & Specs */}
                <div className="p-5 sm:p-7 space-y-5 flex-1 flex flex-col justify-between">
                  <p className="text-sm sm:text-base text-[#DCE8D5]/90 font-light leading-relaxed">
                    {activeHeroDish.description}
                  </p>

                  {/* Specs & Click Cue */}
                  <div className="pt-4 border-t border-[#176B45]/30 flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-4 text-xs text-[#A8BFA0]">
                      <div className="flex items-center gap-1.5">
                        <Flame className="w-4 h-4 text-[#C5A46D]" />
                        <span>Spice Level:</span>
                        <span className="text-[#C5A46D] font-mono">
                          {'★'.repeat(activeHeroDish.spiceLevel || 2)}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <Leaf className="w-4 h-4 text-[#A8BFA0]" />
                        <span className="capitalize">{activeHeroDish.dietary}</span>
                      </div>
                    </div>

                    <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#C5A46D] group-hover:translate-x-1 transition-transform">
                      <span>View Details &amp; Order</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>

          {/* Secondary Signatures Stack (5 Columns) */}
          <div className="lg:col-span-5 flex flex-col justify-between gap-3.5">
            {sideDishes.map((dish, idx) => (
              <ScrollReveal
                key={dish.id}
                direction="right"
                distance={50}
                delay={idx * 0.1}
                duration={0.8}
                className="flex-1"
              >
                <div
                  onClick={() => onSelectDish && onSelectDish(dish)}
                  className="group relative h-full rounded-2xl overflow-hidden bg-[#0B291E]/90 border border-[#176B45]/50 hover:border-[#C5A46D]/70 p-3.5 sm:p-4 transition-all duration-300 hover:-translate-y-0.5 shadow-xl flex items-center gap-3.5 sm:gap-4 cursor-pointer"
                >
                  {/* Thumbnail */}
                  <div className="relative w-20 sm:w-24 h-20 sm:h-24 rounded-xl overflow-hidden flex-shrink-0">
                    <img
                      src={dish.image}
                      alt={dish.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0B291E]/60 to-transparent" />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-[#C5A46D] block truncate">
                        {dish.badge || 'Coastal Specialty'}
                      </span>
                      <span className="text-xs font-mono font-semibold text-[#F8F6EE] px-2 py-0.5 rounded bg-[#176B45]/80 border border-[#A8BFA0]/30 flex-shrink-0">
                        {dish.price}
                      </span>
                    </div>

                    <h4 className="text-base font-serif-display font-medium text-[#F8F6EE] group-hover:text-[#C5A46D] transition-colors truncate">
                      {dish.name}
                    </h4>

                    {dish.malayalamName && (
                      <span className="text-[11px] text-[#A8BFA0] font-sans-ui block truncate">
                        {dish.malayalamName}
                      </span>
                    )}

                    <p className="text-xs text-[#DCE8D5]/70 line-clamp-1 font-light">
                      {dish.description}
                    </p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>

        {/* 3-Column Quality Assurance Footer Strip */}
        <div className="mt-12 sm:mt-16 pt-8 border-t border-[#176B45]/30 grid grid-cols-1 md:grid-cols-3 gap-5 text-xs text-[#DCE8D5]">
          <ScrollReveal direction="left" distance={40} delay={0.1}>
            <div className="flex items-start gap-3 p-4 rounded-xl bg-[#0B291E]/60 border border-[#176B45]/40 h-full">
              <Waves className="w-5 h-5 text-[#C5A46D] flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-[#F8F6EE] block uppercase tracking-wider text-[11px]">
                  Daily Harbour Catch
                </span>
                <p className="text-[#A8BFA0] mt-0.5 font-light leading-relaxed">
                  Direct from Munambam and Fort Kochi landing centers. Never frozen.
                </p>
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal direction="up" distance={40} delay={0.2}>
            <div className="flex items-start gap-3 p-4 rounded-xl bg-[#0B291E]/60 border border-[#176B45]/40 h-full">
              <Flame className="w-5 h-5 text-[#C5A46D] flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-[#F8F6EE] block uppercase tracking-wider text-[11px]">
                  Wood-Pressed Coconut Oil
                </span>
                <p className="text-[#A8BFA0] mt-0.5 font-light leading-relaxed">
                  Cooked exclusively in pure cold-pressed oil and roasted Tellicherry pepper.
                </p>
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal direction="right" distance={40} delay={0.3}>
            <div className="flex items-start gap-3 p-4 rounded-xl bg-[#0B291E]/60 border border-[#176B45]/40 h-full">
              <Leaf className="w-5 h-5 text-[#C5A46D] flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-[#F8F6EE] block uppercase tracking-wider text-[11px]">
                  Served on Living Leaf (ഇല)
                </span>
                <p className="text-[#A8BFA0] mt-0.5 font-light leading-relaxed">
                  Hot feasts on fresh plantain leaves for natural aroma and Ayurvedic digestion.
                </p>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
};
