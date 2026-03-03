import type { Metadata } from 'next';
import { generateSEOMetadata, SEO_CONFIG } from '@/lib/seoUtils';

export const metadata: Metadata = generateSEOMetadata({
  ...SEO_CONFIG.CART,
  type: 'website',
});

export default function CartLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
