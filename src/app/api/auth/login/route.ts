import { randomUUID } from 'node:crypto';
import { NextRequest, NextResponse } from 'next/server';
import {
  generateOtp,
  hashValue,
  signAccessToken,
  signRefreshToken,
  verifyPassword,
} from '@/lib/auth';
import { setAuthCookies } from '@/lib/authCookies';
import { db } from '@/lib/db';
import { logger } from '@/lib/logger';

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const email = body?.email?.toLowerCase?.().trim?.();
  const password = body?.password;

  if (!email || !password) {
    return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
  }

  const user = await db.user.findUnique({ where: { email } });
  if (!user || !(await verifyPassword(password, user.passwordHash))) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  }

  if (user.mfaEnabled) {
    const otp = generateOtp();
    const challenge = await db.mfaChallenge.create({
      data: {
        userId: user.id,
        otpHash: hashValue(otp),
        expiresAt: new Date(Date.now() + 10 * 60 * 1000),
      },
      select: { id: true, expiresAt: true },
    });

    logger.info('MFA OTP generated', { userId: user.id, email: user.email, otp });

    return NextResponse.json({
      mfaRequired: true,
      challengeId: challenge.id,
      expiresAt: challenge.expiresAt.toISOString(),
      otpPreview: process.env.NODE_ENV !== 'production' ? otp : undefined,
    });
  }

  const refreshJti = randomUUID();
  const accessToken = signAccessToken({ sub: user.id, email: user.email, role: user.role });
  const refreshToken = signRefreshToken({ sub: user.id, jti: refreshJti });

  await db.refreshToken.create({
    data: {
      userId: user.id,
      tokenHash: hashValue(refreshToken),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    },
  });

  const res = NextResponse.json({
    user: { id: user.id, email: user.email, role: user.role },
    mfaRequired: false,
  });
  setAuthCookies(res, accessToken, refreshToken);
  return res;
}
