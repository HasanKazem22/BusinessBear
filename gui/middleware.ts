import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('auth_token')?.value;
  const isAuthPage = request.nextUrl.pathname.startsWith('/login') || request.nextUrl.pathname.startsWith('/signup');
  const isAdminPage = request.nextUrl.pathname.startsWith('/admin');

  if (!token && isAdminPage) {
    // Unauthenticated user trying to access admin pages -> redirect to login
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (token && isAuthPage) {
    // Authenticated user trying to access login/signup -> redirect to home (or admin if we knew roles, but we don't have decode here easily, rely on AuthContext on mount instead)
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/login', '/signup'],
};
