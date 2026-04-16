import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseRouteClient } from '@/lib/supabase';

export async function GET(req: NextRequest) {
  const supabase = await createSupabaseRouteClient();
  const redirectTo = new URL('/api/auth/oauth/callback', req.nextUrl.origin).toString();

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo,
      skipBrowserRedirect: true,
    },
  });

  if (error || !data.url) {
    return NextResponse.json({ error: error?.message || 'Failed to start Google OAuth' }, { status: 500 });
  }

  return NextResponse.redirect(data.url);
}
