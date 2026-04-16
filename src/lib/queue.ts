import { Queue } from 'bullmq';
import { getRedisConnection } from '@/lib/redis';

export interface AnalyzeQueueJobData {
  jobId: string;
  idempotencyKey: string;
  traceId: string;
}

export const ANALYZE_QUEUE_NAME = 'analyze-queue';

let analyzeQueue: Queue<AnalyzeQueueJobData> | null = null;

export function getAnalyzeQueue(): Queue<AnalyzeQueueJobData> {
  if (!analyzeQueue) {
    analyzeQueue = new Queue<AnalyzeQueueJobData>(ANALYZE_QUEUE_NAME, {
      connection: getRedisConnection(),
    });
  }
  return analyzeQueue;
}
