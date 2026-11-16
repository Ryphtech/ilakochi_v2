import React from 'react';
import { Leaf } from 'lucide-react';
import { ScrollReveal } from '../Common/ScrollReveal';
import aboutMainImg from '../../assets/about_main.jpeg';
import aboutSmallImg from '../../assets/about_small.jpeg';

export const BrandIntro: React.FC = () => {
  return (
    <section
      id="about"
      className="relative py-20 sm:py-24 lg:py-28 bg-black text-[#F8F6EE] overflow-hidden"
      aria-label="About Ila Kochi - ഞങ്ങളെക്കുറിച്ച്"
    >
      {/* Subtle background flourishes */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-white/[0.02] rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#C5A46D]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">

          {/* Left Column: About Us Editorial Storytelling */}
          <div className="lg:col-span-6 space-y-7">
            <ScrollReveal direction="left" distance={30}>
              <div className="space-y-3">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs uppercase tracking-[0.2em] text-[#C5A46D] font-sans-ui">
                  <Leaf className="w-3.5 h-3.5 text-[#A8BFA0]" />
                  <span>About Us &bull; ഞങ്ങളെക്കുറിച്ച്</span>
                </div>

                {/* Main Heading */}
                <h2 className="font-malayalam text-4xl sm:text-5xl lg:text-[3.5rem] font-bold tracking-tight text-white leading-tight">
                  ഞങ്ങളെക്കുറിച്ച്
                </h2>

                {/* Sub Heading */}
                <h3 className="font-malayalam text-2xl sm:text-3xl text-[#C5A46D] font-semibold leading-snug">
                  പഴമയുടെ രുചി, പുതുമയോടെ...
                </h3>
              </div>
            </ScrollReveal>

            {/* Paragraph 1: The meaning of ILA */}
            <ScrollReveal direction="left" distance={25} delay={0.08}>
              <p className="text-base sm:text-lg text-[#DCE8D5] font-light leading-relaxed">
                The word &ldquo;ILA&rdquo; (ഇല) is Malayalam for leaf. In Kerala culture, a leaf is not a mere receptacle &mdash; it is an offering of abundance, hospitality, and deep ecological harmony with our coastal wetlands.
              </p>
            </ScrollReveal>

            {/* Paragraph 2: Location & Fresh Catch */}
            <ScrollReveal direction="left" distance={25} delay={0.12}>
              <p className="text-sm sm:text-base text-[#A8BFA0] font-light leading-relaxed">
                When you step into ILA KOCHI at Pathadipalam, you step into an authentic culinary haven where tradition is treated with reverence. Our chefs source locally caught sea bass, grouper, prawns, and sardines directly from coastal boats each morning.
              </p>
            </ScrollReveal>

            {/* Paragraph 3: Uncompromising Tradition & Ingredients */}
            <ScrollReveal direction="left" distance={25} delay={0.16}>
              <p className="text-sm sm:text-base text-[#DCE8D5]/90 font-light leading-relaxed">
                We avoid artificial enhancers and shortcuts. Instead, our flavors stem from stone-ground spices, sun-dried Kodampuli (Malabar tamarind), pure wood-pressed coconut oil, and slow braising in century-old clay chattis.
              </p>
            </ScrollReveal>
          </div>

          {/* Right Column: Layered About Us Imagery */}
          <div className="lg:col-span-6 relative">
            <ScrollReveal direction="right" distance={30}>
              <div className="relative mx-auto max-w-md lg:max-w-none lg:mr-14">

                {/* Larger Image in the back: about_main.jpeg */}
                <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-white/15 aspect-[4/3] group bg-[#0a0a0a]">
                  <img
                    src={aboutMainImg}
                    alt="Ila Kochi Restaurant Storefront - Hand-drawn Architectural Illustration"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 filter contrast-110 brightness-105"
                    loading="lazy"
                    decoding="async"
                  />
                </div>

                {/* Smaller Overlapping Image: about_small.jpeg */}
                <div className="absolute -bottom-6 left-4 sm:left-6 w-48 sm:w-60 rounded-2xl overflow-hidden shadow-2xl border-2 border-[#C5A46D]/60 bg-[#0a0a0a] p-2 backdrop-blur-md hidden sm:block group/small z-10">
                  <div className="relative rounded-xl overflow-hidden aspect-[4/3]">
                    <img
                      src={aboutSmallImg}
                      alt="Authentic Kerala Banana Leaf Dining Feast at Ila Kochi"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover/small:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute top-1.5 right-1.5 px-2 py-0.5 rounded bg-black/80 text-[10px] text-[#C5A46D] font-mono border border-white/10">
                      Leaf Feast
                    </div>
                  </div>
                  <div className="pt-2 px-1 text-left">
                    <span className="text-xs font-serif-display font-medium text-[#F8F6EE] block">
                      Authentic Leaf Meals
                    </span>
                    <span className="text-[10px] text-[#A8BFA0] uppercase tracking-wider block">
                      Steamed Matta &amp; Tawa Fry
                    </span>
                  </div>
                </div>

                {/* Cultural Quote Floating Badge Top-Right (More right & compact/small) */}
                <div className="absolute -top-4 sm:-top-5 -right-3 sm:-right-10 lg:-right-14 z-20 px-3 py-2 sm:px-3.5 sm:py-2.5 rounded-xl bg-[#0a0a0a]/95 border border-[#C5A46D]/35 shadow-xl backdrop-blur-md max-w-[10.5rem] sm:max-w-[12rem] text-right">
                  <span className="text-xs sm:text-sm font-serif-display text-[#C5A46D] block leading-tight font-medium">
                    &ldquo;ഇലയിൽ വിളമ്പിയ സ്നേഹം&rdquo;
                  </span>
                  <span className="text-[9px] sm:text-[10px] text-[#DCE8D5]/75 italic block mt-0.5 leading-snug">
                    Love served upon the leaf &mdash; the eternal heart of Kerala dining.
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
