'use client';

import React from 'react';
import StarRating from './StarRating';

export default function ReviewList({
  reviews = [],
  isLoading = false,
  onHelpful,
}) {
  const [helpfulReviews, setHelpfulReviews] = React.useState(
    new Set()
  );

  const handleHelpful = (reviewId) => {
    if (helpfulReviews.has(reviewId)) {
      setHelpfulReviews(
        (prev) =>
          new Set([...prev].filter((id) => id !== reviewId))
      );
    } else {
      setHelpfulReviews((prev) => new Set([...prev, reviewId]));
    }

    if (onHelpful) {
      onHelpful(reviewId);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="bg-gray-200 rounded-lg h-40 animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <div className="bg-gray-50 rounded-lg p-12 text-center">
        <p className="text-gray-600 text-lg">
          No reviews yet. Be the first to share your experience!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {reviews.map((review) => (
        <div
          key={review.id}
          className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition"
        >
          {/* Header */}
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <StarRating rating={review.rating} size="sm" />
              <h4 className="font-bold text-gray-900 mt-2 text-base">
                {review.title}
              </h4>
              <p className="text-sm text-gray-600 mt-1">
                By <span className="font-semibold">{review.userName}</span>{' '}
                •{' '}
                {new Date(review.createdAt).toLocaleDateString(
                  'en-US',
                  {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  }
                )}
              </p>
            </div>
          </div>

          {/* Review Text */}
          <p className="text-gray-700 mb-4 leading-relaxed text-sm">
            {review.text}
          </p>

          {/* Helpful Button */}
          <button
            onClick={() => handleHelpful(review.id)}
            className={`text-sm font-semibold transition ${
              helpfulReviews.has(review.id)
                ? 'text-purple-600'
                : 'text-gray-600 hover:text-purple-600'
            }`}
          >
            {helpfulReviews.has(review.id) ? '👍' : '👤'} Helpful (
            {review.helpful +
              (helpfulReviews.has(review.id) ? 1 : 0)})
          </button>
        </div>
      ))}
    </div>
  );
}
