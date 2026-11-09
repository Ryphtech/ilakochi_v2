import React, { useState, useEffect } from 'react';
import { MenuItem, menuCategories } from '../../data/menuData';
import { uploadFileToR2 } from '../../lib/r2';
import { saveMediaUploadMeta } from '../../lib/firebase';
import { X, Upload, Flame, Sparkles, Image, Check, AlertCircle } from 'lucide-react';

interface FoodItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (item: Partial<MenuItem>) => Promise<void>;
  initialData?: MenuItem | null;
}

export const FoodItemModal: React.FC<FoodItemModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData,
}) => {
  const [formData, setFormData] = useState<Partial<MenuItem>>({
    name: '',
    malayalamName: '',
    category: 'seafood',
    price: '₹',
    description: '',
    badge: '',
    spiceLevel: 2,
    dietary: 'seafood',
    featured: false,
    image: '',
  });

  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({
        name: '',
        malayalamName: '',
        category: 'seafood',
        price: '₹',
        description: '',
        badge: '',
        spiceLevel: 2,
        dietary: 'seafood',
        featured: false,
        image: '',
      });
    }
    setUploadError('');
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadError('');

    try {
      const result = await uploadFileToR2(file);
      if (result.success && result.url) {
        setFormData((prev) => ({ ...prev, image: result.url }));
        // Save upload metadata to Firestore
        await saveMediaUploadMeta({
          name: result.name || file.name,
          key: result.key || file.name,
          url: result.url,
          size: result.size || file.size,
          type: result.type || file.type,
        });
      } else {
        setUploadError('Upload to Cloudflare R2 failed. Please check network.');
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Unknown upload error';
      setUploadError(`Upload error: ${msg}`);
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.price || !formData.description) {
      alert('Please fill in Dish Name, Price, and Description.');
      return;
    }

    setIsSaving(true);
    try {
      await onSave(formData);
      onClose();
    } catch (err) {
      console.error('Save failed:', err);
      alert('Failed to save food item. Please try again.');
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
        className="relative w-full max-w-2xl bg-[#0B291E] border border-[#176B45]/70 rounded-3xl p-6 sm:p-8 shadow-2xl my-auto text-[#F8F6EE] max-h-[92vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#176B45]/40 pb-4 mb-6">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs uppercase tracking-wider text-[#C5A46D] font-mono">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{initialData ? 'Modify Dish' : 'Add New Food Item'}</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-serif-display font-medium text-[#F8F6EE]">
              {initialData ? initialData.name : 'Create Menu Item'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-[#123D2A] text-[#A8BFA0] hover:text-[#F8F6EE] border border-[#176B45]/50 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {uploadError && (
          <div className="mb-4 p-3 rounded-xl bg-red-950/60 border border-red-500/50 text-xs text-red-200 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
            <span>{uploadError}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Dish Name */}
            <div className="space-y-1">
              <label className="text-xs uppercase tracking-wider text-[#A8BFA0] font-medium block">
                Dish Name (English) *
              </label>
              <input
                type="text"
                name="name"
                required
                placeholder="e.g. Karimeen Pollichathu"
                value={formData.name || ''}
                onChange={handleChange}
                className="w-full h-11 px-3.5 rounded-xl bg-[#123D2A] border border-[#176B45]/60 text-sm text-[#F8F6EE] focus:outline-none focus:border-[#C5A46D] transition-colors"
              />
            </div>

            {/* Malayalam Name */}
            <div className="space-y-1">
              <label className="text-xs uppercase tracking-wider text-[#A8BFA0] font-medium block">
                Malayalam Name (ഇല രുചി)
              </label>
              <input
                type="text"
                name="malayalamName"
                placeholder="e.g. കരിമീൻ പൊള്ളിച്ചത്"
                value={formData.malayalamName || ''}
                onChange={handleChange}
                className="w-full h-11 px-3.5 rounded-xl bg-[#123D2A] border border-[#176B45]/60 text-sm text-[#F8F6EE] focus:outline-none focus:border-[#C5A46D] transition-colors"
              />
            </div>

            {/* Price */}
            <div className="space-y-1">
              <label className="text-xs uppercase tracking-wider text-[#A8BFA0] font-medium block">
                Price *
              </label>
              <input
                type="text"
                name="price"
                required
                placeholder="e.g. ₹360"
                value={formData.price || ''}
                onChange={handleChange}
                className="w-full h-11 px-3.5 rounded-xl bg-[#123D2A] border border-[#176B45]/60 text-sm text-[#F8F6EE] font-mono focus:outline-none focus:border-[#C5A46D] transition-colors"
              />
            </div>

            {/* Category */}
            <div className="space-y-1">
              <label className="text-xs uppercase tracking-wider text-[#A8BFA0] font-medium block">
                Category *
              </label>
              <select
                name="category"
                value={formData.category || 'seafood'}
                onChange={handleChange}
                className="w-full h-11 px-3.5 rounded-xl bg-[#123D2A] border border-[#176B45]/60 text-sm text-[#F8F6EE] focus:outline-none focus:border-[#C5A46D] transition-colors cursor-pointer"
              >
                {menuCategories.filter(c => c.id !== 'all').map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Dietary */}
            <div className="space-y-1">
              <label className="text-xs uppercase tracking-wider text-[#A8BFA0] font-medium block">
                Dietary Type
              </label>
              <select
                name="dietary"
                value={formData.dietary || 'seafood'}
                onChange={handleChange}
                className="w-full h-11 px-3.5 rounded-xl bg-[#123D2A] border border-[#176B45]/60 text-sm text-[#F8F6EE] focus:outline-none focus:border-[#C5A46D] transition-colors cursor-pointer"
              >
                <option value="seafood">Seafood</option>
                <option value="non-veg">Non-Veg (Chicken / Beef)</option>
                <option value="veg">Vegetarian</option>
              </select>
            </div>

            {/* Spice Level */}
            <div className="space-y-1">
              <label className="text-xs uppercase tracking-wider text-[#A8BFA0] font-medium block">
                Spice Intensity (1 to 3)
              </label>
              <select
                name="spiceLevel"
                value={formData.spiceLevel || 2}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    spiceLevel: Number(e.target.value) as 1 | 2 | 3,
                  }))
                }
                className="w-full h-11 px-3.5 rounded-xl bg-[#123D2A] border border-[#176B45]/60 text-sm text-[#F8F6EE] focus:outline-none focus:border-[#C5A46D] transition-colors cursor-pointer"
              >
                <option value={1}>Mild (★☆☆)</option>
                <option value={2}>Medium Spiced (★★☆)</option>
                <option value={3}>Fiery Coastal Hot (★★★)</option>
              </select>
            </div>

            {/* Badge */}
            <div className="space-y-1 sm:col-span-2">
              <label className="text-xs uppercase tracking-wider text-[#A8BFA0] font-medium block">
                Badge / Tag (Optional)
              </label>
              <input
                type="text"
                name="badge"
                placeholder="e.g. Chef Signature, Catch of the Day, Popular Sadhya"
                value={formData.badge || ''}
                onChange={handleChange}
                className="w-full h-11 px-3.5 rounded-xl bg-[#123D2A] border border-[#176B45]/60 text-sm text-[#F8F6EE] focus:outline-none focus:border-[#C5A46D] transition-colors"
              />
            </div>

            {/* Description */}
            <div className="space-y-1 sm:col-span-2">
              <label className="text-xs uppercase tracking-wider text-[#A8BFA0] font-medium block">
                Description &amp; Preparation *
              </label>
              <textarea
                name="description"
                required
                rows={3}
                placeholder="e.g. Whole pearl spot marinated in roasted shallots and wrapped in living plantain leaf..."
                value={formData.description || ''}
                onChange={handleChange}
                className="w-full p-3.5 rounded-xl bg-[#123D2A] border border-[#176B45]/60 text-sm text-[#F8F6EE] focus:outline-none focus:border-[#C5A46D] transition-colors resize-none"
              />
            </div>

            {/* Image URL & Upload to Cloudflare R2 */}
            <div className="space-y-2 sm:col-span-2 pt-1 border-t border-[#176B45]/30">
              <label className="text-xs uppercase tracking-wider text-[#A8BFA0] font-medium block">
                Dish Image (Cloudflare R2 CDN or Direct URL)
              </label>

              <div className="flex flex-col sm:flex-row items-center gap-3">
                <input
                  type="text"
                  name="image"
                  placeholder="https://pub-a15e46301b3045309b2a4a019cb939e9.r2.dev/dish.jpg"
                  value={formData.image || ''}
                  onChange={handleChange}
                  className="w-full sm:flex-1 h-11 px-3.5 rounded-xl bg-[#123D2A] border border-[#176B45]/60 text-sm text-[#F8F6EE] focus:outline-none focus:border-[#C5A46D] transition-colors"
                />

                <label className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#176B45] hover:bg-[#1f8758] text-[#F8F6EE] text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer flex-shrink-0">
                  <Upload className="w-4 h-4" />
                  <span>{isUploading ? 'Uploading to R2...' : 'Upload Image to R2'}</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    disabled={isUploading}
                    className="hidden"
                  />
                </label>
              </div>

              {formData.image && (
                <div className="mt-2 flex items-center gap-3 p-2 rounded-xl bg-[#123D2A]/60 border border-[#176B45]/40">
                  <img
                    src={formData.image}
                    alt="Preview"
                    className="w-14 h-14 rounded-lg object-cover border border-[#176B45]"
                  />
                  <div className="text-xs text-[#DCE8D5] truncate flex-1">
                    <span className="text-[#C5A46D] block font-mono text-[10px]">Image Connected</span>
                    <span className="truncate block">{formData.image}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Featured toggle */}
            <div className="sm:col-span-2 pt-2 flex items-center gap-3">
              <input
                type="checkbox"
                id="featured"
                name="featured"
                checked={!!formData.featured}
                onChange={handleChange}
                className="w-4 h-4 accent-[#C5A46D] cursor-pointer"
              />
              <label htmlFor="featured" className="text-xs text-[#F8F6EE] cursor-pointer font-medium">
                Mark as Featured / Signature Dish on Homepage
              </label>
            </div>
          </div>

          {/* Action buttons */}
          <div className="pt-4 border-t border-[#176B45]/40 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isSaving}
              className="px-5 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider text-[#A8BFA0] hover:text-[#F8F6EE] border border-[#176B45] transition-colors cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSaving || isUploading}
              className="px-7 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider text-[#0B291E] bg-[#C5A46D] hover:bg-[#d8b982] transition-colors shadow-lg cursor-pointer flex items-center gap-2"
            >
              <Check className="w-4 h-4" />
              <span>{isSaving ? 'Saving to Firestore...' : initialData ? 'Update Dish' : 'Add Dish'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
