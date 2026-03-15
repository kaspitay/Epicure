import { useState } from 'react';
import { FaStar, FaRegStar, FaStarHalfAlt } from 'react-icons/fa';

interface StarRatingProps {
  rating: number;
  totalRatings?: number;
  size?: 'sm' | 'md' | 'lg';
  interactive?: boolean;
  onRate?: (rating: number) => void;
  userRating?: number | null;
  showCount?: boolean;
}

const sizeClasses = {
  sm: 'text-sm',
  md: 'text-lg',
  lg: 'text-2xl',
};

const StarRating = ({
  rating,
  totalRatings = 0,
  size = 'md',
  interactive = false,
  onRate,
  userRating,
  showCount = true,
}: StarRatingProps) => {
  const [hoverRating, setHoverRating] = useState<number | null>(null);

  const displayRating = hoverRating !== null ? hoverRating : (userRating ?? rating);

  const renderStar = (index: number) => {
    const starValue = index + 1;
    const fillLevel = displayRating - index;

    const starClass = `${sizeClasses[size]} ${
      interactive ? 'cursor-pointer transition-transform hover:scale-110' : ''
    }`;

    const starColor = userRating && !hoverRating 
      ? 'text-green-500' 
      : 'text-yellow-400';

    const handleClick = () => {
      if (interactive && onRate) {
        onRate(starValue);
      }
    };

    const handleMouseEnter = () => {
      if (interactive) {
        setHoverRating(starValue);
      }
    };

    const handleMouseLeave = () => {
      if (interactive) {
        setHoverRating(null);
      }
    };

    if (fillLevel >= 1) {
      return (
        <FaStar
          key={index}
          className={`${starClass} ${starColor}`}
          onClick={handleClick}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        />
      );
    } else if (fillLevel >= 0.5) {
      return (
        <FaStarHalfAlt
          key={index}
          className={`${starClass} ${starColor}`}
          onClick={handleClick}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        />
      );
    } else {
      return (
        <FaRegStar
          key={index}
          className={`${starClass} text-gray-400`}
          onClick={handleClick}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        />
      );
    }
  };

  return (
    <div className="flex items-center gap-1">
      <div className="flex">
        {[0, 1, 2, 3, 4].map(renderStar)}
      </div>
      {showCount && (
        <span className="text-gray-400 text-sm ml-1">
          {rating > 0 ? `${rating.toFixed(1)}` : ''} 
          {totalRatings > 0 && ` (${totalRatings})`}
        </span>
      )}
    </div>
  );
};

export default StarRating;
