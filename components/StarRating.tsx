'use client';

import React from 'react';

interface StarRatingProps {
  rating: number;
  totalReviews?: number;
  onRatingChange?: (rating: number) => void;
  isInteractive?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export default function StarRating({
  rating,
  totalReviews = 0,
  onRatingChange,
  isInteractive = false,
  size = 'md',
}: StarRatingProps) {
  const [hoverRating, setHoverRating] = React.useState(0);

  const sizeMap = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
  };

  const starSizeMap = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };

  const handleStarClick = (starValue: number) => {
    if (isInteractive && onRatingChange) {
      onRatingChange(starValue);
    }
  };

  const displayRating = hoverRating || Math.round(rating * 2) / 2;
  const fullStars = Math.floor(displayRating);
  const hasHalfStar = displayRating % 1 !== 0;

  return (
    <div className="flex items-center gap-2">
      <div
        className="flex gap-0.5"
        onMouseLeave={() => setHoverRating(0)}
      >
        {[1, 2, 3, 4, 5].map((star) => {
          const isFullStar = star <= fullStars;
          const isHalfStar =
            hasHalfStar && star === fullStars + 1;

          return (
            <button
              key={star}
              onClick={() => handleStarClick(star)}
              onMouseEnter={() =>
                isInteractive && setHoverRating(star)
              }
              className={`${starSizeMap[size]} relative cursor-pointer transition-transform hover:scale-110 ${
                isInteractive ? 'opacity-70 hover:opacity-100' : ''
              }`}
              disabled={!isInteractive}
            >
              {/* Background star */}
              <span className="absolute inset-0 text-gray-300">
                ★
              </span>
              {/* Filled star */}
              <span
                className={`absolute inset-0 overflow-hidden transition-all ${
                  isFullStar ? 'w-full' : isHalfStar ? 'w-1/2' : 'w-0'
                }`}
                style={{
                  color: '#a78bfa',
                }}
              >
                ★
              </span>
            </button>
          );
        })}
      </div>

      <div className={sizeMap[size]}>
        <span className="text-gray-600 font-semibold">
          {displayRating.toFixed(1)}
        </span>
        {totalReviews > 0 && (
          <span className="text-gray-500 ml-1">
            ({totalReviews})
          </span>
        )}
      </div>
    </div>
  );
}
