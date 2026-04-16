import { randomUUID } from 'node:crypto';
import { NextResponse } from 'next/server';
import { AuthProvider, User } from '@prisma/client';
import { setAuthCookies } from '@/lib/authCookies';
import { hashValue, signAccessToken, signRefreshToken } from '@/lib/auth';
import { db } from '@/lib/db';

export async function issueSessionForUser(
  res: NextResponse,
  user: Pick<User, 'id' | 'email' | 'role'>
): Promise<NextResponse> {
  const refreshJti = randomUUID();
  const accessToken = signAccessToken({ sub: user.id, email: user.email, role: user.role });
  const refreshToken = signRefreshToken({ sub: user.id, jti: refreshJti });

  await db.refreshToken.create({
    data: {
      userId: user.id,
      tokenHash: hashValue(refreshToken),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    },
  });

  setAuthCookies(res, accessToken, refreshToken);
  return res;
}

export async function findOrCreateUserFromExternalIdentity(input: {
  email: string;
  provider: AuthProvider;
  providerAccountId: string;
}) {
  const email = input.email.toLowerCase().trim();

  const existingAccount = await db.authProviderAccount.findFirst({
    where: {
      provider: input.provider,
      providerAccountId: input.providerAccountId,
    },
    include: { user: true },
  });

  if (existingAccount) {
    return existingAccount.user;
  }

  const existingUser = await db.user.findUnique({
    where: { email },
  });

  const user =
    existingUser ??
    (await db.user.create({
      data: {
        email,
        passwordHash: null,
        role: 'USER',
        mfaEnabled: false,
      },
    }));

  await db.authProviderAccount.upsert({
    where: {
      provider_providerAccountId: {
        provider: input.provider,
        providerAccountId: input.providerAccountId,
      },
    },
    create: {
      userId: user.id,
      provider: input.provider,
      providerAccountId: input.providerAccountId,
    },
    update: {
      userId: user.id,
    },
  });

  return user;
}
