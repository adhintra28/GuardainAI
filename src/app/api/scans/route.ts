import { NextResponse } from 'next/server';
import { randomUUID } from 'crypto';
import { mkdir, writeFile } from 'fs/promises';
import path from 'path';
import { db } from '@/lib/db';
import { getOrCreateUserIdFromSession } from '@/lib/authSession';
import { getUploadRoot } from '@/lib/uploadConfig';
import { getAnalyzeQueue } from '@/lib/queue';
import { createTraceId } from '@/lib/tracing';
import { executeComplianceScan } from '@/services/complianceScanJob';
import type { ScanInputFileMeta } from '@/types/complianceScan';

const MAX_FILE_BYTES = 50 * 1024 * 1024;

function isAllowedMime(mime: string): boolean {
  const m = mime.toLowerCase();
  return m === 'application/pdf' || m.startsWith('text/') || m === 'application/json';
}

export async function POST(req: Request) {
  const userId = await getOrCreateUserIdFromSession();
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

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

  const files = form.getAll('files').filter((x): x is File => typeof File !== 'undefined' && x instanceof File);
  if (files.length === 0) {
    return NextResponse.json({ error: 'At least one file is required' }, { status: 400 });
  }

  const jobId = randomUUID();
  const idempotencyKey = randomUUID();
  const traceId = createTraceId();
  const uploadRoot = getUploadRoot();
  const jobDir = path.join(uploadRoot, jobId);
  await mkdir(jobDir, { recursive: true });

  const inputFiles: ScanInputFileMeta[] = [];

  for (const file of files) {
    if (file.size > MAX_FILE_BYTES) {
      return NextResponse.json({ error: `File too large (max 50MB): ${file.name}` }, { status: 400 });
    }
    const mime = file.type || 'application/octet-stream';
    if (!isAllowedMime(mime)) {
      return NextResponse.json(
        { error: `Unsupported file type: ${mime}. Use PDF, text, or JSON.` },
        { status: 400 },
      );
    }
    const safeName = path.basename(file.name).replace(/[^\w.\-]/g, '_') || 'document';
    const relativePath = path.join(jobId, safeName);
    const abs = path.join(uploadRoot, relativePath);
    const buf = Buffer.from(await file.arrayBuffer());
    await writeFile(abs, buf);
    inputFiles.push({ relativePath, originalName: file.name, mimeType: mime });
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

  const sync = process.env.COMPLIANCE_SCAN_SYNC === 'true';
  if (sync) {
    try {
      await executeComplianceScan(jobId);
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Scan failed';
      await db.analysisJob.update({
        where: { id: jobId },
        data: { status: 'FAILED', errorMessage: msg },
      });
      return NextResponse.json({ jobId, status: 'FAILED', error: msg }, { status: 500 });
    }
    return NextResponse.json({ jobId, status: 'COMPLETED' });
  }

  try {
    await getAnalyzeQueue().add(
      'compliance-scan',
      { jobId, traceId, idempotencyKey },
      { removeOnComplete: true },
    );
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Queue error';
    await db.analysisJob.update({
      where: { id: jobId },
      data: { status: 'FAILED', errorMessage: `Queue unavailable: ${msg}` },
    });
    return NextResponse.json(
      {
        error: 'Queue unavailable',
        hint: 'Start Redis and run npm run worker, or set COMPLIANCE_SCAN_SYNC=true in .env',
      },
      { status: 503 },
    );
  }

  return NextResponse.json({ jobId, status: 'QUEUED' });
}
