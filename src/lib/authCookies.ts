import { NextResponse } from 'next/server';

const isProd = process.env.NODE_ENV === 'production';

export function setAuthCookies(res: NextResponse, accessToken: string, refreshToken: string): void {
  res.cookies.set('access_token', accessToken, {
    httpOnly: true,
    secure: isProd,
    sameSite: 'lax',
    path: '/',
    maxAge: 15 * 60,
  });

  res.cookies.set('refresh_token', refreshToken, {
    httpOnly: true,
    secure: isProd,
    sameSite: 'lax',
    path: '/',
    maxAge: 7 * 24 * 60 * 60,
  });
}

export function clearAuthCookies(res: NextResponse): void {
  res.cookies.set('access_token', '', { path: '/', maxAge: 0 });
  res.cookies.set('refresh_token', '', { path: '/', maxAge: 0 });
}
