'use client';

import { ReactNode } from 'react';
import { StudentProvider } from '@/lib/StudentContext';
import { ResourceProvider } from '@/lib/ResourceContext';

export function Providers({ children }: { children: ReactNode }) {
  return (
    <StudentProvider>
      <ResourceProvider>
        {children}
      </ResourceProvider>
    </StudentProvider>
  );
}
