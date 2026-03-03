'use client';

import React from 'react';
import ReviewCard from './ReviewCard';

interface Review {
  id: string;
  userName: string;
  rating: number;
  title: string;
  text: string;
  createdAt: Date | string;
  helpful: number;
}

interface ReviewListProps {
  reviews: Review[];
  isLoading?: boolean;
  onHelpful?: (reviewId: string) => void;
}

export default function ReviewList({
  reviews,
  isLoading = false,
  onHelpful,
}: ReviewListProps) {
  const [sortBy, setSortBy] = React.useState<'recent' | 'helpful' | 'rating'>(
    'recent'
  );

  const sortedReviews = React.useMemo(() => {
    const sorted = [...reviews];
    switch (sortBy) {
      case 'helpful':
        return sorted.sort((a, b) => b.helpful - a.helpful);
      case 'rating':
        return sorted.sort((a, b) => b.rating - a.rating);
      case 'recent':
      default:
        return sorted.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() -
            new Date(a.createdAt).getTime()
        );
    }
  }, [reviews, sortBy]);

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="bg-gray-200 rounded-lg h-32 animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <div className="text-center py-8 bg-purple-50 rounded-lg border border-purple-100">
        <p className="text-gray-600">No reviews yet.</p>
        <p className="text-sm text-gray-500 mt-1">
          Be the first to share your experience!
        </p>
      </div>
    );
  }

  return (
    <div>
      {/* Sort Controls */}
      <div className="flex gap-2 mb-4 p-3 bg-gray-50 rounded-lg">
        <span className="text-sm font-medium text-gray-600 mr-2">
          Sort by:
        </span>
        {(['recent', 'helpful', 'rating'] as const).map((option) => (
          <button
            key={option}
            onClick={() => setSortBy(option)}
            className={`px-3 py-1.5 text-sm rounded-full transition-all ${
              sortBy === option
                ? 'bg-purple-500 text-white font-semibold'
                : 'bg-white text-gray-700 border border-gray-200 hover:border-purple-300'
            }`}
          >
            {option.charAt(0).toUpperCase() + option.slice(1)}
          </button>
        ))}
      </div>

      {/* Review Cards */}
      <div className="space-y-3">
        {sortedReviews.map((review) => (
          <ReviewCard
            key={review.id}
            {...review}
            onHelpful={onHelpful}
          />
        ))}
      </div>
    </div>
  );
}
