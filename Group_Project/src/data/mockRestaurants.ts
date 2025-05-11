import { Restaurant } from '../types/restaurant';

export const mockRestaurants: Restaurant[] = [
  // Italian Restaurants
  {
    id: '123e4567-e89b-12d3-a456-426614174000', // Bella Italia
    name: 'Bella Italia',
    description: 'Authentic Italian cuisine in a cozy atmosphere with traditional recipes passed down through generations.',
    cuisine: ['Italian', 'Mediterranean'],
    priceRange: 2,
    address: {
      street: '123 Main Street',
      city: 'San Francisco',
      state: 'CA',
      zipCode: '94105',
      country: 'USA',
      latitude: 37.7749,
      longitude: -122.4194,
    },
    phone: '(415) 555-1234',
    email: 'info@bellaitalia.com',
    website: 'https://bellaitalia.example.com',
    hours: {
      monday: { open: '11:00', close: '22:00' },
      tuesday: { open: '11:00', close: '22:00' },
      wednesday: { open: '11:00', close: '22:00' },
      thursday: { open: '11:00', close: '23:00' },
      friday: { open: '11:00', close: '23:00' },
      saturday: { open: '12:00', close: '23:00' },
      sunday: { open: '12:00', close: '21:00' },
    },
    images: [
      'https://images.pexels.com/photos/67468/pexels-photo-67468.jpeg',
      'https://images.pexels.com/photos/1579739/pexels-photo-1579739.jpeg',
      'https://images.pexels.com/photos/2233729/pexels-photo-2233729.jpeg',
    ],
    rating: 4.7,
    reviewCount: 284,
    features: ['Outdoor Seating', 'Takeout', 'Vegetarian Options', 'Vegan Options', 'Wine Bar'],
    ownerId: 'user-2',
    approved: true,
    bookingsToday: 18,
    createdAt: '2023-01-15T08:00:00Z',
    updatedAt: '2023-06-20T14:30:00Z',
  },
  // ... rest of the restaurants with their updated UUIDs
];