import React from 'react';
import { MapPin, Phone, MessageSquare, Clock, Mail, Navigation, ExternalLink, Star } from 'lucide-react';
import { restaurantData } from '../../data/restaurantData';

export const LocationSection: React.FC = () => {
  return (
    <section id="location" className="relative py-20 sm:py-24 lg:py-28 bg-[#123D2A] text-[#F8F6EE] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0B291E] border border-[#176B45]/50 text-xs uppercase tracking-[0.2em] text-[#C5A46D] font-sans-ui">
            <MapPin className="w-3.5 h-3.5" />
            <span>Pathadipalam, Kochi</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif-display font-medium tracking-tight text-[#F8F6EE] leading-tight text-balance">
            Come experience ILA KOCHI.
          </h2>
          <p className="text-sm sm:text-base text-[#DCE8D5] font-light leading-relaxed text-pretty">
            Conveniently situated right by Metro Pillar 350 behind Unimoni, near Kerala History Museum. Stop by for an authentic Kerala meal or fresh evening seafood sizzle.
          </p>
        </div>

        {/* Contact & Map Card Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Left Column: Contact Cards */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
            {/* Address Card */}
            <div className="p-6 rounded-3xl bg-[#0B291E]/90 border border-[#176B45]/50 shadow-xl space-y-3">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-2xl bg-[#123D2A] text-[#C5A46D] border border-[#176B45]">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-serif-display font-medium text-[#F8F6EE]">
                    Restaurant Location
                  </h3>
                  <span className="text-xs text-[#A8BFA0]">Metro Corridor, Kochi</span>
                </div>
              </div>

              <div className="text-xs sm:text-sm text-[#DCE8D5]/90 space-y-1 font-light pt-1">
                <p className="font-medium text-[#F8F6EE]">{restaurantData.address.line1}</p>
                <p>{restaurantData.address.line2}</p>
                <p className="text-[#A8BFA0]">{restaurantData.address.landmark}</p>
                <p>{restaurantData.address.city}, {restaurantData.address.state} – {restaurantData.address.pincode}</p>
              </div>

              <div className="pt-2">
                <a
                  href={restaurantData.address.full ? restaurantData.social.googleMaps : '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#C5A46D] hover:text-[#d8b982] transition-colors"
                >
                  <Navigation className="w-3.5 h-3.5" />
                  <span>Get Directions on Google Maps</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>

            {/* Timings Card */}
            <div className="p-6 rounded-3xl bg-[#0B291E]/90 border border-[#176B45]/50 shadow-xl space-y-3">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-2xl bg-[#123D2A] text-[#C5A46D] border border-[#176B45]">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-serif-display font-medium text-[#F8F6EE]">
                    Opening Hours
                  </h3>
                  <span className="text-xs text-[#A8BFA0]">{restaurantData.timings.days}</span>
                </div>
              </div>

              <div className="space-y-2 text-xs text-[#DCE8D5] pt-1">
                <div className="flex justify-between border-b border-[#176B45]/30 pb-1.5">
                  <span className="text-[#A8BFA0]">All Day Service:</span>
                  <span className="font-mono text-[#F8F6EE] font-medium">{restaurantData.timings.allDay}</span>
                </div>
                <div className="flex justify-between border-b border-[#176B45]/30 pb-1.5">
                  <span className="text-[#A8BFA0]">Banana Leaf Meals:</span>
                  <span className="font-mono text-[#C5A46D]">12:00 PM – 4:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#A8BFA0]">Live Seafood Tawa:</span>
                  <span className="font-mono text-[#C5A46D]">6:30 PM – 11:00 PM</span>
                </div>
              </div>
            </div>

            {/* Direct Connect Buttons */}
            <div className="grid grid-cols-2 gap-3 pt-1">
              <a
                href={`tel:${restaurantData.contact.phoneRaw}`}
                className="flex items-center justify-center gap-2 py-3.5 px-4 rounded-full bg-[#176B45] hover:bg-[#1f8758] text-[#F8F6EE] text-xs font-semibold uppercase tracking-wider transition-colors shadow-lg"
              >
                <Phone className="w-4 h-4" />
                <span>Call Directly</span>
              </a>

              <a
                href={restaurantData.contact.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 py-3.5 px-4 rounded-full bg-[#25D366]/20 border border-[#25D366]/40 hover:bg-[#25D366]/30 text-[#25D366] text-xs font-semibold uppercase tracking-wider transition-colors shadow-lg"
              >
                <MessageSquare className="w-4 h-4" />
                <span>WhatsApp</span>
              </a>
            </div>
          </div>

          {/* Right Column: Google Maps & Verified Listing Banner */}
          <div className="lg:col-span-7 flex flex-col justify-between rounded-3xl overflow-hidden bg-[#0B291E] border border-[#176B45]/50 shadow-2xl relative min-h-[440px] lg:h-full">
            {/* Embed Map Card */}
            <div className="relative w-full h-full min-h-[360px] flex-1">
              <iframe
                title="Ila Kochi Restaurant Google Map"
                src="https://maps.google.com/maps?q=10.0375751,76.3142699&hl=en&z=16&output=embed"
                className="w-full h-full border-0 filter contrast-125 saturate-75 opacity-90"
                loading="lazy"
                allowFullScreen
              />

              {/* Floating Verified Badge */}
              <div className="absolute top-4 left-4 p-3.5 rounded-2xl bg-[#0B291E]/95 border border-[#176B45] shadow-xl backdrop-blur-md max-w-xs space-y-1">
                <div className="flex items-center gap-1.5 text-xs text-[#C5A46D] font-medium">
                  <Star className="w-3.5 h-3.5 fill-[#C5A46D]" />
                  <span>4.0 Star Rated (700+ Reviews)</span>
                </div>
                <p className="text-[11px] text-[#DCE8D5]/90">
                  Known for fresh seafood tawa fries, chemmeen roasts, and authentic Kerala leaf meals.
                </p>
              </div>
            </div>

            {/* Bottom Bar */}
            <div className="p-4 sm:p-5 bg-[#0B291E] border-t border-[#176B45]/40 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#A8BFA0]">
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-[#C5A46D]" />
                <a href={`mailto:${restaurantData.contact.email}`} className="hover:text-[#F8F6EE]">
                  {restaurantData.contact.email}
                </a>
              </div>

              <a
                href={restaurantData.social.googleMaps}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-[#C5A46D] hover:underline font-medium"
              >
                <span>Open in Google Maps App</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
