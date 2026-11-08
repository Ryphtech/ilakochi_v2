import React, { useState } from 'react';
import { galleryImages } from '../../data/galleryData';
import { X, ChevronLeft, ChevronRight, Maximize2, Sparkles } from 'lucide-react';

export const GallerySection: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<'all' | 'seafood' | 'ambience' | 'heritage' | 'kitchen'>('all');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const filteredImages = galleryImages.filter((img) =>
    activeCategory === 'all' ? true : img.category === activeCategory
  );

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    setLightboxIndex(null);
    document.body.style.overflow = 'auto';
  };

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (lightboxIndex !== null) {
      setLightboxIndex((lightboxIndex + 1) % filteredImages.length);
    }
  };

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (lightboxIndex !== null) {
      setLightboxIndex((lightboxIndex - 1 + filteredImages.length) % filteredImages.length);
    }
  };

  return (
    <section id="gallery" className="relative py-20 sm:py-24 lg:py-28 bg-[#0B291E] text-[#F8F6EE] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-12 sm:mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#123D2A] border border-[#176B45]/50 text-xs uppercase tracking-[0.2em] text-[#C5A46D] font-sans-ui">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Visual Tapestry</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif-display font-medium tracking-tight text-[#F8F6EE] leading-tight text-balance">
            Moments at ILA.
          </h2>
          <p className="text-sm sm:text-base text-[#DCE8D5] font-light leading-relaxed text-pretty">
            A glimpse into our fiery tawas, fresh banana leaves, and the authentic flavours that define every afternoon in Kochi.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center justify-start sm:justify-center space-x-2 overflow-x-auto pb-4 mb-8 sm:mb-10 scrollbar-none">
          {(['all', 'seafood', 'heritage', 'kitchen', 'ambience'] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full text-xs uppercase tracking-wider font-sans-ui whitespace-nowrap transition-all cursor-pointer ${
                activeCategory === cat
                  ? 'bg-[#C5A46D] text-[#0B291E] font-semibold shadow-md'
                  : 'bg-[#123D2A]/60 text-[#DCE8D5] hover:bg-[#176B45]/50 border border-[#176B45]/30'
              }`}
            >
              {cat === 'all' ? 'All Photographs' : cat}
            </button>
          ))}
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredImages.map((img, idx) => (
            <div
              key={img.id}
              onClick={() => openLightbox(idx)}
              className="group relative rounded-3xl overflow-hidden aspect-[4/3] bg-[#123D2A] border border-[#176B45]/40 hover:border-[#C5A46D] transition-all duration-500 shadow-xl cursor-pointer"
            >
              <img
                src={img.image}
                alt={img.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0B291E]/95 via-[#0B291E]/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-5 sm:p-6">
                <div className="flex justify-end">
                  <div className="p-2 rounded-full bg-[#0B291E]/80 text-[#C5A46D] border border-[#C5A46D]/40">
                    <Maximize2 className="w-4 h-4" />
                  </div>
                </div>

                <div className="space-y-1 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                  <span className="text-[10px] uppercase font-mono tracking-widest text-[#C5A46D]">
                    {img.category}
                  </span>
                  <h3 className="text-lg font-serif-display font-medium text-[#F8F6EE]">
                    {img.title}
                  </h3>
                  <p className="text-xs text-[#DCE8D5]/80 line-clamp-2">
                    {img.caption}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox Modal */}
      {lightboxIndex !== null && (
        <div
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-4"
          onClick={closeLightbox}
        >
          <button
            onClick={closeLightbox}
            className="absolute top-5 right-5 z-20 p-2.5 rounded-full bg-[#123D2A]/80 text-[#F8F6EE] hover:text-[#C5A46D] border border-[#176B45] transition-colors cursor-pointer"
            aria-label="Close Lightbox"
          >
            <X className="w-6 h-6" />
          </button>

          <button
            onClick={prevImage}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-[#123D2A]/80 text-[#F8F6EE] hover:text-[#C5A46D] border border-[#176B45] transition-colors cursor-pointer"
            aria-label="Previous photograph"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <button
            onClick={nextImage}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-[#123D2A]/80 text-[#F8F6EE] hover:text-[#C5A46D] border border-[#176B45] transition-colors cursor-pointer"
            aria-label="Next photograph"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          <div
            className="relative max-w-4xl max-h-[85vh] rounded-2xl overflow-hidden border border-[#176B45]/60 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={filteredImages[lightboxIndex].image}
              alt={filteredImages[lightboxIndex].title}
              className="w-full h-full max-h-[75vh] object-contain bg-black"
            />
            <div className="p-4 sm:p-5 bg-[#0B291E] border-t border-[#176B45]/40 flex items-center justify-between">
              <div>
                <h4 className="text-base sm:text-lg font-serif-display font-medium text-[#F8F6EE]">
                  {filteredImages[lightboxIndex].title}
                </h4>
                <p className="text-xs text-[#A8BFA0] mt-0.5">
                  {filteredImages[lightboxIndex].caption}
                </p>
              </div>
              <span className="text-xs font-mono text-[#C5A46D]">
                {lightboxIndex + 1} / {filteredImages.length}
              </span>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
