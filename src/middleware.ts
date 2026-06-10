import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(request: NextRequest) {
  const adminSession = request.cookies.get('admin_session')?.value;
  const { pathname } = request.nextUrl;

  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET || process.env.JWT_SECRET || 'super-secret-key-neon-jwt-academy-123!',
  });

  const isCoursePath = pathname.startsWith('/course');
  const isAdminDashboardPath = pathname.startsWith('/admin/dashboard');

  if (token?.isBanned) {
    const response = NextResponse.redirect(new URL('/login?error=banned', request.url));
    return response;
  }

  if (isAdminDashboardPath) {
    if (adminSession !== 'true' && token?.role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/admin', request.url));
    }
  }

  if (isCoursePath) {
    if (!token && adminSession !== 'true') {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }

    if (token) {
      const hasAccess = token.isPaid || token.role === 'ADMIN';
      if (!hasAccess) {
        return NextResponse.redirect(new URL('/buy', request.url));
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/course', '/course/:path*', '/admin/:path*'],
};
