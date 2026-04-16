import { randomUUID } from 'node:crypto';
import { NextRequest, NextResponse } from 'next/server';
import { hashValue, signAccessToken, signRefreshToken, verifyRefreshToken } from '@/lib/auth';
import { clearAuthCookies, setAuthCookies } from '@/lib/authCookies';
import { db } from '@/lib/db';

export async function POST(req: NextRequest) {
  const refreshToken = req.cookies.get('refresh_token')?.value;
  if (!refreshToken) {
    return NextResponse.json({ error: 'Missing refresh token' }, { status: 401 });
  }

  try {
    const payload = verifyRefreshToken(refreshToken);
    const tokenHash = hashValue(refreshToken);

    const record = await db.refreshToken.findUnique({
      where: { tokenHash },
      include: { user: true },
    });

    if (!record || record.revokedAt || record.expiresAt < new Date() || record.userId !== payload.sub) {
      const res = NextResponse.json({ error: 'Invalid refresh token' }, { status: 401 });
      clearAuthCookies(res);
      return res;
    }

    await db.refreshToken.update({
      where: { id: record.id },
      data: { revokedAt: new Date() },
    });

    const nextRefreshJti = randomUUID();
    const nextAccessToken = signAccessToken({
      sub: record.user.id,
      email: record.user.email,
      role: record.user.role,
    });
    const nextRefreshToken = signRefreshToken({
      sub: record.user.id,
      jti: nextRefreshJti,
    });

    await db.refreshToken.create({
      data: {
        userId: record.user.id,
        tokenHash: hashValue(nextRefreshToken),
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    const res = NextResponse.json({
      user: { id: record.user.id, email: record.user.email, role: record.user.role },
    });
    setAuthCookies(res, nextAccessToken, nextRefreshToken);
    return res;
  } catch {
    const res = NextResponse.json({ error: 'Refresh token verification failed' }, { status: 401 });
    clearAuthCookies(res);
    return res;
  }
}
