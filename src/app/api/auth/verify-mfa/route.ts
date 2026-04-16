import { randomUUID } from 'node:crypto';
import { NextRequest, NextResponse } from 'next/server';
import { hashValue, signAccessToken, signRefreshToken } from '@/lib/auth';
import { setAuthCookies } from '@/lib/authCookies';
import { db } from '@/lib/db';

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const challengeId = body?.challengeId;
  const otp = body?.otp;

  if (!challengeId || !otp) {
    return NextResponse.json({ error: 'challengeId and otp are required' }, { status: 400 });
  }

  const challenge = await db.mfaChallenge.findUnique({
    where: { id: challengeId },
    include: { user: true },
  });

  if (!challenge || challenge.consumedAt || challenge.expiresAt < new Date()) {
    return NextResponse.json({ error: 'MFA challenge is invalid or expired' }, { status: 401 });
  }

  if (challenge.otpHash !== hashValue(String(otp))) {
    return NextResponse.json({ error: 'Invalid OTP' }, { status: 401 });
  }

  await db.mfaChallenge.update({
    where: { id: challenge.id },
    data: { consumedAt: new Date() },
  });

  const refreshJti = randomUUID();
  const accessToken = signAccessToken({
    sub: challenge.user.id,
    email: challenge.user.email,
    role: challenge.user.role,
  });
  const refreshToken = signRefreshToken({
    sub: challenge.user.id,
    jti: refreshJti,
  });

  await db.refreshToken.create({
    data: {
      userId: challenge.user.id,
      tokenHash: hashValue(refreshToken),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    },
  });

  const res = NextResponse.json({
    user: { id: challenge.user.id, email: challenge.user.email, role: challenge.user.role },
  });
  setAuthCookies(res, accessToken, refreshToken);
  return res;
}
