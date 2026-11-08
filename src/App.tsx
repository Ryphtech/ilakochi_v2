import React, { useState } from 'react';
import { Navbar } from './components/Navbar/Navbar';
import { Hero } from './components/Hero/Hero';
import { BrandIntro } from './components/BrandIntro/BrandIntro';
import { TaglineReveal } from './components/Common/TaglineReveal';
import { ScrollMarquee } from './components/Common/ScrollMarquee';
import { SignatureDishes } from './components/SignatureDishes/SignatureDishes';
import { HowItWorks } from './components/HowItWorks/HowItWorks';
import { OurStory } from './components/OurStory/OurStory';
import { KeralaCulture } from './components/KeralaCulture/KeralaCulture';
import { ReviewsSection } from './components/Reviews/ReviewsSection';
import { MenuSection } from './components/Menu/MenuSection';
import { DishDetailModal } from './components/Menu/DishDetailModal';
import { DiningExperience } from './components/DiningExperience/DiningExperience';
import { GallerySection } from './components/Gallery/GallerySection';
import { FAQSection } from './components/FAQ/FAQSection';
import { LocationSection } from './components/Location/LocationSection';
import { ReservationSection } from './components/Reservation/ReservationSection';
import { Footer } from './components/Footer/Footer';
import { X, Calendar, MessageSquare } from 'lucide-react';
import { restaurantData } from './data/restaurantData';
import { MenuItem } from './data/menuData';

export function App() {
  const [reservationModalOpen, setReservationModalOpen] = useState(false);
  const [selectedDish, setSelectedDish] = useState<MenuItem | null>(null);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="relative min-h-screen bg-[#0B291E] text-[#F8F6EE] selection:bg-[#176B45] selection:text-[#F8F6EE]">
      {/* Top Navigation */}
      <Navbar onOpenReservation={() => setReservationModalOpen(true)} />

      {/* 01. Immersive Video Reel Hero */}
      <Hero
        onExploreMenu={() => scrollToSection('menu')}
        onDiscoverStory={() => scrollToSection('story')}
        onOpenReservation={() => setReservationModalOpen(true)}
      />

      {/* 02. Brand Editorial Introduction */}
      <BrandIntro />

      {/* Mandatory B11 Tagline Reveal Section */}
      <TaglineReveal />

      {/* Kinetic Scroll Marquee 1 (Paragon Style) */}
      <ScrollMarquee
        textTop="AUTHENTIC KERALA SEAFOOD • BANANA LEAF DINING • FRESH HARBOUR CATCH • ILA KOCHI •"
        textBottom="ഇല കൊച്ചി • ROOTED IN NATURE • INSPIRED BY THE COAST • THE ART OF COASTAL COOKING •"
      />

      {/* 03. Signature Seafood Showcase */}
      <SignatureDishes onSelectDish={(dish) => setSelectedDish(dish)} />

      {/* 04. 3-Step Journey: How It Works */}
      <HowItWorks />

      {/* 05. Our Story – The Meaning of "ILA" */}
      <OurStory />

      {/* 06. Kerala Food Culture & Banana Leaf Traditions */}
      <KeralaCulture />

      {/* 07. Verified Social Proof & Customer Reviews */}
      <ReviewsSection />

      {/* Kinetic Scroll Marquee 2 (Dishes & Aromas) */}
      <ScrollMarquee
        textTop="PEARL SPOT POLLICHATHU • KALANJI TAWA FRY • CHEMMEEN GHEE ROAST • KOONTHAL •"
        textBottom="WOOD PRESSED COCONUT OIL • MALABAR TAMARIND • LIVING PLANTAIN LEAF •"
      />

      {/* 08. Interactive Menu Exploration */}
      <MenuSection
        onOpenReservation={() => setReservationModalOpen(true)}
        onSelectDish={(dish) => setSelectedDish(dish)}
      />

      {/* 09. The Dining Experience & Ambience */}
      <DiningExperience />

      {/* 10. Photo Gallery & Lightbox */}
      <GallerySection />

      {/* 11. Objection Handling: FAQ Section */}
      <FAQSection />

      {/* 12. Location & Contact Details */}
      <LocationSection />

      {/* 13. Table Reservation Section */}
      <ReservationSection />

      {/* 14 & 15. Final Brand Statement & Luxury Footer */}
      <Footer onOpenReservation={() => setReservationModalOpen(true)} />

      {/* Interactive Dish Detail Modal */}
      <DishDetailModal
        dish={selectedDish}
        onClose={() => setSelectedDish(null)}
        onOpenReservation={() => setReservationModalOpen(true)}
      />

      {/* Floating Quick Action Pill for Mobile & Desktop */}
      <div className="fixed bottom-5 right-5 z-40 flex items-center gap-2">
        <a
          href={restaurantData.contact.whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="p-3.5 rounded-full bg-[#25D366] text-white shadow-2xl hover:scale-110 active:scale-95 transition-all flex items-center justify-center border-2 border-[#0B291E]"
          aria-label="Direct WhatsApp Chat"
        >
          <MessageSquare className="w-5 h-5 fill-current" />
        </a>

        <button
          onClick={() => setReservationModalOpen(true)}
          className="hidden sm:inline-flex items-center gap-2 px-5 py-3 rounded-full bg-[#C5A46D] hover:bg-[#d8b982] text-[#0B291E] font-semibold text-xs uppercase tracking-wider shadow-2xl hover:scale-105 active:scale-95 transition-all border-2 border-[#0B291E] cursor-pointer"
        >
          <Calendar className="w-4 h-4" />
          <span>Book Table</span>
        </button>
      </div>

      {/* Reservation Modal Dialog */}
      {reservationModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto"
          onClick={() => setReservationModalOpen(false)}
        >
          <div
            className="relative w-full max-w-xl max-h-[92vh] overflow-y-auto bg-[#123D2A] border border-[#176B45]/70 rounded-2xl sm:rounded-3xl p-5 sm:p-8 shadow-2xl my-auto scrollbar-thin scrollbar-thumb-[#176B45] scrollbar-track-transparent"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={() => setReservationModalOpen(false)}
              className="absolute top-4 right-4 z-20 p-2 rounded-full bg-[#0B291E]/80 text-[#A8BFA0] hover:text-[#F8F6EE] border border-[#176B45]/60 transition-colors cursor-pointer"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            <ReservationSection isModal onClose={() => setReservationModalOpen(false)} />
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
