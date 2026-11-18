import React, { useState, useEffect } from 'react';
import {
  subscribeMenuItems,
  addMenuItem,
  updateMenuItem,
  deleteMenuItem,
  seedDefaultMenu,
} from '../../lib/firebase';
import { MenuItem, menuCategories } from '../../data/menuData';
import { FoodItemModal } from './FoodItemModal';
import { MediaUploadZone } from './MediaUploadZone';
import { ReservationsTable } from './ReservationsTable';
import { HeroBackgroundManager } from './HeroBackgroundManager';
import { ThemeManager } from './ThemeManager';
import { HeadingsManager } from './HeadingsManager';
import { GalleryManager } from './GalleryManager';
import { subscribeGalleryImages } from '../../lib/firebase';
import {
  Utensils,
  Film,
  Calendar,
  Image as ImageIcon,
  Palette,
  Languages,
  Camera,
  Plus,
  Edit2,
  Trash2,
  ExternalLink,
  Lock,
  LogOut,
  RefreshCw,
  Search,
  Sparkles,
  ShieldCheck,
  Flame,
  CheckCircle,
  Menu,
  X,
  ChevronRight,
} from 'lucide-react';

interface AdminPortalProps {
  onExit: () => void;
}

export const AdminPortal: React.FC<AdminPortalProps> = ({ onExit }) => {
  // Simple PIN Authentication
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('ila_admin_auth') === 'true';
  });
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState(false);

  // Active Tab
  const [activeTab, setActiveTab] = useState<'dishes' | 'media' | 'reservations' | 'hero' | 'theme' | 'headings' | 'gallery'>('dishes');
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  // Menu State
  const [dishes, setDishes] = useState<MenuItem[]>([]);
  const [dishCategoryFilter, setDishCategoryFilter] = useState('all');
  const [dishSearch, setDishSearch] = useState('');
  const [editingDish, setEditingDish] = useState<MenuItem | null>(null);
  const [isDishModalOpen, setIsDishModalOpen] = useState(false);
  const [isSeeding, setIsSeeding] = useState(false);
  const [actionSuccess, setActionSuccess] = useState('');
  const [galleryCount, setGalleryCount] = useState<number>(8);

  // Subscribe to real-time menu items from Firestore
  useEffect(() => {
    if (!isAuthenticated) return;
    const unsubscribe = subscribeMenuItems((items) => {
      setDishes(items);
    });
    return () => unsubscribe();
  }, [isAuthenticated]);

  // Subscribe to real-time gallery items count
  useEffect(() => {
    if (!isAuthenticated) return;
    const unsubscribe = subscribeGalleryImages((items) => {
      setGalleryCount(items.length);
    });
    return () => unsubscribe();
  }, [isAuthenticated]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Default PIN: 350 (from Metro Pillar 350) or ila2026
    if (pinInput === '350' || pinInput.toLowerCase() === 'ila2026' || pinInput === 'admin') {
      setIsAuthenticated(true);
      localStorage.setItem('ila_admin_auth', 'true');
      setPinError(false);
    } else {
      setPinError(true);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('ila_admin_auth');
  };

  const handleSaveDish = async (dishData: Partial<MenuItem>) => {
    if (editingDish) {
      await updateMenuItem(editingDish.id, dishData);
      showSuccess(`"${dishData.name}" updated successfully.`);
    } else {
      await addMenuItem(dishData as MenuItem);
      showSuccess(`"${dishData.name}" added to menu.`);
    }
    setEditingDish(null);
  };

  const handleDeleteDish = async (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete "${name}" from the menu?`)) {
      await deleteMenuItem(id);
      showSuccess(`"${name}" removed from menu.`);
    }
  };

  const handleSeedDefaults = async () => {
    if (confirm('Populate/reset Firestore with all 14 curated Ila Kochi specialties?')) {
      setIsSeeding(true);
      try {
        await seedDefaultMenu();
        showSuccess('Firestore successfully seeded with default menu!');
      } catch (err) {
        console.error('Seed error:', err);
        alert('Failed to seed menu.');
      } finally {
        setIsSeeding(false);
      }
    }
  };

  const showSuccess = (msg: string) => {
    setActionSuccess(msg);
    setTimeout(() => setActionSuccess(''), 3500);
  };

  // Filtered dishes
  const filteredDishes = dishes.filter((dish) => {
    const matchesCat = dishCategoryFilter === 'all' || dish.category === dishCategoryFilter;
    const matchesSearch =
      dish.name.toLowerCase().includes(dishSearch.toLowerCase()) ||
      dish.description.toLowerCase().includes(dishSearch.toLowerCase()) ||
      (dish.malayalamName && dish.malayalamName.includes(dishSearch));
    return matchesCat && matchesSearch;
  });

  // Navigation Items for Admin Sidebar
  const navItems = [
    {
      id: 'dishes' as const,
      label: 'Food Items & Menu',
      shortLabel: 'Menu',
      icon: Utensils,
      badge: dishes.length,
      description: 'Manage signature dishes, categories, pricing, and Malayali translations',
    },
    {
      id: 'gallery' as const,
      label: 'Gallery Photos',
      shortLabel: 'Gallery',
      icon: Camera,
      badge: galleryCount,
      description: 'Curate restaurant ambiance, dining hall, and culinary captures',
    },
    {
      id: 'hero' as const,
      label: 'Hero Background',
      shortLabel: 'Hero',
      icon: ImageIcon,
      badge: undefined,
      description: 'Switch between cinematic 4K video reel and dynamic image slideshow',
    },
    {
      id: 'headings' as const,
      label: 'Headings & മലയാളം',
      shortLabel: 'Headings',
      icon: Languages,
      badge: 'Bilingual',
      description: 'Customize section titles with 1-click English, Malayalam, or Bilingual mode',
    },
    {
      id: 'theme' as const,
      label: 'Theme & Colors',
      shortLabel: 'Theme',
      icon: Palette,
      badge: 'Live',
      description: 'Fine-tune primary colors, typography styles, and dark luxury accents',
    },
    {
      id: 'media' as const,
      label: 'Cloudflare R2 Media',
      shortLabel: 'Media',
      icon: Film,
      badge: 'Uploads',
      description: 'Upload high-resolution dish photos and video files to Cloudflare R2',
    },
    {
      id: 'reservations' as const,
      label: 'Table Reservations',
      shortLabel: 'Bookings',
      icon: Calendar,
      badge: undefined,
      description: 'Review guest table bookings, guest counts, and special requests',
    },
  ];

  const currentTabInfo = navItems.find((item) => item.id === activeTab) || navItems[0];

  // 1. PIN GATE LOGIN VIEW
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#000000] text-[#F8F6EE] flex items-center justify-center p-4">
        <div className="w-full max-w-md p-8 rounded-3xl bg-[#050505] border border-[#262626]/70 shadow-2xl space-y-6 text-center">
          <div className="w-16 h-16 rounded-2xl bg-[#121212] border border-[#C5A46D]/60 flex items-center justify-center mx-auto text-[#C5A46D] shadow-xl">
            <Lock className="w-8 h-8" />
          </div>

          <div className="space-y-1">
            <h2 className="text-2xl font-serif-display font-medium text-[#F8F6EE]">
              ILA KOCHI Admin Portal
            </h2>
            <p className="text-xs text-[#A3A3A3]">
              Enter staff security PIN to access Food Items, Media &amp; Reservations
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="password"
              placeholder="Enter PIN (e.g. 350)"
              value={pinInput}
              onChange={(e) => {
                setPinInput(e.target.value);
                setPinError(false);
              }}
              className="w-full text-center tracking-[0.3em] font-mono text-lg py-3 rounded-xl bg-[#121212] border border-[#262626] text-[#F8F6EE] focus:outline-none focus:border-[#C5A46D] transition-colors"
              autoFocus
            />

            {pinError && (
              <p className="text-xs text-red-400">
                Invalid PIN. (Hint: Metro Pillar number 350 or 'admin')
              </p>
            )}

            <button
              type="submit"
              className="w-full py-3.5 rounded-full text-xs font-semibold uppercase tracking-wider text-[#050505] bg-[#C5A46D] hover:bg-[#d8b982] transition-colors shadow-lg cursor-pointer"
            >
              Access Admin Portal
            </button>
          </form>

          <button
            onClick={onExit}
            className="text-xs text-[#A3A3A3] hover:text-[#F8F6EE] underline cursor-pointer"
          >
            &larr; Back to Website
          </button>
        </div>
      </div>
    );
  }

  // 2. MAIN ADMIN PORTAL VIEW
  return (
    <div className="min-h-screen bg-[#000000] text-[#F8F6EE] flex flex-col md:flex-row">
      {/* Mobile Top App Bar (Visible on < md) */}
      <div className="md:hidden sticky top-0 z-40 bg-[#050505]/95 border-b border-[#262626]/60 backdrop-blur-md px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsMobileNavOpen(true)}
            className="p-2 rounded-xl bg-[#121212] border border-[#262626] text-[#F8F6EE] hover:border-[#C5A46D] transition-colors cursor-pointer"
            aria-label="Open Navigation Menu"
          >
            <Menu className="w-5 h-5 text-[#C5A46D]" />
          </button>
          <div className="flex items-center gap-2.5">
            <img
              src="/assets/ila-kochi-logo-white.png"
              alt="Ila Kochi Logo"
              className="h-8 w-auto object-contain"
            />
            <div>
              <span className="font-serif-display font-medium text-xs text-[#F8F6EE] block leading-tight">
                ILA KOCHI <span className="text-[#C5A46D] font-mono text-[10px]">ADMIN</span>
              </span>
              <span className="text-[10px] text-[#A3A3A3] font-sans-ui block">
                {currentTabInfo.shortLabel}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onExit}
            className="px-2.5 py-1.5 rounded-lg text-xs bg-[#121212] border border-[#262626] text-[#E5E5E5] hover:text-[#F8F6EE] flex items-center gap-1 cursor-pointer"
          >
            <ExternalLink className="w-3 h-3 text-[#C5A46D]" />
            <span>Site</span>
          </button>
          <button
            onClick={handleLogout}
            className="p-1.5 rounded-lg text-[#A3A3A3] hover:text-red-400 hover:bg-red-950/40 transition-colors cursor-pointer"
            title="Logout"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Mobile Sidebar Drawer (Slide-in Backdrop & Panel) */}
      {isMobileNavOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
            onClick={() => setIsMobileNavOpen(false)}
          />

          {/* Drawer Panel */}
          <div className="relative w-72 max-w-[85vw] bg-[#070707] border-r border-[#262626] p-5 flex flex-col justify-between z-10 h-full overflow-y-auto shadow-2xl">
            <div className="space-y-6">
              {/* Drawer Header */}
              <div className="flex items-center justify-between pb-4 border-b border-[#262626]/60">
                <div className="flex items-center gap-3">
                  <img
                    src="/assets/ila-kochi-logo-white.png"
                    alt="Ila Kochi Logo"
                    className="h-10 w-auto object-contain"
                  />
                  <div>
                    <div className="font-serif-display font-medium text-sm text-[#F8F6EE]">
                      ILA KOCHI
                    </div>
                    <div className="text-[10px] text-[#C5A46D] font-mono tracking-wider">
                      ADMIN PORTAL
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setIsMobileNavOpen(false)}
                  className="p-1.5 rounded-lg text-[#A3A3A3] hover:text-[#F8F6EE] hover:bg-[#161616] cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Status Pill */}
              <div className="px-3 py-2 rounded-xl bg-[#121212] border border-[#262626]/70 flex items-center gap-2 text-[11px] text-[#A3A3A3]">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse flex-shrink-0" />
                <span>Firestore &amp; R2 Connected</span>
              </div>

              {/* Navigation Items */}
              <div className="space-y-1">
                <div className="text-[10px] uppercase tracking-wider text-[#737373] px-2 font-semibold mb-2">
                  Management
                </div>
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveTab(item.id);
                        setIsMobileNavOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                        isActive
                          ? 'bg-[#C5A46D] text-[#050505] font-semibold shadow-md'
                          : 'text-[#D4D4D4] hover:text-[#F8F6EE] hover:bg-[#141414]'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-[#050505]' : 'text-[#C5A46D]'}`} />
                        <span className="truncate">{item.label}</span>
                      </div>
                      {item.badge !== undefined && (
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded-full font-mono flex-shrink-0 ${
                            isActive
                              ? 'bg-black/20 text-[#050505] font-bold'
                              : 'bg-[#181818] text-[#A3A3A3] border border-[#262626]'
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Drawer Footer Actions */}
            <div className="pt-6 border-t border-[#262626]/60 space-y-2">
              <button
                onClick={onExit}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs text-[#E5E5E5] hover:text-[#F8F6EE] bg-[#121212] border border-[#262626] transition-colors cursor-pointer"
              >
                <ExternalLink className="w-3.5 h-3.5 text-[#C5A46D]" />
                <span>View Public Website</span>
              </button>
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 py-2 rounded-xl text-xs text-red-400 hover:text-red-300 hover:bg-red-950/30 transition-colors cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Desktop Side Navigation Bar (w-72, sticky top-0, h-screen) */}
      <aside className="hidden md:flex w-72 shrink-0 h-screen sticky top-0 bg-[#070707] border-r border-[#262626]/60 flex-col justify-between p-5 overflow-y-auto">
        <div className="space-y-6">
          {/* Brand Header */}
          <div className="space-y-3 pb-4 border-b border-[#262626]/60">
            <div className="flex items-center gap-3">
              <img
                src="/assets/ila-kochi-logo-white.png"
                alt="Ila Kochi Logo"
                className="h-12 w-auto object-contain"
              />
              <div>
                <div className="font-serif-display font-medium text-base text-[#F8F6EE] leading-tight">
                  ILA KOCHI
                </div>
                <div className="inline-flex items-center gap-1.5 mt-0.5">
                  <span className="text-[10px] font-mono tracking-widest text-[#C5A46D] uppercase font-bold">
                    ADMIN
                  </span>
                  <span className="text-[10px] text-[#525252]">&bull;</span>
                  <span className="text-[10px] text-[#A3A3A3] font-mono">v2.0</span>
                </div>
              </div>
            </div>

            {/* Connection Status Pill */}
            <div className="px-3 py-1.5 rounded-lg bg-[#121212] border border-[#262626]/60 flex items-center justify-between text-[11px] text-[#A3A3A3]">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[#A3A3A3]">Live Connected</span>
              </div>
              <span className="text-[10px] font-mono text-[#737373]">Firestore</span>
            </div>
          </div>

          {/* Navigation Items */}
          <div className="space-y-1">
            <div className="text-[10px] uppercase tracking-wider text-[#737373] px-3 font-semibold mb-2 flex items-center justify-between">
              <span>Management</span>
              <span className="font-mono text-[9px] text-[#525252]">{navItems.length} SECTIONS</span>
            </div>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-medium transition-all group cursor-pointer ${
                    isActive
                      ? 'bg-[#C5A46D] text-[#050505] font-semibold shadow-md shadow-[#C5A46D]/15'
                      : 'text-[#D4D4D4] hover:text-[#F8F6EE] hover:bg-[#141414] border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <Icon
                      className={`w-4 h-4 flex-shrink-0 transition-transform group-hover:scale-110 ${
                        isActive ? 'text-[#050505]' : 'text-[#C5A46D]'
                      }`}
                    />
                    <span className="truncate">{item.label}</span>
                  </div>

                  {item.badge !== undefined && (
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-mono flex-shrink-0 ${
                        isActive
                          ? 'bg-black/20 text-[#050505] font-bold'
                          : 'bg-[#181818] text-[#A3A3A3] border border-[#262626]'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Sidebar Footer */}
        <div className="pt-4 border-t border-[#262626]/60 space-y-2 mt-6">
          <button
            onClick={onExit}
            className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs text-[#E5E5E5] hover:text-[#F8F6EE] bg-[#121212] hover:bg-[#1a1a1a] border border-[#262626]/70 transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <ExternalLink className="w-3.5 h-3.5 text-[#C5A46D]" />
              <span>View Website</span>
            </div>
            <span className="text-[10px] text-[#737373] font-mono">&rarr;</span>
          </button>

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-between px-3.5 py-2 rounded-xl text-xs text-[#A3A3A3] hover:text-red-400 hover:bg-red-950/20 transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </div>
            <span className="text-[10px] text-[#525252] font-mono">PIN 350</span>
          </button>

          <div className="text-[10px] text-[#525252] text-center pt-1 font-sans-ui">
            Ila Kochi Authentic Cuisine &bull; Kalamassery
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 min-w-0 flex flex-col min-h-screen">
        {/* Desktop Content Header */}
        <header className="hidden md:flex sticky top-0 z-30 bg-[#050505]/90 border-b border-[#262626]/50 backdrop-blur-md px-8 py-4 items-center justify-between">
          <div>
            <h1 className="text-lg font-serif-display font-medium text-[#F8F6EE] flex items-center gap-2.5">
              <span>{currentTabInfo.label}</span>
              {currentTabInfo.badge !== undefined && (
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#181818] border border-[#262626] text-[#C5A46D] font-mono font-medium">
                  {currentTabInfo.badge}
                </span>
              )}
            </h1>
            <p className="text-xs text-[#A3A3A3] mt-0.5">
              {currentTabInfo.description}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onExit}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs text-[#E5E5E5] hover:text-[#F8F6EE] bg-[#121212] hover:bg-[#1a1a1a] border border-[#262626]/60 transition-colors cursor-pointer"
            >
              <span>View Website</span>
              <ExternalLink className="w-3.5 h-3.5 text-[#C5A46D]" />
            </button>
          </div>
        </header>

        {/* Content Body */}
        <main className="flex-1 p-4 sm:p-8 max-w-7xl w-full mx-auto space-y-6">
          {/* Success Alert Banner */}
          {actionSuccess && (
            <div className="p-4 rounded-2xl bg-emerald-950/80 border border-emerald-500/50 text-xs text-emerald-200 flex items-center gap-2 animate-fadeIn">
              <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>{actionSuccess}</span>
            </div>
          )}

        {/* TAB 1: FOOD ITEMS & MENU MANAGEMENT */}
        {activeTab === 'dishes' && (
          <div className="space-y-6">
            {/* Top Toolbar */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-[#050505] border border-[#262626]/50">
              {/* Search & Category Filter */}
              <div className="flex items-center gap-3 w-full md:w-auto flex-1">
                <div className="relative flex-1 max-w-sm">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A3A3A3]" />
                  <input
                    type="text"
                    placeholder="Search dishes..."
                    value={dishSearch}
                    onChange={(e) => setDishSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#121212] border border-[#262626]/50 text-xs text-[#F8F6EE] focus:outline-none focus:border-[#C5A46D]"
                  />
                </div>

                <select
                  value={dishCategoryFilter}
                  onChange={(e) => setDishCategoryFilter(e.target.value)}
                  className="h-9 px-3 rounded-xl bg-[#121212] border border-[#262626]/50 text-xs text-[#F8F6EE] cursor-pointer"
                >
                  {menuCategories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 self-end md:self-auto flex-wrap">
                <button
                  onClick={handleSeedDefaults}
                  disabled={isSeeding}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#121212] hover:bg-[#262626] text-xs text-[#E5E5E5] border border-[#262626]/50 transition-colors cursor-pointer"
                  title="Seed default 14 dishes to Firestore"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isSeeding ? 'animate-spin' : ''}`} />
                  <span>{isSeeding ? 'Seeding...' : 'Seed Defaults'}</span>
                </button>

                <button
                  onClick={() => {
                    setEditingDish(null);
                    setIsDishModalOpen(true);
                  }}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#C5A46D] hover:bg-[#d8b982] text-xs font-semibold uppercase tracking-wider text-[#050505] transition-colors shadow-lg cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add New Dish</span>
                </button>
              </div>
            </div>

            {/* Dishes Grid */}
            {filteredDishes.length === 0 ? (
              <div className="text-center py-16 rounded-3xl bg-[#050505]/60 border border-[#262626]/30">
                <p className="text-sm text-[#A3A3A3]">No dishes found. Click "+ Add New Dish" or "Seed Defaults".</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredDishes.map((dish) => (
                  <div
                    key={dish.id}
                    className="p-4 rounded-3xl bg-[#050505] border border-[#262626]/50 hover:border-[#C5A46D]/60 transition-all shadow-xl flex flex-col justify-between space-y-3"
                  >
                    <div>
                      {/* Image & Badges */}
                      <div className="relative aspect-[16/10] rounded-2xl overflow-hidden mb-3 bg-black/40">
                        <img
                          src={dish.image}
                          alt={dish.name}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                        <div className="absolute top-2 left-2 flex flex-col gap-1">
                          {dish.badge && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider bg-[#050505]/90 text-[#C5A46D] border border-[#C5A46D]/40">
                              {dish.badge}
                            </span>
                          )}
                          {dish.featured && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider bg-emerald-950/90 text-emerald-300 border border-emerald-500/40">
                              Featured
                            </span>
                          )}
                        </div>

                        <span className="absolute bottom-2 right-2 px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-[#262626] text-[#F8F6EE]">
                          {dish.price}
                        </span>
                      </div>

                      {/* Info */}
                      <div className="space-y-1">
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="text-base font-serif-display font-medium text-[#F8F6EE] leading-snug">
                            {dish.name}
                          </h4>
                          <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-[#121212] text-[#A3A3A3] flex-shrink-0">
                            {dish.category}
                          </span>
                        </div>

                        {dish.malayalamName && (
                          <span className="text-xs text-[#C5A46D] font-sans-ui block">
                            {dish.malayalamName}
                          </span>
                        )}

                        <p className="text-xs text-[#E5E5E5]/80 line-clamp-2 font-light leading-relaxed pt-1">
                          {dish.description}
                        </p>
                      </div>
                    </div>

                    {/* Bottom Toolbar */}
                    <div className="pt-3 border-t border-[#262626]/30 flex items-center justify-between text-xs text-[#A3A3A3]">
                      <div className="flex items-center gap-1 font-mono text-[10px] text-[#C5A46D]">
                        {dish.spiceLevel && (
                          <span title={`Spice level: ${dish.spiceLevel}`}>
                            {'★'.repeat(dish.spiceLevel)}
                          </span>
                        )}
                        <span className="text-[#A3A3A3] uppercase ml-1.5">({dish.dietary})</span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => {
                            setEditingDish(dish);
                            setIsDishModalOpen(true);
                          }}
                          className="p-1.5 rounded-lg bg-[#121212] hover:bg-[#262626] text-[#E5E5E5] hover:text-[#F8F6EE] transition-colors cursor-pointer"
                          title="Edit Dish"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => handleDeleteDish(dish.id, dish.name)}
                          className="p-1.5 rounded-lg text-[#A3A3A3] hover:text-red-400 hover:bg-red-950/40 transition-colors cursor-pointer"
                          title="Delete Dish"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: CLOUDFLARE R2 MEDIA MANAGEMENT */}
        {activeTab === 'media' && <MediaUploadZone />}

        {/* TAB 3: TABLE RESERVATIONS */}
        {activeTab === 'reservations' && <ReservationsTable />}

        {/* TAB 4: HERO BACKGROUND MANAGEMENT (Images vs Video) */}
        {activeTab === 'hero' && <HeroBackgroundManager />}

        {/* TAB 5: WEBSITE THEME & COLOR PALETTE */}
        {activeTab === 'theme' && (
          <ThemeManager
            onSuccessNotice={(msg) => {
              setActionSuccess(msg);
              setTimeout(() => setActionSuccess(''), 3500);
            }}
          />
        )}

        {/* TAB 6: WEBSITE HEADINGS & MALAYALAM MANAGER */}
        {activeTab === 'headings' && (
          <HeadingsManager
            onSuccessNotice={(msg) => {
              setActionSuccess(msg);
              setTimeout(() => setActionSuccess(''), 3500);
            }}
          />
        )}

        {/* TAB 7: GALLERY PHOTOGRAPHS MANAGER */}
        {activeTab === 'gallery' && (
          <GalleryManager
            onSuccessNotice={(msg) => {
              setActionSuccess(msg);
              setTimeout(() => setActionSuccess(''), 3500);
            }}
          />
        )}
      </main>
      </div>

      {/* Dish Add/Edit Modal */}
      <FoodItemModal
        isOpen={isDishModalOpen}
        onClose={() => {
          setIsDishModalOpen(false);
          setEditingDish(null);
        }}
        onSave={handleSaveDish}
        initialData={editingDish}
      />
    </div>
  );
};
