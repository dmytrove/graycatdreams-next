const CORS_HEADERS = {
  'Access-Control-Allow-Origin': 'http://localhost:3000',
  'Access-Control-Allow-Methods': 'DELETE,POST,OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: CORS_HEADERS,
  });
}
import { NextRequest, NextResponse } from 'next/server';
import { getSessionMetadata, setSessionMetadata, UploadMetadata, extractImageIdFromUrl } from '@/lib/session-metadata-r2';
import { S3Client, DeleteObjectCommand } from '@aws-sdk/client-s3';

const s3 = new S3Client({
  region: 'auto',
  endpoint: process.env.R2_ENDPOINT,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
});

async function deleteImageHandler(request: NextRequest): Promise<NextResponse> {
  try {
    const session_id = request.cookies.get('session_id')?.value || null;
    
    if (!session_id) {
      return new NextResponse(
        JSON.stringify({ error: 'No session found' }),
        { status: 401, headers: CORS_HEADERS }
      );
    }

    // Get URL from query parameter for DELETE requests or body for POST requests
    let url: string;
    if (request.method === 'DELETE') {
      url = request.nextUrl.searchParams.get('url') || '';
    } else {
      const body = await request.json();
      url = body.url || '';
    }

    if (!url) {
      return new NextResponse(
        JSON.stringify({ error: 'Missing image URL' }),
        { status: 400, headers: CORS_HEADERS }
      );
    }

    // Get current session metadata
    const data: UploadMetadata[] = await getSessionMetadata(session_id);
    const entry = data.find((e) => e.url === url);
    
    if (!entry) {
      return NextResponse.json(
        { error: 'Image not found' }, 
        { status: 404 }
      );
    }

    if (entry.session_id !== session_id) {
      return NextResponse.json(
        { error: 'Unauthorized: Cannot delete image from different session' }, 
        { status: 403 }
      );
    }
    
    // Extract image ID from URL to construct proper deletion path
    const imageId = entry.imageId || extractImageIdFromUrl(url);
    
    if (imageId) {
      // Delete the actual image file from R2
      try {
        await s3.send(new DeleteObjectCommand({
          Bucket: process.env.R2_BUCKET,
          Key: `${session_id}/${imageId}.webp`,
        }));
      } catch (error) {
        console.error('Error deleting from R2:', error);
        // Continue with metadata deletion even if file deletion fails
      }
    }
    
    // Remove from metadata
    const updatedData = data.filter((e) => e.url !== url);
    await setSessionMetadata(session_id, updatedData);
    
    return NextResponse.json({ 
      success: true, 
      message: 'Image deleted successfully' 
    });
  } catch (error) {
    console.error('Error in delete image handler:', error);
    return NextResponse.json(
      { error: 'Failed to delete image' }, 
      { status: 500 }
    );
  }
}

// Support both DELETE and POST methods for backwards compatibility
export async function DELETE(request: NextRequest) {
  return deleteImageHandler(request);
}

export async function POST(request: NextRequest) {
  return deleteImageHandler(request);
}
