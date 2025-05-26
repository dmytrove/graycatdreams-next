'use client';

import { useEffect } from 'react';

export default function ClientMonitoring() {
  useEffect(() => {
    // Initialize monitoring on client side only
    if (process.env.NODE_ENV === 'production') {
      // Only load monitoring in production to avoid issues in development
      import('@/lib/monitoring').then(() => {
        console.log('Production monitoring initialized');
      }).catch(err => {
        console.error('Failed to initialize monitoring:', err);
      });
    }
  }, []);

  return null; // This component doesn't render anything
}
