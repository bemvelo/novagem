/**
 * Generate Metadata for SEO
 * @param {Object} config - SEO configuration
 * @param {string} config.title - Page title
 * @param {string} config.description - Page description
 * @param {string[]} [config.keywords] - SEO keywords
 * @param {string} [config.image] - OG image URL
 * @param {string} [config.url] - Page URL
 * @param {'website' | 'product' | 'article'} [config.type] - Content type
 * @returns {Object} Metadata object
 */
export function generateSEOMetadata(config) {
  const baseUrl = 'https://gleamia.com';
  const url = config.url || baseUrl;
  const imageUrl = config.image || `${baseUrl}/og-image.jpg`;

  return {
    title: config.title,
    description: config.description,
    keywords: config.keywords?.join(', '),
    openGraph: {
      title: config.title,
      description: config.description,
      url: url,
      type: config.type === 'product' ? 'website' : config.type,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: config.title,
        },
      ],
      siteName: 'GLEAMIA',
    },
    twitter: {
      card: 'summary_large_image',
      title: config.title,
      description: config.description,
      images: [imageUrl],
    },
    robots: {
      index: true,
      follow: true,
      nocache: false,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    alternates: {
      canonical: url,
    },
  };
}

/**
 * Generate Product Schema for JSON-LD
 * @param {Object} product - Product data
 * @param {string} product.id - Product ID
 * @param {string} product.name - Product name
 * @param {string} product.description - Product description
 * @param {number} product.price - Product price
 * @param {number} product.rating - Product rating
 * @param {number} product.reviewCount - Number of reviews
 * @param {string} [product.image] - Product image URL
 * @param {string} [product.category] - Product category
 * @param {string} [product.material] - Product material
 * @returns {Object} Schema.org Product JSON-LD
 */
export function generateProductSchema(product) {
  return {
    '@context': 'https://schema.org/',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image: product.image || 'https://gleamia.com/product.jpg',
    brand: {
      '@type': 'Brand',
      name: 'GLEAMIA',
    },
    offers: {
      '@type': 'Offer',
      url: `https://gleamia.com/products/${product.id}`,
      priceCurrency: 'USD',
      price: product.price.toString(),
      priceValidUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split('T')[0],
      availability: 'https://schema.org/InStock',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: product.rating.toString(),
      reviewCount: product.reviewCount.toString(),
    },
  };
}

/**
 * Generate Organization Schema for JSON-LD
 * @returns {Object} Schema.org Organization JSON-LD
 */
export function generateOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'GLEAMIA',
    url: 'https://gleamia.com',
    logo: 'https://gleamia.com/logo.jpg',
    description:
      'Premium handcrafted jewelry - necklaces, rings, earrings and accessories.',
    sameAs: [
      'https://www.facebook.com/gleamia',
      'https://www.instagram.com/gleamia',
      'https://twitter.com/gleamia',
    ],
    contact: {
      '@type': 'ContactPoint',
      telephone: '+1-XXX-XXX-XXXX',
      contactType: 'Customer Support',
    },
  };
}

/**
 * Generate Local Business Schema for JSON-LD
 * @returns {Object} Schema.org LocalBusiness JSON-LD
 */
export function generateLocalBusinessSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: 'GLEAMIA Jewelry Store',
    image: 'https://gleamia.com/store.jpg',
    '@id': 'https://gleamia.com',
    url: 'https://gleamia.com',
    telephone: '+1-XXX-XXX-XXXX',
    priceRange: '$$',
    address: {
      '@type': 'PostalAddress',
      streetAddress: '123 Jewelry Street',
      addressLocality: 'New York',
      addressRegion: 'NY',
      postalCode: '10001',
      addressCountry: 'US',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: '40.7128',
      longitude: '-74.0060',
    },
    ratingValue: '4.5',
    reviewCount: '100',
    openingHoursSpecification: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: [
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
      ],
      opens: '09:00',
      closes: '18:00',
    },
  };
}

export const SEO_CONFIG = {
  HOME: {
    title: 'GLEAMIA | Premium Handcrafted Jewelry Store',
    description:
      'Discover handcrafted jewelry that tells your story. Shop timeless necklaces, rings, earrings and accessories online. Premium quality, fair prices.',
    keywords: [
      'jewelry',
      'handcrafted jewelry',
      'necklaces',
      'rings',
      'earrings',
      'accessories',
      'luxury jewelry',
      'online jewelry store',
    ],
  },
  PRODUCTS: {
    title: 'Shop Jewelry | GLEAMIA',
    description:
      'Browse our complete collection of handcrafted jewelry including necklaces, rings, earrings and accessories. Find your perfect piece today.',
    keywords: [
      'buy jewelry',
      'jewelry collection',
      'necklaces for sale',
      'rings',
      'earrings',
      'jewelry online',
    ],
  },
  LOGIN: {
    title: 'Login | GLEAMIA',
    description: 'Sign in to your GLEAMIA account to shop our premium jewelry collection.',
    keywords: ['login', 'sign in', 'account', 'GLEAMIA'],
  },
  SIGNUP: {
    title: 'Sign Up | GLEAMIA',
    description: 'Create your GLEAMIA account to start shopping our handcrafted jewelry collection.',
    keywords: ['signup', 'register', 'create account', 'GLEAMIA'],
  },
  ADMIN: {
    title: 'Admin Dashboard | GLEAMIA',
    description: 'Admin dashboard for GLEAMIA - manage products, orders, and analytics.',
    keywords: ['admin', 'dashboard', 'management'],
  },
  USER_DASHBOARD: {
    title: 'My Account | GLEAMIA',
    description: 'Manage your GLEAMIA account, orders, and wishlist.',
    keywords: ['account', 'profile', 'orders', 'wishlist'],
  },
  CART: {
    title: 'Shopping Cart | GLEAMIA',
    description: 'Review your shopping cart and proceed to checkout.',
    keywords: ['cart', 'shopping', 'checkout'],
  },
  CHECKOUT: {
    title: 'Checkout | GLEAMIA',
    description: 'Complete your purchase at GLEAMIA. Secure payment processing.',
    keywords: ['checkout', 'payment', 'order'],
  },
};

/**
 * Get canonical URL for a pathname
 * @param {string} pathname - The pathname
 * @returns {string} Full canonical URL
 */
export function getCanonicalUrl(pathname) {
  return `https://gleamia.com${pathname}`;
}