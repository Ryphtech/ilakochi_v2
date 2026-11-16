import React from 'react';
import { Sparkles, Utensils, Calendar } from 'lucide-react';
import pazhayaSoruImg from '../../assets/pazhaya_soru.webp';
import { ScrollReveal } from '../Common/ScrollReveal';

interface PazhamkanjiSectionProps {
  onExploreMenu: () => void;
  onOpenReservation?: () => void;
}

export const PazhamkanjiSection: React.FC<PazhamkanjiSectionProps> = ({
  onExploreMenu,
  onOpenReservation,
}) => {
  return (
    <section
      id="pazhamkanji"
      className="relative w-full py-16 sm:py-24 lg:py-28 bg-black border-t border-b border-white/10 overflow-hidden"
      aria-label="പഴങ്കഞ്ഞി പെരുമ - Traditional Kerala Fermented Rice Feast"
    >
      {/* Ambient background glow */}
      <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-96 h-96 bg-[#C5A46D]/5 rounded-full blur-3xl pointer-events-none -z-0" />
      <div className="absolute -bottom-20 left-10 w-[30rem] h-[30rem] bg-white/[0.02] rounded-full blur-3xl pointer-events-none -z-0" />

      {/* Subtle Malayalam calligraphy watermark */}
      <div className="absolute left-4 top-1/2 -translate-y-1/2 select-none pointer-events-none opacity-[0.02] text-[18vw] font-serif-display leading-none text-white">
        കഞ്ഞി
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
          
          {/* Left Column: Text Content */}
          <div className="lg:col-span-7 flex flex-col justify-center space-y-6 text-center lg:text-left order-2 lg:order-1">
            <ScrollReveal direction="left" distance={30}>
              <div className="space-y-6">
                {/* Traditional Tag */}
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 w-fit mx-auto lg:mx-0">
                  <Sparkles className="w-3.5 h-3.5 text-[#C5A46D]" />
                  <span className="text-[11px] font-sans-ui uppercase tracking-[0.25em] text-[#C5A46D] font-semibold">
                    Traditional Comfort Feast &bull; Nostalgic Heritage
                  </span>
                </div>

                {/* Main Heading */}
                <h2 className="font-malayalam text-4xl sm:text-5xl lg:text-[3.75rem] font-black text-white leading-[1.15] tracking-tight">
                  പഴങ്കഞ്ഞി പെരുമ
                </h2>

                {/* Subheading */}
                <h3 className="font-malayalam text-2xl sm:text-3xl lg:text-[2.1rem] font-bold text-[#C5A46D] leading-snug">
                  ഓർമ്മകളിലേക്ക് ഒരു തിരിച്ചുപോക്ക്...
                </h3>

                {/* Main Sentence */}
                <p className="font-malayalam text-lg sm:text-xl lg:text-2xl text-[#DCE8D5] font-medium leading-relaxed">
                  പഴമയുടെ രുചിയും തനിമയും നിറഞ്ഞ നമ്മുടെ സ്വന്തം പഴങ്കഞ്ഞി.
                </p>

                {/* Traditional Side Accompaniment Badges */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                  <div className="p-3.5 rounded-2xl bg-[#0a0a0a] border border-white/10 text-center lg:text-left">
                    <span className="font-malayalam text-xs font-semibold text-white block">ചെറിയുള്ളിയും കാന്താരിയും</span>
                    <span className="text-[10px] text-[#A8BFA0] mt-0.5 block">Crushed shallots &amp; fiery chillies</span>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-[#0a0a0a] border border-white/10 text-center lg:text-left">
                    <span className="font-malayalam text-xs font-semibold text-white block">വറുത്ത മീനും അച്ചാറും</span>
                    <span className="text-[10px] text-[#A8BFA0] mt-0.5 block">Crispy fry &amp; traditional pickle</span>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-[#0a0a0a] border border-white/10 text-center lg:text-left">
                    <span className="font-malayalam text-xs font-semibold text-white block">മൺചട്ടിയിലെ തനിമ</span>
                    <span className="text-[10px] text-[#A8BFA0] mt-0.5 block">Served fresh in earthy claypots</span>
                  </div>
                </div>

                {/* CTAs */}
                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-3">
                  <button
                    onClick={onExploreMenu}
                    className="px-7 py-3.5 rounded-full bg-[#C5A46D] hover:bg-[#d8b982] text-black text-xs uppercase tracking-widest font-semibold transition-all duration-300 shadow-[0_10px_30px_rgba(197,164,109,0.3)] hover:scale-105 flex items-center gap-2 cursor-pointer"
                  >
                    <Utensils className="w-4 h-4" />
                    <span>Explore Full Menu</span>
                  </button>

                  {onOpenReservation && (
                    <button
                      onClick={onOpenReservation}
                      className="px-7 py-3.5 rounded-full bg-[#0a0a0a] hover:bg-white/10 text-white border border-white/20 hover:border-[#C5A46D] text-xs uppercase tracking-widest font-medium transition-all duration-300 flex items-center gap-2 cursor-pointer"
                    >
                      <Calendar className="w-4 h-4 text-[#C5A46D]" />
                      <span>Reserve a Table</span>
                    </button>
                  )}
                </div>
              </div>
            </ScrollReveal>
          </div>

          {/* Right Column: Pazhaya Soru Image */}
          <div className="lg:col-span-5 w-full flex flex-col items-center justify-center order-1 lg:order-2">
            <ScrollReveal direction="right" distance={30}>
              <div className="relative w-full max-w-[380px] sm:max-w-[420px] lg:max-w-none mx-auto select-none group">
                {/* Ambient Halo Glow */}
                <div className="absolute -inset-4 bg-gradient-to-tr from-[#C5A46D]/20 via-white/5 to-transparent rounded-[36px] blur-2xl -z-10 opacity-75 group-hover:opacity-100 transition-opacity" />

                {/* Card Container */}
                <div className="relative aspect-[3/4] sm:aspect-[4/5] lg:aspect-[3/4] w-full rounded-3xl overflow-hidden bg-[#0a0a0a] border-2 border-white/15 hover:border-[#C5A46D]/60 transition-all duration-500 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.85)]">
                  {/* Image */}
                  <img
                    src={pazhayaSoruImg}
                    alt="പഴങ്കഞ്ഞി പെരുമ - Ila Kochi Traditional Claypot Rice"
                    className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
                    decoding="async"
                  />

                  {/* Top Badge */}
                  <div className="absolute top-4 left-4 z-20 px-3.5 py-1.5 rounded-full bg-black/80 backdrop-blur-md border border-white/15 text-[10px] sm:text-xs font-mono text-[#C5A46D] tracking-wider uppercase font-medium">
                    Claypot Fermented Rice
                  </div>

                  {/* Subtle Bottom Scrim Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent pointer-events-none" />

                  {/* Bottom Caption Overlay */}
                  <div className="absolute bottom-4 inset-x-4 z-20 flex items-center justify-between text-xs text-[#DCE8D5] pointer-events-none">
                    <span className="font-malayalam text-white font-semibold text-sm">
                      നാടൻ രുചിക്കൂട്ട്
                    </span>
                    <span className="text-[#C5A46D] font-mono text-[11px] bg-black/60 px-2.5 py-1 rounded-full border border-white/10">
                      Served in Manchatti
                    </span>
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
