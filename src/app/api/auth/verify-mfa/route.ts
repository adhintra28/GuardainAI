import { NextRequest, NextResponse } from 'next/server';
import { issueSessionForUser } from '@/lib/authSession';
import { db } from '@/lib/db';
import { createSupabasePublicClient } from '@/lib/supabase';

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

  const supabase = createSupabasePublicClient();
  const otpResult = await supabase.auth.verifyOtp({
    email: challenge.user.email,
    token: String(otp),
    type: 'email',
  });

  if (otpResult.error) {
    return NextResponse.json({ error: otpResult.error.message || 'Invalid OTP' }, { status: 401 });
  }

  await db.mfaChallenge.update({
    where: { id: challenge.id },
    data: { consumedAt: new Date() },
  });

  const res = NextResponse.json({
    user: { id: challenge.user.id, email: challenge.user.email, role: challenge.user.role },
  });
  return issueSessionForUser(res, challenge.user);
}
