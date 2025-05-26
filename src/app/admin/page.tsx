"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AdminPage() {
  const router = useRouter();
  const [adminSecret, setAdminSecret] = useState('');
  const [customId, setCustomId] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [checkingStatus, setCheckingStatus] = useState(true);

  // Check admin status on mount
  useEffect(() => {
    checkAdminStatus();
  }, []);

  const checkAdminStatus = async () => {
    try {
      const response = await fetch('/api/admin/check');
      if (response.ok) {
        const data = await response.json();
        setIsAdmin(!!data.isAdmin);
      }
    } catch (err) {
      console.error('Error checking admin status:', err);
      setIsAdmin(false);
    } finally {
      setCheckingStatus(false);
    }
  };

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ adminSecret, customId }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to login as admin');
      }
      
      // Login successful - update admin state
      setIsAdmin(true);
      
      if (data.sessionId) {
        router.push(`/${data.sessionId}`);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during admin login');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSession = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!customId.trim()) {
      setError('Custom name is required');
      return;
    }
    
    setError(null);
    setLoading(true);
    
    try {
      // Validate custom name
      const customNameRegex = /^[a-zA-Z0-9-_]+$/;
      if (!customNameRegex.test(customId)) {
        throw new Error('Custom name can only contain letters, numbers, hyphens and underscores');
      }
      
      // Navigate to the custom named session
      router.push(`/${customId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setLoading(false);
    }
  };

  if (checkingStatus) {
    return (
      <div style={{ 
        padding: '40px 20px', 
        maxWidth: '800px', 
        margin: '0 auto',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        background: '#111',
        color: '#fff'
      }}>
        <p>Checking admin status...</p>
      </div>
    );
  }

  return (
    <div style={{ 
      padding: '40px 20px', 
      maxWidth: '800px', 
      margin: '0 auto',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      background: '#111',
      color: '#fff'
    }}>
      <h1 style={{ 
        fontSize: '2rem', 
        fontWeight: 'bold',
        marginBottom: '2rem',
        textAlign: 'center'
      }}>
        Admin Access
      </h1>
      
      <div style={{ width: '100%', maxWidth: '500px' }}>
        {error && (
          <div style={{ 
            padding: '12px', 
            marginBottom: '20px', 
            backgroundColor: '#ff4444', 
            color: '#fff', 
            borderRadius: '4px' 
          }}>
            {error}
          </div>
        )}

        {!isAdmin ? (
          <div style={{ 
            backgroundColor: '#222', 
            borderRadius: '8px', 
            padding: '24px', 
            boxShadow: '0 2px 8px rgba(0,0,0,0.5)' 
          }}>
            <h2 style={{ marginBottom: '20px', fontSize: '1.5rem' }}>Admin Login</h2>
            <form onSubmit={handleAdminLogin}>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
                  Admin Secret:
                </label>
                <input
                  type="password"
                  value={adminSecret}
                  onChange={(e) => setAdminSecret(e.target.value)}
                  required
                  style={{ 
                    width: '100%', 
                    padding: '10px', 
                    borderRadius: '4px', 
                    border: '1px solid #555',
                    background: '#333',
                    color: '#fff'
                  }}
                />
              </div>
              
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
                  Custom Session ID (optional):
                </label>
                <input
                  type="text"
                  value={customId}
                  onChange={(e) => setCustomId(e.target.value)}
                  placeholder="Leave blank for auto-generated ID"
                  style={{ 
                    width: '100%', 
                    padding: '10px', 
                    borderRadius: '4px', 
                    border: '1px solid #555',
                    background: '#333',
                    color: '#fff'
                  }}
                />
                <small style={{ display: 'block', marginTop: '4px', color: '#ccc' }}>
                  Use only letters, numbers, hyphens and underscores
                </small>
              </div>
              
              <button 
                type="submit" 
                disabled={loading} 
                style={{ 
                  width: '100%',
                  padding: '12px',
                  backgroundColor: '#1976d2',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  opacity: loading ? 0.7 : 1
                }}
              >
                {loading ? 'Logging in...' : 'Login as Admin'}
              </button>
            </form>
          </div>
        ) : (
          <div style={{ 
            backgroundColor: '#222', 
            borderRadius: '8px', 
            padding: '24px', 
            boxShadow: '0 2px 8px rgba(0,0,0,0.5)' 
          }}>
            <h2 style={{ marginBottom: '20px', fontSize: '1.5rem' }}>Create Custom Animation</h2>
            <form onSubmit={handleCreateSession}>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
                  Custom Animation Name:
                </label>
                <input
                  type="text"
                  value={customId}
                  onChange={(e) => setCustomId(e.target.value)}
                  placeholder="Enter a custom name for this animation"
                  required
                  style={{ 
                    width: '100%', 
                    padding: '10px', 
                    borderRadius: '4px', 
                    border: '1px solid #555',
                    background: '#333',
                    color: '#fff'
                  }}
                />
                <small style={{ display: 'block', marginTop: '4px', color: '#ccc' }}>
                  Use only letters, numbers, hyphens and underscores
                </small>
              </div>
              
              <button 
                type="submit" 
                disabled={loading} 
                style={{ 
                  width: '100%',
                  padding: '12px',
                  backgroundColor: '#1976d2',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  opacity: loading ? 0.7 : 1
                }}
              >
                {loading ? 'Creating...' : 'Create Custom Animation'}
              </button>
            </form>
            
            <div style={{ marginTop: '20px', paddingTop: '20px', borderTop: '1px solid #555' }}>
              <Link 
                href="/"
                style={{
                  display: 'inline-block',
                  padding: '8px 16px',
                  backgroundColor: '#333',
                  color: '#fff',
                  textDecoration: 'none',
                  borderRadius: '4px',
                  border: '1px solid #555'
                }}
              >
                ← Back to Home
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
