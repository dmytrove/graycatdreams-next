"use client";

import React, { useState } from 'react';
import styles from '@/styles/Forms.module.css';
import buttonStyles from '@/styles/Button.module.css';

interface AdminLoginProps {
  onLoginSuccess: (sessionId: string) => void;
}

export default function AdminLogin({ onLoginSuccess }: AdminLoginProps) {
  const [adminSecret, setAdminSecret] = useState('');
  const [customId, setCustomId] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
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

      // Login successful
      onLoginSuccess(data.sessionId);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during admin login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.formContainer}>
      <h2>Admin Login</h2>
      {error && <div className={styles.error}>{error}</div>}
      
      <form onSubmit={handleSubmit} className={styles.form}>
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
          disabled={loading} 
          className={`${buttonStyles.button} ${buttonStyles.primary}`}
        >
          {loading ? 'Logging in...' : 'Login as Admin'}
        </button>
      </form>
    </div>
  );
}
