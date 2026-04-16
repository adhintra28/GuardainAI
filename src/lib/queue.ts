import { Queue } from 'bullmq';
import { redisConnection } from '@/lib/redis';

export interface AnalyzeQueueJobData {
  jobId: string;
  idempotencyKey: string;
  traceId: string;
  invoice?: { base64: string; mimeType: string };
  billOfLading?: { base64: string; mimeType: string };
}

export const ANALYZE_QUEUE_NAME = 'analyze-queue';

export const analyzeQueue = new Queue<AnalyzeQueueJobData>(ANALYZE_QUEUE_NAME, {
  connection: redisConnection,
});
