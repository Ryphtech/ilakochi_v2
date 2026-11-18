import React, { useState, useEffect, useMemo } from 'react';
import { GalleryImage, galleryImages as defaultGalleryImages } from '../../data/galleryData';
import {
  subscribeGalleryImages,
  addGalleryImage,
  updateGalleryImage,
  deleteGalleryImage,
  seedDefaultGallery,
} from '../../lib/firebase';
import { GalleryImageModal } from './GalleryImageModal';
import {
  Image as ImageIcon,
  Plus,
  Edit2,
  Trash2,
  Search,
  Sparkles,
  CheckCircle,
  ExternalLink,
  Layers,
  RotateCcw,
  Maximize2,
  X,
} from 'lucide-react';

interface GalleryManagerProps {
  onSuccessNotice?: (message: string) => void;
}

const CATEGORIES = [
  { id: 'all', label: 'All Photos' },
  { id: 'seafood', label: 'Seafood' },
  { id: 'heritage', label: 'Heritage & Living Leaf' },
  { id: 'ambience', label: 'Ambience' },
  { id: 'kitchen', label: 'Kitchen Craft' },
] as const;

export const GalleryManager: React.FC<GalleryManagerProps> = ({ onSuccessNotice }) => {
  const [images, setImages] = useState<GalleryImage[]>(defaultGalleryImages);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [editingImage, setEditingImage] = useState<GalleryImage | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState<GalleryImage | null>(null);
  const [isSeeding, setIsSeeding] = useState(false);
  const [alertSuccess, setAlertSuccess] = useState('');

  // Subscribe to live gallery images from Firestore & cache
  useEffect(() => {
    const unsubscribe = subscribeGalleryImages((items) => {
      if (items && items.length > 0) {
        setImages(items);
      }
    });
    return () => unsubscribe();
  }, []);

  const showAlert = (msg: string) => {
    setAlertSuccess(msg);
    if (onSuccessNotice) {
      onSuccessNotice(msg);
    }
    setTimeout(() => setAlertSuccess(''), 3500);
  };

  const handleSaveImage = async (data: Partial<GalleryImage>) => {
    if (editingImage) {
      await updateGalleryImage(editingImage.id, data);
      showAlert(`"${data.title || 'Photograph'}" updated successfully.`);
    } else {
      await addGalleryImage(data as GalleryImage);
      showAlert(`"${data.title || 'New photograph'}" published to gallery.`);
    }
    setEditingImage(null);
  };

  const handleDeleteImage = async (id: string, title: string) => {
    if (confirm(`Are you sure you want to delete "${title}" from the gallery?`)) {
      await deleteGalleryImage(id);
      showAlert(`"${title}" removed from gallery.`);
    }
  };

  const handleResetDefaults = async () => {
    if (confirm('Reset gallery to all 8 original curated Ila Kochi photographs?')) {
      setIsSeeding(true);
      try {
        await seedDefaultGallery();
        showAlert('Gallery successfully reset with 8 curated photographs.');
      } catch (err) {
        console.error('Reset error:', err);
        alert('Failed to reset gallery.');
      } finally {
        setIsSeeding(false);
      }
    }
  };

  const filteredImages = useMemo(() => {
    return images.filter((img) => {
      const matchesCategory = activeCategory === 'all' || img.category === activeCategory;
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        !searchQuery.trim() ||
        img.title.toLowerCase().includes(q) ||
        img.caption.toLowerCase().includes(q) ||
        img.category.toLowerCase().includes(q);
      return matchesCategory && matchesSearch;
    });
  }, [images, activeCategory, searchQuery]);

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Success Notification */}
      {alertSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-950/80 border border-emerald-500/50 text-emerald-200 flex items-center gap-3 animate-fadeIn">
          <CheckCircle className="w-5 h-5 flex-shrink-0 text-emerald-400" />
          <span className="text-xs sm:text-sm font-medium">{alertSuccess}</span>
        </div>
      )}

      {/* Top Controller Header */}
      <div className="p-6 rounded-3xl bg-[#050505] border border-[#262626]/60 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
        <div className="space-y-1 text-center md:text-left">
          <div className="flex items-center gap-2.5 justify-center md:justify-start">
            <ImageIcon className="w-5 h-5 text-[#C5A46D]" />
            <h3 className="text-lg font-serif-display font-medium text-[#F8F6EE]">
              Gallery Photographs Manager
            </h3>
            <span className="px-2.5 py-0.5 rounded-full bg-[#121212] border border-[#262626] text-[10px] font-mono text-[#C5A46D] font-bold">
              {images.length} Photos
            </span>
          </div>
          <p className="text-xs text-[#A3A3A3]">
            Add, modify, or remove photos shown in the &ldquo;Moments at ILA&rdquo; visual gallery section.
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap justify-center">
          <button
            type="button"
            onClick={handleResetDefaults}
            disabled={isSeeding}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider text-[#A3A3A3] hover:text-[#F8F6EE] bg-[#121212] hover:bg-[#1a1a1a] border border-[#262626] transition-colors cursor-pointer disabled:opacity-50"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{isSeeding ? 'Resetting...' : 'Reset Defaults'}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setEditingImage(null);
              setIsModalOpen(true);
            }}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider bg-[#C5A46D] hover:bg-[#d8b982] text-[#050505] transition-all shadow-lg hover:scale-105 active:scale-95 cursor-pointer"
          >
            <Plus className="w-4 h-4 text-[#050505]" />
            <span>Add New Photograph</span>
          </button>
        </div>
      </div>

      {/* Search & Category Filter Toolbar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-[#050505] border border-[#262626]/50">
        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A3A3A3]" />
          <input
            type="text"
            placeholder="Search photos by title or caption..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#121212] border border-[#262626]/60 text-xs text-[#F8F6EE] placeholder-[#A3A3A3] focus:outline-none focus:border-[#C5A46D]"
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs uppercase tracking-wider font-semibold transition-all cursor-pointer whitespace-nowrap ${
                activeCategory === cat.id
                  ? 'bg-[#C5A46D] text-[#050505] shadow'
                  : 'bg-[#121212] text-[#A3A3A3] hover:text-[#F8F6EE] border border-[#262626]/50'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Gallery Cards Grid */}
      {filteredImages.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-[#050505] border border-[#262626]/50 space-y-3">
          <ImageIcon className="w-10 h-10 text-[#A3A3A3] mx-auto opacity-50" />
          <h4 className="text-sm font-semibold text-[#F8F6EE]">No Photographs Found</h4>
          <p className="text-xs text-[#A3A3A3] max-w-sm mx-auto">
            No gallery items match your current filter or search criteria.
          </p>
          <button
            onClick={() => {
              setActiveCategory('all');
              setSearchQuery('');
            }}
            className="text-xs text-[#C5A46D] hover:underline cursor-pointer"
          >
            Clear filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filteredImages.map((img) => {
            const isWide = img.span === 'col-span-2';

            return (
              <div
                key={img.id}
                className="group relative rounded-2xl overflow-hidden bg-[#121212] border border-[#262626]/60 hover:border-[#C5A46D] transition-all shadow-lg flex flex-col justify-between"
              >
                <div>
                  {/* Image Frame */}
                  <div className="relative aspect-[4/3] overflow-hidden bg-black">
                    <img
                      src={img.image}
                      alt={img.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />

                    {/* Top Badges */}
                    <div className="absolute top-2 left-2 flex items-center gap-1.5 flex-wrap">
                      <span className="px-2 py-0.5 rounded-md bg-black/80 text-[9px] font-mono uppercase tracking-wider text-[#C5A46D] font-bold border border-white/10">
                        {img.category}
                      </span>
                      {isWide && (
                        <span className="px-2 py-0.5 rounded-md bg-[#C5A46D] text-black text-[9px] font-mono uppercase font-bold">
                          Wide
                        </span>
                      )}
                    </div>

                    {/* Quick Lightbox Zoom Button */}
                    <button
                      type="button"
                      onClick={() => setPreviewImage(img)}
                      className="absolute top-2 right-2 p-1.5 rounded-lg bg-black/75 text-[#F8F6EE] hover:text-[#C5A46D] transition-colors cursor-pointer opacity-0 group-hover:opacity-100"
                      title="Enlarge preview"
                    >
                      <Maximize2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Meta Content */}
                  <div className="p-4 space-y-1.5">
                    <h4 className="text-sm font-serif-display font-medium text-[#F8F6EE] line-clamp-1">
                      {img.title}
                    </h4>
                    <p className="text-xs text-[#A3A3A3] line-clamp-2 leading-relaxed">
                      {img.caption}
                    </p>
                  </div>
                </div>

                {/* Card Action Footer */}
                <div className="p-3 border-t border-[#262626]/40 flex items-center justify-between gap-2 bg-[#0d0d0d]">
                  <button
                    type="button"
                    onClick={() => {
                      setEditingImage(img);
                      setIsModalOpen(true);
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-[#E5E5E5] hover:text-[#F8F6EE] bg-[#1a1a1a] hover:bg-[#262626] transition-colors cursor-pointer flex-1 justify-center"
                  >
                    <Edit2 className="w-3 h-3 text-[#C5A46D]" />
                    <span>Modify</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDeleteImage(img.id, img.title)}
                    className="p-1.5 rounded-lg text-rose-400 hover:text-white hover:bg-rose-900/60 bg-[#1a1a1a] transition-colors cursor-pointer"
                    title="Remove photograph"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add / Edit Image Modal */}
      <GalleryImageModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingImage(null);
        }}
        onSave={handleSaveImage}
        initialData={editingImage}
      />

      {/* Enlarge Preview Modal */}
      {previewImage && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setPreviewImage(null)}
        >
          <div
            className="relative max-w-4xl max-h-[85vh] rounded-3xl overflow-hidden border border-[#262626] bg-[#0a0a0a] shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setPreviewImage(null)}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/80 text-[#F8F6EE] hover:text-[#C5A46D] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <img
              src={previewImage.image}
              alt={previewImage.title}
              className="w-full h-full max-h-[70vh] object-contain bg-black"
            />

            <div className="p-5 border-t border-[#262626]/50 bg-[#0d0d0d] space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#C5A46D]">
                  {previewImage.category}
                </span>
              </div>
              <h4 className="text-base font-serif-display font-medium text-[#F8F6EE]">
                {previewImage.title}
              </h4>
              <p className="text-xs text-[#A3A3A3]">
                {previewImage.caption}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
