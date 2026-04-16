import { createHash, randomUUID } from 'node:crypto';
import { NextRequest, NextResponse } from 'next/server';
import { Prisma } from '@prisma/client';
import { getAccessTokenFromRequest, verifyAccessToken } from '@/lib/auth';
import { db } from '@/lib/db';
import { logger } from '@/lib/logger';
import { analyzeQueue } from '@/lib/queue';
import { createTraceId, withTrace } from '@/lib/tracing';

type AnalysisJobRow = {
  id: string;
  userId: string;
  status: 'QUEUED' | 'PROCESSING' | 'COMPLETED' | 'FAILED';
  report: Prisma.JsonValue | null;
  errorMessage: string | null;
};

export async function POST(req: NextRequest) {
  const traceId = createTraceId();
  return withTrace(traceId, async () => {
    try {
      const token = getAccessTokenFromRequest(req);
      if (!token) {
        return NextResponse.json({ error: 'Unauthenticated' }, { status: 401 });
      }
      const auth = verifyAccessToken(token);

      const formData = await req.formData();
      const invoiceFile = formData.get('invoice') as File | null;
      const blFile = formData.get('bill_of_lading') as File | null;

      if (!invoiceFile && !blFile) {
        logger.warn('REST API called without any documents provided.');
        return NextResponse.json({ error: 'No files provided' }, { status: 400 });
      }

      const invoiceBuffer = invoiceFile ? Buffer.from(await invoiceFile.arrayBuffer()) : undefined;
      const blBuffer = blFile ? Buffer.from(await blFile.arrayBuffer()) : undefined;
      const idempotencyKey = createHash('sha256')
        .update(invoiceBuffer ?? Buffer.from(''))
        .update(blBuffer ?? Buffer.from(''))
        .digest('hex');

      const [existingJob] = await db.$queryRaw<AnalysisJobRow[]>(Prisma.sql`
        SELECT id, "userId", status, report, "errorMessage"
        FROM "AnalysisJob"
        WHERE "idempotencyKey" = ${idempotencyKey}
        LIMIT 1
      `);

      if (existingJob && existingJob.userId !== auth.sub) {
        return NextResponse.json({ error: 'This document hash belongs to another user' }, { status: 403 });
      }

      if (existingJob?.status === 'COMPLETED' && existingJob.report) {
        logger.info('Returning completed idempotent job result', { jobId: existingJob.id });
        return NextResponse.json({
          jobId: existingJob.id,
          status: existingJob.status,
          report: existingJob.report,
        });
      }

      const job =
        existingJob ??
        (
          await db.$queryRaw<AnalysisJobRow[]>(Prisma.sql`
            INSERT INTO "AnalysisJob" ("id", "userId", "idempotencyKey", "status", "traceId", "createdAt", "updatedAt")
            VALUES (${randomUUID()}, ${auth.sub}, ${idempotencyKey}, 'QUEUED'::"JobStatus", ${traceId}, NOW(), NOW())
            RETURNING id, "userId", status, report, "errorMessage"
          `)
        )[0];

      if (!existingJob) {
        await analyzeQueue.add(
          'analyze-documents',
          {
            jobId: job.id,
            idempotencyKey,
            traceId,
            invoice: invoiceBuffer
              ? {
                  base64: invoiceBuffer.toString('base64'),
                  mimeType: invoiceFile?.type || 'application/octet-stream',
                }
              : undefined,
            billOfLading: blBuffer
              ? {
                  base64: blBuffer.toString('base64'),
                  mimeType: blFile?.type || 'application/octet-stream',
                }
              : undefined,
          },
          {
            jobId: idempotencyKey,
            removeOnComplete: 200,
            removeOnFail: 200,
            attempts: 3,
            backoff: { type: 'exponential', delay: 2000 },
          }
        );
      }

      const startedAt = Date.now();
      while (Date.now() - startedAt < 90000) {
        const state = await db.analysisJob.findUnique({ where: { id: job.id } });
        if (state?.status === 'COMPLETED' && state.report) {
          return NextResponse.json({
            jobId: state.id,
            status: state.status,
            report: state.report,
          });
        }
        if (state?.status === 'FAILED') {
          return NextResponse.json(
            { jobId: state.id, status: state.status, error: state.errorMessage ?? 'Analysis failed' },
            { status: 500 }
          );
        }
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }

      return NextResponse.json({ jobId: job.id, status: 'QUEUED' }, { status: 202 });
    } catch (error) {
      logger.error('Critical failure in Analysis REST API Route', error);
      return NextResponse.json({ error: 'Failed to process files' }, { status: 500 });
    }
  });
}
