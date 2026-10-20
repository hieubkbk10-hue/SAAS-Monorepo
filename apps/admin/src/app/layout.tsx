import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Tenant Admin Portal | SaaS Platform',
  description: 'Tenant management portal for content, orders, and settings',
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

