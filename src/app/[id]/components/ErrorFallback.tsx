'use client';

import React from 'react';

export default function ErrorFallback({ error }: { error: Error }) {
  return (
    <div style={{ 
      width: '100%', 
      height: 500, 
      background: '#333',
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center',
      color: 'white',
      padding: 20,
      textAlign: 'center'
    }}>
      <h3>Something went wrong with the 3D animation</h3>
      <p>We could not load some of the images. Please try again later.</p>
      <pre style={{ 
        background: '#222', 
        padding: 10, 
        borderRadius: 5,
        fontSize: 12,
        maxWidth: '100%',
        overflow: 'auto'
      }}>
        {error.message}
      </pre>
    </div>
  );
} 