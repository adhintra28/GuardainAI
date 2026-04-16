import IORedis from 'ioredis';

const redisUrl = process.env.REDIS_URL ?? 'redis://redis:6379';

export const redisConnection = new IORedis(redisUrl, {
  maxRetriesPerRequest: null,
});
