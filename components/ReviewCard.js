'use client';

import React from 'react';
import StarRating from './StarRating';
import { formatRelativeDate } from '@/lib/dateUtils';

export default function ReviewCard({
  id,
  userName,
  rating,
  title,
  text,
  createdAt,
  helpful,
  onHelpful,
}) {
  const [isHelpful, setIsHelpful] = React.useState(false);

  const handleHelpful = () => {
    setIsHelpful(!isHelpful);
    onHelpful?.(id);
  };

  const formattedDate = formatRelativeDate(createdAt);

  return (
    <div className="border border-gray-200 rounded-lg p-4 bg-white hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <p className="font-semibold text-gray-800">{userName}</p>
          <p className="text-xs text-gray-500">{formattedDate}</p>
        </div>
        <StarRating rating={rating} size="sm" />
      </div>

      {/* Review Title */}
      <h4 className="font-semibold text-gray-800 mb-2 text-sm line-clamp-2">
        {title}
      </h4>

      {/* Review Text */}
      <p className="text-gray-700 text-sm leading-relaxed mb-4 line-clamp-4">
        {text}
      </p>

      {/* Helpful Button */}
      <div className="flex items-center gap-4">
        <button
          onClick={handleHelpful}
          className={`text-xs px-3 py-1.5 rounded-full transition-all ${
            isHelpful
              ? 'bg-purple-200 text-purple-700 font-semibold'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          👍 Helpful {helpful > 0 && `(${helpful})`}
        </button>
      </div>
    </div>
  );
}
