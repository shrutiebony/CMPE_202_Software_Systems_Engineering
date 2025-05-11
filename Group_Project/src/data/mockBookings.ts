import { Booking, BookingStatus } from '../types/booking';

export const mockBookings: Booking[] = [
  {
    id: '123e4567-e89b-12d3-a456-426614174100',
    restaurantId: '123e4567-e89b-12d3-a456-426614174000', // matches Bella Italia
    userId: 'user-1',
    date: '2025-06-15',
    time: '19:00',
    partySize: 2,
    status: BookingStatus.CONFIRMED,
    specialRequests: 'Anniversary dinner, window table if possible',
    createdAt: '2025-06-10T14:30:00Z',
  },
  // ... update all other booking IDs and restaurantIds to match
];