import React from 'react';

const StarRating = ({ rating, reviewCount, showCount = true, size = 'sm' }) => {
  const sizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg'
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    // Full stars
    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <span key={i} className="text-yellow-400">★</span>
      );
    }

    // Half star
    if (hasHalfStar) {
      stars.push(
        <span key="half" className="text-yellow-400">☆</span>
      );
    }

    // Empty stars
    const remainingStars = 5 - Math.ceil(rating);
    for (let i = 0; i < remainingStars; i++) {
      stars.push(
        <span key={`empty-${i}`} className="text-gray-300">★</span>
      );
    }

    return stars;
  };

  if (rating === 0 || rating === null || rating === undefined) {
    return (
      <div className={`flex items-center gap-1 ${sizeClasses[size]}`}>
        <span className="text-gray-400">Belum ada rating</span>
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-1 ${sizeClasses[size]}`}>
      <div className="flex">
        {renderStars(rating)}
      </div>
      <span className="text-gray-600">
        {rating.toFixed(1)}
      </span>
      {showCount && reviewCount > 0 && (
        <span className="text-gray-500 text-xs">
          ({reviewCount} review{reviewCount > 1 ? 's' : ''})
        </span>
      )}
    </div>
  );
};

export default StarRating;
