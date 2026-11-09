import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const r2Config = {
  endpoint: 'https://d6e0e618a594c39ee7bf96cd59297564.r2.cloudflarestorage.com',
  bucketName: 'ilakochi',
  accessKeyId: '93d1cbcc3bcb67bdf187c20bfac1e47a',
  secretAccessKey: 'f5f08f1b10ebf44e0b5e59236ec75c2238aa6591ce3b05dc427ffc51d154f750',
  publicUrl: 'https://pub-a15e46301b3045309b2a4a019cb939e9.r2.dev',
};

const client = new S3Client({
  region: 'auto',
  endpoint: r2Config.endpoint,
  credentials: {
    accessKeyId: r2Config.accessKeyId,
    secretAccessKey: r2Config.secretAccessKey,
  },
});

async function uploadFile(localPath, r2Key, contentType) {
  if (!fs.existsSync(localPath)) {
    console.log(`File not found: ${localPath}`);
    return;
  }
  const fileBuffer = fs.readFileSync(localPath);
  const sizeMb = (fileBuffer.length / (1024 * 1024)).toFixed(2);
  console.log(`Uploading ${r2Key} (${sizeMb} MB)...`);

  const command = new PutObjectCommand({
    Bucket: r2Config.bucketName,
    Key: r2Key,
    Body: fileBuffer,
    ContentType: contentType,
  });

  await client.send(command);
  console.log(` Successfully uploaded: ${r2Config.publicUrl}/${r2Key}`);
}

async function main() {
  const assetsDir = path.resolve(__dirname, '../public/assets');

  console.log('--- Uploading ILA KOCHI Media to Cloudflare R2 ---');

  // 1. Upload Logo
  await uploadFile(
    path.join(assetsDir, 'ila-kochi-logo-white.png'),
    'ila-kochi-logo-white.png',
    'image/png'
  );

  // 2. Upload Google Listing Image
  await uploadFile(
    path.join(assetsDir, 'ila-google-listing.jpg'),
    'ila-google-listing.jpg',
    'image/jpeg'
  );

  // 3. Upload Culinary Video Reel
  await uploadFile(
    path.join(assetsDir, 'ila-kochi-reel.mp4'),
    'ila-kochi-reel.mp4',
    'video/mp4'
  );

  console.log(' All media successfully uploaded to Cloudflare R2 bucket: ilakochi');
}

main().catch((err) => {
  console.error('Upload failed:', err);
  process.exit(1);
});

