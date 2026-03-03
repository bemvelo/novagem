import type { Metadata } from 'next';
import { generateSEOMetadata, SEO_CONFIG } from '@/lib/seoUtils';

export const metadata: Metadata = generateSEOMetadata({
  ...SEO_CONFIG.LOGIN,
  type: 'website',
});

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
