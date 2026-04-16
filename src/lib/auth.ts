import { createHash, randomInt } from 'node:crypto';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { NextRequest } from 'next/server';

export type AuthRole = 'USER' | 'ADMIN';

export interface AccessTokenPayload {
  sub: string;
  email: string;
  role: AuthRole;
  type: 'access';
}

export interface RefreshTokenPayload {
  sub: string;
  jti: string;
  type: 'refresh';
}

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`${name} is required`);
  }
  return value;
}

const JWT_ACCESS_SECRET = () => requireEnv('JWT_ACCESS_SECRET');
const JWT_REFRESH_SECRET = () => requireEnv('JWT_REFRESH_SECRET');

export function hashValue(value: string): string {
  return createHash('sha256').update(value).digest('hex');
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function signAccessToken(payload: Omit<AccessTokenPayload, 'type'>): string {
  return jwt.sign({ ...payload, type: 'access' }, JWT_ACCESS_SECRET(), { expiresIn: '15m' });
}

export function signRefreshToken(payload: Omit<RefreshTokenPayload, 'type'>): string {
  return jwt.sign({ ...payload, type: 'refresh' }, JWT_REFRESH_SECRET(), { expiresIn: '7d' });
}

export function verifyAccessToken(token: string): AccessTokenPayload {
  return jwt.verify(token, JWT_ACCESS_SECRET()) as AccessTokenPayload;
}

export function verifyRefreshToken(token: string): RefreshTokenPayload {
  return jwt.verify(token, JWT_REFRESH_SECRET()) as RefreshTokenPayload;
}

export function generateOtp(): string {
  return String(randomInt(0, 1_000_000)).padStart(6, '0');
}

export function getBearerToken(req: NextRequest): string | null {
  const header = req.headers.get('authorization');
  if (!header?.toLowerCase().startsWith('bearer ')) return null;
  return header.slice(7);
}

export function getAccessTokenFromRequest(req: NextRequest): string | null {
  const bearer = getBearerToken(req);
  if (bearer) return bearer;
  return req.cookies.get('access_token')?.value ?? null;
}
