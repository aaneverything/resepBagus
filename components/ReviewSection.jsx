"use client";
import React, { useState } from 'react';
import ReviewForm from './ReviewForm';
import ReviewsList from './ReviewsList';

const ReviewSection = ({ recipeId }) => {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleReviewSubmitted = () => {
    // Trigger refresh of reviews list
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-gray-900">Reviews</h2>
      {/* Review Form */}
      <ReviewForm 
        recipeId={recipeId} 
        onReviewSubmitted={handleReviewSubmitted}
      />
      {/* Reviews List */}
      <ReviewsList 
        recipeId={recipeId} 
        refreshTrigger={refreshTrigger}
      />
    </div>
  );
};

export default ReviewSection;
