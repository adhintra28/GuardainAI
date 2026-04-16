import { auth, currentUser } from '@clerk/nextjs/server';
import { db } from '@/lib/db';
import { ANONYMOUS_SCAN_USER_EMAIL } from '@/lib/guardianDynamicData';

/** Ensures a User row exists for the signed-in Clerk user (keyed by primary email). */
export async function getOrCreateUserIdFromSession(): Promise<string | null> {
  const { userId } = await auth();
  if (!userId) return null;

  const clerkUser = await currentUser();
  const email =
    clerkUser?.primaryEmailAddress?.emailAddress ??
    clerkUser?.emailAddresses?.[0]?.emailAddress;
  if (!email) return null;

  const user = await db.user.upsert({
    where: { email },
    create: { email },
    update: {},
    select: { id: true },
  });

  return user.id;
}

/**
 * Resolves the workspace user for scans and dashboard data.
 * Uses Clerk when signed in; otherwise a shared prototype user (no login required).
 */
export async function getOrCreateUserIdForScans(): Promise<string> {
  const clerkId = await getOrCreateUserIdFromSession();
  if (clerkId) return clerkId;

  const user = await db.user.upsert({
    where: { email: ANONYMOUS_SCAN_USER_EMAIL },
    create: { email: ANONYMOUS_SCAN_USER_EMAIL },
    update: {},
    select: { id: true },
  });
  return user.id;
}
