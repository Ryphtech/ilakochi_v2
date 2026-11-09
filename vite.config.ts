import { defineConfig, type ViteDevServer, type PluginOption } from 'vite';
import type { IncomingMessage, ServerResponse } from 'http';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

const r2Client = new S3Client({
  region: 'auto',
  endpoint: 'https://d6e0e618a594c39ee7bf96cd59297564.r2.cloudflarestorage.com',
  credentials: {
    accessKeyId: '93d1cbcc3bcb67bdf187c20bfac1e47a',
    secretAccessKey: 'f5f08f1b10ebf44e0b5e59236ec75c2238aa6591ce3b05dc427ffc51d154f750',
  },
});

const r2PublicUrl = 'https://pub-a15e46301b3045309b2a4a019cb939e9.r2.dev';
const r2Bucket = 'ilakochi';

function r2UploadPlugin(): PluginOption {
  return {
    name: 'r2-upload-middleware',
    configureServer(server: ViteDevServer) {
      server.middlewares.use(async (req: IncomingMessage, res: ServerResponse, next: () => void) => {
        if (req.url === '/api/upload' && req.method === 'POST') {
          try {
            const rawFileName = (req.headers['x-filename'] as string) || `upload-${Date.now()}`;
            const fileName = decodeURIComponent(rawFileName);
            const contentType = (req.headers['content-type'] as string) || 'application/octet-stream';

            const chunks: Buffer[] = [];
            for await (const chunk of req) {
              chunks.push(chunk as Buffer);
            }
            const buffer = Buffer.concat(chunks);

            // Clean key name: replace spaces and special characters
            const sanitizedKey = fileName
              .toLowerCase()
              .replace(/[^a-z0-9._-]/g, '-');
            const uniqueKey = `${Date.now()}-${sanitizedKey}`;

            const command = new PutObjectCommand({
              Bucket: r2Bucket,
              Key: uniqueKey,
              Body: buffer,
              ContentType: contentType,
            });

            await r2Client.send(command);

            const fileUrl = `${r2PublicUrl}/${uniqueKey}`;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({
              success: true,
              url: fileUrl,
              key: uniqueKey,
              name: fileName,
              size: buffer.length,
              type: contentType
            }));
          } catch (err: unknown) {
            console.error('Server R2 upload error:', err);
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            const errorMsg = err instanceof Error ? err.message : 'Upload failed';
            res.end(JSON.stringify({ success: false, error: errorMsg }));
          }
        } else {
          next();
        }
      });
    },
  };
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), r2UploadPlugin()],
  server: {
    port: 3001,
    open: true,
  },
});
