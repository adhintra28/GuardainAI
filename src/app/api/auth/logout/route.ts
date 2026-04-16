import { NextRequest, NextResponse } from 'next/server';
import { hashValue } from '@/lib/auth';
import { clearAuthCookies } from '@/lib/authCookies';
import { db } from '@/lib/db';

export async function POST(req: NextRequest) {
  const refreshToken = req.cookies.get('refresh_token')?.value;
  if (refreshToken) {
    const tokenHash = hashValue(refreshToken);
    await db.refreshToken
      .update({
        where: { tokenHash },
        data: { revokedAt: new Date() },
      })
      .catch(() => null);
  }

  const res = NextResponse.json({ success: true });
  clearAuthCookies(res);
  return res;
}
