import path from 'path';
import { pathToFileURL } from 'url';
import { PDFParse } from 'pdf-parse';

let configured = false;

/**
 * pdfjs-dist resolves workers via URLs. Next/Turbopack bundles break that path; point at the real file in node_modules.
 */
export function ensurePdfjsWorkerConfigured(): void {
  if (configured) return;
  configured = true;
  const workerPath = path.join(
    process.cwd(),
    'node_modules',
    'pdfjs-dist',
    'legacy',
    'build',
    'pdf.worker.mjs',
  );
  PDFParse.setWorker(pathToFileURL(workerPath).href);
}
