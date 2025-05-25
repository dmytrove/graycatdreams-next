// --- CORS helper ---
const CORS_HEADERS = {
  'Access-Control-Allow-Origin': 'http://localhost:3000',
  'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: CORS_HEADERS,
  });
}
import { NextRequest, NextResponse } from 'next/server';
import { getAnimationOptions, setAnimationOptions } from '@/lib/session-metadata-r2';
import { AnimationOptions, DEFAULT_ANIMATION_OPTIONS } from '@/types';
import { createApiHandler, addSecurityHeaders } from '@/lib/api-handler';
import { apiRateLimit } from '@/lib/rate-limit';

const getHandler = createApiHandler(
  async ({ request, sessionId }) => {
    const options = await getAnimationOptions(sessionId);
    const response = NextResponse.json({ options });
    return addSecurityHeaders(response);
  },
  { 
    rateLimit: apiRateLimit,
    allowedMethods: ['GET'],
    requireAuth: false // Session ID from query param
  }
);

const postHandler = createApiHandler(
  async ({ request, sessionId }) => {
    const body = await request.json();
    
    if (!body.options || typeof body.options !== 'object') {
      return NextResponse.json(
        { error: 'Invalid options data' },
        { status: 400 }
      );
    }

    // Validate and sanitize options
    const options: AnimationOptions = {
      ...DEFAULT_ANIMATION_OPTIONS,
      ...body.options,
      // Ensure numerical values are within valid ranges
      maxImageCount: Math.max(1, Math.min(20, Math.round(body.options.maxImageCount || 10))),
      spinMaxSpeed: Math.max(0.1, Math.min(5, parseFloat(body.options.spinMaxSpeed) || 1)),
      imageMinSize: Math.max(0.1, Math.min(10, parseFloat(body.options.imageMinSize) || 1)),
      imageMaxSize: Math.max(0.1, Math.min(10, parseFloat(body.options.imageMaxSize) || 2)),
      orbitDistance: Math.max(1, Math.min(10, parseFloat(body.options.orbitDistance) || 3)),
      attractionForce: Math.max(0, Math.min(0.1, parseFloat(body.options.attractionForce) || 0.02)),
      orbitSpeed: Math.max(0, Math.min(0.2, parseFloat(body.options.orbitSpeed) || 0.02)),
      bounciness: Math.max(0, Math.min(2, parseFloat(body.options.bounciness) || 0.7)),
      pulsationAmount: Math.max(0, Math.min(1, parseFloat(body.options.pulsationAmount) || 0.2)),
      pulsationRate: Math.max(0.1, Math.min(5, parseFloat(body.options.pulsationRate) || 0.5)),
      focusedGroup: Math.max(-1, Math.min(100, Math.round(body.options.focusedGroup) || -1)),
      cameraSpeed: Math.max(0.01, Math.min(0.5, parseFloat(body.options.cameraSpeed) || 0.05)),
      movementTemplate: Math.max(0, Math.min(6, Math.round(body.options.movementTemplate) || 0)),
      parallaxSpeed: Math.max(0.001, Math.min(0.2, parseFloat(body.options.parallaxSpeed) || 0.03)),
      parallaxInterval: Math.max(1, Math.min(30, parseFloat(body.options.parallaxInterval) || 6)),
      lightingMode: Math.max(0, Math.min(7, Math.round(body.options.lightingMode) || 0)),
      ambientIntensity: Math.max(0, Math.min(3, parseFloat(body.options.ambientIntensity) || 0.6)),
      lightIntensity: Math.max(0, Math.min(5, parseFloat(body.options.lightIntensity) || 0.8)),
    };

    // Ensure imageMinSize < imageMaxSize
    if (options.imageMinSize >= options.imageMaxSize) {
      options.imageMaxSize = options.imageMinSize + 0.1;
    }

    await setAnimationOptions(sessionId, options);
    
    const response = NextResponse.json({ 
      success: true, 
      options 
    });
    return addSecurityHeaders(response);
  },
  { 
    rateLimit: apiRateLimit,
    allowedMethods: ['POST']
  }
);

export async function GET(request: NextRequest) {
  const session_id = request.nextUrl.searchParams.get('session_id');
  
  if (!session_id) {
    return new NextResponse(
      JSON.stringify({ error: 'Missing session_id parameter' }),
      { status: 400, headers: CORS_HEADERS }
    );
  }
  
  // Create a modified request with session in context
  const modifiedRequest = new NextRequest(request.url, {
    method: request.method,
    headers: request.headers,
    body: request.body
  });
  
  // Add session to cookies for the handler
  modifiedRequest.cookies.set('session_id', session_id);
  
  const response = await getHandler(modifiedRequest);
  Object.entries(CORS_HEADERS).forEach(([key, value]) => response.headers.set(key, value));
  return response;
}

export async function POST(request: NextRequest) {
  const session_id = request.nextUrl.searchParams.get('session_id');
  const cookieSession = request.cookies.get('session_id')?.value || null;
  
  if (!session_id || !cookieSession || session_id !== cookieSession) {
    return new NextResponse(
      JSON.stringify({ error: 'Unauthorized: Session mismatch' }),
      { status: 403, headers: CORS_HEADERS }
    );
  }
  const response = await postHandler(request);
  Object.entries(CORS_HEADERS).forEach(([key, value]) => response.headers.set(key, value));
  return response;
}
