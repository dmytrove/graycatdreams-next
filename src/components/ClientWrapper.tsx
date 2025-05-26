'use client';

import React from 'react';

interface ClientWrapperProps {
  children: React.ReactNode;
}

export default function ClientWrapper({ children }: ClientWrapperProps) {
  return (
    <div id="root">
      {children}
    </div>
  );
}
