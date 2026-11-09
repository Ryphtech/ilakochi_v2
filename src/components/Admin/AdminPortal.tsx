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
import {
  Utensils,
  Film,
  Calendar,
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
  const [activeTab, setActiveTab] = useState<'dishes' | 'media' | 'reservations'>('dishes');

  // Menu State
  const [dishes, setDishes] = useState<MenuItem[]>([]);
  const [dishCategoryFilter, setDishCategoryFilter] = useState('all');
  const [dishSearch, setDishSearch] = useState('');
  const [editingDish, setEditingDish] = useState<MenuItem | null>(null);
  const [isDishModalOpen, setIsDishModalOpen] = useState(false);
  const [isSeeding, setIsSeeding] = useState(false);
  const [actionSuccess, setActionSuccess] = useState('');

  // Subscribe to real-time menu items from Firestore
  useEffect(() => {
    if (!isAuthenticated) return;
    const unsubscribe = subscribeMenuItems((items) => {
      setDishes(items);
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

  // 1. PIN GATE LOGIN VIEW
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#071B14] text-[#F8F6EE] flex items-center justify-center p-4">
        <div className="w-full max-w-md p-8 rounded-3xl bg-[#0B291E] border border-[#176B45]/70 shadow-2xl space-y-6 text-center">
          <div className="w-16 h-16 rounded-2xl bg-[#123D2A] border border-[#C5A46D]/60 flex items-center justify-center mx-auto text-[#C5A46D] shadow-xl">
            <Lock className="w-8 h-8" />
          </div>

          <div className="space-y-1">
            <h2 className="text-2xl font-serif-display font-medium text-[#F8F6EE]">
              ILA KOCHI Admin Portal
            </h2>
            <p className="text-xs text-[#A8BFA0]">
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
              className="w-full text-center tracking-[0.3em] font-mono text-lg py-3 rounded-xl bg-[#123D2A] border border-[#176B45] text-[#F8F6EE] focus:outline-none focus:border-[#C5A46D] transition-colors"
              autoFocus
            />

            {pinError && (
              <p className="text-xs text-red-400">
                Invalid PIN. (Hint: Metro Pillar number 350 or 'admin')
              </p>
            )}

            <button
              type="submit"
              className="w-full py-3.5 rounded-full text-xs font-semibold uppercase tracking-wider text-[#0B291E] bg-[#C5A46D] hover:bg-[#d8b982] transition-colors shadow-lg cursor-pointer"
            >
              Access Admin Portal
            </button>
          </form>

          <button
            onClick={onExit}
            className="text-xs text-[#A8BFA0] hover:text-[#F8F6EE] underline cursor-pointer"
          >
            &larr; Back to Website
          </button>
        </div>
      </div>
    );
  }

  // 2. MAIN ADMIN PORTAL VIEW
  return (
    <div className="min-h-screen bg-[#071B14] text-[#F8F6EE]">
      {/* Top Admin Header */}
      <header className="sticky top-0 z-40 bg-[#0B291E]/95 border-b border-[#176B45]/50 backdrop-blur-md px-4 sm:px-8 py-3.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <img
              src="/assets/ila-kochi-logo-white.png"
              alt="Ila Kochi Logo"
              className="h-9 w-auto object-contain"
            />
            <div>
              <span className="text-sm sm:text-base font-serif-display font-medium text-[#F8F6EE] block leading-tight">
                ILA KOCHI <span className="text-[#C5A46D] font-mono text-xs">ADMIN</span>
              </span>
              <span className="text-[10px] text-[#A8BFA0] font-sans-ui block">
                Firebase Firestore &bull; Cloudflare R2 Connected
              </span>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-3">
            <button
              onClick={onExit}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs text-[#DCE8D5] hover:text-[#F8F6EE] bg-[#123D2A] border border-[#176B45]/50 transition-colors cursor-pointer"
            >
              <span>View Website</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={handleLogout}
              className="p-2 rounded-full text-[#A8BFA0] hover:text-red-400 hover:bg-red-950/40 transition-colors cursor-pointer"
              title="Logout from Admin"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Body */}
      <main className="max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-8">
        {/* Success Alert Banner */}
        {actionSuccess && (
          <div className="p-4 rounded-2xl bg-emerald-950/80 border border-emerald-500/50 text-xs text-emerald-200 flex items-center gap-2 animate-fadeIn">
            <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span>{actionSuccess}</span>
          </div>
        )}

        {/* Tab Selector Navigation */}
        <div className="flex items-center gap-2 border-b border-[#176B45]/40 pb-3 overflow-x-auto">
          <button
            onClick={() => setActiveTab('dishes')}
            className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs uppercase tracking-wider font-semibold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'dishes'
                ? 'bg-[#C5A46D] text-[#0B291E] shadow-lg'
                : 'text-[#DCE8D5] hover:bg-[#123D2A] border border-transparent'
            }`}
          >
            <Utensils className="w-4 h-4" />
            <span>Food Items &amp; Menu ({dishes.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('media')}
            className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs uppercase tracking-wider font-semibold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'media'
                ? 'bg-[#C5A46D] text-[#0B291E] shadow-lg'
                : 'text-[#DCE8D5] hover:bg-[#123D2A] border border-transparent'
            }`}
          >
            <Film className="w-4 h-4" />
            <span>Cloudflare R2 Media (Uploads)</span>
          </button>

          <button
            onClick={() => setActiveTab('reservations')}
            className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs uppercase tracking-wider font-semibold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'reservations'
                ? 'bg-[#C5A46D] text-[#0B291E] shadow-lg'
                : 'text-[#DCE8D5] hover:bg-[#123D2A] border border-transparent'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Table Reservations</span>
          </button>
        </div>

        {/* TAB 1: FOOD ITEMS & MENU MANAGEMENT */}
        {activeTab === 'dishes' && (
          <div className="space-y-6">
            {/* Top Toolbar */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-[#0B291E] border border-[#176B45]/50">
              {/* Search & Category Filter */}
              <div className="flex items-center gap-3 w-full md:w-auto flex-1">
                <div className="relative flex-1 max-w-sm">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A8BFA0]" />
                  <input
                    type="text"
                    placeholder="Search dishes..."
                    value={dishSearch}
                    onChange={(e) => setDishSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#123D2A] border border-[#176B45]/50 text-xs text-[#F8F6EE] focus:outline-none focus:border-[#C5A46D]"
                  />
                </div>

                <select
                  value={dishCategoryFilter}
                  onChange={(e) => setDishCategoryFilter(e.target.value)}
                  className="h-9 px-3 rounded-xl bg-[#123D2A] border border-[#176B45]/50 text-xs text-[#F8F6EE] cursor-pointer"
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
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#123D2A] hover:bg-[#176B45] text-xs text-[#DCE8D5] border border-[#176B45]/50 transition-colors cursor-pointer"
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
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#C5A46D] hover:bg-[#d8b982] text-xs font-semibold uppercase tracking-wider text-[#0B291E] transition-colors shadow-lg cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add New Dish</span>
                </button>
              </div>
            </div>

            {/* Dishes Grid */}
            {filteredDishes.length === 0 ? (
              <div className="text-center py-16 rounded-3xl bg-[#0B291E]/60 border border-[#176B45]/30">
                <p className="text-sm text-[#A8BFA0]">No dishes found. Click "+ Add New Dish" or "Seed Defaults".</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredDishes.map((dish) => (
                  <div
                    key={dish.id}
                    className="p-4 rounded-3xl bg-[#0B291E] border border-[#176B45]/50 hover:border-[#C5A46D]/60 transition-all shadow-xl flex flex-col justify-between space-y-3"
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
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider bg-[#0B291E]/90 text-[#C5A46D] border border-[#C5A46D]/40">
                              {dish.badge}
                            </span>
                          )}
                          {dish.featured && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider bg-emerald-950/90 text-emerald-300 border border-emerald-500/40">
                              Featured
                            </span>
                          )}
                        </div>

                        <span className="absolute bottom-2 right-2 px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-[#176B45] text-[#F8F6EE]">
                          {dish.price}
                        </span>
                      </div>

                      {/* Info */}
                      <div className="space-y-1">
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="text-base font-serif-display font-medium text-[#F8F6EE] leading-snug">
                            {dish.name}
                          </h4>
                          <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-[#123D2A] text-[#A8BFA0] flex-shrink-0">
                            {dish.category}
                          </span>
                        </div>

                        {dish.malayalamName && (
                          <span className="text-xs text-[#C5A46D] font-sans-ui block">
                            {dish.malayalamName}
                          </span>
                        )}

                        <p className="text-xs text-[#DCE8D5]/80 line-clamp-2 font-light leading-relaxed pt-1">
                          {dish.description}
                        </p>
                      </div>
                    </div>

                    {/* Bottom Toolbar */}
                    <div className="pt-3 border-t border-[#176B45]/30 flex items-center justify-between text-xs text-[#A8BFA0]">
                      <div className="flex items-center gap-1 font-mono text-[10px] text-[#C5A46D]">
                        {dish.spiceLevel && (
                          <span title={`Spice level: ${dish.spiceLevel}`}>
                            {'★'.repeat(dish.spiceLevel)}
                          </span>
                        )}
                        <span className="text-[#A8BFA0] uppercase ml-1.5">({dish.dietary})</span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => {
                            setEditingDish(dish);
                            setIsDishModalOpen(true);
                          }}
                          className="p-1.5 rounded-lg bg-[#123D2A] hover:bg-[#176B45] text-[#DCE8D5] hover:text-[#F8F6EE] transition-colors cursor-pointer"
                          title="Edit Dish"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => handleDeleteDish(dish.id, dish.name)}
                          className="p-1.5 rounded-lg text-[#A8BFA0] hover:text-red-400 hover:bg-red-950/40 transition-colors cursor-pointer"
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
      </main>

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
