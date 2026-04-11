import React, { useState } from 'react';
import { Star } from 'lucide-react';
import { cn } from '../../utils/cn';

/**
 * A premium Star Rating component
 * @param {number} value - The current rating value
 * @param {function} onChange - Callback when rating changes (optional)
 * @param {boolean} readonly - If true, rating cannot be changed
 * @param {number} size - Size of the stars
 * @param {string} className - Additional classes
 */
const StarRating = ({ 
  value = 0, 
  onChange, 
  readonly = false, 
  size = 24,
  className 
}) => {
  const [hover, setHover] = useState(0);

  const displayValue = hover || value;

  return (
    <div className={cn("flex items-center gap-1", className)}>
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={readonly}
          onClick={() => onChange && onChange(star)}
          onMouseEnter={() => !readonly && setHover(star)}
          onMouseLeave={() => !readonly && setHover(0)}
          className={cn(
            "p-0.5 transition-all duration-200",
            !readonly && "hover:scale-110 active:scale-95",
            readonly ? "cursor-default" : "cursor-pointer"
          )}
        >
          <Star
            size={size}
            className={cn(
              "transition-colors duration-200",
              star <= displayValue 
                ? "text-amber-400 fill-amber-400" 
                : "text-slate-200 dark:text-slate-700"
            )}
            strokeWidth={2}
          />
        </button>
      ))}
    </div>
  );
};

export default StarRating;
