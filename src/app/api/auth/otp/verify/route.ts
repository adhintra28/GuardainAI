import { AuthProvider } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';
import { findOrCreateUserFromExternalIdentity, issueSessionForUser } from '@/lib/authSession';
import { createSupabasePublicClient } from '@/lib/supabase';

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const email = body?.email?.toLowerCase?.().trim?.();
  const otp = body?.otp;

  if (!email || !otp) {
    return NextResponse.json({ error: 'Email and OTP are required' }, { status: 400 });
  }

  const supabase = createSupabasePublicClient();
  const { data, error } = await supabase.auth.verifyOtp({
    email,
    token: String(otp),
    type: 'email',
  });

  const authUser = data.user;
  if (error || !authUser?.email) {
    return NextResponse.json({ error: error?.message || 'Invalid OTP' }, { status: 401 });
  }

  const localUser = await findOrCreateUserFromExternalIdentity({
    email: authUser.email,
    provider: AuthProvider.EMAIL_OTP,
    providerAccountId: authUser.id,
  });

  const res = NextResponse.json({
    user: { id: localUser.id, email: localUser.email, role: localUser.role },
  });

  return issueSessionForUser(res, localUser);
}
