import { generateSEOMetadata, SEO_CONFIG } from '@/lib/seoUtils.js';

export const metadata = generateSEOMetadata({
  ...SEO_CONFIG.HOME,
  type: 'website',
});

/**
 * Home Layout Component
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Page children
 * @returns {JSX.Element} Layout wrapper
 */
export default function HomeLayout({ children }) {
  return <>{children}</>;
}