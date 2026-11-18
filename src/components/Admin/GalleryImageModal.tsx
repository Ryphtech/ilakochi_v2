import React, { useState, useEffect } from 'react';
import { GalleryImage } from '../../data/galleryData';
import { uploadFileToR2, CORE_R2_MEDIA, listR2Objects, R2MediaItem } from '../../lib/r2';
import { saveMediaUploadMeta } from '../../lib/firebase';
import { X, Upload, Sparkles, Image, Check, AlertCircle, Eye, Layers } from 'lucide-react';

interface GalleryImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (item: Partial<GalleryImage>) => Promise<void>;
  initialData?: GalleryImage | null;
}

const CATEGORIES = [
  { id: 'seafood', label: 'Seafood Speciality', badgeColor: 'text-amber-400 border-amber-500/40 bg-amber-950/30' },
  { id: 'heritage', label: 'Heritage & Living Leaf', badgeColor: 'text-emerald-400 border-emerald-500/40 bg-emerald-950/30' },
  { id: 'ambience', label: 'Coastal Ambience', badgeColor: 'text-purple-400 border-purple-500/40 bg-purple-950/30' },
  { id: 'kitchen', label: 'Kitchen Craft & Hearth', badgeColor: 'text-cyan-400 border-cyan-500/40 bg-cyan-950/30' },
] as const;

export const GalleryImageModal: React.FC<GalleryImageModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData,
}) => {
  const [formData, setFormData] = useState<Partial<GalleryImage>>({
    title: '',
    caption: '',
    category: 'seafood',
    image: '',
    span: 'col-span-1',
  });

  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [showR2Picker, setShowR2Picker] = useState(false);
  const [r2Images, setR2Images] = useState<R2MediaItem[]>(CORE_R2_MEDIA.filter((m) => m.type === 'image'));

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({
        title: '',
        caption: '',
        category: 'seafood',
        image: '',
        span: 'col-span-1',
      });
    }
    setUploadError('');
    setShowR2Picker(false);
  }, [initialData, isOpen]);

  useEffect(() => {
    if (isOpen) {
      listR2Objects().then((items) => {
        const imagesOnly = items.filter((m) => m.type === 'image');
        if (imagesOnly.length > 0) {
          setR2Images(imagesOnly);
        }
      });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadError('');

    try {
      const result = await uploadFileToR2(file);
      if (result.success && result.url) {
        setFormData((prev) => ({
          ...prev,
          image: result.url,
          title: prev.title || file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' '),
        }));

        // Log upload metadata
        await saveMediaUploadMeta({
          name: file.name,
          key: result.key || file.name,
          url: result.url,
          size: file.size,
          type: file.type,
        });
      } else {
        setUploadError('Upload to Cloudflare R2 failed. Please check network.');
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Upload failed';
      setUploadError(msg);
    } finally {
      setIsUploading(false);
      e.target.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title?.trim() || !formData.image?.trim()) {
      setUploadError('Please provide both a title and an image URL.');
      return;
    }

    setIsSaving(true);
    try {
      await onSave(formData);
      onClose();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Save failed';
      setUploadError(msg);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl bg-[#0a0a0a] border border-[#262626] rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#262626]/40 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-[#121212] text-[#C5A46D] border border-[#262626]">
              <Image className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-serif-display font-medium text-[#F8F6EE]">
                {initialData ? 'Modify Gallery Photograph' : 'Add New Gallery Photograph'}
              </h3>
              <span className="text-xs text-[#A3A3A3]">
                {initialData ? `Editing "${initialData.title}"` : 'Publish a new photo to the website gallery'}
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full text-[#A3A3A3] hover:text-[#F8F6EE] hover:bg-[#1a1a1a] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {uploadError && (
          <div className="p-3.5 rounded-xl bg-red-950/60 border border-red-500/50 text-xs text-red-200 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
            <span>{uploadError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Title & Category */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-mono uppercase tracking-wider text-[#A3A3A3] block">
                Photograph Title *
              </label>
              <input
                type="text"
                name="title"
                required
                placeholder="e.g. Feast on the Living Leaf"
                value={formData.title || ''}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl bg-[#121212] border border-[#262626]/60 text-xs text-[#F8F6EE] focus:outline-none focus:border-[#C5A46D]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-mono uppercase tracking-wider text-[#A3A3A3] block">
                Gallery Category *
              </label>
              <select
                name="category"
                value={formData.category || 'seafood'}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl bg-[#121212] border border-[#262626]/60 text-xs text-[#F8F6EE] focus:outline-none focus:border-[#C5A46D] cursor-pointer"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Caption */}
          <div className="space-y-1.5">
            <label className="text-xs font-mono uppercase tracking-wider text-[#A3A3A3] block">
              Photograph Caption / Story *
            </label>
            <textarea
              name="caption"
              rows={2}
              required
              placeholder="Describe what is shown in this photograph (e.g. Traditional Kerala seafood meal served on fresh plantain leaf...)"
              value={formData.caption || ''}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-xl bg-[#121212] border border-[#262626]/60 text-xs text-[#F8F6EE] focus:outline-none focus:border-[#C5A46D] resize-none"
            />
          </div>

          {/* Image URL & Upload / Pick from R2 */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-mono uppercase tracking-wider text-[#C5A46D] font-semibold block">
                Photograph Image (Cloudflare R2 CDN or URL) *
              </label>
              <button
                type="button"
                onClick={() => setShowR2Picker(!showR2Picker)}
                className="text-[11px] text-[#C5A46D] hover:underline cursor-pointer flex items-center gap-1 font-mono"
              >
                <Layers className="w-3.5 h-3.5" />
                <span>{showR2Picker ? 'Hide R2 Library' : 'Pick from Cloudflare R2'}</span>
              </button>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="url"
                name="image"
                required
                placeholder="https://pub-...r2.dev/photo.jpg or click Pick from R2"
                value={formData.image || ''}
                onChange={handleChange}
                className="flex-1 px-4 py-2.5 rounded-xl bg-[#121212] border border-[#262626]/60 text-xs text-[#F8F6EE] font-mono focus:outline-none focus:border-[#C5A46D]"
              />

              {/* Upload to R2 button */}
              <label className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#121212] hover:bg-[#262626] border border-[#262626] text-xs text-[#C5A46D] font-semibold uppercase tracking-wider transition-colors cursor-pointer whitespace-nowrap shadow">
                <Upload className="w-3.5 h-3.5" />
                <span>{isUploading ? 'Uploading...' : 'Upload to R2'}</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  disabled={isUploading}
                  className="hidden"
                />
              </label>
            </div>

            {/* R2 Image Picker Drawer */}
            {showR2Picker && (
              <div className="p-3 rounded-2xl bg-[#121212] border border-[#262626]/60 space-y-2 animate-fadeIn">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono uppercase text-[#A3A3A3]">
                    Select from Cloudflare R2 Photos ({r2Images.length})
                  </span>
                  <span className="text-[10px] text-[#C5A46D]">Click any photo to select</span>
                </div>

                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5 max-h-48 overflow-y-auto p-1">
                  {r2Images.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => {
                        setFormData((prev) => ({
                          ...prev,
                          image: item.url,
                          title: prev.title || item.title,
                          caption: prev.caption || item.caption,
                        }));
                        setShowR2Picker(false);
                      }}
                      className="group relative aspect-[4/3] rounded-lg overflow-hidden border border-[#262626] hover:border-[#C5A46D] cursor-pointer transition-all bg-black"
                    >
                      <img src={item.url} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                      <div className="absolute inset-0 bg-black/40 group-hover:bg-transparent transition-colors flex items-end p-1">
                        <span className="text-[9px] text-[#F8F6EE] truncate font-mono bg-black/70 px-1 rounded">
                          {item.title}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Grid Layout Span */}
          <div className="space-y-1.5">
            <label className="text-xs font-mono uppercase tracking-wider text-[#A3A3A3] block">
              Grid Layout Size
            </label>
            <div className="grid grid-cols-2 gap-3">
              <label
                className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                  formData.span === 'col-span-1'
                    ? 'bg-[#151208] border-[#C5A46D] text-[#F8F6EE]'
                    : 'bg-[#121212] border-[#262626]/50 text-[#A3A3A3]'
                }`}
              >
                <div className="space-y-0.5">
                  <span className="text-xs font-semibold block text-[#F8F6EE]">Standard (1 Column)</span>
                  <span className="text-[10px] text-[#A3A3A3] block">Standard 4:3 grid card</span>
                </div>
                <input
                  type="radio"
                  name="span"
                  value="col-span-1"
                  checked={formData.span === 'col-span-1'}
                  onChange={handleChange}
                  className="accent-[#C5A46D]"
                />
              </label>

              <label
                className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                  formData.span === 'col-span-2'
                    ? 'bg-[#151208] border-[#C5A46D] text-[#F8F6EE]'
                    : 'bg-[#121212] border-[#262626]/50 text-[#A3A3A3]'
                }`}
              >
                <div className="space-y-0.5">
                  <span className="text-xs font-semibold block text-[#F8F6EE]">Featured Wide (2 Columns)</span>
                  <span className="text-[10px] text-[#A3A3A3] block">Double width showcase highlight</span>
                </div>
                <input
                  type="radio"
                  name="span"
                  value="col-span-2"
                  checked={formData.span === 'col-span-2'}
                  onChange={handleChange}
                  className="accent-[#C5A46D]"
                />
              </label>
            </div>
          </div>

          {/* Live Preview Box */}
          {formData.image && (
            <div className="space-y-2 pt-2 border-t border-[#262626]/40">
              <div className="flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-wider text-[#C5A46D]">
                <Eye className="w-3.5 h-3.5" />
                <span>Live Card Preview in Gallery</span>
              </div>

              <div className="relative rounded-2xl overflow-hidden aspect-[16/9] max-w-md mx-auto border border-[#262626] bg-black shadow-xl group">
                <img
                  src={formData.image}
                  alt={formData.title || 'Preview'}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent flex flex-col justify-between p-4">
                  <div className="flex justify-end">
                    <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-black/60 text-[#C5A46D] border border-white/10">
                      {formData.category}
                    </span>
                  </div>
                  <div>
                    <h4 className="text-sm font-serif-display font-medium text-[#F8F6EE]">
                      {formData.title || 'Untitled Photograph'}
                    </h4>
                    <p className="text-[11px] text-[#E5E5E5]/80 line-clamp-1 mt-0.5">
                      {formData.caption || 'No caption provided'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#262626]/40">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-full text-xs font-medium uppercase tracking-wider text-[#A3A3A3] hover:text-[#F8F6EE] hover:bg-[#1a1a1a] transition-colors cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSaving}
              className="px-7 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider text-[#050505] bg-[#C5A46D] hover:bg-[#d8b982] transition-all shadow-lg hover:scale-105 active:scale-95 cursor-pointer disabled:opacity-50"
            >
              {isSaving ? 'Saving...' : initialData ? 'Update Photograph' : 'Add Photograph'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
