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
import { getSessionData, setSessionData, getImagePath, getImagePublicUrl } from '@/lib/session-metadata-r2';
import { UploadMetadata } from '@/types';
import { createApiHandler, addSecurityHeaders } from '@/lib/api-handler';
import { uploadRateLimit } from '@/lib/rate-limit';
import { getEnvConfig } from '@/lib/env';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import sharp from 'sharp';

const MAX_SIZE = 5 * 1024 * 1024; // 5MB
const MAX_FILES = 10; // Maximum files per upload
const ALLOWED_TYPES = ['image/png', 'image/jpeg', 'image/webp', 'image/jpg'];

// Initialize S3 client with validated environment
let s3Client: S3Client | null = null;

function getS3Client(): S3Client {
  if (!s3Client) {
    const env = getEnvConfig();
    s3Client = new S3Client({
      region: 'auto',
      endpoint: env.R2_ENDPOINT,
      credentials: {
        accessKeyId: env.R2_ACCESS_KEY_ID,
        secretAccessKey: env.R2_SECRET_ACCESS_KEY,
      },
    });
  }
  return s3Client;
}

const uploadHandler = createApiHandler(
  async ({ request, sessionId, isAdmin }) => {
    const formData = await request.formData();
    const files = formData.getAll('file').filter(Boolean) as File[];
    
    // Check for custom name (admin only)
    let customName = formData.get('customName') as string | null;
    if (customName && !isAdmin) {
      customName = null; // Only allow admins to set custom names
    }
    
    if (files.length === 0) {
      return new NextResponse(
        JSON.stringify({ error: 'No files uploaded' }),
        { status: 400, headers: CORS_HEADERS }
      );
    }
    
    if (files.length > MAX_FILES) {
      return NextResponse.json(
        { error: `Too many files. Maximum ${MAX_FILES} files allowed per upload.` },
        { status: 400 }
      );
    }

    // Use customName as sessionId if provided by admin
    const effectiveSessionId = (isAdmin && customName) ? customName : sessionId;
    
    const sessionData = await getSessionData(effectiveSessionId);
    
    // If admin provided a custom name, store it in session data
    if (isAdmin && customName) {
      sessionData.customName = customName;
    }
    
    const uploadedUrls: string[] = [];
    const errors: string[] = [];
    const s3 = getS3Client();
    const env = getEnvConfig();

    for (const file of files) {
      try {
        // Validate file type
        if (!ALLOWED_TYPES.includes(file.type)) {
          errors.push(`Unsupported file type: ${file.name} (${file.type})`);
          continue;
        }

        // Validate file size
        if (file.size > MAX_SIZE) {
          errors.push(`File too large: ${file.name} (${(file.size / 1024 / 1024).toFixed(1)}MB > 5MB)`);
          continue;
        }

        // Validate file name
        if (!file.name || file.name.length > 255) {
          errors.push(`Invalid file name: ${file.name}`);
          continue;
        }

        // Process the image
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        
        // Convert to WebP with optimization
        const webpBuffer = await sharp(buffer)
          .webp({ 
            quality: 80, 
            effort: 4 // Good balance of compression and speed
          })
          .resize(2048, 2048, { 
            fit: 'inside', 
            withoutEnlargement: true 
          })
          .toBuffer();
        
        // Generate unique image ID
        const imageId = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
        const imagePath = getImagePath(effectiveSessionId, imageId);
        
        // Upload to R2
        await s3.send(new PutObjectCommand({
          Bucket: env.R2_BUCKET,
          Key: imagePath,
          Body: webpBuffer,
          ContentType: 'image/webp',
          CacheControl: 'public, max-age=31536000', // 1 year cache
          Metadata: {
            'original-name': file.name,
            'original-type': file.type,
            'original-size': file.size.toString(),
            'session-id': effectiveSessionId,
            'upload-time': new Date().toISOString(),
            ...(customName && { 'custom-name': customName }),
          },
        }));
        
        const url = getImagePublicUrl(effectiveSessionId, imageId);
        const newEntry: UploadMetadata = { 
          url, 
          imageId, 
          session_id: effectiveSessionId,
          timestamp: Date.now(),
          ...(customName && { customName }),
        };
        
        sessionData.images.push(newEntry);
        uploadedUrls.push(url);
      } catch (error) {
        console.error(`Error processing file ${file.name}:`, error);
        errors.push(`Failed to process: ${file.name}`);
      }
    }

    // Save updated session data
    if (uploadedUrls.length > 0) {
      await setSessionData(effectiveSessionId, sessionData);
    }

    // Return results
    const response: { urls: string[]; warnings?: string[] } = { urls: uploadedUrls };
    if (errors.length > 0) {
      response.warnings = errors;
    }

    const jsonResponse = NextResponse.json(response);
    return addSecurityHeaders(jsonResponse);
  },
  { 
    rateLimit: uploadRateLimit,
    allowedMethods: ['POST']
  }
);

export async function POST(request: NextRequest) {
  return uploadHandler(request);
}
