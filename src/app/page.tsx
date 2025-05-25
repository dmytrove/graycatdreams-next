'use client';

export default function LoadingPage() {
  return (
    <div style={{
      minHeight: '100vh',
      background: '#111',
      color: '#fff',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '1.5rem'
    }}>
      <div style={{ textAlign: 'center' }}>
        <div>Loading...</div>
        <div style={{ fontSize: '1rem', marginTop: '1rem', opacity: 0.7 }}>
          If you are not redirected automatically, your browser may have disabled cookies.
        </div>
      </div>
    </div>
  );
}
