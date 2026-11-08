import React from 'react';
import { Waves, Flame, Leaf, ArrowRight } from 'lucide-react';
import { ScrollReveal } from '../Common/ScrollReveal';

export const HowItWorks: React.FC = () => {
  const steps = [
    {
      step: '01',
      title: 'Dawn Harbour Catch',
      malayalam: 'പുലർച്ചെ എത്തുന്ന മീൻ',
      description: 'Our kitchen selects whole fresh sea bass, reef cod, kingfish, prawns, and squid directly from coastal fishing boats at sunrise.',
      icon: Waves,
    },
    {
      step: '02',
      title: 'Cast Iron & Clay Hearth',
      malayalam: 'മൺചട്ടിയും തവയും',
      description: 'Fish is marinated in stone ground Malabar spices, roasted with crushed pepper, and seared on heavy cast iron in pure coconut oil.',
      icon: Flame,
    },
    {
      step: '03',
      title: 'Served on Living Leaf',
      malayalam: 'വാഴയിലയിൽ ഊണ്',
      description: 'Steaming Kerala Matta rice and hot seafood roasts are arranged on fresh plantain leaves, unlocking authentic natural aroma.',
      icon: Leaf,
    },
  ];

  return (
    <section className="py-20 sm:py-24 lg:py-28 px-4 sm:px-6 lg:px-8 bg-[#0B291E] border-t border-[#176B45]/30 relative overflow-hidden">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <ScrollReveal direction="up" distance={40}>
          <div className="text-center max-w-2xl mx-auto space-y-3 mb-12 sm:mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#123D2A] border border-[#176B45]/50 text-xs uppercase tracking-[0.2em] text-[#C5A46D] font-sans-ui">
              <Leaf className="w-3.5 h-3.5" />
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

        {/* 3 Step Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {steps.map((item, idx) => {
            const Icon = item.icon;
            return (
              <ScrollReveal
                key={idx}
                direction="up"
                distance={45}
                delay={idx * 0.12}
                className="h-full"
              >
                <div className="h-full group p-6 sm:p-8 rounded-3xl bg-[#123D2A]/60 border border-[#176B45]/50 hover:border-[#C5A46D]/60 transition-all duration-300 hover:-translate-y-1 shadow-xl flex flex-col justify-between">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-mono font-bold text-[#C5A46D]">
                        {item.step}
                      </span>
                      <div className="w-12 h-12 rounded-2xl bg-[#0B291E] border border-[#176B45] flex items-center justify-center text-[#C5A46D] group-hover:scale-105 transition-transform shadow-inner">
                        <Icon className="w-5 h-5" />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <h3 className="text-xl font-serif-display font-medium text-[#F8F6EE]">
                        {item.title}
                      </h3>
                      <span className="text-xs text-[#A8BFA0] font-sans-ui block">
                        {item.malayalam}
                      </span>
                    </div>

                    <p className="text-xs sm:text-sm text-[#DCE8D5]/80 font-light leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-[#176B45]/30 flex items-center justify-between text-xs text-[#A8BFA0]">
                    <span>Step {item.step} of 03</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#C5A46D] group-hover:translate-x-1 transition-transform" />
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
