"use client";
import Link from 'next/link';

export default function HomePage() {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #111, #222)',
      color: '#fff',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '1.5rem',
      padding: '2rem'
    }}>
      <div style={{ 
        textAlign: 'center', 
        maxWidth: '600px',
        background: 'rgba(34, 34, 34, 0.8)',
        borderRadius: '16px',
        padding: '3rem',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        <h1 style={{ 
          fontSize: '3rem', 
          marginBottom: '1rem',
          background: 'linear-gradient(45deg, #6cf, #4ae)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text'
        }}>
          GrayCAT Dreams
        </h1>
        
        <p style={{ 
          fontSize: '1.2rem', 
          marginBottom: '2rem', 
          opacity: 0.8,
          lineHeight: '1.6'
        }}>
          Create beautiful 3D animations with your images using WebGL and Three.js
        </p>
        
        <div style={{ 
          display: 'flex', 
          gap: '1rem', 
          justifyContent: 'center',
          flexWrap: 'wrap',
          marginBottom: '2rem'
        }}>
          <button 
            onClick={() => {
              // Generate a random session ID and redirect
              const sessionId = Math.random().toString(36).substring(2, 15);
              window.location.href = `/${sessionId}`;
            }}
            style={{
              background: 'linear-gradient(45deg, #6cf, #4ae)',
              color: '#111',
              border: 'none',
              borderRadius: '8px',
              padding: '12px 24px',
              fontSize: '1rem',
              fontWeight: 'bold',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
            onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
            onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            🎨 Create Animation
          </button>
          
          <Link 
            href="/admin"
            style={{
              background: 'rgba(34, 34, 34, 0.8)',
              color: '#6cf',
              border: '1px solid #6cf',
              borderRadius: '8px',
              padding: '12px 24px',
              fontSize: '1rem',
              fontWeight: 'bold',
              textDecoration: 'none',
              transition: 'all 0.3s ease',
              display: 'inline-block'
            }}
          >
            🔑 Admin Access
          </Link>
        </div>
        
        <div style={{ 
          fontSize: '0.9rem', 
          opacity: 0.6,
          marginTop: '2rem',
          borderTop: '1px solid rgba(255, 255, 255, 0.1)',
          paddingTop: '1rem'
        }}>
          <p>✨ Upload your images and watch them come to life in 3D space</p>
          <p>🎛️ Customize animations with advanced controls</p>
          <p>📱 Share your creations with friends</p>
        </div>
      </div>
    </div>
  );
}
