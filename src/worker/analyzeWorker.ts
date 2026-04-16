import { Worker } from 'bullmq';
import { db } from '@/lib/db';
import { ANALYZE_QUEUE_NAME, AnalyzeQueueJobData } from '@/lib/queue';
import { redisConnection } from '@/lib/redis';
import { logger } from '@/lib/logger';
import { runAnalysisPipeline } from '@/services/analysisPipeline';
import { withTrace } from '@/lib/tracing';

const worker = new Worker<AnalyzeQueueJobData>(
  ANALYZE_QUEUE_NAME,
  async (job) =>
    withTrace(job.data.traceId, async () => {
      logger.info('Worker picked job', { jobId: job.data.jobId, queueJobId: job.id });

      await db.analysisJob.update({
        where: { id: job.data.jobId },
        data: { status: 'PROCESSING' },
      });

      const { report, encryptedExtractedData } = await runAnalysisPipeline({
        traceId: job.data.traceId,
        invoice: job.data.invoice
          ? { buffer: Buffer.from(job.data.invoice.base64, 'base64'), mimeType: job.data.invoice.mimeType }
          : undefined,
        billOfLading: job.data.billOfLading
          ? { buffer: Buffer.from(job.data.billOfLading.base64, 'base64'), mimeType: job.data.billOfLading.mimeType }
          : undefined,
      });

      await db.analysisJob.update({
        where: { id: job.data.jobId },
        data: {
          status: 'COMPLETED',
          report: JSON.parse(JSON.stringify(report)),
          extractedData: encryptedExtractedData,
          errorMessage: null,
        },
      });

      logger.info('Worker completed job', { jobId: job.data.jobId });
    }),
  {
    connection: redisConnection,
    concurrency: 2,
  }
);

worker.on('failed', async (job, error) => {
  const jobId = job?.data.jobId;
  if (jobId) {
    await db.analysisJob
      .update({
        where: { id: jobId },
        data: { status: 'FAILED', errorMessage: error.message },
      })
      .catch(() => null);
  }
  logger.error('Worker job failed', { jobId, error: error.message });
});

worker.on('ready', () => {
  logger.info('Analyze worker is ready');
});
