import IORedis from 'ioredis';

let connection: IORedis | null = null;

export function getRedisConnection(): IORedis {
  if (!connection) {
    const redisUrl = process.env.REDIS_URL ?? 'redis://127.0.0.1:6379';
    connection = new IORedis(redisUrl, {
      maxRetriesPerRequest: null,
    });
  }
  return connection;
}
