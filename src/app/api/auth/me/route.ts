import { NextRequest, NextResponse } from 'next/server';
import { getAccessTokenFromRequest, verifyAccessToken } from '@/lib/auth';
import { db } from '@/lib/db';

export async function GET(req: NextRequest) {
  const token = getAccessTokenFromRequest(req);
  if (!token) {
    return NextResponse.json({ error: 'Unauthenticated' }, { status: 401 });
  }

  try {
    const payload = verifyAccessToken(token);
    const user = await db.user.findUnique({
      where: { id: payload.sub },
      select: { id: true, email: true, role: true, mfaEnabled: true, createdAt: true },
    });

    if (!user) {
      return NextResponse.json({ error: 'Unauthenticated' }, { status: 401 });
    }

    return NextResponse.json({ user });
  } catch {
    return NextResponse.json({ error: 'Unauthenticated' }, { status: 401 });
  }
}
