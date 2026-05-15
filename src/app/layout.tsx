import type { Metadata } from 'next';
import '../globals.css';
import { HydrationProvider } from '@/components/layout/HydrationProvider';

export const metadata: Metadata = {
  title: 'TrustShield - Vendor Verification Platform',
  description: 'AI-powered vendor verification platform for Nigeria',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>
        <HydrationProvider>{children}</HydrationProvider>
      </body>
    </html>
  );
}
