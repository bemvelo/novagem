import type { Metadata } from 'next';
import { generateSEOMetadata, SEO_CONFIG } from '@/lib/seoUtils';

export const metadata: Metadata = generateSEOMetadata({
  ...SEO_CONFIG.HOME,
  type: 'website',
});

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
