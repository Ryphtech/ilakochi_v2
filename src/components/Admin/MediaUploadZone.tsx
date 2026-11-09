import React, { useState, useEffect } from 'react';
import { uploadFileToR2, getR2Url } from '../../lib/r2';
import {
  saveMediaUploadMeta,
  subscribeMediaUploads,
  deleteMediaUploadMeta,
  MediaUploadItem,
} from '../../lib/firebase';
import { Upload, Video, Image, Copy, Check, Trash2, ExternalLink, Sparkles, AlertCircle } from 'lucide-react';

export const MediaUploadZone: React.FC = () => {
  const [uploads, setUploads] = useState<MediaUploadItem[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<string>('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const unsubscribe = subscribeMediaUploads((items) => {
      setUploads(items);
    });
    return () => unsubscribe();
  }, []);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    setErrorMessage('');

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      setUploadProgress(`Uploading ${file.name} (${i + 1}/${files.length}) to Cloudflare R2...`);

      try {
        const result = await uploadFileToR2(file);
        if (result.success && result.url) {
          // Record in Firestore
          await saveMediaUploadMeta({
            name: file.name,
            key: result.key || file.name,
            url: result.url,
            size: file.size,
            type: file.type,
          });
        } else {
          setErrorMessage(`Failed to upload ${file.name}.`);
        }
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Upload failed';
        setErrorMessage(`Error: ${msg}`);
      }
    }

    setIsUploading(false);
    setUploadProgress('');
    e.target.value = '';
  };

  const copyToClipboard = (url: string, id: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDelete = async (item: MediaUploadItem) => {
    if (!item.id) return;
    if (confirm(`Remove "${item.name}" from library list?`)) {
      await deleteMediaUploadMeta(item.id);
    }
  };

  return (
    <div className="space-y-8">
      {/* Upload Zone Card */}
      <div className="p-8 rounded-3xl bg-[#0B291E] border-2 border-dashed border-[#176B45] hover:border-[#C5A46D] transition-colors text-center relative">
        <input
          type="file"
          id="media-upload-input"
          multiple
          accept="image/*,video/*"
          onChange={handleFileSelect}
          disabled={isUploading}
          className="hidden"
        />

        <label
          htmlFor="media-upload-input"
          className="flex flex-col items-center justify-center space-y-4 cursor-pointer"
        >
          <div className="w-16 h-16 rounded-2xl bg-[#123D2A] border border-[#176B45] flex items-center justify-center text-[#C5A46D] shadow-xl">
            <Upload className="w-8 h-8" />
          </div>

          <div className="space-y-1">
            <h4 className="text-lg font-serif-display font-medium text-[#F8F6EE]">
              {isUploading ? uploadProgress : 'Upload Photos & Videos to Cloudflare R2'}
            </h4>
            <p className="text-xs text-[#A8BFA0] max-w-md mx-auto">
              Drag &amp; drop or click to upload. Files are stored directly in your Cloudflare R2 bucket (`ilakochi`) and distributed globally via Cloudflare CDN.
            </p>
          </div>

          <div className="flex items-center gap-2 pt-2">
            <span className="px-3 py-1 rounded-full text-[11px] font-mono bg-[#123D2A] border border-[#176B45]/50 text-[#C5A46D]">
              MP4 &bull; WEBM &bull; JPG &bull; PNG &bull; WEBP
            </span>
          </div>
        </label>

        {isUploading && (
          <div className="mt-6 max-w-sm mx-auto space-y-2">
            <div className="w-full h-1.5 bg-[#123D2A] rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-[#176B45] to-[#C5A46D] animate-pulse" />
            </div>
            <span className="text-[11px] text-[#C5A46D] block font-mono">{uploadProgress}</span>
          </div>
        )}

        {errorMessage && (
          <div className="mt-4 p-3 rounded-xl bg-red-950/70 border border-red-500/50 text-xs text-red-200 inline-flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-400" />
            <span>{errorMessage}</span>
          </div>
        )}
      </div>

      {/* Cloudflare Core Assets Quick Strip */}
      <div className="p-5 rounded-2xl bg-[#123D2A]/60 border border-[#176B45]/40 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs uppercase tracking-wider font-semibold text-[#C5A46D] flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            Core Cloudflare R2 Media Active on Website
          </span>
          <span className="text-[10px] text-[#A8BFA0] font-mono">pub-a15e46301b3045309b2a4a019cb939e9.r2.dev</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          {/* Reel Video */}
          <div className="p-3 rounded-xl bg-[#0B291E] border border-[#176B45]/40 flex items-center justify-between">
            <div className="flex items-center gap-2.5 truncate">
              <Video className="w-4 h-4 text-[#C5A46D] flex-shrink-0" />
              <div className="truncate">
                <span className="text-[#F8F6EE] font-medium block truncate">ila-kochi-reel.mp4</span>
                <span className="text-[10px] text-[#A8BFA0]">32.12 MB &bull; Hero Video</span>
              </div>
            </div>
            <button
              onClick={() => copyToClipboard(getR2Url('ila-kochi-reel.mp4'), 'core-reel')}
              className="p-1.5 rounded-lg bg-[#123D2A] text-[#C5A46D] hover:text-[#F8F6EE] transition-colors cursor-pointer flex-shrink-0"
              title="Copy CDN Link"
            >
              {copiedId === 'core-reel' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>

          {/* Logo */}
          <div className="p-3 rounded-xl bg-[#0B291E] border border-[#176B45]/40 flex items-center justify-between">
            <div className="flex items-center gap-2.5 truncate">
              <Image className="w-4 h-4 text-[#C5A46D] flex-shrink-0" />
              <div className="truncate">
                <span className="text-[#F8F6EE] font-medium block truncate">ila-kochi-logo-white.png</span>
                <span className="text-[10px] text-[#A8BFA0]">Brand Emblem Logo</span>
              </div>
            </div>
            <button
              onClick={() => copyToClipboard(getR2Url('ila-kochi-logo-white.png'), 'core-logo')}
              className="p-1.5 rounded-lg bg-[#123D2A] text-[#C5A46D] hover:text-[#F8F6EE] transition-colors cursor-pointer flex-shrink-0"
              title="Copy CDN Link"
            >
              {copiedId === 'core-logo' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>

          {/* Listing */}
          <div className="p-3 rounded-xl bg-[#0B291E] border border-[#176B45]/40 flex items-center justify-between">
            <div className="flex items-center gap-2.5 truncate">
              <Image className="w-4 h-4 text-[#C5A46D] flex-shrink-0" />
              <div className="truncate">
                <span className="text-[#F8F6EE] font-medium block truncate">ila-google-listing.jpg</span>
                <span className="text-[10px] text-[#A8BFA0]">Restaurant Ambience</span>
              </div>
            </div>
            <button
              onClick={() => copyToClipboard(getR2Url('ila-google-listing.jpg'), 'core-listing')}
              className="p-1.5 rounded-lg bg-[#123D2A] text-[#C5A46D] hover:text-[#F8F6EE] transition-colors cursor-pointer flex-shrink-0"
              title="Copy CDN Link"
            >
              {copiedId === 'core-listing' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Uploaded Library Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-base font-serif-display font-medium text-[#F8F6EE]">
            Uploaded Media Library ({uploads.length})
          </h4>
          <span className="text-xs text-[#A8BFA0]">Realtime synced with Cloudflare R2 &amp; Firestore</span>
        </div>

        {uploads.length === 0 ? (
          <div className="text-center py-12 rounded-2xl bg-[#0B291E]/60 border border-[#176B45]/30">
            <p className="text-sm text-[#A8BFA0]">No custom uploads yet. Upload photos or videos above.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {uploads.map((item) => {
              const isVideo = item.type?.startsWith('video/') || item.url?.endsWith('.mp4');
              const sizeMb = item.size ? (item.size / (1024 * 1024)).toFixed(2) : null;

              return (
                <div
                  key={item.id || item.key}
                  className="group rounded-2xl overflow-hidden bg-[#0B291E] border border-[#176B45]/50 hover:border-[#C5A46D] transition-all shadow-xl flex flex-col justify-between"
                >
                  {/* Media Preview */}
                  <div className="relative aspect-video bg-black/60 overflow-hidden flex items-center justify-center">
                    {isVideo ? (
                      <video
                        src={item.url}
                        className="w-full h-full object-cover"
                        muted
                        playsInline
                        preload="metadata"
                      />
                    ) : (
                      <img
                        src={item.url}
                        alt={item.name}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    )}

                    <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-black/70 backdrop-blur-sm text-[10px] font-mono text-[#C5A46D] border border-white/10">
                      {isVideo ? 'Video' : 'Image'}
                    </div>

                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="absolute top-2 right-2 p-1.5 rounded-full bg-black/70 text-[#DCE8D5] hover:text-[#F8F6EE] border border-white/10 transition-colors"
                      title="Open full preview"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>

                  {/* Details & Actions */}
                  <div className="p-3.5 space-y-2">
                    <div>
                      <span className="text-xs font-medium text-[#F8F6EE] block truncate" title={item.name}>
                        {item.name}
                      </span>
                      {sizeMb && (
                        <span className="text-[10px] text-[#A8BFA0] font-mono block">
                          {sizeMb} MB &bull; Cloudflare R2
                        </span>
                      )}
                    </div>

                    <div className="pt-2 border-t border-[#176B45]/30 flex items-center justify-between gap-2">
                      <button
                        onClick={() => copyToClipboard(item.url, item.id || item.key)}
                        className="flex-1 py-1.5 px-3 rounded-lg bg-[#123D2A] hover:bg-[#176B45] text-xs text-[#DCE8D5] hover:text-[#F8F6EE] transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        {copiedId === (item.id || item.key) ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                            <span className="text-emerald-400">Copied!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5 text-[#C5A46D]" />
                            <span>Copy CDN URL</span>
                          </>
                        )}
                      </button>

                      <button
                        onClick={() => handleDelete(item)}
                        className="p-1.5 rounded-lg text-[#A8BFA0] hover:text-red-400 hover:bg-red-950/40 transition-colors cursor-pointer"
                        title="Remove from list"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
