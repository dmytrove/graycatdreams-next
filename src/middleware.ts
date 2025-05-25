import { NextRequest, NextResponse } from 'next/server';

// Simple UUID generator for session IDs
function uuidv4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

export function middleware(request: NextRequest) {
  console.log('MIDDLEWARE RUNNING: path=', request.nextUrl.pathname);
  const sessionCookie = request.cookies.get('session_id');
  
  // If this is the root path, we'll need to redirect
  const isRootPath = request.nextUrl.pathname === '/';
  
  if (!sessionCookie) {
    const sessionId = uuidv4();
    
    // If we're at the root path, redirect to the animation page
    if (isRootPath) {
      const url = new URL(`/${sessionId}`, request.url);
      const response = NextResponse.redirect(url);
      
      // Set cookies before redirecting
      response.cookies.set('session_id', sessionId, {
        path: '/',
        httpOnly: true,
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 365, // 1 year
      });
      response.cookies.set('session_id_visible', sessionId, {
        path: '/',
        httpOnly: false,
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 365,
      });
      
      return response;
    }
    
    // For other paths, just set the cookies but don't redirect
    const response = NextResponse.next();
    response.cookies.set('session_id', sessionId, {
      path: '/',
      httpOnly: true,
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 365, // 1 year
    });
    response.cookies.set('session_id_visible', sessionId, {
      path: '/',
      httpOnly: false,
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 365,
    });
    return response;
  } else if (isRootPath) {
    // If we're at the root path and already have a session ID, redirect to the animation page
    const url = new URL(`/${sessionCookie.value}`, request.url);
    return NextResponse.redirect(url);
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next|favicon.ico|vercel.svg|next.svg|globe.svg|file.svg|window.svg).*)'],
};