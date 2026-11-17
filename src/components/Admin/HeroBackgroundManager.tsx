import React, { useState, useEffect } from 'react';
import {
  HeroConfig,
  HeroImageConfig,
  defaultHeroConfig,
  saveHeroConfig,
  subscribeHeroConfig,
  subscribeMediaUploads,
  MediaUploadItem,
} from '../../lib/firebase';
import { uploadFileToR2 } from '../../lib/r2';
import {
  Image as ImageIcon,
  Film,
  Plus,
  Trash2,
  Upload,
  CheckCircle,
  ExternalLink,
  Sparkles,
  Play,
  RotateCw,
  Clock,
  Layers,
} from 'lucide-react';

export const HeroBackgroundManager: React.FC = () => {
  const [config, setConfig] = useState<HeroConfig>(defaultHeroConfig);
  const [mediaLibrary, setMediaLibrary] = useState<MediaUploadItem[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState('');

  // Add new image form state
  const [newImageUrl, setNewImageUrl] = useState('');
  const [newImageCaption, setNewImageCaption] = useState('');
  const [newImageAlt, setNewImageAlt] = useState('');
  const [showMediaPicker, setShowMediaPicker] = useState<'image' | 'video' | null>(null);

  useEffect(() => {
    const unsubHero = subscribeHeroConfig((liveConfig) => {
      setConfig(liveConfig);
    });

    const unsubMedia = subscribeMediaUploads((items) => {
      setMediaLibrary(items);
    });

    return () => {
      unsubHero();
      unsubMedia();
    };
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await saveHeroConfig(config);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.error('Failed to save hero config:', err);
      alert('Failed to save settings. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddImage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newImageUrl.trim()) return;

    const newImg: HeroImageConfig = {
      url: newImageUrl.trim(),
      caption: newImageCaption.trim() || 'Culinary Highlight',
      alt: newImageAlt.trim() || newImageCaption.trim() || 'Ila Kochi specialty',
    };

    setConfig((prev) => ({
      ...prev,
      images: [...prev.images, newImg],
    }));

    setNewImageUrl('');
    setNewImageCaption('');
    setNewImageAlt('');
  };

  const handleRemoveImage = (indexToRemove: number) => {
    if (config.images.length <= 1) {
      alert('You must keep at least 1 image for the slideshow.');
      return;
    }
    setConfig((prev) => ({
      ...prev,
      images: prev.images.filter((_, idx) => idx !== indexToRemove),
    }));
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, target: 'image' | 'video') => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadStatus(`Uploading ${file.name} to Cloudflare R2...`);

    try {
      const result = await uploadFileToR2(file);
      if (result.success && result.url) {
        if (target === 'video') {
          setConfig((prev) => ({ ...prev, videoUrl: result.url }));
        } else {
          setNewImageUrl(result.url);
          if (!newImageCaption) {
            setNewImageCaption(file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' '));
          }
        }
      } else {
        alert('Upload failed. Please check your network and credentials.');
      }
    } catch (err) {
      console.error('Upload error:', err);
      alert('File upload failed.');
    } finally {
      setIsUploading(false);
      setUploadStatus('');
      e.target.value = '';
    }
  };

  return (
    <div className="space-y-8">
      {/* Save Success Alert */}
      {saveSuccess && (
        <div className="p-4 rounded-2xl bg-[#121212] border border-[#C5A46D] text-[#C5A46D] flex items-center gap-3 animate-fadeIn">
          <CheckCircle className="w-5 h-5 flex-shrink-0" />
          <span className="text-xs sm:text-sm font-medium">
            Hero background settings saved and published live to the website!
          </span>
        </div>
      )}

      {/* Top Controller Header: Mode Switcher & Save Button */}
      <div className="p-6 rounded-3xl bg-[#050505] border border-[#262626]/60 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
        <div className="space-y-1 text-center sm:text-left">
          <div className="flex items-center gap-2 justify-center sm:justify-start">
            <Sparkles className="w-4 h-4 text-[#C5A46D]" />
            <h3 className="text-lg font-serif-display font-medium text-[#F8F6EE]">
              Hero Background Mode
            </h3>
          </div>
          <p className="text-xs text-[#A3A3A3]">
            Choose whether to show a rotating slideshow of photos or a video in the background.
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap justify-center">
          {/* Mode Switch Buttons */}
          <div className="flex items-center p-1 rounded-2xl bg-[#121212] border border-[#262626]/50">
            <button
              type="button"
              onClick={() => setConfig((prev) => ({ ...prev, mode: 'images' }))}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs uppercase tracking-wider font-semibold transition-all cursor-pointer ${
                config.mode === 'images'
                  ? 'bg-[#C5A46D] text-[#050505] shadow-md'
                  : 'text-[#E5E5E5] hover:text-[#F8F6EE]'
              }`}
            >
              <ImageIcon className="w-3.5 h-3.5" />
              <span>Rotating Images</span>
            </button>

            <button
              type="button"
              onClick={() => setConfig((prev) => ({ ...prev, mode: 'video' }))}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs uppercase tracking-wider font-semibold transition-all cursor-pointer ${
                config.mode === 'video'
                  ? 'bg-[#C5A46D] text-[#050505] shadow-md'
                  : 'text-[#E5E5E5] hover:text-[#F8F6EE]'
              }`}
            >
              <Film className="w-3.5 h-3.5" />
              <span>Background Video</span>
            </button>
          </div>

          {/* Save Action */}
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="px-6 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider bg-[#C5A46D] hover:bg-[#d8b982] text-[#050505] transition-all shadow-lg hover:scale-105 active:scale-95 cursor-pointer disabled:opacity-50"
          >
            {isSaving ? 'Publishing...' : 'Save & Publish Live'}
          </button>
        </div>
      </div>

      {/* MODE 1: BACKGROUND VIDEO SETTINGS */}
      {config.mode === 'video' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="p-6 rounded-3xl bg-[#050505] border border-[#262626]/60 space-y-6">
            <div className="flex items-center justify-between flex-wrap gap-4 border-b border-[#262626]/30 pb-4">
              <div>
                <h4 className="text-base font-serif-display font-medium text-[#F8F6EE] flex items-center gap-2">
                  <Film className="w-4 h-4 text-[#C5A46D]" />
                  <span>Video Settings</span>
                </h4>
                <p className="text-xs text-[#A3A3A3]">
                  Configure the video that plays seamlessly in the background across the hero.
                </p>
              </div>

              {/* Upload to R2 Button */}
              <label className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs uppercase tracking-wider font-medium bg-[#121212] hover:bg-[#262626] text-[#F8F6EE] border border-[#262626] cursor-pointer transition-colors shadow">
                <Upload className="w-3.5 h-3.5 text-[#C5A46D]" />
                <span>Upload Video to R2</span>
                <input
                  type="file"
                  accept="video/*"
                  onChange={(e) => handleFileUpload(e, 'video')}
                  className="hidden"
                />
              </label>
            </div>

            {uploadStatus && (
              <div className="p-3 rounded-xl bg-[#121212] text-xs text-[#C5A46D] animate-pulse">
                {uploadStatus}
              </div>
            )}

            {/* Video URL Input */}
            <div className="space-y-2">
              <label className="text-xs font-mono uppercase tracking-wider text-[#A3A3A3] block">
                Video Stream URL (MP4 / WebM / Cloudflare R2 CDN)
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="url"
                  value={config.videoUrl}
                  onChange={(e) => setConfig((prev) => ({ ...prev, videoUrl: e.target.value }))}
                  placeholder="https://pub-...r2.dev/video.mp4"
                  className="flex-1 px-4 py-2.5 rounded-xl bg-[#121212] border border-[#262626]/50 text-xs text-[#F8F6EE] focus:outline-none focus:border-[#C5A46D]"
                />
                <button
                  type="button"
                  onClick={() => setShowMediaPicker('video')}
                  className="px-4 py-2.5 rounded-xl text-xs uppercase tracking-wider bg-[#121212] hover:bg-[#262626] text-[#C5A46D] border border-[#262626]/60 transition-colors whitespace-nowrap cursor-pointer"
                >
                  Pick from R2
                </button>
              </div>
            </div>

            {/* Video Poster URL */}
            <div className="space-y-2">
              <label className="text-xs font-mono uppercase tracking-wider text-[#A3A3A3] block">
                Video Poster Image (Shown while video loads)
              </label>
              <input
                type="url"
                value={config.videoPoster || ''}
                onChange={(e) => setConfig((prev) => ({ ...prev, videoPoster: e.target.value }))}
                placeholder="https://images.unsplash.com/... or R2 link"
                className="w-full px-4 py-2.5 rounded-xl bg-[#121212] border border-[#262626]/50 text-xs text-[#F8F6EE] focus:outline-none focus:border-[#C5A46D]"
              />
            </div>

            {/* Live Video Preview Box */}
            <div className="space-y-2 pt-2">
              <span className="text-xs font-mono uppercase tracking-wider text-[#C5A46D] block">
                Live Video Preview
              </span>
              <div className="relative aspect-[16/9] max-w-2xl rounded-2xl overflow-hidden border border-[#262626]/60 bg-black shadow-2xl">
                <video
                  src={config.videoUrl}
                  poster={config.videoPoster}
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-3 left-3 px-3 py-1 rounded-full bg-black/70 backdrop-blur-md text-[10px] text-[#F8F6EE] font-mono border border-white/20">
                  Preview: Full-width looping video
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODE 2: ROTATING IMAGES SETTINGS */}
      {config.mode === 'images' && (
        <div className="space-y-6 animate-fadeIn">
          {/* Rotation Interval Setting */}
          <div className="p-5 rounded-2xl bg-[#050505] border border-[#262626]/50 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-[#C5A46D]" />
              <div>
                <span className="text-sm font-semibold text-[#F8F6EE] block">
                  Slideshow Rotation Speed
                </span>
                <span className="text-xs text-[#A3A3A3]">
                  How many seconds each photo stays on screen before crossfading.
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {[3000, 5000, 8000, 10000].map((ms) => (
                <button
                  key={ms}
                  type="button"
                  onClick={() => setConfig((prev) => ({ ...prev, intervalMs: ms }))}
                  className={`px-3 py-1.5 rounded-xl text-xs font-mono transition-colors cursor-pointer ${
                    (config.intervalMs || 5000) === ms
                      ? 'bg-[#C5A46D] text-[#050505] font-bold shadow'
                      : 'bg-[#121212] text-[#E5E5E5] hover:bg-[#262626]'
                  }`}
                >
                  {ms / 1000}s
                </button>
              ))}
            </div>
          </div>

          {/* Current Slides List */}
          <div className="p-6 rounded-3xl bg-[#050505] border border-[#262626]/60 space-y-4">
            <div className="flex items-center justify-between border-b border-[#262626]/30 pb-3">
              <div>
                <h4 className="text-base font-serif-display font-medium text-[#F8F6EE] flex items-center gap-2">
                  <Layers className="w-4 h-4 text-[#C5A46D]" />
                  <span>Current Slideshow Photos ({config.images.length})</span>
                </h4>
                <p className="text-xs text-[#A3A3A3]">
                  These photos rotate with smooth crossfades in the hero background.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
              {config.images.map((img, idx) => (
                <div
                  key={idx}
                  className="group relative rounded-2xl overflow-hidden border border-[#262626]/50 hover:border-[#C5A46D] bg-[#121212] transition-all shadow-lg flex flex-col"
                >
                  <div className="relative aspect-[16/10] overflow-hidden bg-black">
                    <img
                      src={img.url}
                      alt={img.alt}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-black/75 text-[10px] font-mono text-[#C5A46D] font-bold">
                      Slide {idx + 1}
                    </div>

                    <button
                      type="button"
                      onClick={() => handleRemoveImage(idx)}
                      className="absolute top-2 right-2 p-1.5 rounded-lg bg-black/75 text-rose-400 hover:text-white hover:bg-rose-600 transition-colors cursor-pointer"
                      title="Remove image from slideshow"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="p-3 space-y-1">
                    <span className="text-xs font-semibold text-[#F8F6EE] block truncate">
                      {img.caption}
                    </span>
                    <span className="text-[10px] text-[#A3A3A3] font-light block truncate">
                      {img.alt}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Add New Slide Card */}
          <div className="p-6 rounded-3xl bg-[#050505] border border-[#262626]/60 space-y-4">
            <h4 className="text-base font-serif-display font-medium text-[#F8F6EE] flex items-center gap-2">
              <Plus className="w-4 h-4 text-[#C5A46D]" />
              <span>Add New Background Image</span>
            </h4>

            <form onSubmit={handleAddImage} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="md:col-span-2 space-y-1.5">
                  <label className="text-xs font-mono uppercase tracking-wider text-[#A3A3A3] block">
                    Image URL
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="url"
                      required
                      placeholder="https://... or Cloudflare R2 link"
                      value={newImageUrl}
                      onChange={(e) => setNewImageUrl(e.target.value)}
                      className="flex-1 px-4 py-2 rounded-xl bg-[#121212] border border-[#262626]/50 text-xs text-[#F8F6EE] focus:outline-none focus:border-[#C5A46D]"
                    />
                    <button
                      type="button"
                      onClick={() => setShowMediaPicker('image')}
                      className="px-3.5 py-2 rounded-xl text-xs uppercase font-mono tracking-wider bg-[#121212] hover:bg-[#262626] text-[#C5A46D] border border-[#262626]/60 transition-colors whitespace-nowrap cursor-pointer"
                    >
                      Pick R2
                    </button>
                    <label className="p-2 rounded-xl bg-[#121212] hover:bg-[#262626] text-[#C5A46D] border border-[#262626]/60 transition-colors cursor-pointer" title="Upload directly from computer">
                      <Upload className="w-4 h-4" />
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileUpload(e, 'image')}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono uppercase tracking-wider text-[#A3A3A3] block">
                    Slide Caption (Shown on Indicator)
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Sizzling Pearl Spot"
                    value={newImageCaption}
                    onChange={(e) => setNewImageCaption(e.target.value)}
                    className="w-full px-4 py-2 rounded-xl bg-[#121212] border border-[#262626]/50 text-xs text-[#F8F6EE] focus:outline-none focus:border-[#C5A46D]"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono uppercase tracking-wider text-[#A3A3A3] block">
                  Accessibility Alt Text
                </label>
                <input
                  type="text"
                  placeholder="Describe image for screen readers"
                  value={newImageAlt}
                  onChange={(e) => setNewImageAlt(e.target.value)}
                  className="w-full px-4 py-2 rounded-xl bg-[#121212] border border-[#262626]/50 text-xs text-[#F8F6EE] focus:outline-none focus:border-[#C5A46D]"
                />
              </div>

              {uploadStatus && (
                <div className="text-xs text-[#C5A46D] animate-pulse">
                  {uploadStatus}
                </div>
              )}

              <button
                type="submit"
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider bg-[#262626] hover:bg-[#208b5a] text-[#F8F6EE] transition-all cursor-pointer shadow"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Image to Slideshow</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* R2 MEDIA PICKER MODAL */}
      {showMediaPicker && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setShowMediaPicker(null)}
        >
          <div
            className="w-full max-w-2xl bg-[#050505] border border-[#262626] rounded-3xl p-6 space-y-4 max-h-[85vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-[#262626]/30 pb-3">
              <h4 className="text-base font-serif-display font-medium text-[#F8F6EE]">
                Select from Cloudflare R2 Uploads
              </h4>
              <button
                onClick={() => setShowMediaPicker(null)}
                className="text-xs text-[#A3A3A3] hover:text-[#F8F6EE] cursor-pointer"
              >
                Close
              </button>
            </div>

            {mediaLibrary.length === 0 ? (
              <p className="text-xs text-[#A3A3A3] py-8 text-center">
                No uploads found in R2 library. Upload files first in the Cloudflare R2 tab.
              </p>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {mediaLibrary
                  .filter((item) =>
                    showMediaPicker === 'video'
                      ? item.type?.startsWith('video') || item.url.endsWith('.mp4')
                      : !item.type?.startsWith('video') && !item.url.endsWith('.mp4')
                  )
                  .map((item) => (
                    <div
                      key={item.id}
                      onClick={() => {
                        if (showMediaPicker === 'video') {
                          setConfig((prev) => ({ ...prev, videoUrl: item.url }));
                        } else {
                          setNewImageUrl(item.url);
                          setNewImageCaption(item.name.replace(/\.[^/.]+$/, ''));
                        }
                        setShowMediaPicker(null);
                      }}
                      className="group p-2 rounded-xl bg-[#121212] border border-[#262626]/50 hover:border-[#C5A46D] cursor-pointer transition-all space-y-1"
                    >
                      <div className="aspect-[16/10] bg-black rounded-lg overflow-hidden flex items-center justify-center text-xs text-[#A3A3A3]">
                        {showMediaPicker === 'video' ? (
                          <Film className="w-6 h-6 text-[#C5A46D]" />
                        ) : (
                          <img src={item.url} alt={item.name} className="w-full h-full object-cover" />
                        )}
                      </div>
                      <span className="text-[11px] text-[#F8F6EE] font-mono block truncate">
                        {item.name}
                      </span>
                    </div>
                  ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
