/**
 * Secure API handler wrapper with rate limiting and error handling
 */

import { NextRequest, NextResponse } from 'next/server';
import { RateLimit } from './rate-limit';
import { getEnvConfig } from './env';

export interface ApiContext {
  sessionId: string;
  request: NextRequest;
  isAdmin: boolean; // Added admin state flag
}

export type ApiHandler = (
  context: ApiContext
) => Promise<NextResponse> | NextResponse;

export interface ApiOptions {
  rateLimit?: RateLimit;
  requireAuth?: boolean;
  allowedMethods?: string[];
}

function getClientIdentifier(request: NextRequest): string {
  // Use IP address if available, fallback to user agent hash
  const forwarded = request.headers.get('x-forwarded-for');
  const ip = forwarded ? forwarded.split(',')[0].trim() : 
             request.headers.get('x-real-ip') || 
             '127.0.0.1';
  
  // For additional uniqueness, combine with user agent
  const userAgent = request.headers.get('user-agent') || '';
  return `${ip}-${userAgent.slice(0, 50)}`;
}

// Admin authentication check
function isAdminRequest(request: NextRequest): boolean {
  const env = getEnvConfig();
  
  if (!env.ADMIN_SECRET) {
    return false; // No admin secret configured
  }

  // Check for admin secret in Authorization header (Bearer token)
  const authHeader = request.headers.get('Authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7);
    return token === env.ADMIN_SECRET;
  }

  // Also check for admin secret in 'admin-secret' query parameter
  const url = new URL(request.url);
  const adminSecret = url.searchParams.get('admin-secret');
  
  return adminSecret === env.ADMIN_SECRET;
}

export function createApiHandler(
  handler: ApiHandler,
  options: ApiOptions = {}
) {
  const {
    rateLimit,
    requireAuth = true,
    allowedMethods = ['GET', 'POST', 'PUT', 'DELETE']
  } = options;

  return async (request: NextRequest): Promise<NextResponse> => {
    try {
      // Method validation
      if (!allowedMethods.includes(request.method)) {
        return NextResponse.json(
          { error: 'Method not allowed' },
          { status: 405, headers: { Allow: allowedMethods.join(', ') } }
        );
      }

      // Rate limiting
      if (rateLimit) {
        const identifier = getClientIdentifier(request);
        const { success, remaining, resetTime } = await rateLimit.check(identifier);
        
        if (!success) {
          return NextResponse.json(
            { 
              error: 'Too many requests',
              retryAfter: Math.ceil((resetTime - Date.now()) / 1000)
            },
            { 
              status: 429,
              headers: {
                'Retry-After': Math.ceil((resetTime - Date.now()) / 1000).toString(),
                'X-RateLimit-Remaining': remaining.toString(),
                'X-RateLimit-Reset': new Date(resetTime).toISOString()
              }
            }
          );
        }
      }

      // Admin authentication check
      const isAdmin = isAdminRequest(request);

      // Authentication
      let sessionId = '';
      if (requireAuth) {
        const sessionCookie = request.cookies.get('session_id');
        if (!sessionCookie?.value && !isAdmin) {
          return NextResponse.json(
            { error: 'Authentication required' },
            { status: 401 }
          );
        }
        sessionId = sessionCookie?.value || '';
      }

      // Call the actual handler
      const context: ApiContext = { sessionId, request, isAdmin };
      return await handler(context);

    } catch (error) {
      console.error('API Handler Error:', error);
      
      // Don't expose internal errors in production
      const isDevelopment = process.env.NODE_ENV === 'development';
      const errorMessage = isDevelopment && error instanceof Error 
        ? error.message 
        : 'Internal server error';
      
      return NextResponse.json(
        { error: errorMessage },
        { status: 500 }
      );
    }
  };
}

// Helper for public endpoints
export function createPublicApiHandler(
  handler: ApiHandler,
  options: Omit<ApiOptions, 'requireAuth'> = {}
) {
  return createApiHandler(handler, { ...options, requireAuth: false });
}

// CORS headers for API responses
export function addCorsHeaders(response: NextResponse): NextResponse {
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  response.headers.set('Access-Control-Max-Age', '86400'); // 24 hours
  
  return response;
}

// Security headers
export function addSecurityHeaders(response: NextResponse): NextResponse {
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  return response;
}
