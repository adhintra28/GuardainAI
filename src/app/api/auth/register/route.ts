import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { hashPassword } from '@/lib/auth';

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const email = body?.email?.toLowerCase?.().trim?.();
  const password = body?.password;

  if (!email || !password || password.length < 8) {
    return NextResponse.json({ error: 'Valid email and password (min 8 chars) are required' }, { status: 400 });
  }

  const existing = await db.user.findUnique({ where: { email } });
  if (existing) {
    return NextResponse.json({ error: 'Email already registered' }, { status: 409 });
  }

  const passwordHash = await hashPassword(password);
  const user = await db.user.create({
    data: {
      email,
      passwordHash,
      role: 'USER',
      mfaEnabled: true,
    },
    select: { id: true, email: true, role: true, mfaEnabled: true, createdAt: true },
  });

  return NextResponse.json({ user }, { status: 201 });
}
