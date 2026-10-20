import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Client Portal | SaaS Platform',
  description: 'Customer facing public website & commerce portal',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi">
      <body className="min-h-screen bg-slate-50 antialiased">
        {children}
      </body>
    </html>
  );
}

