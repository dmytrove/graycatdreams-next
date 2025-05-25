import { S3Client, GetObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3';
import { AnimationOptions, DEFAULT_ANIMATION_OPTIONS, UploadMetadata, SessionData } from '@/types';
import { getEnvConfig } from './env';

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

// Path utilities
export function getMetadataPath(sessionId: string): string {
  return `${sessionId}/metadata.json`;
}

export function getImagePath(sessionId: string, imageId: string): string {
  return `${sessionId}/${imageId}.webp`;
}

export function getImagePublicUrl(sessionId: string, imageId: string): string {
  const env = getEnvConfig();
  return `https://pub-7b860cf9a8554e759d05d06688f078b0.r2.dev/${sessionId}/${imageId}.webp`;
}

export function extractImageIdFromUrl(url: string): string | null {
  const regex = /\/([^\/]+)\/([^\/]+)\.webp$/;
  const match = url.match(regex);
  return match ? match[2] : null;
}

// Session data management
export async function getSessionData(sessionId: string): Promise<SessionData> {
  const s3 = getS3Client();
  const env = getEnvConfig();
  
  try {
    const { Body } = await s3.send(new GetObjectCommand({
      Bucket: env.R2_BUCKET,
      Key: getMetadataPath(sessionId),
    }));
    
    if (!Body) {
      throw new Error('No Body returned from R2 for session metadata');
    }
    
    const raw = await Body.transformToString();
    const parsed = JSON.parse(raw);
    
    // Ensure we have valid data structure
    return {
      images: Array.isArray(parsed.images) ? parsed.images : [],
      options: parsed.options ? { ...DEFAULT_ANIMATION_OPTIONS, ...parsed.options } : { ...DEFAULT_ANIMATION_OPTIONS },
    };
  } catch (err: unknown) {
    // Handle NoSuchKey error (file doesn't exist)
    if (
      typeof err === 'object' &&
      err !== null &&
      ('name' in err || '$metadata' in err)
    ) {
      const name = (err as { name?: string }).name;
      const status = (err as { $metadata?: { httpStatusCode?: number } }).$metadata?.httpStatusCode;
      
      if (name === 'NoSuchKey' || status === 404) {
        return { 
          images: [], 
          options: { ...DEFAULT_ANIMATION_OPTIONS } 
        };
      }
    }
    
    console.error('Error fetching session data:', err);
    throw err;
  }
}

export async function setSessionData(sessionId: string, data: SessionData): Promise<void> {
  const s3 = getS3Client();
  const env = getEnvConfig();
  
  try {
    // Validate data structure before saving
    const validatedData: SessionData = {
      images: Array.isArray(data.images) ? data.images : [],
      options: { ...DEFAULT_ANIMATION_OPTIONS, ...data.options },
    };

    await s3.send(new PutObjectCommand({
      Bucket: env.R2_BUCKET,
      Key: getMetadataPath(sessionId),
      Body: JSON.stringify(validatedData, null, 2),
      ContentType: 'application/json',
    }));
  } catch (err) {
    console.error('Error saving session data:', err);
    throw err;
  }
}

// Backward compatibility functions
export async function getSessionMetadata(sessionId: string): Promise<UploadMetadata[]> {
  const data = await getSessionData(sessionId);
  return data.images;
}

export async function setSessionMetadata(sessionId: string, images: UploadMetadata[]): Promise<void> {
  const data = await getSessionData(sessionId);
  await setSessionData(sessionId, { ...data, images });
}

// Animation options management
export async function getAnimationOptions(sessionId: string): Promise<AnimationOptions> {
  const data = await getSessionData(sessionId);
  return data.options;
}

export async function setAnimationOptions(sessionId: string, options: AnimationOptions): Promise<void> {
  const data = await getSessionData(sessionId);
  await setSessionData(sessionId, { ...data, options });
}

// Utility types for backward compatibility
export type { UploadMetadata, SessionData, AnimationOptions };
