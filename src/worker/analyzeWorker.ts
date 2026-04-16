import { Worker } from 'bullmq';
import { db } from '@/lib/db';
import { ANALYZE_QUEUE_NAME, AnalyzeQueueJobData } from '@/lib/queue';
import { getRedisConnection } from '@/lib/redis';
import { logger } from '@/lib/logger';
import { executeComplianceScan } from '@/services/complianceScanJob';
import { withTrace } from '@/lib/tracing';

const worker = new Worker<AnalyzeQueueJobData>(
  ANALYZE_QUEUE_NAME,
  async (job) =>
    withTrace(job.data.traceId, async () => {
      logger.info('Worker picked job', { jobId: job.data.jobId, queueJobId: job.id });
      await executeComplianceScan(job.data.jobId);
      logger.info('Worker completed job', { jobId: job.data.jobId });
    }),
  {
    connection: getRedisConnection(),
    concurrency: 2,
  },
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
  logger.info('Compliance scan worker is ready');
});
