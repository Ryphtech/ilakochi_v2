import { S3Client, PutObjectCommand, ListObjectsV2Command } from '@aws-sdk/client-s3';

// Cloudflare R2 Configuration
export const r2Config = {
  publicUrl: import.meta.env.VITE_R2_PUBLIC_URL || 'https://pub-a15e46301b3045309b2a4a019cb939e9.r2.dev',
  bucketName: import.meta.env.VITE_R2_BUCKET_NAME || 'ilakochi',
  endpoint: import.meta.env.VITE_R2_ENDPOINT || 'https://d6e0e618a594c39ee7bf96cd59297564.r2.cloudflarestorage.com',
  accessKeyId: import.meta.env.VITE_R2_ACCESS_KEY_ID || '93d1cbcc3bcb67bdf187c20bfac1e47a',
  secretAccessKey: import.meta.env.VITE_R2_SECRET_ACCESS_KEY || 'f5f08f1b10ebf44e0b5e59236ec75c2238aa6591ce3b05dc427ffc51d154f750',
};

// S3-compatible client for Cloudflare R2
export const r2Client = new S3Client({
  region: 'auto',
  endpoint: r2Config.endpoint,
  credentials: {
    accessKeyId: r2Config.accessKeyId,
    secretAccessKey: r2Config.secretAccessKey,
  },
});

/**
 * Returns the public Cloudflare R2 CDN URL for any media key
 * @example getR2Url('ila-kochi-reel.mp4') => 'https://pub-a15e46301b3045309b2a4a019cb939e9.r2.dev/ila-kochi-reel.mp4'
 */
export const getR2Url = (key: string): string => {
  if (!key) return '';
  if (key.startsWith('http://') || key.startsWith('https://')) return key;
  const cleanKey = key.startsWith('/') ? key.slice(1) : key;
  return `${r2Config.publicUrl}/${cleanKey}`;
};

export interface UploadResult {
  success: boolean;
  url: string;
  key?: string;
  name?: string;
  size?: number;
  type?: string;
  error?: unknown;
}

export interface R2MediaItem {
  id: string;
  key: string;
  url: string;
  name: string;
  title: string;
  caption?: string;
  size?: number;
  type: 'image' | 'video' | 'other';
  dimensions?: string;
  isCore?: boolean;
}

/**
 * Curated list of verified assets permanently available in Cloudflare R2
 */
export const CORE_R2_MEDIA: R2MediaItem[] = [
  // --- VIDEOS ---
  {
    id: 'r2-vid-1',
    key: 'ila-kochi-reel.mp4',
    url: 'https://pub-a15e46301b3045309b2a4a019cb939e9.r2.dev/ila-kochi-reel.mp4',
    name: 'ila-kochi-reel.mp4',
    title: 'Signature Ila Kochi Reel (Full Atmosphere)',
    type: 'video',
    size: 33677146,
    isCore: true,
  },
  {
    id: 'r2-vid-2',
    key: 'videos/fish-cooking-sizzle.mp4',
    url: 'https://pub-a15e46301b3045309b2a4a019cb939e9.r2.dev/videos/fish-cooking-sizzle.mp4',
    name: 'fish-cooking-sizzle.mp4',
    title: 'Fresh Catch Cast-Iron Tawa Sizzle',
    type: 'video',
    size: 8243497,
    isCore: true,
  },
  {
    id: 'r2-vid-3',
    key: 'videos/kerala-curry-simmer.mp4',
    url: 'https://pub-a15e46301b3045309b2a4a019cb939e9.r2.dev/videos/kerala-curry-simmer.mp4',
    name: 'kerala-curry-simmer.mp4',
    title: 'Clay Pot Meen Chatti Simmering Curry',
    type: 'video',
    size: 10445350,
    isCore: true,
  },
  {
    id: 'r2-vid-4',
    key: 'videos/kerala-porotta-leaf.mp4',
    url: 'https://pub-a15e46301b3045309b2a4a019cb939e9.r2.dev/videos/kerala-porotta-leaf.mp4',
    name: 'kerala-porotta-leaf.mp4',
    title: 'Flaky Porotta & Fresh Catch on Living Leaf',
    type: 'video',
    size: 5904914,
    isCore: true,
  },

  // --- IMAGES ---
  {
    id: 'r2-img-1',
    key: 'images/dawn-harbour-catch.jpg',
    url: 'https://pub-a15e46301b3045309b2a4a019cb939e9.r2.dev/images/dawn-harbour-catch.jpg',
    name: 'dawn-harbour-catch.jpg',
    title: 'Dawn Harbour Catch (Kochi Sea Tides)',
    caption: 'Fresh Sea Catch',
    type: 'image',
    size: 62826,
    isCore: true,
  },
  {
    id: 'r2-img-2',
    key: 'images/cast-iron-clay-hearth.jpg',
    url: 'https://pub-a15e46301b3045309b2a4a019cb939e9.r2.dev/images/cast-iron-clay-hearth.jpg',
    name: 'cast-iron-clay-hearth.jpg',
    title: 'Cast Iron Tawa & Earthen Hearth',
    caption: 'Cast Iron Sizzle',
    type: 'image',
    size: 110957,
    isCore: true,
  },
  {
    id: 'r2-img-3',
    key: 'images/served-on-living-leaf.jpg',
    url: 'https://pub-a15e46301b3045309b2a4a019cb939e9.r2.dev/images/served-on-living-leaf.jpg',
    name: 'served-on-living-leaf.jpg',
    title: 'Served on Living Banana Leaf',
    caption: 'Banana Leaf Feast',
    type: 'image',
    size: 498251,
    isCore: true,
  },
  {
    id: 'r2-img-4',
    key: 'images/about-main.jpeg',
    url: 'https://pub-a15e46301b3045309b2a4a019cb939e9.r2.dev/images/about-main.jpeg',
    name: 'about-main.jpeg',
    title: 'Pathadipalam Culinary Heritage',
    caption: 'Authentic Coastal Soul',
    type: 'image',
    size: 547836,
    isCore: true,
  },
  {
    id: 'r2-img-5',
    key: 'images/about-small.jpeg',
    url: 'https://pub-a15e46301b3045309b2a4a019cb939e9.r2.dev/images/about-small.jpeg',
    name: 'about-small.jpeg',
    title: 'Handcrafted Seafood Spreads',
    caption: 'Tender Spices & Curries',
    type: 'image',
    size: 167575,
    isCore: true,
  },
  {
    id: 'r2-img-6',
    key: 'images/pazhaya-soru.webp',
    url: 'https://pub-a15e46301b3045309b2a4a019cb939e9.r2.dev/images/pazhaya-soru.webp',
    name: 'pazhaya-soru.webp',
    title: 'Heritage Clay Pot Meals',
    caption: 'Clay Pot Heritage',
    type: 'image',
    size: 103116,
    isCore: true,
  },
  {
    id: 'r2-img-7',
    key: 'ila-google-listing.jpg',
    url: 'https://pub-a15e46301b3045309b2a4a019cb939e9.r2.dev/ila-google-listing.jpg',
    name: 'ila-google-listing.jpg',
    title: 'Ila Kochi Restaurant Ambiance',
    caption: 'Pathadipalam Kitchen',
    type: 'image',
    size: 74930,
    isCore: true,
  },
  {
    id: 'r2-img-8',
    key: 'ila-kochi-logo-white.png',
    url: 'https://pub-a15e46301b3045309b2a4a019cb939e9.r2.dev/ila-kochi-logo-white.png',
    name: 'ila-kochi-logo-white.png',
    title: 'Official Ila Kochi Brand Emblem',
    caption: 'Brand Logo',
    type: 'image',
    size: 122266,
    isCore: true,
  },
];

/**
 * Fetch all objects currently in the Cloudflare R2 bucket.
 * Combines live bucket API listing with CORE_R2_MEDIA so all media is instantly available.
 */
export const listR2Objects = async (): Promise<R2MediaItem[]> => {
  const map = new Map<string, R2MediaItem>();

  // 1. Seed with known core R2 items
  for (const item of CORE_R2_MEDIA) {
    map.set(item.url, item);
  }

  // 2. Attempt fetching live bucket contents from local dev endpoint
  try {
    const res = await fetch('/api/r2-media');
    if (res.ok) {
      const data = await res.json();
      if (data.success && Array.isArray(data.items)) {
        for (const item of data.items) {
          const key: string = item.key || '';
          if (!key || key.endsWith('.txt')) continue; // skip test files

          const url = item.url || getR2Url(key);
          const isVideo = key.endsWith('.mp4') || key.endsWith('.webm') || key.endsWith('.mov');
          const isImage = key.endsWith('.jpg') || key.endsWith('.jpeg') || key.endsWith('.png') || key.endsWith('.webp') || key.endsWith('.avif');
          const mediaType: 'image' | 'video' | 'other' = isVideo ? 'video' : isImage ? 'image' : 'other';

          // Format clean title from filename
          const baseName = key.split('/').pop() || key;
          const cleanTitle = baseName
            .replace(/\.[^/.]+$/, '')
            .replace(/^(\d+)-/, '')
            .replace(/[-_]/g, ' ')
            .replace(/\b\w/g, (c) => c.toUpperCase());

          if (!map.has(url)) {
            map.set(url, {
              id: `r2-${key.replace(/[^a-zA-Z0-9_-]/g, '_')}`,
              key,
              url,
              name: baseName,
              title: cleanTitle,
              caption: cleanTitle,
              size: item.size,
              type: mediaType,
            });
          }
        }
      }
    }
  } catch (err) {
    // If running in pure static mode without dev server, map already contains CORE_R2_MEDIA
    console.debug('Cloudflare R2 live API not reachable, using cached R2 catalog:', err);
  }

  return Array.from(map.values());
};

/**
 * Upload a media file (Image or Video) to Cloudflare R2 Object Storage
 * Uses the proxy endpoint when available, and falls back to direct S3 client
 */
export const uploadFileToR2 = async (file: File): Promise<UploadResult> => {
  try {
    // 1. Try upload endpoint
    const response = await fetch('/api/upload', {
      method: 'POST',
      headers: {
        'x-filename': encodeURIComponent(file.name),
        'content-type': file.type || 'application/octet-stream',
      },
      body: file,
    });

    if (response.ok) {
      const data = await response.json();
      if (data.success) {
        return data as UploadResult;
      }
    }
  } catch (apiErr) {
    console.warn('API upload failed, trying direct S3 client fallback:', apiErr);
  }

  // 2. Direct S3 client fallback
  try {
    const cleanName = file.name.toLowerCase().replace(/[^a-z0-9._-]/g, '-');
    const uniqueKey = `${Date.now()}-${cleanName}`;
    const arrayBuffer = await file.arrayBuffer();
    const body = new Uint8Array(arrayBuffer);

    const command = new PutObjectCommand({
      Bucket: r2Config.bucketName,
      Key: uniqueKey,
      Body: body,
      ContentType: file.type || 'application/octet-stream',
    });

    await r2Client.send(command);

    const publicUrl = `${r2Config.publicUrl}/${uniqueKey}`;
    return {
      success: true,
      url: publicUrl,
      key: uniqueKey,
      name: file.name,
      size: file.size,
      type: file.type,
    };
  } catch (s3Err) {
    console.error('Direct S3 upload to Cloudflare R2 failed:', s3Err);
    return {
      success: false,
      url: '',
      error: s3Err,
    };
  }
};
