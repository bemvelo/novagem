'use client';

import React from 'react';
import StarRating from './StarRating';
import Button from './Button';

interface ReviewFormProps {
  productId: string;
  onSubmit?: (review: {
    rating: number;
    title: string;
    text: string;
  }) => Promise<void>;
  isLoading?: boolean;
}

export default function ReviewForm({
  productId,
  onSubmit,
  isLoading = false,
}: ReviewFormProps) {
  const [rating, setRating] = React.useState(5);
  const [title, setTitle] = React.useState('');
  const [text, setText] = React.useState('');
  const [error, setError] = React.useState('');
  const [success, setSuccess] = React.useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validation
    if (!title.trim()) {
      setError('Please enter a review title');
      return;
    }
    if (!text.trim()) {
      setError('Please enter a review');
      return;
    }
    if (text.trim().length < 10) {
      setError('Review must be at least 10 characters');
      return;
    }

    try {
      await onSubmit?.({
        rating,
        title,
        text,
      });
      setSuccess('Thank you! Your review has been posted.');
      setTitle('');
      setText('');
      setRating(5);
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to submit review'
      );
    }
  };

  return (
    <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg p-6 border border-purple-100">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        Share Your Experience
      </h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Rating Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Rating
          </label>
          <StarRating
            rating={rating}
            onRatingChange={setRating}
            isInteractive={true}
            size="lg"
          />
        </div>

        {/* Title Input */}
        <div>
          <label
            htmlFor="review-title"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Review Title
          </label>
          <input
            id="review-title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Summarize your experience..."
            maxLength={100}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
          <p className="text-xs text-gray-500 mt-1">
            {title.length}/100 characters
          </p>
        </div>

        {/* Review Text */}
        <div>
          <label
            htmlFor="review-text"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Your Review
          </label>
          <textarea
            id="review-text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Share your detailed experience with this product..."
            maxLength={1000}
            rows={4}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
          />
          <p className="text-xs text-gray-500 mt-1">
            {text.length}/1000 characters (minimum 10)
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        {/* Success Message */}
        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm">
            {success}
          </div>
        )}

        {/* Submit Button */}
        <Button
          type="submit"
          variant="primary"
          disabled={isLoading || !title || !text}
          className="w-full"
        >
          {isLoading ? 'Submitting...' : 'Post Review'}
        </Button>
      </form>
    </div>
  );
}
