import React from 'react';
import { MenuItem } from '../../data/menuData';
import { X, Flame, Leaf, MessageSquare, Utensils, Check } from 'lucide-react';

interface DishDetailModalProps {
  dish: MenuItem | null;
  onClose: () => void;
  onOpenReservation: () => void;
}

export const DishDetailModal: React.FC<DishDetailModalProps> = ({ dish, onClose, onOpenReservation }) => {
  if (!dish) return null;

  const handleWhatsAppPreOrder = () => {
    const text = `Hello ILA KOCHI Kitchen, I would like to inquire about ordering / reserving the dish: "${dish.name}" (${dish.price}). Could you let me know today's catch availability?`;
    window.open(`https://wa.me/919526267626?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-[#0B291E] border border-[#176B45]/80 rounded-3xl shadow-2xl my-auto text-[#F8F6EE]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-[#0B291E]/80 backdrop-blur-md text-[#A8BFA0] hover:text-[#F8F6EE] border border-[#176B45]/60 transition-colors cursor-pointer"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Hero Dish Image */}
        <div className="relative aspect-[16/9] w-full overflow-hidden">
          <img
            src={dish.image}
            alt={dish.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B291E] via-[#0B291E]/40 to-transparent" />

          {dish.badge && (
            <span className="absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-[#0B291E]/90 text-[#C5A46D] border border-[#C5A46D]/40 backdrop-blur-md">
              {dish.badge}
            </span>
          )}

          <div className="absolute bottom-4 left-6 right-6 flex items-end justify-between">
            <div>
              <span className="text-xs font-mono uppercase tracking-widest text-[#C5A46D] block">
                {dish.category.replace('-', ' ')}
              </span>
              <h3 className="text-2xl sm:text-3xl font-serif-display font-medium text-[#F8F6EE]">
                {dish.name}
              </h3>
              {dish.malayalamName && (
                <span className="text-sm text-[#A8BFA0] font-sans-ui block mt-0.5">
                  {dish.malayalamName}
                </span>
              )}
            </div>

            <span className="text-xl sm:text-2xl font-mono font-bold text-[#C5A46D] px-4 py-1.5 rounded-full bg-[#123D2A]/90 border border-[#176B45] shadow-lg">
              {dish.price}
            </span>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8 space-y-6">
          <div className="space-y-2">
            <h4 className="text-xs uppercase font-sans-ui tracking-[0.2em] text-[#C5A46D] font-semibold">
              Culinary Craftsmanship
            </h4>
            <p className="text-sm sm:text-base text-[#DCE8D5]/90 font-light leading-relaxed">
              {dish.description}
            </p>
          </div>

          {/* Dish Specs */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2 border-t border-[#176B45]/30">
            <div className="p-3 rounded-xl bg-[#123D2A]/60 border border-[#176B45]/30 space-y-0.5">
              <span className="text-[10px] uppercase tracking-wider text-[#A8BFA0] block">Dietary Profile</span>
              <span className="text-xs font-medium text-[#F8F6EE] uppercase">{dish.dietary}</span>
            </div>

            <div className="p-3 rounded-xl bg-[#123D2A]/60 border border-[#176B45]/30 space-y-0.5">
              <span className="text-[10px] uppercase tracking-wider text-[#A8BFA0] block">Spice Intensity</span>
              <div className="flex items-center gap-1 text-xs text-[#C5A46D]">
                <Flame className="w-3.5 h-3.5" />
                <span>{'🌶️'.repeat(dish.spiceLevel || 2)}</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-[#123D2A]/60 border border-[#176B45]/30 space-y-0.5 col-span-2 sm:col-span-1">
              <span className="text-[10px] uppercase tracking-wider text-[#A8BFA0] block">Serving Style</span>
              <div className="flex items-center gap-1 text-xs text-[#A8BFA0]">
                <Leaf className="w-3.5 h-3.5 text-[#C5A46D]" />
                <span className="text-[#DCE8D5]">Fresh Banana Leaf</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
            <button
              onClick={handleWhatsAppPreOrder}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3 rounded-full text-xs font-semibold uppercase tracking-wider bg-[#25D366] text-white hover:bg-[#20ba5a] transition-all shadow-lg cursor-pointer"
            >
              <MessageSquare className="w-4 h-4 fill-current" />
              <span>Ask Catch Availability</span>
            </button>

            <button
              onClick={() => {
                onClose();
                onOpenReservation();
              }}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full text-xs font-semibold uppercase tracking-wider bg-[#C5A46D] text-[#0B291E] hover:bg-[#d8b982] transition-all shadow-lg cursor-pointer"
            >
              <Utensils className="w-4 h-4" />
              <span>Reserve Table for This</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

