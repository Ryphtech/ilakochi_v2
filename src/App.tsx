import React, { useState, useEffect, Suspense, lazy } from 'react';
import { Navbar } from './components/Navbar/Navbar';
import { Hero } from './components/Hero/Hero';
import { WebsitePreloader } from './components/Common/WebsitePreloader';
import { SectionSkeleton } from './components/Common/SectionSkeleton';
import { X, Calendar, MessageSquare } from 'lucide-react';
import { restaurantData } from './data/restaurantData';
import { MenuItem } from './data/menuData';

// Lazy-loaded Admin Portal
const AdminPortal = lazy(() => import('./components/Admin/AdminPortal').then(m => ({ default: m.AdminPortal })));

// Lazy-loaded below-the-fold sections for optimized performance & faster TTI
const BrandIntro = lazy(() => import('./components/BrandIntro/BrandIntro').then(m => ({ default: m.BrandIntro })));
const TaglineReveal = lazy(() => import('./components/Common/TaglineReveal').then(m => ({ default: m.TaglineReveal })));
const ScrollMarquee = lazy(() => import('./components/Common/ScrollMarquee').then(m => ({ default: m.ScrollMarquee })));
const SignatureDishes = lazy(() => import('./components/SignatureDishes/SignatureDishes').then(m => ({ default: m.SignatureDishes })));
const HowItWorks = lazy(() => import('./components/HowItWorks/HowItWorks').then(m => ({ default: m.HowItWorks })));
const OurStory = lazy(() => import('./components/OurStory/OurStory').then(m => ({ default: m.OurStory })));
const KeralaCulture = lazy(() => import('./components/KeralaCulture/KeralaCulture').then(m => ({ default: m.KeralaCulture })));
const ReviewsSection = lazy(() => import('./components/Reviews/ReviewsSection').then(m => ({ default: m.ReviewsSection })));
const MenuSection = lazy(() => import('./components/Menu/MenuSection').then(m => ({ default: m.MenuSection })));
const DiningExperience = lazy(() => import('./components/DiningExperience/DiningExperience').then(m => ({ default: m.DiningExperience })));
const GallerySection = lazy(() => import('./components/Gallery/GallerySection').then(m => ({ default: m.GallerySection })));
const FAQSection = lazy(() => import('./components/FAQ/FAQSection').then(m => ({ default: m.FAQSection })));
const LocationSection = lazy(() => import('./components/Location/LocationSection').then(m => ({ default: m.LocationSection })));
const ReservationSection = lazy(() => import('./components/Reservation/ReservationSection').then(m => ({ default: m.ReservationSection })));
const Footer = lazy(() => import('./components/Footer/Footer').then(m => ({ default: m.Footer })));
const DishDetailModal = lazy(() => import('./components/Menu/DishDetailModal').then(m => ({ default: m.DishDetailModal })));

export function App() {
  const [showPreloader, setShowPreloader] = useState(true);
  const [reservationModalOpen, setReservationModalOpen] = useState(false);
  const [selectedDish, setSelectedDish] = useState<MenuItem | null>(null);

  // Admin portal route detection: '#admin', '#/admin', or '/admin'
  const [isAdminRoute, setIsAdminRoute] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const hash = (window.location.hash || '').toLowerCase();
      const path = (window.location.pathname || '').toLowerCase();
      return hash === '#admin' || hash === '#/admin' || path === '/admin';
    }
    return false;
  });

  useEffect(() => {
    const checkRoute = () => {
      const hash = (window.location.hash || '').toLowerCase();
      const path = (window.location.pathname || '').toLowerCase();
      setIsAdminRoute(hash === '#admin' || hash === '#/admin' || path === '/admin');
    };

    window.addEventListener('hashchange', checkRoute);
    window.addEventListener('popstate', checkRoute);
    return () => {
      window.removeEventListener('hashchange', checkRoute);
      window.removeEventListener('popstate', checkRoute);
    };
  }, []);

  const handleExitAdmin = () => {
    window.location.hash = '';
    if (window.location.pathname === '/admin') {
      window.history.pushState(null, '', '/');
    }
    setIsAdminRoute(false);
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // If Admin Route is active, render the dedicated Staff Portal
  if (isAdminRoute) {
    return (
      <div className="relative min-h-screen bg-[#0B291E] text-[#F8F6EE] selection:bg-[#176B45] selection:text-[#F8F6EE]">
        <Suspense fallback={<SectionSkeleton height="min-h-screen" />}>
          <AdminPortal onExit={handleExitAdmin} />
        </Suspense>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-[#0B291E] text-[#F8F6EE] selection:bg-[#176B45] selection:text-[#F8F6EE]">
      {/* 00. Luxury Website Preloader & Entrance Animation */}
      {showPreloader && (
        <WebsitePreloader onComplete={() => setShowPreloader(false)} />
      )}

      {/* Top Navigation (Eagerly Loaded) */}
      <Navbar onOpenReservation={() => setReservationModalOpen(true)} />

      {/* 01. Immersive Video Reel Hero (Eagerly Loaded for Instant FCP) */}
      <Hero
        onExploreMenu={() => scrollToSection('menu')}
        onDiscoverStory={() => scrollToSection('story')}
        onOpenReservation={() => setReservationModalOpen(true)}
      />

      {/* 02. Brand Editorial Introduction */}
      <Suspense fallback={<SectionSkeleton height="min-h-[500px]" />}>
        <BrandIntro />
      </Suspense>

      {/* Mandatory B11 Tagline Reveal Section */}
      <Suspense fallback={<SectionSkeleton height="min-h-[300px]" hasCardGrid={false} />}>
        <TaglineReveal />
      </Suspense>

      {/* Kinetic Scroll Marquee 1 (Paragon Style) */}
      <Suspense fallback={<div className="h-20 bg-[#0B291E]" />}>
        <ScrollMarquee
          textTop="AUTHENTIC KERALA SEAFOOD • BANANA LEAF DINING • FRESH HARBOUR CATCH • ILA KOCHI •"
          textBottom="ഇല കൊച്ചി • ROOTED IN NATURE • INSPIRED BY THE COAST • THE ART OF COASTAL COOKING •"
        />
      </Suspense>

      {/* 03. Signature Seafood Showcase */}
      <Suspense fallback={<SectionSkeleton height="min-h-[600px]" />}>
        <SignatureDishes onSelectDish={(dish) => setSelectedDish(dish)} />
      </Suspense>

      {/* 04. 3-Step Journey: How It Works */}
      <Suspense fallback={<SectionSkeleton height="min-h-[450px]" />}>
        <HowItWorks />
      </Suspense>

      {/* 05. Our Story – The Meaning of "ILA" */}
      <Suspense fallback={<SectionSkeleton height="min-h-[500px]" />}>
        <OurStory />
      </Suspense>

      {/* 06. Kerala Food Culture & Banana Leaf Traditions */}
      <Suspense fallback={<SectionSkeleton height="min-h-[480px]" />}>
        <KeralaCulture />
      </Suspense>

      {/* 07. Verified Social Proof & Customer Reviews */}
      <Suspense fallback={<SectionSkeleton height="min-h-[420px]" />}>
        <ReviewsSection />
      </Suspense>

      {/* Kinetic Scroll Marquee 2 (Dishes & Aromas) */}
      <Suspense fallback={<div className="h-20 bg-[#123D2A]" />}>
        <ScrollMarquee
          textTop="PEARL SPOT POLLICHATHU • KALANJI TAWA FRY • CHEMMEEN GHEE ROAST • KOONTHAL •"
          textBottom="WOOD PRESSED COCONUT OIL • MALABAR TAMARIND • LIVING PLANTAIN LEAF •"
        />
      </Suspense>

      {/* 08. Interactive Menu Exploration */}
      <Suspense fallback={<SectionSkeleton height="min-h-[650px]" />}>
        <MenuSection
          onOpenReservation={() => setReservationModalOpen(true)}
          onSelectDish={(dish) => setSelectedDish(dish)}
        />
      </Suspense>

      {/* 09. The Dining Experience & Ambience */}
      <Suspense fallback={<SectionSkeleton height="min-h-[500px]" />}>
        <DiningExperience />
      </Suspense>

      {/* 10. Photo Gallery & Lightbox */}
      <Suspense fallback={<SectionSkeleton height="min-h-[550px]" />}>
        <GallerySection />
      </Suspense>

      {/* 11. Objection Handling: FAQ Section */}
      <Suspense fallback={<SectionSkeleton height="min-h-[450px]" hasCardGrid={false} />}>
        <FAQSection />
      </Suspense>

      {/* 12. Location & Contact Details */}
      <Suspense fallback={<SectionSkeleton height="min-h-[550px]" />}>
        <LocationSection />
      </Suspense>

      {/* 13. Table Reservation Section */}
      <Suspense fallback={<SectionSkeleton height="min-h-[450px]" hasCardGrid={false} />}>
        <ReservationSection />
      </Suspense>

      {/* 14 & 15. Final Brand Statement & Luxury Footer */}
      <Suspense fallback={<SectionSkeleton height="min-h-[400px]" />}>
        <Footer onOpenReservation={() => setReservationModalOpen(true)} />
      </Suspense>

      {/* Interactive Dish Detail Modal (Lazy loaded on demand) */}
      {selectedDish && (
        <Suspense fallback={null}>
          <DishDetailModal
            dish={selectedDish}
            onClose={() => setSelectedDish(null)}
            onOpenReservation={() => {
              setSelectedDish(null);
              setReservationModalOpen(true);
            }}
          />
        </Suspense>
      )}

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

            <Suspense fallback={<SectionSkeleton height="min-h-[300px]" hasCardGrid={false} />}>
              <ReservationSection isModal onClose={() => setReservationModalOpen(false)} />
            </Suspense>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
