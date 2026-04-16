import { auth, currentUser } from '@clerk/nextjs/server';
import { db } from '@/lib/db';

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
