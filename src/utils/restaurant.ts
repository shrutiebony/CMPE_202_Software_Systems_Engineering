export interface Restaurant {
  id: string;
  name: string;
  description: string;
  cuisine: string[];
  priceRange: 1 | 2 | 3 | 4; // $ to $$$$
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    latitude: number;
    longitude: number;
  };
  phone: string;
  email: string;
  website?: string;
  hours: {
    [key: string]: { open: string; close: string } | null; // null means closed
  };
  images: string[];
  rating: number;
  reviewCount: number;
  features: string[];
  ownerId: string;
  approved: boolean;
  bookingsToday: number;
  createdAt: string;
  updatedAt: string;
}

export interface RestaurantSearchParams {
  date?: string;
  time?: string;
  people?: number;
  location?: string;
  cuisine?: string;
  price?: string;
}

export interface TimeSlot {
  time: string;
  available: boolean;
}

export interface AvailableTable {
  restaurantId: string;
  date: string;
  time: string;
  tableSize: number;
  tableId: string;
}