import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, Users } from 'lucide-react';
import { Booking, BookingStatus } from '../../types/booking';
import { Restaurant } from '../../types/restaurant';
import { formatDate, formatTime } from '../../utils/dateUtils';
import Button from '../ui/Button';
import ConfirmationPopup from '../ui/ConfirmationPopup';

interface BookingCardProps {
  booking: Booking;
  restaurant?: Restaurant;
  onCancel?: (bookingId: string) => void;
  showRestaurantDetails?: boolean;
}

function BookingCard({ 
  booking, 
  restaurant, 
  onCancel,
  showRestaurantDetails = true 
}: BookingCardProps) {
  const [showCancelPopup, setShowCancelPopup] = useState(false);

  // Status badge colors
  const statusColors = {
    [BookingStatus.PENDING]: 'bg-yellow-100 text-yellow-800',
    [BookingStatus.CONFIRMED]: 'bg-green-100 text-green-800',
    [BookingStatus.COMPLETED]: 'bg-blue-100 text-blue-800',
    [BookingStatus.CANCELLED]: 'bg-red-100 text-red-800',
    [BookingStatus.NO_SHOW]: 'bg-gray-100 text-gray-800'
  };
  
  // Check if booking is upcoming (future date and confirmed)
  const isUpcoming = (booking.status === BookingStatus.PENDING || booking.status === BookingStatus.CONFIRMED) && 
    new Date(`${booking.date}T${booking.time}`) > new Date();

  const handleCancelClick = () => {
    setShowCancelPopup(true);
  };

  const handleConfirmCancel = () => {
    if (onCancel) {
      onCancel(booking.id);
    }
    setShowCancelPopup(false);
  };
  
  return (
    <>
      <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-100">
        {/* Status badge - always visible */}
        <div className="p-4 border-b border-gray-100">
          <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${statusColors[booking.status]}`}>
            {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
          </span>
        </div>
        
        <div className="p-4">
          {/* Restaurant details */}
          {showRestaurantDetails && restaurant && (
            <div className="mb-4">
              <Link to={`/restaurant/${restaurant.id}`} className="block mb-2">
                <h3 className="text-xl font-bold text-gray-800 hover:text-blue-600 transition-colors">
                  {restaurant.name}
                </h3>
              </Link>
              
              {restaurant.address && (
                <p className="text-sm text-gray-600">
                  {restaurant.address.street}, {restaurant.address.city}, {restaurant.address.state}
                </p>
              )}
            </div>
          )}
          
          {/* Booking details */}
          <div className="space-y-3">
            <div className="flex items-center text-gray-700">
              <Calendar className="h-5 w-5 text-gray-400 mr-3" />
              <span>{formatDate(booking.date)}</span>
            </div>
            
            <div className="flex items-center text-gray-700">
              <Clock className="h-5 w-5 text-gray-400 mr-3" />
              <span>{formatTime(booking.time)}</span>
            </div>
            
            <div className="flex items-center text-gray-700">
              <Users className="h-5 w-5 text-gray-400 mr-3" />
              <span>
                {booking.partySize} {booking.partySize === 1 ? 'person' : 'people'}
              </span>
            </div>
          </div>
          
          {/* Special requests */}
          {booking.specialRequests && (
            <div className="mt-4 p-3 bg-gray-50 rounded-md text-sm text-gray-700">
              <div className="font-medium mb-1">Special Requests:</div>
              <p>{booking.specialRequests}</p>
            </div>
          )}
          
          {/* Cancel button - only show for upcoming bookings */}
          {isUpcoming && onCancel && (
            <div className="mt-4 pt-4 border-t border-gray-100">
              <Button 
                variant="danger" 
                onClick={handleCancelClick}
                fullWidth
              >
                Cancel Reservation
              </Button>
            </div>
          )}
        </div>
      </div>

      <ConfirmationPopup
        isOpen={showCancelPopup}
        title="Cancel Reservation"
        message="Are you sure you want to cancel this reservation? This action cannot be undone."
        confirmLabel="Yes, Cancel Reservation"
        cancelLabel="No, Keep Reservation"
        onConfirm={handleConfirmCancel}
        onCancel={() => setShowCancelPopup(false)}
      />
    </>
  );
}

export default BookingCard;