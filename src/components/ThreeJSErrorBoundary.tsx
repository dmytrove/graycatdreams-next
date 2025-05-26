'use client';

import React from 'react';
import SimpleErrorBoundary from './SimpleErrorBoundary';

export function ThreeJSErrorBoundary({ children }: { children: React.ReactNode }) {
  return (
    <SimpleErrorBoundary
      fallback={(error, resetError) => (
        <div style={{
          width: '100%',
          height: '100vh',
          background: 'linear-gradient(to bottom, #111, #222)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#fff',
          padding: '2rem',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🎮</div>
          <h2 style={{ fontSize: '1.8rem', marginBottom: '1rem', color: '#ff6b9d' }}>
            3D Rendering Error
          </h2>
          <p style={{ fontSize: '1.1rem', marginBottom: '2rem', maxWidth: '500px', lineHeight: '1.6' }}>
            Unable to initialize the 3D graphics engine. Your browser may not support WebGL or 
            there might be a graphics driver issue.
          </p>
          <button
            onClick={resetError}
            style={{
              background: '#ff6b9d',
              color: 'white',
              border: 'none',
              padding: '16px 32px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '1.1rem',
              fontWeight: 'bold'
            }}
          >
            🔄 Try Again
          </button>
          <div style={{ marginTop: '2rem', fontSize: '0.9rem', color: '#ccc' }}>
            <p>💡 Try enabling hardware acceleration in your browser settings</p>
          </div>
        </div>
      )}
    >
      {children}
    </SimpleErrorBoundary>
  );
}

export default ThreeJSErrorBoundary;
