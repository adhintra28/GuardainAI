import { cookies } from 'next/headers';
import { db } from '@/lib/db';
import { verifyAccessToken } from '@/lib/auth';

export type CurrentUser = {
  id: string;
  email: string;
  role: string;
  mfaEnabled: boolean;
};

export async function getCurrentUser(): Promise<CurrentUser | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get('access_token')?.value;

  if (!token) {
    return null;
  }

  try {
    const payload = verifyAccessToken(token);
    const user = await db.user.findUnique({
      where: { id: payload.sub },
      select: { id: true, email: true, role: true, mfaEnabled: true },
    });

    return user;
  } catch {
    return null;
  }
}
