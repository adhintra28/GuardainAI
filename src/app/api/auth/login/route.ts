import { randomUUID } from 'node:crypto';
import { NextRequest, NextResponse } from 'next/server';
import {
  hashValue,
  verifyPassword,
} from '@/lib/auth';
import { issueSessionForUser } from '@/lib/authSession';
import { db } from '@/lib/db';
import { createSupabasePublicClient } from '@/lib/supabase';

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const email = body?.email?.toLowerCase?.().trim?.();
  const password = body?.password;

  if (!email || !password) {
    return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
  }

  const user = await db.user.findUnique({ where: { email } });
  if (!user?.passwordHash || !(await verifyPassword(password, user.passwordHash))) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  }

  if (user.mfaEnabled) {
    const supabase = createSupabasePublicClient();
    const otpResponse = await supabase.auth.signInWithOtp({
      email: user.email,
      options: {
        shouldCreateUser: false,
      },
    });

    if (otpResponse.error) {
      return NextResponse.json({ error: otpResponse.error.message }, { status: 500 });
    }

    const challenge = await db.mfaChallenge.create({
      data: {
        userId: user.id,
        otpHash: hashValue(randomUUID()),
        expiresAt: new Date(Date.now() + 10 * 60 * 1000),
      },
      select: { id: true, expiresAt: true },
    });

    return NextResponse.json({
      mfaRequired: true,
      challengeId: challenge.id,
      expiresAt: challenge.expiresAt.toISOString(),
    });
  }

  const res = NextResponse.json({
    user: { id: user.id, email: user.email, role: user.role },
    mfaRequired: false,
  });
  return issueSessionForUser(res, user);
}
