'use client';

import React from 'react';
import StarRating from './StarRating';
import ReviewForm from './ReviewForm';
import ReviewList from './ReviewList';

export default function ProductReviews({
  productId,
  reviews = [],
  averageRating = 0,
  totalReviews = 0,
  isLoading = false,
  onSubmitReview,
  onHelpful,
}) {
  // Calculate rating distribution
  const ratingDistribution = React.useMemo(() => {
    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviews.forEach((review) => {
      distribution[review.rating]++;
    });
    return distribution;
  }, [reviews]);

  return (
    <div className="space-y-8">
      {/* Rating Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Average Rating Card */}
        <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg p-6 border border-purple-100">
          <h3 className="text-sm font-medium text-gray-600 mb-3">
            Customer Ratings
          </h3>
          <div className="flex items-end gap-4">
            <div>
              <p className="text-4xl font-bold text-purple-600">
                {averageRating.toFixed(1)}
              </p>
              <p className="text-xs text-gray-500">out of 5</p>
            </div>
            <div className="mb-1">
              <StarRating rating={averageRating} size="lg" />
              <p className="text-xs text-gray-500 mt-2">
                {totalReviews} {totalReviews === 1 ? 'review' : 'reviews'}
              </p>
            </div>
          </div>
        </div>

        {/* Rating Distribution */}
        <div className="bg-white rounded-lg p-6 border border-gray-200 md:col-span-2">
          <h3 className="text-sm font-medium text-gray-600 mb-4">
            Rating Breakdown
          </h3>
          <div className="space-y-2">
            {[5, 4, 3, 2, 1].map((stars) => {
              const count = ratingDistribution[stars];
              const percentage =
                totalReviews > 0 ? (count / totalReviews) * 100 : 0;

              return (
                <div
                  key={stars}
                  className="flex items-center gap-3"
                >
                  <div className="flex items-center gap-1 w-16 text-xs text-gray-600">
                    <span>{stars}</span>
                    <span>★</span>
                  </div>
                  <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-purple-400 to-pink-400 transition-all"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="text-xs text-gray-500 w-8 text-right">
                    {count}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Review Form and List */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form - Sticky on desktop */}
        <div className="lg:col-span-1 lg:sticky lg:top-20 lg:h-fit">
          <ReviewForm
            productId={productId}
            onSubmit={onSubmitReview}
            isLoading={isLoading}
          />
        </div>

        {/* Reviews List */}
        <div className="lg:col-span-2">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Customer Reviews
          </h3>
          <ReviewList
            reviews={reviews}
            isLoading={isLoading}
            onHelpful={onHelpful}
          />
        </div>
      </div>
    </div>
  );
}
