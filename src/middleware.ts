import { NextResponse, type NextRequest } from 'next/server';
import { getAuth } from 'firebase-admin/auth';
import { initializeApp, getApps } from 'firebase-admin/app';

// Initialize Firebase Admin SDK if not already initialized
if (!getApps().length) {
  initializeApp();
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const publicPaths = ['/login', '/signup'];

  if (publicPaths.includes(pathname)) {
    return NextResponse.next();
  }

  const sessionCookie = request.cookies.get('__session')?.value;

  if (!sessionCookie) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  try {
    await getAuth().verifySessionCookie(sessionCookie, true);
    return NextResponse.next();
  } catch (error) {
    console.error('Session cookie verification failed:', error);
    const response = NextResponse.redirect(new URL('/login', request.url));
    response.cookies.delete('__session');
    return response;
  }
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
