"use client";
import React, { useState } from 'react';
import { useSession } from 'next-auth/react';

const ReviewForm = ({ recipeId, onReviewSubmitted }) => {
  const { data: session } = useSession();
  const [rating, setRating] = useState(0);
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!session) {
      setError('You must be logged in to leave a review');
      return;
    }

    if (rating === 0) {
      setError('Please select a rating');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/review', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          recipeId,
          rating,
          content,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit review');
      }

      setRating(0);
      setContent('');
      onReviewSubmitted && onReviewSubmitted();
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (!session) {
    return (
      <div className="bg-gray-50 p-4 rounded-lg text-center">
        <p className="text-gray-600">
          <a href="/login" className="text-blue-600 hover:underline">
            Login
          </a> untuk memberikan review
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white p-4 rounded-lg border">
      <h3 className="text-lg font-semibold mb-4">Berikan Review</h3>
      
      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Rating Stars */}
        <div>
          <label className="block text-sm font-medium mb-2">Rating:</label>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                className={`text-2xl transition ${
                  star <= rating
                    ? 'text-yellow-400 hover:text-yellow-500'
                    : 'text-gray-300 hover:text-yellow-300'
                }`}
              >
                ★
              </button>
            ))}
          </div>
        </div>

        {/* Review Content */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Review (opsional):
          </label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Ceritakan pengalaman Anda dengan resep ini..."
            className="w-full p-3 border rounded-lg resize-none"
            rows={3}
          />
        </div>

        <button
          type="submit"
          disabled={loading || rating === 0}
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:bg-gray-400 transition"
        >
          {loading ? 'Mengirim...' : 'Kirim Review'}
        </button>
      </form>
    </div>
  );
};

export default ReviewForm;
