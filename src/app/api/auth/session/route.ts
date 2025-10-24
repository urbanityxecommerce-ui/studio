import { NextResponse, type NextRequest } from 'next/server';
import { getAuth } from 'firebase-admin/auth';
import { initializeApp, getApps } from 'firebase-admin/app';

if (!getApps().length) {
  initializeApp();
}

export async function POST(request: NextRequest) {
  const { idToken } = await request.json();

  // If there's no ID token, we're logging out. Clear the cookie.
  if (!idToken) {
    const response = NextResponse.json({ status: 'logged out' });
    response.cookies.set({
      name: '__session',
      value: '',
      maxAge: -1, // Expire the cookie immediately
    });
    return response;
  }

  // Set session expiration to 5 days.
  const expiresIn = 60 * 60 * 24 * 5 * 1000;

  try {
    const sessionCookie = await getAuth().createSessionCookie(idToken, { expiresIn });
    const options = {
      name: '__session',
      value: sessionCookie,
      maxAge: expiresIn,
      httpOnly: true,
      secure: true,
    };

    const response = NextResponse.json({ status: 'success' });
    response.cookies.set(options);
    return response;
  } catch (error) {
    console.error('Error creating session cookie:', error);
    return NextResponse.json({ error: 'Failed to create session cookie' }, { status: 401 });
  }
}
