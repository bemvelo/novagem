'use client';

import { useState } from 'react';
import ProductReviews from '@/components/ProductReviews';
import StarRating from '@/components/StarRating';

// Mock data - replace with real data from Firestore
const mockProduct = {
  id: 'product-1',
  name: 'Luxury Purple Gemstone Ring',
  price: 259.99,
  description:
    'Beautiful handcrafted ring with premium amethyst gemstone set in sterling silver.',
  category: 'Rings',
  rating: 4.5,
  reviewCount: 24,
  material: 'Sterling Silver',
  gemstone: 'Amethyst',
};

const mockReviews = [
  {
    id: 'review-1',
    userName: 'Sarah M.',
    rating: 5,
    title: 'Absolutely stunning!',
    text: 'The quality of this ring exceeded my expectations. The gemstone is vibrant and the craftsmanship is impeccable. I wear it every day and receive compliments constantly. Highly recommend!',
    createdAt: new Date('2024-02-28'),
    helpful: 12,
  },
  {
    id: 'review-2',
    userName: 'Jessica L.',
    rating: 4,
    title: 'Beautiful piece, great quality',
    text: 'Very happy with my purchase. The ring fits perfectly and looks exactly like the images. The only reason I\'m giving 4 stars instead of 5 is that the packaging could be a bit more protective.',
    createdAt: new Date('2024-02-20'),
    helpful: 8,
  },
  {
    id: 'review-3',
    userName: 'Emma R.',
    rating: 5,
    title: 'Perfect engagement ring!',
    text: 'My fiancée loves it! The design is elegant and timeless. Perfect for an engagement ring. Definitely worth the investment!',
    createdAt: new Date('2024-02-10'),
    helpful: 15,
  },
  {
    id: 'review-4',
    userName: 'Rachel T.',
    rating: 4,
    title: 'Great quality at good price',
    text: 'Amazing value for money. The ring arrived quickly and is beautifully crafted. Very pleased with my purchase.',
    createdAt: new Date('2024-01-25'),
    helpful: 5,
  },
];

export default function ProductDetailExample() {
  const [reviews, setReviews] = useState(mockReviews);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmitReview = async (review: {
    rating: number;
    title: string;
    text: string;
  }) => {
    setIsSubmitting(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const newReview = {
      id: `review-${Date.now()}`,
      userName: 'You',
      ...review,
      createdAt: new Date(),
      helpful: 0,
    };

    setReviews((prev) => [newReview, ...prev]);
    setIsSubmitting(false);
  };

  const handleHelpful = (reviewId: string) => {
    setReviews((prev) =>
      prev.map((review) =>
        review.id === reviewId
          ? { ...review, helpful: review.helpful + 1 }
          : review
      )
    );
  };

  const averageRating =
    mockReviews.length > 0
      ? mockReviews.reduce((sum, r) => sum + r.rating, 0) /
        mockReviews.length
      : 0;

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-gradient-to-br from-purple-50 to-blue-50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            {mockProduct.name}
          </h1>
          <div className="flex items-center gap-4 mt-4">
            <StarRating
              rating={mockProduct.rating}
              totalReviews={mockProduct.reviewCount}
              size="lg"
            />
            <p className="text-gray-600">
              {mockProduct.category} • {mockProduct.material}
            </p>
          </div>
        </div>
      </div>

      {/* Product Details & Reviews */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {/* Product Image & Info */}
          <div className="md:col-span-1">
            <div className="bg-gradient-to-br from-purple-100 to-blue-100 rounded-lg h-80 flex items-center justify-center text-6xl">
              ✨
            </div>
            <p className="text-4xl font-bold text-gray-900 mt-6 mb-2">
              ${mockProduct.price}
            </p>
            <button className="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 transition">
              Add to Cart
            </button>
          </div>

          {/* Description */}
          <div className="md:col-span-2">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Product Details
            </h2>
            <p className="text-gray-700 text-lg mb-6">
              {mockProduct.description}
            </p>
            <div className="space-y-3">
              <div className="flex items-center gap-4">
                <span className="font-semibold text-gray-700 w-32">
                  Material:
                </span>
                <span className="text-gray-600">{mockProduct.material}</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="font-semibold text-gray-700 w-32">
                  Gemstone:
                </span>
                <span className="text-gray-600">{mockProduct.gemstone}</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="font-semibold text-gray-700 w-32">
                  Category:
                </span>
                <span className="text-gray-600">{mockProduct.category}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="border-t pt-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">
            Customer Reviews
          </h2>
          <ProductReviews
            productId={mockProduct.id}
            reviews={reviews}
            averageRating={averageRating}
            totalReviews={reviews.length}
            isLoading={isSubmitting}
            onSubmitReview={handleSubmitReview}
            onHelpful={handleHelpful}
          />
        </div>
      </div>
    </div>
  );
}
