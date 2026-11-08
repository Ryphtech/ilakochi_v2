import React from 'react';
import { Sparkles, Utensils, Clock, Users } from 'lucide-react';

export const DiningExperience: React.FC = () => {
  return (
    <section id="experience" className="relative py-20 sm:py-24 lg:py-28 bg-[#123D2A] text-[#F8F6EE] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0B291E] border border-[#176B45]/50 text-xs uppercase tracking-[0.2em] text-[#C5A46D] font-sans-ui">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Atmosphere &amp; Hospitality</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif-display font-medium tracking-tight text-[#F8F6EE] leading-tight text-balance">
            An experience worth savouring.
          </h2>
          <p className="text-sm sm:text-base text-[#DCE8D5] font-light leading-relaxed text-pretty">
            Step away from the bustling city into a warm, botanical retreat where the aroma of roasting spices and simmering coconut curries greets you at the door.
          </p>
        </div>

        {/* Experience Highlights Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Left Grid: Atmospheric Gallery (Balanced 2x2) */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-4">
              <div className="relative rounded-2xl overflow-hidden aspect-[4/3] border border-[#176B45]/40 shadow-xl group">
                <img
                  src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80"
                  alt="Ila Kochi Dining Ambiance Warm Lighting"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B291E]/85 via-transparent to-transparent" />
                <div className="absolute bottom-3 left-3.5 right-3.5">
                  <span className="text-xs font-serif-display text-[#F8F6EE] block">Warm Botanical Glow</span>
                  <span className="text-[10px] text-[#A8BFA0] uppercase tracking-wider">Natural wood &amp; foliage</span>
                </div>
              </div>

              <div className="relative rounded-2xl overflow-hidden aspect-[4/3] border border-[#176B45]/40 shadow-xl group">
                <img
                  src="https://images.unsplash.com/photo-1559742811-822873691df8?auto=format&fit=crop&w=800&q=80"
                  alt="Fresh Seafood Preparation"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B291E]/85 via-transparent to-transparent" />
                <div className="absolute bottom-3 left-3.5">
                  <span className="text-xs font-serif-display text-[#F8F6EE] block">Harbour-Fresh Delicacies</span>
                  <span className="text-[10px] text-[#A8BFA0] uppercase tracking-wider">Catch of the morning</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="relative rounded-2xl overflow-hidden aspect-[4/3] border border-[#176B45]/40 shadow-xl group">
                <img
                  src="https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80"
                  alt="Traditional Fish Pollichathu presentation"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B291E]/85 via-transparent to-transparent" />
                <div className="absolute bottom-3 left-3.5">
                  <span className="text-xs font-serif-display text-[#F8F6EE] block">Fresh Banana Leaf Service</span>
                  <span className="text-[10px] text-[#A8BFA0] uppercase tracking-wider">Centuries-old custom</span>
                </div>
              </div>

              <div className="relative rounded-2xl overflow-hidden aspect-[4/3] border border-[#176B45]/40 shadow-xl group">
                <img
                  src="https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=800&q=80"
                  alt="Kochi Kulukki Sarbath Bar"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B291E]/85 via-transparent to-transparent" />
                <div className="absolute bottom-3 left-3.5 right-3.5">
                  <span className="text-xs font-serif-display text-[#F8F6EE] block">Kochi Kulukki Counter</span>
                  <span className="text-[10px] text-[#A8BFA0] uppercase tracking-wider">Shaken coastal coolers</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Experience Details */}
          <div className="lg:col-span-5 h-full">
            <div className="h-full p-6 sm:p-8 rounded-3xl bg-[#0B291E]/90 border border-[#176B45]/60 shadow-2xl flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <h3 className="text-2xl font-serif-display font-medium text-[#F8F6EE]">
                  Dining with nature's touch.
                </h3>

                <p className="text-sm text-[#DCE8D5]/90 font-light leading-relaxed">
                  Whether joining us for a hearty afternoon <strong className="text-[#C5A46D] font-medium">Banana Leaf Sadhya</strong> between work meetings or unwinding over an evening feast of smoking <strong className="text-[#C5A46D] font-medium">Tawa Kalanji</strong> and flaky Malabar porottas with family, our team welcomes you with signature Kerala warmth.
                </p>
              </div>

              <div className="space-y-3 pt-2">
                <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-[#123D2A]/60 border border-[#176B45]/40">
                  <Clock className="w-5 h-5 text-[#C5A46D] flex-shrink-0" />
                  <div>
                    <span className="text-xs font-semibold uppercase tracking-wider text-[#F8F6EE] block">
                      Daily Service Hours
                    </span>
                    <span className="text-xs text-[#A8BFA0]">
                      11:30 AM – 11:00 PM (Meals from 12 PM - 4 PM)
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-[#123D2A]/60 border border-[#176B45]/40">
                  <Users className="w-5 h-5 text-[#C5A46D] flex-shrink-0" />
                  <div>
                    <span className="text-xs font-semibold uppercase tracking-wider text-[#F8F6EE] block">
                      Seating &amp; Gatherings
                    </span>
                    <span className="text-xs text-[#A8BFA0]">
                      Cozy family dining, group tables &amp; express takeaway
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-[#123D2A]/60 border border-[#176B45]/40">
                  <Utensils className="w-5 h-5 text-[#C5A46D] flex-shrink-0" />
                  <div>
                    <span className="text-xs font-semibold uppercase tracking-wider text-[#F8F6EE] block">
                      Authentic Preparation
                    </span>
                    <span className="text-xs text-[#A8BFA0]">
                      No artificial coloring, no preservatives, 100% fresh catch
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
