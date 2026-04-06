// Review Card Component - Display ratings and reviews
import React from 'react';

const ReviewCard = ({ review }) => {
  return (
    <div className="review-card">
      <p>{review?.comment}</p>
    </div>
  );
};

export default ReviewCard;
