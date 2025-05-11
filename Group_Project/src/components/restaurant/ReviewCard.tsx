import { formatDate } from '../../utils/dateUtils';
import { Review } from '../../types/review';
import StarRating from '../ui/StarRating';
import { User } from 'lucide-react';

interface ReviewCardProps {
  review: Review;
}

function ReviewCard({ review }: ReviewCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-5 mb-4 border border-gray-100">
      <div className="flex items-start">
        <div className="w-10 h-10 rounded-full bg-gray-100 flex-shrink-0 overflow-hidden mr-4">
          {review.userAvatar ? (
            <img 
              src={review.userAvatar} 
              alt={review.userName} 
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <User className="h-6 w-6 text-gray-400" />
            </div>
          )}
        </div>
        
        <div className="flex-1">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2">
            <div>
              <h4 className="font-semibold text-gray-900">{review.userName}</h4>
              <div className="flex items-center">
                <StarRating rating={review.rating} size="sm" />
                <span className="ml-2 text-sm text-gray-500">
                  {formatDate(review.date)}
                </span>
              </div>
            </div>
          </div>
          
          <p className="text-gray-700 mt-2">{review.text}</p>
        </div>
      </div>
    </div>
  );
}

export default ReviewCard;