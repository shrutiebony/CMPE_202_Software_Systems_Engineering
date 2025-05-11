import { useState } from 'react';
import { Star } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useReviewStore } from '../../store/reviewStore';
import Button from '../ui/Button';

interface AddReviewFormProps {
  restaurantId: string;
  onSuccess: () => void;
}

function AddReviewForm({ restaurantId, onSuccess }: AddReviewFormProps) {
  const { user } = useAuthStore();
  const { addReview, isLoading } = useReviewStore();
  
  const [rating, setRating] = useState(5);
  const [text, setText] = useState('');
  const [hoveredRating, setHoveredRating] = useState(0);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) return;
    
    const reviewData = {
      restaurantId,
      userId: user.id,
      userName: user.name,
      userAvatar: user.avatar,
      rating,
      text
    };
    
    const result = await addReview(reviewData);
    
    if (result) {
      setText('');
      setRating(5);
      onSuccess();
    }
  };
  
  if (!user) {
    return null;
  }
  
  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg p-5 mb-6 border border-gray-200">
      <h3 className="text-xl font-semibold mb-4">Write a Review</h3>
      
      <div className="mb-4">
        <div className="flex items-center mb-2">
          <label className="block text-sm font-medium text-gray-700 mr-4">
            Your Rating:
          </label>
          <div className="flex">
            {[1, 2, 3, 4, 5].map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => setRating(value)}
                onMouseEnter={() => setHoveredRating(value)}
                onMouseLeave={() => setHoveredRating(0)}
                className="focus:outline-none"
              >
                <Star 
                  className={`h-6 w-6 ${
                    (hoveredRating ? value <= hoveredRating : value <= rating)
                      ? 'text-amber-400 fill-amber-400'
                      : 'text-gray-300'
                  }`}
                />
              </button>
            ))}
          </div>
        </div>
      </div>
      
      <div className="mb-4">
        <label 
          htmlFor="review" 
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Your Review
        </label>
        <textarea
          id="review"
          rows={4}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Share your experience with this restaurant..."
          className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          required
        />
      </div>
      
      <Button 
        type="submit" 
        disabled={isLoading || !text.trim()} 
        className="mt-2"
      >
        {isLoading ? 'Submitting...' : 'Submit Review'}
      </Button>
    </form>
  );
}

export default AddReviewForm;