"use client";

// This file is kept for backward compatibility
// but now simply re-exports from AdminContext
import { useAdmin } from '@/context/AdminContext';

// Re-export with the same interface for compatibility
export function useAdminState() {
  const { adminState } = useAdmin();
  return adminState;
}

export default useAdminState;
