import { NextRequest, NextResponse } from 'next/server';
import { createPublicApiHandler, addSecurityHeaders } from '@/lib/api-handler';
import { getEnvConfig } from '@/lib/env';
import { AdminCredentials, AdminSessionOptions } from '@/types';
import { randomUUID } from 'crypto';

// Handler for admin login
const adminLoginHandler = createPublicApiHandler(
  async ({ request, isAdmin: _isAdmin }) => {
    // Parse the request body
    let body: AdminCredentials & AdminSessionOptions;
    try {
      body = await request.json();
    } catch (_error) {
      return NextResponse.json(
        { error: 'Invalid request body' },
        { status: 400 }
      );
    }

    const { adminSecret, customId } = body;
    const env = getEnvConfig();

    // Verify the admin secret
    if (!env.ADMIN_SECRET || adminSecret !== env.ADMIN_SECRET) {
      return NextResponse.json(
        { error: 'Invalid admin credentials' },
        { status: 401 }
      );
    }

    // Generate session ID (use custom if provided, otherwise generate UUID)
    const sessionId = customId?.trim() || randomUUID();

    // Create response with session cookie
    const response = NextResponse.json(
      { 
        success: true, 
        message: 'Admin login successful',
        sessionId,
        isAdmin: true
      }
    );

    // Set the session cookie (1 week expiry for admin)
    response.cookies.set({
      name: 'session_id',
      value: sessionId,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 1 week
    });

    // Set admin session cookie
    response.cookies.set({
      name: 'admin_session',
      value: 'true',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 1 week
    });

    return addSecurityHeaders(response);
  },
  { allowedMethods: ['POST'] }
);

// Export the handler for the POST method
export async function POST(request: NextRequest) {
  return adminLoginHandler(request);
}
