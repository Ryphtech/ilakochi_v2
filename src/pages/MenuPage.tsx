import React, { useState, useEffect } from 'react';
import { Navbar } from '../components/Navbar/Navbar';
import { MenuSection } from '../components/Menu/MenuSection';
import { DishDetailModal } from '../components/Menu/DishDetailModal';
import { Footer } from '../components/Footer/Footer';
import { ReservationSection } from '../components/Reservation/ReservationSection';
import { MenuItem } from '../data/menuData';
import { ArrowLeft, Utensils, MessageSquare, Calendar, X } from 'lucide-react';
import { restaurantData } from '../data/restaurantData';

interface MenuPageProps {
  onBackToHome: () => void;
}

export const MenuPage: React.FC<MenuPageProps> = ({ onBackToHome }) => {
  const [selectedDish, setSelectedDish] = useState<MenuItem | null>(null);
  const [reservationModalOpen, setReservationModalOpen] = useState(false);

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  }, []);

  return (
    <div className="relative min-h-screen bg-[#000000] text-[#F8F6EE] selection:bg-[#C5A46D]/30 selection:text-white">
      {/* Top Navigation */}
      <Navbar onOpenReservation={() => setReservationModalOpen(true)} />

      {/* Menu Page Hero Banner */}
      <header className="relative pt-28 pb-10 sm:pt-36 sm:pb-14 bg-gradient-to-b from-[#0a0a0a] via-black to-black border-b border-white/10 overflow-hidden">
        {/* Ambient atmospheric glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[40rem] h-[20rem] bg-[#C5A46D]/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -top-10 right-10 w-80 h-80 bg-white/[0.02] rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Breadcrumb Navigation & Back Button */}
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/10">
            <button
              onClick={onBackToHome}
              className="inline-flex items-center gap-2 text-xs uppercase tracking-widest font-sans-ui text-[#C5A46D] hover:text-[#d8b982] transition-colors cursor-pointer group"
              aria-label="Back to Home Page"
            >
              <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
              <span>Back to Home</span>
            </button>

            <div className="flex items-center gap-2 text-xs font-mono text-[#A8BFA0]">
              <span
                onClick={onBackToHome}
                className="hover:text-white cursor-pointer transition-colors"
              >
                Home
              </span>
              <span>/</span>
              <span className="text-[#C5A46D]">Full Menu</span>
            </div>
          </div>

          {/* Editorial Title & Subtitle */}
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs uppercase tracking-[0.2em] text-[#C5A46D] font-sans-ui">
              <Utensils className="w-3.5 h-3.5 text-[#C5A46D]" />
              <span>Ila Kochi &bull; സമ്പൂർണ്ണ വിഭവങ്ങൾ</span>
            </div>

            <h1 className="font-serif-display text-4xl sm:text-5xl lg:text-6xl font-medium tracking-tight text-white leading-tight">
              Our Full Menu
            </h1>

            <p className="text-base sm:text-lg text-[#DCE8D5]/90 font-light leading-relaxed max-w-2xl mx-auto text-pretty">
              Morning ocean catch, stone-ground heirloom spices, and slow clay-pot braising served upon fresh living plantain leaves at Pathadipalam, Kochi.
            </p>
          </div>
        </div>
      </header>

      {/* Main Interactive Menu Showcase */}
      <main className="relative z-10">
        <MenuSection
          onOpenReservation={() => setReservationModalOpen(true)}
          onSelectDish={(dish) => setSelectedDish(dish)}
        />
      </main>

      {/* Luxury Footer */}
      <Footer onOpenReservation={() => setReservationModalOpen(true)} />

      {/* Dish Detail Modal */}
      {selectedDish && (
        <DishDetailModal
          dish={selectedDish}
          onClose={() => setSelectedDish(null)}
          onOpenReservation={() => {
            setSelectedDish(null);
            setReservationModalOpen(true);
          }}
        />
      )}

      {/* Table Reservation Modal */}
      {reservationModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-4xl bg-[#0a0a0a] border border-white/15 rounded-3xl p-6 sm:p-10 shadow-2xl my-8">
            <button
              onClick={() => setReservationModalOpen(false)}
              className="absolute top-6 right-6 p-2 rounded-full bg-white/5 hover:bg-white/10 text-white transition-colors cursor-pointer"
              aria-label="Close Reservation"
            >
              <X className="w-5 h-5" />
            </button>
            <ReservationSection />
          </div>
        </div>
      )}

      {/* Floating Quick Action Pill */}
      <div className="fixed bottom-5 right-5 z-40 flex items-center gap-2">
        <a
          href={restaurantData.contact.whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-4 py-3 rounded-full bg-[#25D366] text-black font-semibold text-xs tracking-wider shadow-2xl hover:scale-105 active:scale-95 transition-all duration-300"
          aria-label="Chat on WhatsApp"
        >
          <MessageSquare className="w-4 h-4 fill-black" />
          <span className="hidden sm:inline">WhatsApp Booking</span>
        </a>

        <button
          onClick={() => setReservationModalOpen(true)}
          className="flex items-center gap-2 px-4 py-3 rounded-full bg-[#C5A46D] text-black font-semibold text-xs uppercase tracking-wider shadow-2xl hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer"
          aria-label="Open Table Reservation"
        >
          <Calendar className="w-4 h-4" />
          <span>Reserve Table</span>
        </button>
      </div>
    </div>
  );
};
