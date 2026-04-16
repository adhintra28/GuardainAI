import { NextRequest, NextResponse } from 'next/server';
import { verifyAccessTokenEdge } from '@/lib/authEdge';

const ADMIN_ONLY_PATHS = ['/api/auth/admin'];

export async function proxy(req: NextRequest) {
  const token = req.cookies.get('access_token')?.value;
  if (!token) {
    return NextResponse.json({ error: 'Unauthenticated' }, { status: 401 });
  }

  try {
    const payload = await verifyAccessTokenEdge(token);
    const isAdminOnly = ADMIN_ONLY_PATHS.some((path) => req.nextUrl.pathname.startsWith(path));

    if (isAdminOnly && payload.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    return NextResponse.next();
  } catch {
    return NextResponse.json({ error: 'Unauthenticated' }, { status: 401 });
  }
}

export const config = {
  matcher: ['/api/analyze/:path*', '/api/auth/admin/:path*'],
};
