import React from 'react';
import { Logo } from '../Navbar/Logo';
import { restaurantData } from '../../data/restaurantData';
import { MapPin, Phone, Mail, Clock, ArrowUp, MessageSquare } from 'lucide-react';

interface FooterProps {
  onOpenReservation: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenReservation }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#0B291E] text-[#F8F6EE] border-t border-[#176B45]/40 relative overflow-hidden">
      {/* SECTION: FINAL BRAND STATEMENT BANNER */}
      <div className="relative py-20 sm:py-24 lg:py-28 px-4 sm:px-6 lg:px-8 text-center bg-gradient-to-b from-[#123D2A] to-[#0B291E] border-b border-[#176B45]/30">
        <div className="max-w-3xl mx-auto space-y-6 relative z-10">
          {/* Logo prominently displayed without any circular border */}
          <div className="flex justify-center mb-6">
            <img
              src="/assets/ila-kochi-logo-white.png"
              alt="ILA KOCHI Emblem"
              className="h-28 sm:h-36 md:h-44 w-auto object-contain drop-shadow-[0_8px_30px_rgba(197,164,109,0.35)] filter brightness-105 hover:scale-105 transition-transform duration-500 select-none"
            />
          </div>

          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-serif-display font-medium tracking-tight text-[#F8F6EE] leading-tight text-balance">
            Rooted in Nature. <br />
            <span className="italic font-editorial text-[#C5A46D]">Inspired by the Coast.</span>
          </h2>

          <p className="text-base sm:text-lg text-[#DCE8D5]/90 font-light max-w-xl mx-auto text-pretty">
            Discover the spirit of Kerala, one flavour at a time. Served fresh on living banana leaves at Pathadipalam, Kochi.
          </p>

          <div className="pt-3 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={onOpenReservation}
              className="w-full sm:w-auto px-8 py-3.5 rounded-full text-xs font-semibold uppercase tracking-[0.2em] text-[#0B291E] bg-[#C5A46D] hover:bg-[#d8b982] transition-all shadow-xl hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
            >
              Reserve Your Table
            </button>
            <a
              href="#menu"
              className="w-full sm:w-auto px-7 py-3.5 rounded-full text-xs font-medium uppercase tracking-[0.2em] text-[#F8F6EE] border border-[#176B45] hover:border-[#C5A46D] bg-[#123D2A]/60 transition-all hover:-translate-y-0.5"
            >
              View Full Menu
            </a>
          </div>
        </div>
      </div>

      {/* SECTION: MAIN FOOTER DIRECTORY */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-12">
          {/* Col 1: Brand & Bio */}
          <div className="lg:col-span-4 space-y-5">
            <Logo size="lg" variant="light" />
            <p className="text-xs sm:text-sm text-[#DCE8D5]/80 font-light leading-relaxed">
              Authentic Kerala seafood dining celebrating the centuries-old southern custom of eating off fresh plantain leaves. Savor fresh harbor catch, tawa fries, and traditional clay-pot curries.
            </p>
            <div className="flex items-center space-x-3 text-xs text-[#A8BFA0]">
              <span className="px-3 py-1 rounded-full bg-[#123D2A] border border-[#176B45]/50 text-[#C5A46D] font-mono">
                Google 4.0 ★ (700+ Reviews)
              </span>
            </div>
          </div>

          {/* Col 2: Navigation Links */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="text-xs uppercase font-sans-ui tracking-[0.25em] text-[#C5A46D] font-semibold">
              Explore
            </h4>
            <ul className="space-y-2 text-xs font-sans-ui">
              <li>
                <a href="#home" className="text-[#DCE8D5] hover:text-[#C5A46D] transition-colors">
                  Home
                </a>
              </li>
              <li>
                <a href="#story" className="text-[#DCE8D5] hover:text-[#C5A46D] transition-colors">
                  Our Story
                </a>
              </li>
              <li>
                <a href="#signatures" className="text-[#DCE8D5] hover:text-[#C5A46D] transition-colors">
                  Signature Seafood
                </a>
              </li>
              <li>
                <a href="#menu" className="text-[#DCE8D5] hover:text-[#C5A46D] transition-colors">
                  Full Menu
                </a>
              </li>
              <li>
                <a href="#culture" className="text-[#DCE8D5] hover:text-[#C5A46D] transition-colors">
                  Kerala Culture
                </a>
              </li>
              <li>
                <a href="#experience" className="text-[#DCE8D5] hover:text-[#C5A46D] transition-colors">
                  Dining Experience
                </a>
              </li>
              <li>
                <a href="#gallery" className="text-[#DCE8D5] hover:text-[#C5A46D] transition-colors">
                  Photo Gallery
                </a>
              </li>
              <li>
                <a href="#location" className="text-[#DCE8D5] hover:text-[#C5A46D] transition-colors">
                  Find Us
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: Hours & Service */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="text-xs uppercase font-sans-ui tracking-[0.25em] text-[#C5A46D] font-semibold">
              Dining Windows
            </h4>
            <div className="space-y-3 text-xs text-[#DCE8D5]/90">
              <div className="flex items-start gap-2">
                <Clock className="w-4 h-4 text-[#C5A46D] flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-[#F8F6EE] block">Daily Service</span>
                  <span>11:30 AM – 11:00 PM</span>
                </div>
              </div>
              <div className="p-3.5 rounded-2xl bg-[#123D2A]/60 border border-[#176B45]/40 space-y-1.5">
                <div>
                  <span className="text-[11px] font-semibold text-[#C5A46D] block uppercase">
                    Banana Leaf Meals
                  </span>
                  <span className="text-[11px] text-[#A8BFA0] block">
                    12:00 PM – 4:00 PM (Lunch Sadhya)
                  </span>
                </div>
                <div className="pt-1 border-t border-[#176B45]/30">
                  <span className="text-[11px] font-semibold text-[#C5A46D] block uppercase">
                    Live Seafood Tawa
                  </span>
                  <span className="text-[11px] text-[#A8BFA0] block">
                    6:30 PM – 11:00 PM (Dinner Catch)
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Col 4: Location & Contact */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="text-xs uppercase font-sans-ui tracking-[0.25em] text-[#C5A46D] font-semibold">
              Visit Us
            </h4>
            <div className="space-y-3 text-xs text-[#DCE8D5]/90 font-light">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#C5A46D] flex-shrink-0 mt-0.5" />
                <span>
                  Metro Pillar 350, Behind Unimoni, Pathadipalam, Edappally, Kochi 682024
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#C5A46D] flex-shrink-0" />
                <a href={`tel:${restaurantData.contact.phoneRaw}`} className="hover:text-[#C5A46D] transition-colors">
                  {restaurantData.contact.phone}
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#C5A46D] flex-shrink-0" />
                <a href={`mailto:${restaurantData.contact.email}`} className="hover:text-[#C5A46D] transition-colors">
                  {restaurantData.contact.email}
                </a>
              </div>

              {/* Socials / Direct Channels */}
              <div className="pt-2 flex items-center space-x-3">
                <a
                  href={restaurantData.social.googleMaps}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-full bg-[#123D2A] hover:bg-[#176B45] text-[#C5A46D] transition-colors border border-[#176B45]/40"
                  aria-label="Google Maps Location"
                  title="Google Maps"
                >
                  <MapPin className="w-4 h-4" />
                </a>
                <a
                  href={restaurantData.contact.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-full bg-[#123D2A] hover:bg-[#176B45] text-[#25D366] transition-colors border border-[#176B45]/40"
                  aria-label="WhatsApp Us"
                  title="Chat on WhatsApp"
                >
                  <MessageSquare className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Sub-footer */}
        <div className="mt-16 pt-8 border-t border-[#176B45]/30 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-[#A8BFA0]">
          <div>
            &copy; {new Date().getFullYear()} ILA KOCHI RESTAURANT (ഇല കൊച്ചി). Pathadipalam Metro Pillar 350. All rights reserved.
          </div>

          <div className="flex items-center gap-4">
            <span>Rooted in Nature &middot; Inspired by the Coast</span>
            <button
              onClick={scrollToTop}
              className="p-2 rounded-full bg-[#123D2A] hover:bg-[#176B45] text-[#C5A46D] transition-colors border border-[#176B45]/40 cursor-pointer"
              aria-label="Back to top"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
