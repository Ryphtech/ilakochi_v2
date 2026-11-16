import React, { useState, useEffect, Suspense, lazy } from 'react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Navbar } from './components/Navbar/Navbar';
import { Hero } from './components/Hero/Hero';
import { HeroVideoSection } from './components/Hero/HeroVideoSection';
import { PazhamkanjiSection } from './components/Hero/PazhamkanjiSection';
import { KochiArtBanner } from './components/Hero/KochiArtBanner';
import { WebsitePreloader } from './components/Common/WebsitePreloader';
import { SectionSkeleton } from './components/Common/SectionSkeleton';
import { X, Calendar, MessageSquare } from 'lucide-react';
import { restaurantData } from './data/restaurantData';
import { MenuItem } from './data/menuData';

// Lazy-loaded Admin Portal & Dedicated Menu Page
const AdminPortal = lazy(() => import('./components/Admin/AdminPortal').then(m => ({ default: m.AdminPortal })));
const MenuPage = lazy(() => import('./pages/MenuPage').then(m => ({ default: m.MenuPage })));

// Lazy-loaded below-the-fold sections for optimized performance & faster TTI
const BrandIntro = lazy(() => import('./components/BrandIntro/BrandIntro').then(m => ({ default: m.BrandIntro })));
const TaglineReveal = lazy(() => import('./components/Common/TaglineReveal').then(m => ({ default: m.TaglineReveal })));
const ScrollMarquee = lazy(() => import('./components/Common/ScrollMarquee').then(m => ({ default: m.ScrollMarquee })));
const SignatureDishes = lazy(() => import('./components/SignatureDishes/SignatureDishes').then(m => ({ default: m.SignatureDishes })));
const HowItWorks = lazy(() => import('./components/HowItWorks/HowItWorks').then(m => ({ default: m.HowItWorks })));
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

  // Active route: 'home' | 'menu' | 'admin'
  const [currentRoute, setCurrentRoute] = useState<'home' | 'menu' | 'admin'>(() => {
    if (typeof window !== 'undefined') {
      const hash = (window.location.hash || '').toLowerCase();
      const path = (window.location.pathname || '').toLowerCase();
      if (hash === '#admin' || hash === '#/admin' || path === '/admin') return 'admin';
      if (hash === '#menu' || hash === '#/menu' || path === '/menu') return 'menu';
    }
    return 'home';
  });

  useEffect(() => {
    const checkRoute = () => {
      const hash = (window.location.hash || '').toLowerCase();
      const path = (window.location.pathname || '').toLowerCase();
      if (hash === '#admin' || hash === '#/admin' || path === '/admin') {
        setCurrentRoute('admin');
      } else if (hash === '#menu' || hash === '#/menu' || path === '/menu') {
        setCurrentRoute('menu');
      } else {
        setCurrentRoute('home');
        if (hash && hash !== '#home') {
          setTimeout(() => {
            const el = document.querySelector(hash);
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }, 100);
        }
      }
    };

    window.addEventListener('hashchange', checkRoute);
    window.addEventListener('popstate', checkRoute);
    return () => {
      window.removeEventListener('hashchange', checkRoute);
      window.removeEventListener('popstate', checkRoute);
    };
  }, []);

  // Ensure GSAP ScrollTrigger recalculates accurate offsets after dynamic media and lazy sections load
  useEffect(() => {
    const handleRefresh = () => {
      ScrollTrigger.refresh();
    };

    window.addEventListener('load', handleRefresh);
    window.addEventListener('resize', handleRefresh);
    const timer1 = setTimeout(handleRefresh, 300);
    const timer2 = setTimeout(handleRefresh, 1000);

    return () => {
      window.removeEventListener('load', handleRefresh);
      window.removeEventListener('resize', handleRefresh);
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  const handleExitAdmin = () => {
    window.location.hash = '';
    if (window.location.pathname === '/admin') {
      window.history.pushState(null, '', '/');
    }
    setCurrentRoute('home');
  };

  const handleBackToHome = () => {
    window.location.hash = '';
    if (window.location.pathname === '/menu') {
      window.history.pushState(null, '', '/');
    }
    setCurrentRoute('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // If Admin Route is active, render the dedicated Staff Portal
  if (currentRoute === 'admin') {
    return (
      <div className="relative min-h-screen bg-[#000000] text-[#F8F6EE] selection:bg-[#C5A46D]/30 selection:text-white">
        <Suspense fallback={<SectionSkeleton height="min-h-screen" />}>
          <AdminPortal onExit={handleExitAdmin} />
        </Suspense>
      </div>
    );
  }

  // If Dedicated Menu Route is active, render the standalone Menu Page
  if (currentRoute === 'menu') {
    return (
      <Suspense fallback={<SectionSkeleton height="min-h-screen" />}>
        <MenuPage onBackToHome={handleBackToHome} />
      </Suspense>
    );
  }

  return (
    <div className="relative min-h-screen bg-[#000000] text-[#F8F6EE] selection:bg-[#C5A46D]/30 selection:text-white">
      {/* 00. Luxury Website Preloader & Entrance Animation */}
      {showPreloader && (
        <WebsitePreloader onComplete={() => setShowPreloader(false)} />
      )}

      {/* Top Navigation (Eagerly Loaded) */}
      <Navbar onOpenReservation={() => setReservationModalOpen(true)} />

      {/* 01. Hero Poster Carousel Section */}
      <Hero
        onExploreMenu={() => { window.location.hash = '#menu'; }}
        onDiscoverStory={() => scrollToSection('video-experience')}
        onOpenReservation={() => setReservationModalOpen(true)}
      />

      {/* 01.5. Authentic Dish Reel Showcase (Moved below Hero) */}
      <HeroVideoSection
        onExploreMenu={() => { window.location.hash = '#menu'; }}
        onOpenReservation={() => setReservationModalOpen(true)}
      />

      {/* 01.7. Kochi Heritage Architectural Line Art Banner */}
      <KochiArtBanner />

      {/* 01.8. Pazhamkanji Peruma Feature Section */}
      <PazhamkanjiSection
        onExploreMenu={() => { window.location.hash = '#menu'; }}
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
      <Suspense fallback={<div className="h-20 bg-[#000000]" />}>
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

      {/* Kinetic Scroll Marquee 2 (Dishes & Aromas) */}
      <Suspense fallback={<div className="h-20 bg-[#000000]" />}>
        <ScrollMarquee
          textTop="PEARL SPOT POLLICHATHU • KALANJI TAWA FRY • CHEMMEEN GHEE ROAST • KOONTHAL •"
          textBottom="WOOD PRESSED COCONUT OIL • MALABAR TAMARIND • LIVING PLANTAIN LEAF •"
        />
      </Suspense>

      {/* 06. Culinary Menu Invitation Banner leading to dedicated Menu Page */}
      <section className="relative py-16 sm:py-20 bg-black border-y border-white/10 overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-5">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs uppercase tracking-[0.2em] text-[#C5A46D] font-sans-ui">
            <span>Specialty Dishes &bull; സമ്പൂർണ്ണ മെനു</span>
          </div>
          <h2 className="font-serif-display text-3xl sm:text-4xl lg:text-5xl font-medium text-white leading-tight">
            Craving fresh coastal seafood &amp; banana leaf meals?
          </h2>
          <p className="text-sm sm:text-base text-[#DCE8D5]/80 max-w-xl mx-auto font-light leading-relaxed">
            Discover our complete assortment of fresh harbor fish, clay-pot curries, tawa roasts, and authentic Kerala meals on our dedicated menu page.
          </p>
          <div className="pt-2">
            <button
              onClick={() => {
                window.location.hash = '#menu';
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-full bg-[#C5A46D] hover:bg-[#d8b982] text-black font-semibold text-xs uppercase tracking-[0.2em] transition-all shadow-xl hover:-translate-y-0.5 cursor-pointer group"
            >
              <span>Explore Full Menu</span>
              <span className="transition-transform group-hover:translate-x-1">&rarr;</span>
            </button>
          </div>
        </div>
      </section>

      {/* 07. Photo Gallery & Lightbox */}
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
          className="p-3.5 rounded-full bg-[#25D366] text-white shadow-2xl hover:scale-110 active:scale-95 transition-all flex items-center justify-center border-2 border-black"
          aria-label="Direct WhatsApp Chat"
        >
          <MessageSquare className="w-5 h-5 fill-current" />
        </a>

        <button
          onClick={() => setReservationModalOpen(true)}
          className="hidden sm:inline-flex items-center gap-2 px-5 py-3 rounded-full bg-[#C5A46D] hover:bg-[#d8b982] text-black font-semibold text-xs uppercase tracking-wider shadow-2xl hover:scale-105 active:scale-95 transition-all border-2 border-black cursor-pointer"
        >
          <Calendar className="w-4 h-4" />
          <span>Book Table</span>
        </button>
      </div>

      {/* Reservation Modal Dialog */}
      {reservationModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto"
          onClick={() => setReservationModalOpen(false)}
        >
          <div
            className="relative w-full max-w-xl max-h-[92vh] overflow-y-auto bg-[#0a0a0a] border border-white/10 rounded-2xl sm:rounded-3xl p-5 sm:p-8 shadow-2xl my-auto scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={() => setReservationModalOpen(false)}
              className="absolute top-4 right-4 z-20 p-2 rounded-full bg-[#141414] text-[#A8BFA0] hover:text-[#F8F6EE] border border-white/10 transition-colors cursor-pointer"
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
