export interface Booking {
  id: string;
  restaurantId: string;
  userId: string;
  date: string;
  time: string;
  partySize: number;
  status: BookingStatus;
  specialRequests?: string;
  createdAt: string;
}

export enum BookingStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  NO_SHOW = 'no_show'
}