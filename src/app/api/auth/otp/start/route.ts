import { NextRequest, NextResponse } from 'next/server';
import { createSupabasePublicClient } from '@/lib/supabase';

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const email = body?.email?.toLowerCase?.().trim?.();

  if (!email) {
    return NextResponse.json({ error: 'Email is required' }, { status: 400 });
  }

  const supabase = createSupabasePublicClient();
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      shouldCreateUser: true,
    },
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
