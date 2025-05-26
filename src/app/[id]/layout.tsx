'use client';

import React from 'react';
import { AdminProvider } from '@/context/AdminContext';
import { ThreeJSErrorBoundary } from '@/components/ThreeJSErrorBoundary';

interface AnimationLayoutProps {
  children: React.ReactNode;
}

export default function AnimationLayout({ children }: AnimationLayoutProps) {
  return (
    <ThreeJSErrorBoundary>
      <AdminProvider>
        {children}
      </AdminProvider>
    </ThreeJSErrorBoundary>
  );
}
