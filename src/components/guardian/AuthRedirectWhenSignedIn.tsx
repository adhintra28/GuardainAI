'use client';

import { useAuth } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useEffect, useRef } from 'react';

/**
 * Client-only redirect avoids a server redirect to /dashboard while middleware may still
 * treat the session as unsigned-in for the next navigation (redirect loop /auth ↔ /dashboard).
 */
export function AuthRedirectWhenSignedIn({ redirectUrl }: { redirectUrl: string }) {
  const { isSignedIn, isLoaded } = useAuth();
  const router = useRouter();
  const didRedirect = useRef(false);

  useEffect(() => {
    if (!isLoaded || didRedirect.current) return;
    if (isSignedIn) {
      didRedirect.current = true;
      router.replace(redirectUrl);
    }
  }, [isLoaded, isSignedIn, router, redirectUrl]);

  return null;
}
