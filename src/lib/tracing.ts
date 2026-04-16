import { AsyncLocalStorage } from 'node:async_hooks';
import { randomUUID } from 'node:crypto';

type TraceContext = { traceId: string };

const traceStorage = new AsyncLocalStorage<TraceContext>();

export function getTraceId(): string {
  return traceStorage.getStore()?.traceId ?? 'trace-unknown';
}

export async function withTrace<T>(traceId: string, fn: () => Promise<T>): Promise<T> {
  return traceStorage.run({ traceId }, fn);
}

export function createTraceId(): string {
  return randomUUID();
}
