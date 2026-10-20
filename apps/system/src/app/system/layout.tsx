import { ReactNode } from 'react';
import { SystemSidebar } from '@/shared/components/layout/SystemSidebar';

export default function SystemLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen bg-slate-950">
      <SystemSidebar />
      <main className="flex-1 p-8 overflow-auto">{children}</main>
    </div>
  );
}

