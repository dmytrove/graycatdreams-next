'use client';

/**
 * Enhanced Error Boundary with better error handling and logging
 */

import React from 'react';
import { ErrorBoundary } from 'react-error-boundary';

interface ErrorFallbackProps {
  error: Error;
  resetErrorBoundary: () => void;
}

function ErrorFallback({ error, resetErrorBoundary }: ErrorFallbackProps) {
  const isDevelopment = process.env.NODE_ENV === 'development';
  
  return (
    <div style={{
      width: '100%',
      minHeight: '400px',
      background: 'linear-gradient(135deg, #1a1a1a, #2d2d2d)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#ffffff',
      padding: '2rem',
      textAlign: 'center',
      borderRadius: '8px',
      border: '1px solid rgba(255, 255, 255, 0.1)'
    }}>
      <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⚠️</div>
      <h2 style={{ 
        fontSize: '1.5rem', 
        marginBottom: '1rem',
        color: '#ff6b6b'
      }}>
        Something went wrong
      </h2>
      <p style={{ 
        fontSize: '1rem', 
        marginBottom: '2rem',
        maxWidth: '500px',
        lineHeight: '1.5',
        color: '#cccccc'
      }}>
        We encountered an unexpected error while loading the 3D animation. 
        This might be due to browser compatibility or network issues.
      </p>
      
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
        <button
          onClick={resetErrorBoundary}
          style={{
            background: '#4CAF50',
            color: 'white',
            border: 'none',
            padding: '12px 24px',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '1rem',
            fontWeight: 'bold',
            transition: 'background-color 0.2s'
          }}
          onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#45a049'}
          onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#4CAF50'}
        >
          🔄 Try Again
        </button>
        
        <button
          onClick={() => window.location.reload()}
          style={{
            background: '#2196F3',
            color: 'white',
            border: 'none',
            padding: '12px 24px',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '1rem',
            fontWeight: 'bold',
            transition: 'background-color 0.2s'
          }}
          onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#1976D2'}
          onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#2196F3'}
        >
          🔃 Reload Page
        </button>
      </div>
      
      {isDevelopment && (
        <details style={{ 
          marginTop: '2rem', 
          maxWidth: '100%',
          background: 'rgba(255, 255, 255, 0.05)',
          padding: '1rem',
          borderRadius: '4px',
          border: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
          <summary style={{ 
            cursor: 'pointer', 
            marginBottom: '1rem',
            color: '#ff9800',
            fontWeight: 'bold'
          }}>
            🔍 Developer Info
          </summary>
          <pre style={{ 
            textAlign: 'left',
            fontSize: '0.75rem',
            color: '#ffcccc',
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
            maxHeight: '200px',
            overflow: 'auto'
          }}>
            {error.name}: {error.message}
            {error.stack && `\n\nStack trace:\n${error.stack}`}
          </pre>
        </details>
      )}
      
      <div style={{ 
        marginTop: '2rem', 
        fontSize: '0.85rem', 
        color: '#888',
        maxWidth: '600px'
      }}>
        <p>💡 <strong>Possible solutions:</strong></p>
        <ul style={{ 
          textAlign: 'left', 
          paddingLeft: '1.5rem',
          marginTop: '0.5rem'
        }}>
          <li>Check your internet connection</li>
          <li>Try using a different browser (Chrome, Firefox, Safari)</li>
          <li>Disable browser extensions temporarily</li>
          <li>Clear your browser cache and cookies</li>
        </ul>
      </div>
    </div>
  );
}

interface AppErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<ErrorFallbackProps>;
}

export function AppErrorBoundary({ children, fallback }: AppErrorBoundaryProps) {
  const handleError = (error: Error, errorInfo: any) => {
    // Log error for monitoring
    console.error('Error Boundary caught error:', error, errorInfo);
    
    // In production, you might want to send this to an error reporting service
    if (typeof window !== 'undefined' && process.env.NODE_ENV === 'production') {
      // Example: Sentry.captureException(error, { extra: errorInfo });
    }
  };

  return (
    <ErrorBoundary
      FallbackComponent={fallback || ErrorFallback}
      onError={handleError}
      onReset={() => {
        // Optional: Clear any cached state or reload the page
        window.location.reload();
      }}
    >
      {children}
    </ErrorBoundary>
  );
}

// Specific error boundary for Three.js components
export function ThreeJSErrorBoundary({ children }: { children: React.ReactNode }) {
  return (
    <AppErrorBoundary
      fallback={({ error, resetErrorBoundary }) => (
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
            onClick={resetErrorBoundary}
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
    </AppErrorBoundary>
  );
}

export default AppErrorBoundary;
