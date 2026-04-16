import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

/**
 * Protect only routes that require a session. Default-deny-inverted (protect all except a list)
 * can fight with Clerk’s post-login navigation before cookies are visible on the next request.
 */
const isProtectedRoute = createRouteMatcher([
  '/dashboard(.*)',
  '/scanner(.*)',
  '/settings(.*)',
  '/reports(.*)',
  '/domains(.*)',
  '/alerts(.*)',
  '/frameworks(.*)',
  '/api/scans(.*)',
]);

export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};
