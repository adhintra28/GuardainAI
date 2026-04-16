import { NextRequest, NextResponse } from 'next/server';
import { AuthProvider } from '@prisma/client';
import { db } from '@/lib/db';
import { hashPassword } from '@/lib/auth';
import { createSupabaseAdminClient } from '@/lib/supabase';

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
  const supabaseAdmin = createSupabaseAdminClient();
  const authResult = await supabaseAdmin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });

  if (authResult.error || !authResult.data.user) {
    return NextResponse.json(
      { error: authResult.error?.message || 'Failed to create Supabase auth user' },
      { status: 500 }
    );
  }

  const user = await db.user.create({
    data: {
      email,
      passwordHash,
      role: 'USER',
      mfaEnabled: true,
      providerAccounts: {
        create: {
          provider: AuthProvider.LOCAL,
          providerAccountId: authResult.data.user.id,
        },
      },
    },
    select: { id: true, email: true, role: true, mfaEnabled: true, createdAt: true },
  });

  return NextResponse.json({ user }, { status: 201 });
}
