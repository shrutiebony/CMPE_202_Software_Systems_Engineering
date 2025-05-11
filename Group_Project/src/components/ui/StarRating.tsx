import { Star, StarHalf } from 'lucide-react';

interface StarRatingProps {
  rating: number;
  totalStars?: number;
  size?: 'sm' | 'md' | 'lg';
  showValue?: boolean;
  className?: string;
}

function StarRating({ 
  rating: initialRating, 
  totalStars = 5, 
  size = 'md', 
  showValue = false,
  className = '' 
}: StarRatingProps) {
  // Ensure rating is non-negative and not greater than totalStars
  const rating = Math.max(0, Math.min(initialRating, totalStars));
  
  // Calculate how many full stars, half stars, and empty stars
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  
  const sizeClass = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
    lg: 'h-5 w-5'
  };
  
  return (
    <div className={`flex items-center ${className}`}>
      <div className="flex">
        {Array.from({ length: fullStars }).map((_, i) => (
          <Star 
            key={`full-${i}`} 
            className={`${sizeClass[size]} text-amber-400 fill-amber-400`} 
          />
        ))}
        
        {hasHalfStar && (
          <StarHalf 
            className={`${sizeClass[size]} text-amber-400 fill-amber-400`} 
          />
        )}
        
        {Array.from({ length: totalStars - fullStars - (hasHalfStar ? 1 : 0) }).map((_, i) => (
          <Star 
            key={`empty-${i}`} 
            className={`${sizeClass[size]} text-gray-300`} 
          />
        ))}
      </div>
      
      {showValue && (
        <span className="ml-1 text-sm font-medium text-gray-700">
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  );
}

export default StarRating;