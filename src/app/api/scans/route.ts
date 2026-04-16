import { NextResponse } from 'next/server';
import { randomUUID } from 'crypto';
import { mkdir, writeFile } from 'fs/promises';
import path from 'path';
import { db } from '@/lib/db';
import { getOrCreateUserIdForScans } from '@/lib/authSession';
import { getUploadRoot } from '@/lib/uploadConfig';
import { getAnalyzeQueue } from '@/lib/queue';
import { createTraceId } from '@/lib/tracing';
import { executeComplianceScan } from '@/services/complianceScanJob';
import { logger } from '@/lib/logger';
import type { ScanInputFileMeta } from '@/types/complianceScan';

const MAX_FILE_BYTES = 50 * 1024 * 1024;

/** Sync scans can run for a while (LLM). */
export const maxDuration = 300;

function isAllowedMime(mime: string): boolean {
  const m = mime.toLowerCase();
  return m === 'application/pdf' || m.startsWith('text/') || m === 'application/json';
}

function inferMimeType(fileName: string, declared: string): string {
  const d = (declared ?? '').trim().toLowerCase();
  if (d && d !== 'application/octet-stream') return declared;
  const ext = path.extname(fileName).toLowerCase();
  if (ext === '.pdf') return 'application/pdf';
  if (ext === '.json') return 'application/json';
  if (ext === '.txt' || ext === '.md' || ext === '.csv' || ext === '.log') return 'text/plain';
  if (ext === '.html' || ext === '.htm') return 'text/html';
  return 'text/plain';
}

function uniqueSafeName(original: string, used: Set<string>): string {
  let base = path.basename(original).replace(/[^\w.\-]/g, '_') || 'document';
  if (!base.includes('.')) base = `${base}.txt`;
  let candidate = base;
  let i = 0;
  const ext = path.extname(base);
  const stem = ext ? base.slice(0, -ext.length) : base;
  while (used.has(candidate.toLowerCase())) {
    i += 1;
    candidate = `${stem}_${i}${ext}`;
  }
  used.add(candidate.toLowerCase());
  return candidate;
}

function isFormDataFileEntry(entry: FormDataEntryValue): entry is File | Blob {
  return typeof entry !== 'string' && entry != null && typeof (entry as Blob).arrayBuffer === 'function';
}

export async function POST(req: Request) {
  const userId = await getOrCreateUserIdForScans();

  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return NextResponse.json({ error: 'Invalid form data' }, { status: 400 });
  }

  const domainId = String(form.get('domainId') ?? '').trim();
  if (!domainId) {
    return NextResponse.json({ error: 'domainId is required' }, { status: 400 });
  }

  const domain = await db.complianceDomain.findUnique({
    where: { id: domainId },
    include: { acts: true },
  });
  if (!domain) {
    return NextResponse.json({ error: 'Invalid domainId' }, { status: 400 });
  }

  const rawEntries = form.getAll('files');
  const fileEntries = rawEntries.filter(isFormDataFileEntry);
  if (fileEntries.length === 0) {
    return NextResponse.json({ error: 'At least one file is required' }, { status: 400 });
  }

  const jobId = randomUUID();
  const idempotencyKey = randomUUID();
  const traceId = createTraceId();
  const uploadRoot = getUploadRoot();
  const jobDir = path.join(uploadRoot, jobId);
  await mkdir(jobDir, { recursive: true });

  const inputFiles: ScanInputFileMeta[] = [];
  const usedNames = new Set<string>();

  for (let i = 0; i < fileEntries.length; i++) {
    const blob = fileEntries[i];
    const originalName =
      typeof File !== 'undefined' && blob instanceof File && blob.name
        ? blob.name
        : `document-${i + 1}`;

    if (blob.size > MAX_FILE_BYTES) {
      return NextResponse.json({ error: `File too large (max 50MB): ${originalName}` }, { status: 400 });
    }

    const declaredType = typeof File !== 'undefined' && blob instanceof File ? blob.type : '';
    const mime = inferMimeType(originalName, declaredType);
    if (!isAllowedMime(mime)) {
      return NextResponse.json(
        { error: `Unsupported file type for "${originalName}" (${mime || 'unknown'}). Use PDF, text, Markdown, or JSON.` },
        { status: 400 },
      );
    }

    const safeName = uniqueSafeName(originalName, usedNames);
    const relativePath = path.posix.join(jobId, safeName);
    const abs = path.join(uploadRoot, relativePath);
    const buf = Buffer.from(await blob.arrayBuffer());
    await writeFile(abs, buf);
    inputFiles.push({ relativePath, originalName, mimeType: mime });
  }

  await db.analysisJob.create({
    data: {
      id: jobId,
      userId,
      idempotencyKey,
      traceId,
      status: 'QUEUED',
      complianceDomainId: domainId,
      inputFiles: JSON.parse(JSON.stringify(inputFiles)),
    },
  });

  /** Local dev runs inline by default so Redis + worker are not required. */
  const preferSync =
    process.env.COMPLIANCE_SCAN_SYNC === 'true' ||
    (process.env.NODE_ENV === 'development' && process.env.USE_BULLMQ_IN_DEV !== 'true');

  async function runSyncInRequest(): Promise<NextResponse> {
    try {
      await executeComplianceScan(jobId);
      return NextResponse.json({ jobId, status: 'COMPLETED' });
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Scan failed';
      await db.analysisJob.update({
        where: { id: jobId },
        data: { status: 'FAILED', errorMessage: msg },
      });
      return NextResponse.json({ jobId, status: 'FAILED', error: msg }, { status: 500 });
    }
  }

  if (preferSync) {
    return runSyncInRequest();
  }

  try {
    await getAnalyzeQueue().add(
      'compliance-scan',
      { jobId, traceId, idempotencyKey },
      { removeOnComplete: true },
    );
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Queue error';
    logger.warn('Analyze queue unavailable, running scan synchronously', { jobId, msg });
    return runSyncInRequest();
  }

  return NextResponse.json({ jobId, status: 'QUEUED' });
}
