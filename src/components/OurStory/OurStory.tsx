import React from 'react';
import { Leaf, Compass, Heart } from 'lucide-react';
import { ScrollReveal } from '../Common/ScrollReveal';

export const OurStory: React.FC = () => {
  return (
    <section id="story" className="relative py-20 sm:py-24 lg:py-28 bg-[#0B291E] text-[#F8F6EE] overflow-hidden">
      {/* Background botanical foliage silhouettes */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-96 h-96 bg-[#176B45]/15 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
          {/* Left Column: Visual Leaf Composition */}
          <div className="lg:col-span-5 order-2 lg:order-1 relative">
            <ScrollReveal direction="left" distance={60} duration={1.0}>
              <div className="relative mx-auto max-w-sm lg:max-w-none space-y-4">
                {/* Main Visual Frame */}
                <div className="relative rounded-3xl overflow-hidden border border-[#176B45]/60 shadow-2xl bg-[#123D2A] p-2.5">
                  <div className="aspect-[3/4] rounded-2xl overflow-hidden relative">
                    <img
                      src="https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=900&q=80"
                      alt="Kerala Backwater Coastal Cuisine &amp; Banana Leaf"
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0B291E] via-black/20 to-transparent opacity-80" />
                  </div>

                  {/* Overlaid Botanical Card */}
                  <div className="p-3.5 text-center space-y-0.5">
                    <span className="text-2xl font-serif-display text-[#C5A46D] block">
                      ഇല &middot; Ila
                    </span>
                    <span className="text-xs uppercase tracking-[0.25em] text-[#A8BFA0] block">
                      The Living Leaf
                    </span>
                  </div>
                </div>

                {/* Contained Ayurvedic Wisdom Card */}
                <div className="p-4 rounded-2xl bg-[#123D2A]/90 border border-[#C5A46D]/40 shadow-xl">
                  <div className="flex items-center gap-2 text-[#C5A46D] mb-1.5">
                    <Leaf className="w-4 h-4" />
                    <span className="text-xs uppercase font-sans-ui tracking-wider font-semibold">Ayurvedic Wisdom</span>
                  </div>
                  <p className="text-xs text-[#DCE8D5]/80 leading-relaxed">
                    Hot food activates the polyphenol wax on fresh banana leaves, releasing a delicate aroma while enriching every bite naturally.
                  </p>
                </div>
              </div>
            </ScrollReveal>
          </div>

          {/* Right Column: Editorial Narrative */}
          <div className="lg:col-span-7 order-1 lg:order-2 space-y-7">
            <ScrollReveal direction="right" distance={60} duration={1.0}>
              <div className="space-y-3">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#123D2A] border border-[#176B45]/50 text-xs uppercase tracking-[0.2em] text-[#C5A46D] font-sans-ui">
                  <Leaf className="w-3.5 h-3.5" />
                  <span>Origins &amp; Philosophy</span>
                </div>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif-display font-medium tracking-tight text-[#F8F6EE] leading-tight text-balance">
                  Inspired by nature. <br />
                  <span className="italic font-editorial text-[#C5A46D]">Rooted in Kerala.</span>
                </h2>
              </div>
            </ScrollReveal>

            <ScrollReveal direction="right" distance={45} delay={0.15}>
              <div className="space-y-4 text-sm sm:text-base text-[#DCE8D5] font-light leading-relaxed">
                <p>
                  The word <strong className="text-[#F8F6EE] font-medium font-serif-display">"ILA" (ഇല)</strong> is Malayalam for leaf. In Kerala culture, a leaf is not a mere receptacle — it is an offering of abundance, hospitality, and deep ecological harmony with our coastal wetlands.
                </p>

                <p>
                  When you step into <strong className="text-[#F8F6EE] font-medium">ILA KOCHI</strong> at Pathadipalam, you step into an authentic culinary haven where tradition is treated with reverence. Our chefs source locally caught sea bass, grouper, prawns, and sardines directly from coastal boats each morning.
                </p>

                <p className="text-[#A8BFA0]">
                  We avoid artificial enhancers and shortcuts. Instead, our flavors stem from stone-ground spices, sun-dried Kodampuli (Malabar tamarind), pure wood-pressed coconut oil, and slow braising in century-old clay chattis.
                </p>
              </div>
            </ScrollReveal>

            {/* Core Values Grid */}
            <ScrollReveal direction="up" distance={35} delay={0.3}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-5 border-t border-[#176B45]/40">
                <div className="flex items-start gap-3 p-3.5 rounded-xl bg-[#123D2A]/60 border border-[#176B45]/40 hover:border-[#C5A46D]/50 transition-colors">
                  <div className="p-2 rounded-lg bg-[#0B291E] text-[#C5A46D] border border-[#176B45]/50 flex-shrink-0">
                    <Compass className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs uppercase tracking-wider font-semibold text-[#F8F6EE]">Coastal Authenticity</h4>
                    <p className="text-xs text-[#DCE8D5]/70 mt-1 leading-relaxed">Homestyle recipes rooted in the coastal households of Ernakulam and Alleppey.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3.5 rounded-xl bg-[#123D2A]/60 border border-[#176B45]/40 hover:border-[#C5A46D]/50 transition-colors">
                  <div className="p-2 rounded-lg bg-[#0B291E] text-[#C5A46D] border border-[#176B45]/50 flex-shrink-0">
                    <Heart className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs uppercase tracking-wider font-semibold text-[#F8F6EE]">Warm Hospitality</h4>
                    <p className="text-xs text-[#DCE8D5]/70 mt-1 leading-relaxed">Every guest is welcomed with attentive care, generous servings, and hot hospitality.</p>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </div>
    </section>
  );
};
