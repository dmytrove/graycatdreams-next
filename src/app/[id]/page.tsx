import AnimationClient from './AnimationClient';
import { cookies } from 'next/headers';
import { getSessionMetadata } from '@/lib/session-metadata-r2';

// Define the params shape we expect
type AnimationParams = {
  id: string;
};

// Define the type that aligns with Next.js 15.3.2 requirements
type AnimationPageProps = {
  params: Promise<AnimationParams>;
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
};

async function getImagesForSession(session_id: string) {
  const data = await getSessionMetadata(session_id);
  const r2Domain = 'https://pub-7b860cf9a8554e759d05d06688f078b0.r2.dev/';
  return data
    .map((entry) => entry.url)
    .filter((url) => url.startsWith(`${r2Domain}${session_id}/`));
}

export default async function AnimationPage({ params }: AnimationPageProps) {
  const resolvedParams = await params;
  const { id } = resolvedParams;
  const cookieStore = await cookies();
  const userSession = cookieStore.get('session_id')?.value || null;
  const isAuthor = userSession === id;
  const images = await getImagesForSession(id);
  // We now allow empty image arrays - users will be prompted to upload
  return <AnimationClient images={images} isAuthor={isAuthor} animationId={id} />;
}

// Export the type for Next.js type system compatibility
