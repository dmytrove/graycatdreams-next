"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from '@/styles/Forms.module.css';
import buttonStyles from '@/styles/Button.module.css';
import { useAdmin } from '@/context/AdminContext';

export default function AdminSessionCreator() {
  const router = useRouter();
  const { adminState, refreshAdminState } = useAdmin();
  const { isAdmin, loading } = adminState;
  
  // State for admin login
  const [adminSecret, setAdminSecret] = useState('');
  const [customId, setCustomId] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [processingAction, setProcessingAction] = useState(false);

  // Handler for admin creation of sessions
  const handleCreateSession = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!customId.trim()) {
      setError('Custom name is required');
      return;
    }
    
    setError(null);
    setProcessingAction(true);
    
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
      setProcessingAction(false);
    }
  };
  
  // Handler for admin login
  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setProcessingAction(true);

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
      }      // Login successful - refresh admin state and redirect
      await refreshAdminState();
      router.push(`/${data.sessionId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during admin login');
      setProcessingAction(false);
    }
  };

  if (loading) {
    return <div>Checking admin status...</div>;
  }

  // Admin login form
  if (!isAdmin) {
    return (
      <div className={styles.formContainer}>
        <h2>Admin Login</h2>
        {error && <div className={styles.error}>{error}</div>}
        
        <form onSubmit={handleAdminLogin} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="adminSecret">Admin Secret:</label>
            <input
              id="adminSecret"
              type="password"
              value={adminSecret}
              onChange={(e) => setAdminSecret(e.target.value)}
              required
              className={styles.input}
            />
          </div>
          
          <div className={styles.formGroup}>
            <label htmlFor="customId">Custom Session ID (optional):</label>
            <input
              id="customId"
              type="text"
              value={customId}
              onChange={(e) => setCustomId(e.target.value)}
              placeholder="Leave blank for auto-generated ID"
              className={styles.input}
            />
            <small>Use only letters, numbers, hyphens and underscores</small>
          </div>
          
          <button 
            type="submit" 
            disabled={processingAction} 
            className={`${buttonStyles.button} ${buttonStyles.primary}`}
          >
            {processingAction ? 'Logging in...' : 'Login as Admin'}
          </button>
        </form>
      </div>
    );
  }

  // Admin session creator form
  return (
    <div className={styles.formContainer}>
      <h2>Create Custom Animation Session</h2>
      {error && <div className={styles.error}>{error}</div>}
      
      <form onSubmit={handleCreateSession} className={styles.form}>
        <div className={styles.formGroup}>
          <label htmlFor="customId">Custom Animation Name:</label>
          <input
            id="customId"
            type="text"
            value={customId}
            onChange={(e) => setCustomId(e.target.value)}
            placeholder="Enter a custom name for this animation"
            className={styles.input}
            required
          />
          <small>Use only letters, numbers, hyphens and underscores</small>
        </div>
        
        <button 
          type="submit" 
          disabled={processingAction} 
          className={`${buttonStyles.button} ${buttonStyles.primary}`}
        >
          {processingAction ? 'Creating...' : 'Create Custom Animation'}
        </button>
      </form>
    </div>
  );
}
