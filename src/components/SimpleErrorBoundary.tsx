'use client';

import React from 'react';

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: (error: Error, resetError: () => void) => React.ReactNode;
}

class SimpleErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error Boundary caught error:', error, errorInfo);
    
    if (typeof window !== 'undefined' && process.env.NODE_ENV === 'production') {
      // In production, you might want to send this to an error reporting service
      // Example: Sentry.captureException(error, { extra: errorInfo });
    }
  }

  resetError = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError && this.state.error) {
      if (this.props.fallback) {
        return this.props.fallback(this.state.error, this.resetError);
      }

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
            We encountered an unexpected error while loading the application.
          </p>
          
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
            <button
              onClick={this.resetError}
              style={{
                background: '#4CAF50',
                color: 'white',
                border: 'none',
                padding: '12px 24px',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '1rem',
                fontWeight: 'bold'
              }}
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
                fontWeight: 'bold'
              }}
            >
              🔃 Reload Page
            </button>
          </div>
          
          {process.env.NODE_ENV === 'development' && (
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
                {this.state.error.name}: {this.state.error.message}
                {this.state.error.stack && `\n\nStack trace:\n${this.state.error.stack}`}
              </pre>
            </details>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}

export default SimpleErrorBoundary;
