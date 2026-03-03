import type { Metadata } from 'next';
import { generateSEOMetadata, SEO_CONFIG } from '@/lib/seoUtils';

export const metadata: Metadata = generateSEOMetadata({
  ...SEO_CONFIG.ADMIN,
  type: 'website',
});

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
