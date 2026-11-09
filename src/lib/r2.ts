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

/**
 * Upload a media file directly to Cloudflare R2 Object Storage
 */
export const uploadFileToR2 = async (
  file: File | Blob | Uint8Array,
  key: string,
  contentType: string
): Promise<{ success: boolean; url: string; error?: unknown }> => {
  try {
    const cleanKey = key.startsWith('/') ? key.slice(1) : key;
    const body = file instanceof Uint8Array ? file : new Uint8Array(await file.arrayBuffer());

    const command = new PutObjectCommand({
      Bucket: r2Config.bucketName,
      Key: cleanKey,
      Body: body,
      ContentType: contentType,
    });

    await r2Client.send(command);

    const publicUrl = `${r2Config.publicUrl}/${cleanKey}`;
    return { success: true, url: publicUrl };
  } catch (err) {
    console.error('Failed to upload asset to Cloudflare R2:', err);
    return { success: false, url: '', error: err };
  }
};
