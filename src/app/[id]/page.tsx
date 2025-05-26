import AnimationClient from './AnimationClient';
import { cookies } from 'next/headers';
import { getSessionMetadata, getSessionData } from '@/lib/session-metadata-r2';
import Link from 'next/link';

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
  try {
    const resolvedParams = await params;
    const { id } = resolvedParams;
    const cookieStore = await cookies();
    const userSession = cookieStore.get('session_id')?.value || null;
    const isAdmin = cookieStore.get('admin_session')?.value === 'true';

    // Consider user as author if they're the session owner or an admin
    const isAuthor = userSession === id || isAdmin;
    const images = await getImagesForSession(id);

    // Get session data to check for custom name
    const sessionData = await getSessionData(id);
    const customName = sessionData.customName;

    // We now allow empty image arrays - users will be prompted to upload
    return (
      <AnimationClient
        images={images}
        isAuthor={isAuthor}
        animationId={id}
        customName={customName}
      />
    );
  } catch (error) {
    console.error('Error in AnimationPage:', error);
    // Return a basic error state that will be shown to the user
    return (
      <div style={{
        width: '100%',
        minHeight: '100vh',
        display: 'flex', 
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #111, #222)',
        color: 'white',
        padding: '2rem'
      }}>
        <h1 style={{ color: '#ff6b6b', marginBottom: '1rem' }}>Something went wrong</h1>
        <p>Unable to load the animation. Please try again later.</p>
        <Link 
          href="/"
          style={{
            marginTop: '1rem',
            background: '#4CAF50',
            color: 'white',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '4px',
            cursor: 'pointer',
            textDecoration: 'none',
            display: 'inline-block'
          }}
        >
          Go to Home
        </Link>
      </div>
    );
  }
}

// Export the type for Next.js type system compatibility
