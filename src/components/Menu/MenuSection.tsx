import React, { useState, useEffect, useMemo } from 'react';
import { menuCategories, menuItems as fallbackMenuItems, MenuItem } from '../../data/menuData';
import { subscribeMenuItems } from '../../lib/firebase';
import { Search, Flame, Sparkles, Filter, ArrowRight } from 'lucide-react';

interface MenuSectionProps {
  onOpenReservation: () => void;
  onSelectDish?: (dish: MenuItem) => void;
}

export const MenuSection: React.FC<MenuSectionProps> = ({ onOpenReservation, onSelectDish }) => {
  const [items, setItems] = useState<MenuItem[]>(fallbackMenuItems);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [dietaryFilter, setDietaryFilter] = useState<'all' | 'seafood' | 'non-veg' | 'veg'>('all');

  // Real-time sync with Firebase Firestore
  useEffect(() => {
    const unsubscribe = subscribeMenuItems((firestoreItems) => {
      if (firestoreItems && firestoreItems.length > 0) {
        setItems(firestoreItems);
      } else {
        setItems(fallbackMenuItems);
      }
    });
    return () => unsubscribe();
  }, []);

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchesCategory =
        selectedCategory === 'all' || item.category === selectedCategory;

      const matchesDietary =
        dietaryFilter === 'all' || item.dietary === dietaryFilter;

      const matchesSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.malayalamName && item.malayalamName.includes(searchQuery));

      return matchesCategory && matchesDietary && matchesSearch;
    });
  }, [items, selectedCategory, dietaryFilter, searchQuery]);

  return (
    <section id="menu" className="relative py-20 sm:py-24 lg:py-28 bg-[#0B291E] text-[#F8F6EE] overflow-hidden">
      {/* Decorative ambient background */}
      <div className="absolute top-1/3 right-0 w-96 h-96 bg-[#176B45]/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-80 h-80 bg-[#C5A46D]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-12 sm:mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#123D2A] border border-[#176B45]/50 text-xs uppercase tracking-[0.2em] text-[#C5A46D] font-sans-ui">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Curated Culinary Offerings</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif-display font-medium tracking-tight text-[#F8F6EE] leading-tight text-balance">
            Explore our menu.
          </h2>
          <p className="text-sm sm:text-base text-[#DCE8D5]/85 font-light leading-relaxed text-pretty">
            Fresh fish brought daily, wood-pressed coconut oil, stone-ground Malabar spices, and traditional meals served on steaming green plantain leaves.
          </p>

          {/* Search bar */}
          <div className="pt-3 max-w-md mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A8BFA0]" />
              <input
                type="text"
                placeholder="Search fish, prawns, beef roast, meals..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-14 py-3 rounded-full bg-[#123D2A]/80 border border-[#176B45]/60 text-sm text-[#F8F6EE] placeholder-[#A8BFA0]/60 focus:outline-none focus:border-[#C5A46D] focus:ring-1 focus:ring-[#C5A46D] transition-all shadow-inner"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-[#A8BFA0] hover:text-[#F8F6EE] cursor-pointer"
                >
                  Clear
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex items-center justify-start lg:justify-center space-x-2 overflow-x-auto pb-4 mb-8 scrollbar-none">
          {menuCategories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-5 py-2.5 rounded-full text-xs uppercase tracking-wider font-sans-ui font-medium whitespace-nowrap transition-all duration-300 cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-[#C5A46D] text-[#0B291E] shadow-lg shadow-[#0B291E]/50 font-semibold'
                  : 'bg-[#123D2A]/70 text-[#DCE8D5] hover:bg-[#176B45]/60 border border-[#176B45]/30'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Dietary Filter Pills */}
        <div className="flex items-center justify-between flex-wrap gap-4 mb-8 pb-4 border-b border-[#176B45]/30">
          <div className="flex items-center gap-2">
            <Filter className="w-3.5 h-3.5 text-[#C5A46D]" />
            <span className="text-xs uppercase tracking-wider text-[#A8BFA0] font-sans-ui">Filter by:</span>
            {(['all', 'seafood', 'non-veg', 'veg'] as const).map((diet) => (
              <button
                key={diet}
                onClick={() => setDietaryFilter(diet)}
                className={`text-[11px] uppercase tracking-wider px-3 py-1 rounded-md transition-colors cursor-pointer ${
                  dietaryFilter === diet
                    ? 'bg-[#176B45] text-[#F8F6EE] font-medium'
                    : 'text-[#A8BFA0] hover:text-[#F8F6EE]'
                }`}
              >
                {diet === 'all' ? 'All' : diet}
              </button>
            ))}
          </div>

          <div className="text-xs text-[#A8BFA0]">
            Showing <span className="text-[#C5A46D] font-mono font-medium">{filteredItems.length}</span> specialties
          </div>
        </div>

        {/* Menu Grid */}
        {filteredItems.length === 0 ? (
          <div className="text-center py-16 space-y-3">
            <p className="text-lg text-[#DCE8D5] font-serif-display">No dishes match your search.</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
                setDietaryFilter('all');
              }}
              className="text-xs text-[#C5A46D] underline hover:text-[#d8b982] cursor-pointer"
            >
              Reset all filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                onClick={() => onSelectDish && onSelectDish(item)}
                className="group rounded-3xl bg-[#123D2A]/60 border border-[#176B45]/40 hover:border-[#C5A46D]/60 p-5 transition-all duration-300 hover:-translate-y-1 shadow-xl flex flex-col justify-between cursor-pointer"
              >
                <div>
                  {/* Image with Aspect Ratio */}
                  <div className="relative aspect-[16/10] rounded-2xl overflow-hidden mb-4">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                      decoding="async"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0B291E]/80 via-transparent to-transparent" />

                    {item.badge && (
                      <span className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider bg-[#0B291E]/85 text-[#C5A46D] border border-[#C5A46D]/30 backdrop-blur-sm">
                        {item.badge}
                      </span>
                    )}

                    <span className="absolute bottom-2.5 right-2.5 px-3 py-1 rounded-full text-xs font-mono font-semibold bg-[#176B45]/90 text-[#F8F6EE] border border-[#A8BFA0]/30 shadow-md">
                      {item.price}
                    </span>
                  </div>

                  {/* Title & Malayalam */}
                  <div className="space-y-0.5 mb-2">
                    <h3 className="text-lg font-serif-display font-medium text-[#F8F6EE] group-hover:text-[#C5A46D] transition-colors leading-snug">
                      {item.name}
                    </h3>
                    {item.malayalamName && (
                      <span className="text-xs text-[#A8BFA0] font-sans-ui block">
                        {item.malayalamName}
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-[#DCE8D5]/80 font-light leading-relaxed line-clamp-3">
                    {item.description}
                  </p>
                </div>

                {/* Bottom Row */}
                <div className="mt-4 pt-3.5 border-t border-[#176B45]/30 flex items-center justify-between text-[11px] text-[#A8BFA0]">
                  <div className="flex items-center gap-1">
                    {item.spiceLevel && (
                      <>
                        <Flame className="w-3.5 h-3.5 text-[#C5A46D]" />
                        <span className="font-mono text-[#C5A46D]">
                          {'★'.repeat(item.spiceLevel)}
                        </span>
                      </>
                    )}
                  </div>

                  <span className="uppercase text-[9px] tracking-wider px-2.5 py-0.5 rounded-full bg-[#0B291E] border border-[#176B45]/50 text-[#DCE8D5]">
                    {item.dietary}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Menu Actions Banner */}
        <div className="mt-14 sm:mt-16 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#123D2A] via-[#176B45]/40 to-[#123D2A] border border-[#176B45]/60 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-2xl">
          <div className="space-y-1 text-center sm:text-left">
            <h4 className="text-xl sm:text-2xl font-serif-display text-[#F8F6EE]">
              Craving fresh seafood on leaf today?
            </h4>
            <p className="text-xs sm:text-sm text-[#DCE8D5]/80 font-light">
              Live catch is prepared freshly upon order. Reserve your table or contact us for takeaway.
            </p>
          </div>

          <div className="flex items-center gap-3 flex-wrap justify-center">
            <button
              onClick={onOpenReservation}
              className="px-6 py-3 rounded-full text-xs font-semibold uppercase tracking-wider bg-[#C5A46D] text-[#0B291E] hover:bg-[#d8b982] transition-colors shadow-lg cursor-pointer"
            >
              Reserve A Table
            </button>
            <a
              href="#location"
              className="px-5 py-3 rounded-full text-xs font-medium uppercase tracking-wider text-[#F8F6EE] border border-[#176B45] hover:border-[#C5A46D] bg-[#0B291E]/60 transition-colors"
            >
              Get Directions
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
