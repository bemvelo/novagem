import type { Metadata } from 'next';
import { generateSEOMetadata, SEO_CONFIG } from '@/lib/seoUtils';

export const metadata: Metadata = generateSEOMetadata({
  ...SEO_CONFIG.PRODUCTS,
  type: 'website',
});

export default function ProductsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
