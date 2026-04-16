import { AuthProvider } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';
import { findOrCreateUserFromExternalIdentity, issueSessionForUser } from '@/lib/authSession';
import { createSupabaseRouteClient } from '@/lib/supabase';

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get('code');
  if (!code) {
    return NextResponse.redirect(new URL('/?authError=Missing%20OAuth%20code', req.nextUrl.origin));
  }

  const supabase = await createSupabaseRouteClient();
  const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
  if (exchangeError) {
    return NextResponse.redirect(new URL(`/?authError=${encodeURIComponent(exchangeError.message)}`, req.nextUrl.origin));
  }

  const { data, error: userError } = await supabase.auth.getUser();
  const authUser = data.user;
  const email = authUser?.email;
  if (userError || !authUser || !email) {
    return NextResponse.redirect(new URL('/?authError=Unable%20to%20read%20OAuth%20user', req.nextUrl.origin));
  }

  const provider = authUser.app_metadata.provider === 'github' ? AuthProvider.GITHUB : AuthProvider.GOOGLE;
  const localUser = await findOrCreateUserFromExternalIdentity({
    email,
    provider,
    providerAccountId: authUser.id,
  });

  const res = NextResponse.redirect(new URL('/', req.nextUrl.origin));
  await issueSessionForUser(res, localUser);
  return res;
}
