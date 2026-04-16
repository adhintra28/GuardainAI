import { readFile } from 'fs/promises';
import path from 'path';
import { db } from '@/lib/db';
import { getUploadRoot } from '@/lib/uploadConfig';
import { logger } from '@/lib/logger';
import { extractTextFromBuffer, runComplianceScanPipeline } from '@/services/complianceScanPipeline';
import type { ScanInputFileMeta } from '@/types/complianceScan';

export async function executeComplianceScan(jobId: string): Promise<void> {
  const job = await db.analysisJob.findUnique({
    where: { id: jobId },
    include: {
      complianceDomain: {
        include: { acts: { orderBy: { sortOrder: 'asc' } } },
      },
    },
  });

  if (!job) {
    throw new Error('Job not found');
  }
  if (!job.complianceDomain || job.inputFiles == null) {
    throw new Error('Job is not a compliance scan');
  }

  await db.analysisJob.update({
    where: { id: jobId },
    data: { status: 'PROCESSING' },
  });

  const files = job.inputFiles as ScanInputFileMeta[];
  const uploadRoot = getUploadRoot();
  const documents: { fileName: string; mimeType: string; text: string }[] = [];

  for (const f of files) {
    const abs = path.join(uploadRoot, f.relativePath);
    const buf = await readFile(abs);
    const text = await extractTextFromBuffer(buf, f.mimeType, f.originalName);
    documents.push({ fileName: f.originalName, mimeType: f.mimeType, text });
  }

  const actTitles = job.complianceDomain.acts.map((a) => a.title);
  const report = await runComplianceScanPipeline({
    traceId: job.traceId,
    domainId: job.complianceDomain.id,
    domainLabel: job.complianceDomain.label,
    actTitles,
    documents,
  });

  await db.analysisJob.update({
    where: { id: jobId },
    data: {
      status: 'COMPLETED',
      report: JSON.parse(JSON.stringify(report)),
      errorMessage: null,
    },
  });

  logger.info('Compliance scan completed', { jobId, score: report.compliance_score });
}
