import React, { useState, useEffect } from 'react';
import { Logo } from './Logo';
import { Menu, X, Phone, Calendar } from 'lucide-react';
import { restaurantData } from '../../data/restaurantData';

interface NavbarProps {
  onOpenReservation: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenReservation }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);

      // Section tracking
      const sections = ['story', 'menu', 'experience', 'gallery', 'location'];
      const scrollPos = window.scrollY + 250;

      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            setActiveSection(section);
            return;
          }
        }
      }
      if (window.scrollY < 200) {
        setActiveSection('home');
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Curated, uncluttered links for luxury airy feel
  const navLinks = [
    { label: 'STORY', href: '#story', id: 'story' },
    { label: 'MENU', href: '#menu', id: 'menu' },
    { label: 'EXPERIENCE', href: '#experience', id: 'experience' },
    { label: 'GALLERY', href: '#gallery', id: 'gallery' },
    { label: 'VISIT US', href: '#location', id: 'location' },
  ];

  const handleNavClick = (href: string) => {
    setMobileMenuOpen(false);
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled
            ? 'bg-[#0B291E]/90 backdrop-blur-xl border-b border-[#176B45]/20 py-3.5 shadow-2xl shadow-black/40'
            : 'bg-gradient-to-b from-[#0B291E]/80 via-[#0B291E]/30 to-transparent py-5 md:py-6'
        }`}
      >
        <div className="max-w-6xl mx-auto px-5 sm:px-8">
          <div className="flex items-center justify-between">
            {/* Clean, Uncluttered Brand Logo */}
            <a
              href="#home"
              onClick={(e) => {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="focus:outline-none rounded-lg transition-transform hover:opacity-95"
              aria-label="ILA KOCHI Home"
            >
              <Logo size="sm" variant="light" showSubtitle={false} />
            </a>

            {/* Desktop Navigation Links with generous breathing room */}
            <nav className="hidden md:flex items-center space-x-9" aria-label="Main Navigation">
              {navLinks.map((link) => {
                const isActive = activeSection === link.id;
                return (
                  <a
                    key={link.id}
                    href={link.href}
                    onClick={(e) => {
                      e.preventDefault();
                      handleNavClick(link.href);
                    }}
                    className={`text-[11px] uppercase tracking-[0.22em] font-sans-ui transition-all duration-300 relative py-1 ${
                      isActive
                        ? 'text-[#C5A46D] font-semibold'
                        : 'text-[#F8F6EE]/75 hover:text-[#F8F6EE]'
                    }`}
                  >
                    {link.label}
                    {isActive && (
                      <span className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-[#C5A46D] rounded-full" />
                    )}
                  </a>
                );
              })}
            </nav>

            {/* Right Side: Clean, Elegant Single CTA */}
            <div className="hidden sm:flex items-center space-x-4">
              <a
                href={`tel:${restaurantData.contact.phoneRaw}`}
                className="p-2 rounded-full text-[#A8BFA0] hover:text-[#C5A46D] hover:bg-[#123D2A]/60 transition-colors"
                title={`Call ${restaurantData.contact.phone}`}
                aria-label={`Call ${restaurantData.contact.phone}`}
              >
                <Phone className="w-3.5 h-3.5" />
              </a>

              <button
                onClick={onOpenReservation}
                className="inline-flex items-center gap-2 px-5 py-2 rounded-full text-[11px] font-semibold uppercase tracking-[0.2em] text-[#0B291E] bg-[#C5A46D] hover:bg-[#d8b982] transition-all duration-300 shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>Reserve Table</span>
              </button>
            </div>

            {/* Mobile Toggle Button */}
            <div className="flex items-center sm:hidden space-x-2">
              <button
                onClick={onOpenReservation}
                className="px-3 py-1.5 rounded-full bg-[#C5A46D] text-[#0B291E] text-[10px] font-semibold uppercase tracking-wider"
                aria-label="Reserve"
              >
                Book
              </button>

              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-lg text-[#F8F6EE] hover:bg-[#123D2A] focus:outline-none"
                aria-label={mobileMenuOpen ? 'Close Menu' : 'Open Menu'}
                aria-expanded={mobileMenuOpen}
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5 text-[#DCE8D5]" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Menu */}
      <div
        className={`fixed inset-0 z-40 md:hidden transition-all duration-300 ${
          mobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div
          className="absolute inset-0 bg-[#0B291E]/95 backdrop-blur-2xl"
          onClick={() => setMobileMenuOpen(false)}
        />

        <div className="relative z-50 flex flex-col justify-between h-full pt-24 pb-10 px-8 overflow-y-auto">
          <div className="space-y-8">
            <div className="border-b border-[#176B45]/30 pb-4">
              <span className="text-[10px] uppercase tracking-[0.3em] text-[#A8BFA0]">
                Ila Kochi Menu
              </span>
            </div>

            <nav className="flex flex-col space-y-5">
              {navLinks.map((link) => (
                <a
                  key={link.id}
                  href={link.href}
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavClick(link.href);
                  }}
                  className={`text-xl tracking-[0.18em] font-serif-display transition-colors py-1 flex items-center justify-between ${
                    activeSection === link.id ? 'text-[#C5A46D] font-semibold' : 'text-[#F8F6EE]'
                  }`}
                >
                  <span>{link.label}</span>
                  <span className="text-xs text-[#A8BFA0]/60">→</span>
                </a>
              ))}
            </nav>
          </div>

          <div className="space-y-4 pt-6 border-t border-[#176B45]/30">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenReservation();
              }}
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-full text-xs font-semibold uppercase tracking-widest text-[#0B291E] bg-[#C5A46D] shadow-lg cursor-pointer"
            >
              <Calendar className="w-4 h-4" />
              <span>Reserve a Table</span>
            </button>

            <a
              href={`tel:${restaurantData.contact.phoneRaw}`}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-full text-xs tracking-wider text-[#F8F6EE] border border-[#176B45] bg-[#123D2A]/60"
            >
              <Phone className="w-4 h-4 text-[#C5A46D]" />
              <span>Call: {restaurantData.contact.phone}</span>
            </a>

            <div className="text-center text-[10px] text-[#A8BFA0] font-sans-ui pt-1">
              Metro Pillar 350, Pathadipalam, Kochi
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
