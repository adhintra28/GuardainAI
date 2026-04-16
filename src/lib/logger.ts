import { getTraceId } from '@/lib/tracing';

function toJsonLine(level: 'INFO' | 'WARN' | 'ERROR', message: string, meta?: unknown): string {
  return JSON.stringify({
    level,
    timestamp: new Date().toISOString(),
    traceId: getTraceId(),
    message,
    meta: meta ?? undefined,
  });
}

export const logger = {
  info: (message: string, meta?: unknown) => {
    console.log(toJsonLine('INFO', message, meta));
  },
  warn: (message: string, meta?: unknown) => {
    console.warn(toJsonLine('WARN', message, meta));
  },
  error: (message: string, error?: unknown) => {
    console.error(toJsonLine('ERROR', message, error));
  },
};
