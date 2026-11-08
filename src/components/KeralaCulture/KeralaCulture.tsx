import React from 'react';
import { Leaf, Award, Waves, Sun } from 'lucide-react';
import { ScrollReveal } from '../Common/ScrollReveal';

export const KeralaCulture: React.FC = () => {
  const traditions = [
    {
      title: 'The Banana Leaf Ritual',
      malayalam: 'വാഴയിലയിൽ ഊണ്',
      desc: 'Dining on a plantain leaf is an ancient culinary art. Steaming red Matta rice releases natural plant wax, infusing each bite with delicate freshness and antioxidants.',
      icon: Leaf,
      direction: 'left' as const,
    },
    {
      title: 'Kudampuli & Clay Pots',
      malayalam: 'മൺചട്ടിയിലെ മീൻ കറി',
      desc: 'Authentic Kerala fish curries must breathe inside unglazed earthenware chattis, simmered slowly with smoked Malabar tamarind (Kudampuli) that lends its deep tangy soul.',
      icon: Sun,
      direction: 'left' as const,
    },
    {
      title: 'Wood-Pressed Coconut Oil',
      malayalam: 'വെളിച്ചെണ്ണയുടെ മണം',
      desc: 'Freshly grated coconut roasted to deep mahogany, cold-pressed golden coconut oil, and hand-plucked green curry leaves form our irreplicable culinary signature.',
      icon: Award,
      direction: 'right' as const,
    },
    {
      title: 'The Daily Harbor Catch',
      malayalam: 'തീരദേശത്തിൻ്റെ രുചി',
      desc: 'From Kalanji (Barramundi) and Hamur to Karimeen and juicy ocean tiger prawns, our dishes reflect the rich biodiversity of God’s Own Country.',
      icon: Waves,
      direction: 'right' as const,
    },
  ];

  return (
    <section id="culture" className="relative py-20 sm:py-24 lg:py-28 bg-[#123D2A] text-[#F8F6EE] overflow-hidden">
      {/* Background imagery subtle overlay */}
      <div
        className="absolute inset-0 opacity-10 bg-center bg-cover pointer-events-none mix-blend-overlay"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1600&q=80')`,
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <ScrollReveal direction="up" distance={40}>
          <div className="text-center max-w-2xl mx-auto space-y-3 mb-12 sm:mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0B291E] border border-[#176B45]/50 text-xs uppercase tracking-[0.2em] text-[#C5A46D] font-sans-ui">
              <Leaf className="w-3.5 h-3.5 text-[#A8BFA0]" />
              <span>Living Heritage</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif-display font-medium tracking-tight text-[#F8F6EE] leading-tight text-balance">
              The ritual of Kerala dining.
            </h2>
            <p className="text-sm sm:text-base text-[#DCE8D5] font-light leading-relaxed text-pretty">
              Where ancestral techniques meet contemporary coastal aesthetics. An unhurried celebration of natural textures, earthy aromas, and the timeless bounty of the Arabian Sea.
            </p>
          </div>
        </ScrollReveal>

        {/* 4 Cultural Pillars Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
          {traditions.map((item, index) => {
            const Icon = item.icon;
            return (
              <ScrollReveal
                key={index}
                direction={item.direction}
                distance={45}
                delay={index * 0.1}
                className="h-full"
              >
                <div className="group p-6 sm:p-7 rounded-3xl bg-[#0B291E]/80 border border-[#176B45]/50 hover:border-[#C5A46D]/60 transition-all duration-300 hover:-translate-y-1 shadow-xl flex flex-col justify-between h-full">
                  <div className="space-y-4">
                    <div className="w-12 h-12 rounded-2xl bg-[#123D2A] border border-[#176B45] flex items-center justify-center text-[#C5A46D] group-hover:scale-105 transition-transform shadow-inner">
                      <Icon className="w-5 h-5" />
                    </div>

                    <div className="space-y-0.5">
                      <h3 className="text-lg font-serif-display font-medium text-[#F8F6EE]">
                        {item.title}
                      </h3>
                      <span className="text-xs text-[#C5A46D] font-sans-ui block">
                        {item.malayalam}
                      </span>
                    </div>

                    <p className="text-xs sm:text-sm text-[#DCE8D5]/80 font-light leading-relaxed">
                      {item.desc}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-[#176B45]/30 flex items-center justify-between text-[11px] tracking-wider text-[#A8BFA0] uppercase">
                    <span>Tradition 0{index + 1}</span>
                    <span className="text-[#C5A46D]">✦</span>
                  </div>
                </div>
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
};
