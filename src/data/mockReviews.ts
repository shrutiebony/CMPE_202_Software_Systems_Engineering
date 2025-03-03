import { Review } from '../types/review';

export const mockReviews: Review[] = [
  {
    id: '123e4567-e89b-12d3-a456-426614174200',
    restaurantId: '123e4567-e89b-12d3-a456-426614174000', // matches Bella Italia
    userId: 'user-1',
    userName: 'John D.',
    userAvatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    rating: 5,
    text: 'Amazing authentic Italian food! The pasta is homemade and you can taste the difference. Service was excellent and the atmosphere was charming. Will definitely return!',
    date: '2025-05-10T18:30:00Z',
  },
  // ... update all other review IDs and restaurantIds to match
];