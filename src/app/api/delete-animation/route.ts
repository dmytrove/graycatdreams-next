const CORS_HEADERS = {
  'Access-Control-Allow-Origin': 'http://localhost:3000',
  'Access-Control-Allow-Methods': 'POST,OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: CORS_HEADERS,
  });
}
import { NextRequest, NextResponse } from 'next/server';
import { getSessionData, getImagePath } from '@/lib/session-metadata-r2';
import { S3Client, DeleteObjectCommand } from '@aws-sdk/client-s3';

const s3 = new S3Client({
  region: 'auto',
  endpoint: process.env.R2_ENDPOINT,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
});

export async function POST(request: NextRequest) {
  try {
    const session_id = request.nextUrl.searchParams.get('session_id');
    const cookieSession = request.cookies.get('session_id')?.value || null;
    
    if (!session_id) {
      return new NextResponse(
        JSON.stringify({ error: 'Missing session_id parameter' }),
        { status: 400, headers: CORS_HEADERS }
      );
    }

    if (!cookieSession || session_id !== cookieSession) {
      return new NextResponse(
        JSON.stringify({ error: 'Unauthorized: Session mismatch' }),
        { status: 403, headers: CORS_HEADERS }
      );
    }

    console.log(`Deleting animation and all assets for session: ${session_id}`);

    // Get all images for this animation
    let sessionData;
    try {
      sessionData = await getSessionData(session_id);
    } catch (error) {
      console.error('Error fetching session data:', error);
      // If session data doesn't exist, that's OK - nothing to delete
      return NextResponse.json({ 
        success: true, 
        message: 'Animation not found or already deleted' 
      });
    }

    const images = sessionData.images || [];
    let deletedImages = 0;
    let deletionErrors = 0;

    // Delete all images from R2
    for (const img of images) {
      if (img.imageId) {
        try {
          await s3.send(new DeleteObjectCommand({
            Bucket: process.env.R2_BUCKET,
            Key: getImagePath(session_id, img.imageId),
          }));
          deletedImages++;
          console.log(`Deleted image: ${img.imageId}`);
        } catch (error) {
          deletionErrors++;
          console.error(`Failed to delete image ${img.imageId}:`, error);
        }
      }
    }

    // Delete the metadata file
    try {
      await s3.send(new DeleteObjectCommand({
        Bucket: process.env.R2_BUCKET,
        Key: `${session_id}/metadata.json`,
      }));
      console.log(`Deleted metadata for session: ${session_id}`);
    } catch (error) {
      console.error('Failed to delete metadata:', error);
      // Continue even if metadata deletion fails
    }

    console.log(`Animation deletion complete: ${deletedImages} images deleted, ${deletionErrors} errors`);

    return NextResponse.json({ 
      success: true, 
      message: 'Animation deleted successfully',
      details: {
        imagesDeleted: deletedImages,
        errors: deletionErrors
      }
    });
  } catch (error) {
    console.error('Error in delete animation handler:', error);
    return NextResponse.json(
      { error: 'Failed to delete animation' }, 
      { status: 500 }
    );
  }
}
