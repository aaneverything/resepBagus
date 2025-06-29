"use client";
import React, { useState, useEffect } from 'react';

const ReviewsList = ({ recipeId, refreshTrigger }) => {
  const [reviews, setReviews] = useState([]);
  const [avgRating, setAvgRating] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/review/${recipeId}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch reviews');
      }

      setReviews(data.reviews);
      setAvgRating(data.avgRating);
      setTotalReviews(data.totalReviews);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [recipeId, refreshTrigger]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const renderStars = (rating) => {
    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className={`text-sm ${
              star <= rating ? 'text-yellow-400' : 'text-gray-300'
            }`}
          >
            ★
          </span>
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="animate-pulse">
            <div className="bg-gray-200 h-4 w-1/4 rounded mb-2"></div>
            <div className="bg-gray-200 h-3 w-full rounded mb-1"></div>
            <div className="bg-gray-200 h-3 w-3/4 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 text-red-600 p-4 rounded-lg">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Reviews Summary */}
      {totalReviews > 0 && (
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex items-center gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">{avgRating}</div>
              <div className="flex justify-center">{renderStars(Math.round(avgRating))}</div>
            </div>
            <div>
              <div className="text-sm text-gray-600">
                {totalReviews} review{totalReviews > 1 ? 's' : ''}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reviews List */}
      {reviews.length === 0 ? (
        <div className="text-center text-gray-500 py-8">
          Belum ada review untuk resep ini.
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <div key={review.id} className="bg-white p-4 rounded-lg border">
              <div className="flex items-start gap-3">
                {/* User Avatar */}
                <img
                  src={review.user.image || "https://ui-avatars.com/api/?name=" + encodeURIComponent(review.user.name)}
                  alt={review.user.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
                
                <div className="flex-1">
                  {/* User Name and Rating */}
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium text-gray-900">{review.user.name}</h4>
                    {renderStars(review.rating)}
                  </div>
                  
                  {/* Review Content */}
                  {review.content && (
                    <p className="text-gray-700 mb-2">{review.content}</p>
                  )}
                  
                  {/* Date */}
                  <p className="text-xs text-gray-500">
                    {formatDate(review.createdAt)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReviewsList;
