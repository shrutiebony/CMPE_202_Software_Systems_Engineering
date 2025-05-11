export enum UserRole {
  CUSTOMER = 'customer',
  RESTAURANT_MANAGER = 'restaurant_manager',
  ADMIN = 'admin'
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
  visitCount: number;
  lastVisit?: Date;
  isRegular: boolean;
  customerRating?: number;
  totalSpent: number;
  cancelledBookings: number;
  noShowCount: number;
  specialNotes?: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface CustomerStats {
  totalBookings: number;
  completedBookings: number;
  cancelledBookings: number;
  noShowCount: number;
  totalSpent: number;
  lastVisit?: Date;
  customerRating?: number;
}