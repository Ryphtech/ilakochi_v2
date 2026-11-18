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
import {
  uploadFileToR2,
  listR2Objects,
  CORE_R2_MEDIA,
  R2MediaItem,
} from '../../lib/r2';
import {
  Image as ImageIcon,
  Film,
  Plus,
  Trash2,
  Upload,
  CheckCircle,
  Sparkles,
  Play,
  Clock,
  Layers,
  Check,
  ExternalLink,
  Copy,
} from 'lucide-react';

export const HeroBackgroundManager: React.FC = () => {
  const [config, setConfig] = useState<HeroConfig>(defaultHeroConfig);
  const [r2MediaList, setR2MediaList] = useState<R2MediaItem[]>(CORE_R2_MEDIA);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState('');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Add new image form state
  const [newImageUrl, setNewImageUrl] = useState('');
  const [newImageCaption, setNewImageCaption] = useState('');
  const [newImageAlt, setNewImageAlt] = useState('');

  // 1. Subscribe to live Firestore hero config
  useEffect(() => {
    const unsubHero = subscribeHeroConfig((liveConfig) => {
      setConfig(liveConfig);
    });

    return () => unsubHero();
  }, []);

  // 2. Fetch live R2 media objects and combine with Firestore uploads
  useEffect(() => {
    let isMounted = true;

    // Load from R2
    listR2Objects().then((items) => {
      if (isMounted && items.length > 0) {
        setR2MediaList(items);
      }
    });

    // Also subscribe to Firestore media_uploads
    const unsubUploads = subscribeMediaUploads((uploadedItems: MediaUploadItem[]) => {
      if (!isMounted || uploadedItems.length === 0) return;

      setR2MediaList((prev) => {
        const map = new Map<string, R2MediaItem>();
        prev.forEach((item) => map.set(item.url, item));

        uploadedItems.forEach((upload) => {
          const isVideo = upload.type?.startsWith('video') || upload.url.endsWith('.mp4');
          if (!map.has(upload.url)) {
            map.set(upload.url, {
              id: upload.id || `up-${Date.now()}`,
              key: upload.key,
              url: upload.url,
              name: upload.name,
              title: upload.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' '),
              caption: upload.name.replace(/\.[^/.]+$/, ''),
              size: upload.size,
              type: isVideo ? 'video' : 'image',
            });
          }
        });

        return Array.from(map.values());
      });
    });

    return () => {
      isMounted = false;
      unsubUploads();
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

  const handleAddImage = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
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

  const handleQuickAddR2Image = (item: R2MediaItem) => {
    // Check if already in slideshow
    const alreadyExists = config.images.some((img) => img.url === item.url);
    if (alreadyExists) {
      alert(`"${item.title}" is already in your slideshow.`);
      return;
    }

    const newImg: HeroImageConfig = {
      url: item.url,
      caption: item.caption || item.title || 'Fresh Catch Highlight',
      alt: item.title || 'Ila Kochi Specialty',
    };

    setConfig((prev) => ({
      ...prev,
      images: [...prev.images, newImg],
    }));
  };

  const handleFillFormFromR2 = (item: R2MediaItem) => {
    setNewImageUrl(item.url);
    setNewImageCaption(item.caption || item.title);
    setNewImageAlt(item.title);
  };

  const handleSelectR2Video = (item: R2MediaItem) => {
    setConfig((prev) => ({
      ...prev,
      videoUrl: item.url,
    }));
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

  const copyUrl = (url: string, key: string) => {
    navigator.clipboard.writeText(url);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const r2Videos = r2MediaList.filter((m) => m.type === 'video');
  const r2Images = r2MediaList.filter((m) => m.type === 'image');

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* 1. Save Success Alert */}
      {saveSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-950/80 border border-emerald-500/50 text-emerald-200 flex items-center gap-3 animate-fadeIn">
          <CheckCircle className="w-5 h-5 flex-shrink-0 text-emerald-400" />
          <span className="text-xs sm:text-sm font-medium">
            Hero background settings saved and published live to the website!
          </span>
        </div>
      )}

      {/* 2. Top Controller Header: Mode Switcher & Save Button */}
      <div className="p-6 rounded-3xl bg-[#050505] border border-[#262626]/60 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
        <div className="space-y-1 text-center sm:text-left">
          <div className="flex items-center gap-2 justify-center sm:justify-start">
            <Sparkles className="w-4 h-4 text-[#C5A46D]" />
            <h3 className="text-lg font-serif-display font-medium text-[#F8F6EE]">
              Hero Background Media Controller
            </h3>
          </div>
          <p className="text-xs text-[#A3A3A3]">
            Choose whether to show a rotating slideshow of photos or a video stream from Cloudflare R2.
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

      {/* ========================================================
          MODE 1: BACKGROUND VIDEO SETTINGS
      ======================================================== */}
      {config.mode === 'video' && (
        <div className="space-y-6 animate-fadeIn">
          {/* A. CLOUDFLARE R2 CURRENT VIDEOS SECTION */}
          <div className="p-6 rounded-3xl bg-[#050505] border border-[#262626]/60 space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-4 border-b border-[#262626]/30 pb-3">
              <div>
                <h4 className="text-base font-serif-display font-medium text-[#F8F6EE] flex items-center gap-2">
                  <Film className="w-4 h-4 text-[#C5A46D]" />
                  <span>Current Videos in Cloudflare R2 ({r2Videos.length})</span>
                </h4>
                <p className="text-xs text-[#A3A3A3]">
                  Select any video below to instantly set it as the background video stream for the hero section.
                </p>
              </div>

              {/* Upload to R2 Button */}
              <label className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs uppercase tracking-wider font-medium bg-[#121212] hover:bg-[#262626] text-[#F8F6EE] border border-[#262626] cursor-pointer transition-colors shadow">
                <Upload className="w-3.5 h-3.5 text-[#C5A46D]" />
                <span>Upload New Video to R2</span>
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

            {/* Grid of Cloudflare R2 Videos */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
              {r2Videos.map((video) => {
                const isSelected = config.videoUrl === video.url;
                const sizeMb = video.size ? (video.size / (1024 * 1024)).toFixed(1) : null;

                return (
                  <div
                    key={video.id}
                    onClick={() => handleSelectR2Video(video)}
                    className={`group relative rounded-2xl overflow-hidden border p-3 flex flex-col justify-between transition-all cursor-pointer shadow-lg ${
                      isSelected
                        ? 'bg-[#151208] border-[#C5A46D] ring-2 ring-[#C5A46D]/30'
                        : 'bg-[#121212] border-[#262626]/50 hover:border-[#C5A46D]/60'
                    }`}
                  >
                    <div className="space-y-3">
                      {/* Video Preview thumbnail/player */}
                      <div className="relative aspect-[16/10] rounded-xl overflow-hidden bg-black flex items-center justify-center">
                        <video
                          src={video.url}
                          muted
                          loop
                          playsInline
                          preload="metadata"
                          onMouseEnter={(e) => e.currentTarget.play().catch(() => {})}
                          onMouseLeave={(e) => e.currentTarget.pause()}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors flex items-center justify-center pointer-events-none">
                          <div className="p-2 rounded-full bg-black/60 text-[#C5A46D] backdrop-blur-sm group-hover:scale-110 transition-transform">
                            <Play className="w-4 h-4 fill-[#C5A46D]" />
                          </div>
                        </div>

                        {isSelected && (
                          <div className="absolute top-2 left-2 px-2.5 py-1 rounded-md bg-[#C5A46D] text-black font-bold text-[10px] font-mono flex items-center gap-1 shadow">
                            <Check className="w-3 h-3" />
                            <span>ACTIVE HERO</span>
                          </div>
                        )}

                        {sizeMb && (
                          <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded-md bg-black/80 text-[10px] font-mono text-[#E5E5E5]">
                            {sizeMb} MB
                          </div>
                        )}
                      </div>

                      {/* Video Info */}
                      <div>
                        <h5 className="text-xs font-semibold text-[#F8F6EE] line-clamp-1">
                          {video.title}
                        </h5>
                        <p className="text-[10px] text-[#A3A3A3] font-mono line-clamp-1 mt-0.5">
                          {video.name}
                        </p>
                      </div>
                    </div>

                    {/* Action Footer */}
                    <div className="pt-3 mt-2 border-t border-[#262626]/40 flex items-center justify-between gap-2">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSelectR2Video(video);
                        }}
                        className={`flex-1 py-1.5 px-3 rounded-lg text-[11px] font-semibold uppercase tracking-wider transition-colors cursor-pointer text-center ${
                          isSelected
                            ? 'bg-[#C5A46D] text-black'
                            : 'bg-[#1a1a1a] hover:bg-[#262626] text-[#C5A46D]'
                        }`}
                      >
                        {isSelected ? 'Selected' : 'Use Video'}
                      </button>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          copyUrl(video.url, video.id);
                        }}
                        className="p-1.5 rounded-lg bg-[#1a1a1a] hover:bg-[#262626] text-[#A3A3A3] hover:text-[#F8F6EE] transition-colors"
                        title="Copy CDN URL"
                      >
                        {copiedKey === video.id ? (
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* B. Custom Video URL & Live Player Box */}
          <div className="p-6 rounded-3xl bg-[#050505] border border-[#262626]/60 space-y-5">
            <div className="space-y-2">
              <label className="text-xs font-mono uppercase tracking-wider text-[#A3A3A3] block">
                Active Video Stream URL (Cloudflare R2 CDN)
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="url"
                  value={config.videoUrl}
                  onChange={(e) => setConfig((prev) => ({ ...prev, videoUrl: e.target.value }))}
                  placeholder="https://pub-...r2.dev/video.mp4"
                  className="flex-1 px-4 py-2.5 rounded-xl bg-[#121212] border border-[#262626]/50 text-xs text-[#F8F6EE] font-mono focus:outline-none focus:border-[#C5A46D]"
                />
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
                placeholder="https://... or Cloudflare R2 image link"
                className="w-full px-4 py-2.5 rounded-xl bg-[#121212] border border-[#262626]/50 text-xs text-[#F8F6EE] focus:outline-none focus:border-[#C5A46D]"
              />
            </div>

            {/* Live Video Preview Box */}
            <div className="space-y-2 pt-2">
              <span className="text-xs font-mono uppercase tracking-wider text-[#C5A46D] block">
                Live Video Preview (Playing on Hero)
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

      {/* ========================================================
          MODE 2: ROTATING IMAGES SETTINGS
      ======================================================== */}
      {config.mode === 'images' && (
        <div className="space-y-6 animate-fadeIn">
          {/* Rotation Speed Setting */}
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
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-mono transition-colors cursor-pointer ${
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

          {/* ========================================================
              SECTION: ADD NEW BACKGROUND IMAGE / VIDEO
              Includes Live Cloudflare R2 Images + Form + Direct Upload
          ======================================================== */}
          <div className="p-6 rounded-3xl bg-[#050505] border border-[#262626]/60 space-y-6">
            <div className="flex items-center justify-between flex-wrap gap-4 border-b border-[#262626]/30 pb-3">
              <div>
                <h4 className="text-base font-serif-display font-medium text-[#F8F6EE] flex items-center gap-2">
                  <Plus className="w-4 h-4 text-[#C5A46D]" />
                  <span>Add New Background Image / Video</span>
                </h4>
                <p className="text-xs text-[#A3A3A3]">
                  Select from current Cloudflare R2 images below or upload a new photo directly to Cloudflare R2.
                </p>
              </div>

              {/* Direct Upload Button */}
              <label className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs uppercase tracking-wider font-medium bg-[#121212] hover:bg-[#262626] text-[#F8F6EE] border border-[#262626] cursor-pointer transition-colors shadow">
                <Upload className="w-3.5 h-3.5 text-[#C5A46D]" />
                <span>Upload New Photo to R2</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileUpload(e, 'image')}
                  className="hidden"
                />
              </label>
            </div>

            {/* Current Cloudflare R2 Images Gallery */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase tracking-wider text-[#C5A46D] font-semibold">
                  Current Cloudflare R2 Images ({r2Images.length})
                </span>
                <span className="text-[11px] text-[#A3A3A3]">
                  Click &ldquo;+ Add to Slideshow&rdquo; or click any image to fill into the form
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3.5 max-h-[380px] overflow-y-auto p-1 rounded-2xl bg-[#0c0c0c] border border-[#262626]/40">
                {r2Images.map((item) => {
                  const isInSlideshow = config.images.some((img) => img.url === item.url);
                  const slideNumber = config.images.findIndex((img) => img.url === item.url);

                  return (
                    <div
                      key={item.id}
                      onClick={() => handleFillFormFromR2(item)}
                      className={`group relative rounded-xl overflow-hidden border p-2 flex flex-col justify-between transition-all cursor-pointer ${
                        isInSlideshow
                          ? 'bg-[#151208] border-[#C5A46D]/80'
                          : 'bg-[#121212] border-[#262626]/50 hover:border-[#C5A46D]'
                      }`}
                    >
                      <div className="space-y-2">
                        <div className="relative aspect-[16/10] rounded-lg overflow-hidden bg-black">
                          <img
                            src={item.url}
                            alt={item.title}
                            className="w-full h-full object-cover transition-transform group-hover:scale-105"
                          />
                          {isInSlideshow && (
                            <div className="absolute top-1.5 left-1.5 px-2 py-0.5 rounded bg-[#C5A46D] text-black font-mono text-[9px] font-bold shadow">
                              Slide {slideNumber + 1}
                            </div>
                          )}
                        </div>

                        <div>
                          <span className="text-[11px] font-semibold text-[#F8F6EE] block truncate">
                            {item.title}
                          </span>
                          <span className="text-[10px] text-[#A3A3A3] font-mono block truncate">
                            {item.name}
                          </span>
                        </div>
                      </div>

                      {/* Quick Add Button */}
                      <div className="pt-2 mt-2 border-t border-[#262626]/30 flex items-center justify-between gap-1.5">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleQuickAddR2Image(item);
                          }}
                          disabled={isInSlideshow}
                          className={`flex-1 py-1 px-2 rounded-lg text-[10px] font-semibold uppercase tracking-wider transition-colors cursor-pointer text-center ${
                            isInSlideshow
                              ? 'bg-transparent text-[#A3A3A3] cursor-default'
                              : 'bg-[#1e1e1e] hover:bg-[#C5A46D] hover:text-black text-[#C5A46D]'
                          }`}
                        >
                          {isInSlideshow ? 'In Slideshow' : '+ Add Slide'}
                        </button>

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            copyUrl(item.url, item.id);
                          }}
                          className="p-1 rounded bg-[#1e1e1e] text-[#A3A3A3] hover:text-[#F8F6EE]"
                          title="Copy R2 URL"
                        >
                          {copiedKey === item.id ? (
                            <Check className="w-3 h-3 text-emerald-400" />
                          ) : (
                            <Copy className="w-3 h-3" />
                          )}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Custom Image Form & Fine Adjustment */}
            <form onSubmit={handleAddImage} className="space-y-4 pt-2 border-t border-[#262626]/30">
              <span className="text-xs font-mono uppercase tracking-wider text-[#A3A3A3] block">
                Custom Image URL or Selected Image Adjustments
              </span>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="md:col-span-2 space-y-1.5">
                  <label className="text-xs font-mono uppercase tracking-wider text-[#A3A3A3] block">
                    Image URL
                  </label>
                  <input
                    type="url"
                    required
                    placeholder="https://... or click any R2 image above"
                    value={newImageUrl}
                    onChange={(e) => setNewImageUrl(e.target.value)}
                    className="w-full px-4 py-2 rounded-xl bg-[#121212] border border-[#262626]/50 text-xs text-[#F8F6EE] font-mono focus:outline-none focus:border-[#C5A46D]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono uppercase tracking-wider text-[#A3A3A3] block">
                    Slide Caption (Indicator Label)
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
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider bg-[#C5A46D] hover:bg-[#d8b982] text-[#050505] transition-all cursor-pointer shadow-lg font-semibold"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Image to Slideshow</span>
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
