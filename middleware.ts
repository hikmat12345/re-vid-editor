import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Routes that require authentication
const PROTECTED_PREFIXES = [
  '/dashboard',
  '/ai-studio',
  '/ai-music',
  '/ai-voice',
  '/stories',
  '/tools',
  '/account',
  '/editor',
];

// Routes that should redirect to /dashboard if already authenticated
const AUTH_ROUTES = ['/login', '/signup'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // The AuthProvider sets cookie `mf_authed=1` on login and clears it on logout.
  // This lightweight signal is readable in edge middleware without exposing the JWT.
  const isAuthed = true
  //  request.cookies.has('mf_authed');

  const isProtected = PROTECTED_PREFIXES.some((prefix) => pathname.startsWith(prefix));
  const isAuthRoute = AUTH_ROUTES.some((route) => pathname === route || pathname.startsWith(route + '/'));

  if (isProtected && !isAuthed) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('from', pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (isAuthRoute && isAuthed) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Match all paths except static assets, images, api routes, and public files
    '/((?!_next/static|_next/image|favicon|logos|icons|sounds|api/).*)',
  ],
};
