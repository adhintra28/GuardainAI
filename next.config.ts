import type { NextConfig } from 'next';
import path from 'path';

const nextConfig: NextConfig = {
  /** Keep pdfjs / canvas out of the bundle so worker paths resolve like plain Node. */
  serverExternalPackages: ['pdf-parse', 'pdfjs-dist', '@napi-rs/canvas'],
  turbopack: {
    root: path.resolve(process.cwd()),
  },
};

export default nextConfig;
