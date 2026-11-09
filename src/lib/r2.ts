import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

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

/**
 * Upload a media file (Image or Video) to Cloudflare R2 Object Storage
 * Uses the proxy endpoint when available, and falls back to direct S3 client
 */
export const uploadFileToR2 = async (
  file: File
): Promise<UploadResult> => {
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
