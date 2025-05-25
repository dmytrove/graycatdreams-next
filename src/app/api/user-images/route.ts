const CORS_HEADERS = {
  'Access-Control-Allow-Origin': 'http://localhost:3000',
  'Access-Control-Allow-Methods': 'GET,OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: CORS_HEADERS,
  });
}
import { NextRequest, NextResponse } from 'next/server';
import { getSessionMetadata } from '@/lib/session-metadata-r2';

export async function GET(request: NextRequest) {
  const session_id = request.cookies.get('session_id')?.value || null;
  if (!session_id) {
    return new NextResponse(
      JSON.stringify({ images: [] }),
      { status: 200, headers: CORS_HEADERS }
    );
  }
  const data = await getSessionMetadata(session_id);
  // Now images should be in the format of {id}/{imageId}.webp
  // We'll filter by checking if the URL contains the sessionId
  const images = data
    .map((entry) => entry.url)
    .filter((url) => {
      const r2Domain = 'https://pub-7b860cf9a8554e759d05d06688f078b0.r2.dev/';
      return url.startsWith(r2Domain + session_id + '/') || url.startsWith('/uploads/');
    });
  return new NextResponse(
    JSON.stringify({ images }),
    { status: 200, headers: CORS_HEADERS }
  );
}