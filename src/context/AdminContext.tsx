"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';

interface AdminState {
  isAdmin: boolean;
  loading: boolean;
  error: string | null;
}

interface AdminContextType {
  adminState: AdminState;
  checkAdminStatus: () => Promise<boolean>;
  refreshAdminState: () => Promise<void>;
}

// Create the context with proper defaults
const defaultAdminState: AdminState = {
  isAdmin: false,
  loading: true,
  error: null,
};

// Create the context with a default value that includes all required functions
const AdminContext = createContext<AdminContextType>({
  adminState: defaultAdminState,
  checkAdminStatus: async () => false,
  refreshAdminState: async () => {},
});

// Export the hook to use the context
export const useAdmin = () => {
  const context = useContext(AdminContext);
  
  // Ensure the context is being used within a provider
  if (!context) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  
  return context;
};

// Provider component
interface AdminProviderProps {
  children: ReactNode;
}

export function AdminProvider({ children }: AdminProviderProps) {
  const [adminState, setAdminState] = useState<AdminState>(defaultAdminState);
  
  // Function to check admin status that can be called from anywhere
  const checkAdminStatus = useCallback(async (): Promise<boolean> => {
    try {
      setAdminState(prev => ({ ...prev, loading: true }));
      const response = await fetch('/api/admin/check');
      
      if (!response.ok) {
        throw new Error('Failed to verify admin status');
      }
      
      const data = await response.json();
      const isAdmin = !!data.isAdmin;
      
      setAdminState({
        isAdmin,
        loading: false,
        error: null,
      });
      
      return isAdmin;
    } catch (err) {
      setAdminState({
        isAdmin: false,
        loading: false,
        error: err instanceof Error ? err.message : 'An error occurred',
      });
      return false;
    }
  }, []);
  
  const refreshAdminState = useCallback(async (): Promise<void> => {
    await checkAdminStatus();
  }, [checkAdminStatus]);

  // Check admin status on initial load
  useEffect(() => {
    // Wrap in try-catch to prevent unhandled promise rejections
    (async () => {
      try {
        await checkAdminStatus();
      } catch (error) {
        console.error('Error checking admin status:', error);
        setAdminState({
          isAdmin: false,
          loading: false,
          error: error instanceof Error ? error.message : 'Failed to check admin status',
        });
      }
    })();
  }, []);

  // Create the context value object just once when dependencies change
  const contextValue = React.useMemo(() => ({
    adminState,
    checkAdminStatus,
    refreshAdminState
  }), [adminState, checkAdminStatus, refreshAdminState]);

  return (
    <AdminContext.Provider value={contextValue}>
      {children}
    </AdminContext.Provider>
  );
}
