import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Trash2 } from 'lucide-react';
import { formatTime } from '../../utils/dateUtils';
import { Restaurant } from '../../types/restaurant';
import StarRating from '../ui/StarRating';
import PriceRange from '../ui/PriceRange';
import { useAuthStore } from '../../store/authStore';
import { UserRole } from '../../types/auth';
import ConfirmationPopup from '../ui/ConfirmationPopup';

interface RestaurantCardProps {
  restaurant: Restaurant;
  availableTimes?: string[];
  date?: string;
  people?: number;
  onDelete?: (id: string) => void;
}

function RestaurantCard({ 
  restaurant, 
  availableTimes = [], 
  date, 
  people,
  onDelete 
}: RestaurantCardProps) {
  const { user } = useAuthStore();
  const isAdmin = user?.role === UserRole.ADMIN;
  const [showDeletePopup, setShowDeletePopup] = useState(false);

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent card click from triggering
    setShowDeletePopup(true);
  };

  const handleConfirmDelete = () => {
    if (onDelete) {
      onDelete(restaurant.id);
    }
    setShowDeletePopup(false);
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:-translate-y-1 hover:shadow-lg group">
        <Link to={`/restaurant/${restaurant.id}`}>
          <div className="relative h-48 overflow-hidden">
            <img 
              src={restaurant.images[0]} 
              alt={restaurant.name} 
              className="w-full h-full object-cover"
            />
            {isAdmin && (
              <button
                onClick={handleDeleteClick}
                className="absolute top-2 right-2 p-2 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-700"
              >
                <Trash2 className="h-5 w-5" />
              </button>
            )}
          </div>
        </Link>
        
        <div className="p-5">
          <div className="flex justify-between items-start mb-2">
            <Link to={`/restaurant/${restaurant.id}`} className="block">
              <h3 className="text-xl font-bold text-gray-800 hover:text-blue-600 transition-colors">
                {restaurant.name}
              </h3>
            </Link>
            <PriceRange range={restaurant.priceRange} />
          </div>
          
          <div className="flex items-center mb-3">
            <StarRating 
              rating={restaurant.rating}
              showValue
              className="mr-2"
            />
            <span className="text-sm text-gray-500">
              ({restaurant.reviewCount} reviews)
            </span>
          </div>
          
          <div className="mb-3">
            <div className="flex flex-wrap gap-2">
              {restaurant.cuisine.map((type, index) => (
                <span 
                  key={index}
                  className="inline-block px-2 py-1 text-xs bg-gray-100 text-gray-800 rounded-full"
                >
                  {type}
                </span>
              ))}
            </div>
          </div>
          
          <div className="text-sm text-gray-500 mb-4">
            {restaurant.address?.city}, {restaurant.address?.state}
          </div>
          
          {availableTimes.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">
                Available times for {people} {people === 1 ? 'person' : 'people'}:
              </h4>
              <div className="flex flex-wrap gap-2">
                {availableTimes.slice(0, 5).map((time, index) => (
                  <Link 
                    key={index}
                    to={`/booking/${restaurant.id}?date=${date}&time=${time}&people=${people}`}
                    className="inline-block px-3 py-1 text-sm font-medium bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
                  >
                    {formatTime(time)}
                  </Link>
                ))}
                
                {availableTimes.length > 5 && (
                  <Link
                    to={`/restaurant/${restaurant.id}?date=${date}&people=${people}`}
                    className="inline-block px-3 py-1 text-sm font-medium bg-gray-100 text-gray-800 rounded-md hover:bg-gray-200 transition-colors"
                  >
                    +{availableTimes.length - 5} more
                  </Link>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      <ConfirmationPopup
        isOpen={showDeletePopup}
        title="Delete Restaurant"
        message={`Are you sure you want to delete ${restaurant.name}? This action cannot be undone and will remove all associated bookings and reviews.`}
        confirmLabel="Yes, Delete Restaurant"
        cancelLabel="No, Keep Restaurant"
        onConfirm={handleConfirmDelete}
        onCancel={() => setShowDeletePopup(false)}
      />
    </>
  );
}

export default RestaurantCard;