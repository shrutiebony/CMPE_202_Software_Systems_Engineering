import { create } from 'zustand';
import { Booking, BookingStatus } from '../types/booking';
import { supabase } from '../lib/supabase';

interface BookingStore {
  bookings: Booking[];
  userBookings: Booking[];
  restaurantBookings: Booking[];
  isLoading: boolean;
  error: string | null;
  
  fetchUserBookings: (userId: string) => Promise<void>;
  fetchRestaurantBookings: (restaurantId: string) => Promise<void>;
  createBooking: (bookingData: {
    restaurantId: string;
    date: string;
    time: string;
    guests: number;
    notes?: string;
  }) => Promise<Booking | null>;
  confirmBooking: (bookingId: string) => Promise<boolean>;
  cancelBooking: (bookingId: string) => Promise<boolean>;
}

export const useBookingStore = create<BookingStore>((set, get) => ({
  bookings: [],
  userBookings: [],
  restaurantBookings: [],
  isLoading: false,
  error: null,
  
  fetchUserBookings: async (userId: string) => {
    try {
      set({ isLoading: true });
      
      const { data: bookings, error } = await supabase
        .from('bookings')
        .select(`
          id,
          restaurant_id,
          customer_id,
          date,
          time,
          party_size,
          status,
          special_requests,
          created_at,
          restaurant:restaurants (
            id,
            name,
            description,
            cuisine,
            price_range,
            images,
            street_address,
            city,
            state
          )
        `)
        .eq('customer_id', userId)
        .order('date', { ascending: true });
      
      if (error) throw error;

      const transformedBookings = bookings.map(booking => ({
        id: booking.id,
        restaurantId: booking.restaurant_id,
        userId: booking.customer_id,
        date: booking.date,
        time: booking.time,
        partySize: booking.party_size,
        status: booking.status as BookingStatus,
        specialRequests: booking.special_requests,
        createdAt: booking.created_at,
        restaurant: booking.restaurant ? {
          id: booking.restaurant.id,
          name: booking.restaurant.name,
          description: booking.restaurant.description,
          cuisine: booking.restaurant.cuisine,
          priceRange: booking.restaurant.price_range,
          images: booking.restaurant.images,
          address: {
            street: booking.restaurant.street_address,
            city: booking.restaurant.city,
            state: booking.restaurant.state
          }
        } : undefined
      }));
      
      set({ 
        userBookings: transformedBookings,
        isLoading: false 
      });
    } catch (error) {
      console.error('Error fetching bookings:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch your bookings',
        isLoading: false 
      });
    }
  },
  
  fetchRestaurantBookings: async (restaurantId: string) => {
    try {
      set({ isLoading: true });
      
      const { data: bookings, error } = await supabase
        .from('bookings')
        .select(`
          *,
          customer:profiles(
            id,
            full_name,
            email,
            avatar_url,
            customer_rating
          )
        `)
        .eq('restaurant_id', restaurantId)
        .order('date', { ascending: true });
      
      if (error) throw error;
      
      set({ 
        restaurantBookings: bookings,
        isLoading: false 
      });
    } catch (error) {
      console.error('Error fetching restaurant bookings:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch restaurant bookings',
        isLoading: false 
      });
    }
  },
  
  createBooking: async (bookingData) => {
    try {
      set({ isLoading: true });

      // Get the current user's session
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError || !session) {
        throw new Error('You must be logged in to create a booking');
      }

      const { data: booking, error } = await supabase
        .from('bookings')
        .insert([{
          restaurant_id: bookingData.restaurantId,
          customer_id: session.user.id,
          date: bookingData.date,
          time: bookingData.time,
          party_size: bookingData.guests,
          status: BookingStatus.PENDING,
          special_requests: bookingData.notes
        }])
        .select(`
          id,
          restaurant_id,
          customer_id,
          date,
          time,
          party_size,
          status,
          special_requests,
          created_at,
          restaurant:restaurants (
            id,
            name,
            description,
            cuisine,
            price_range,
            images,
            street_address,
            city,
            state
          )
        `)
        .single();
      
      if (error) throw error;

      const transformedBooking = {
        id: booking.id,
        restaurantId: booking.restaurant_id,
        userId: booking.customer_id,
        date: booking.date,
        time: booking.time,
        partySize: booking.party_size,
        status: booking.status as BookingStatus,
        specialRequests: booking.special_requests,
        createdAt: booking.created_at,
        restaurant: booking.restaurant ? {
          id: booking.restaurant.id,
          name: booking.restaurant.name,
          description: booking.restaurant.description,
          cuisine: booking.restaurant.cuisine,
          priceRange: booking.restaurant.price_range,
          images: booking.restaurant.images,
          address: {
            street: booking.restaurant.street_address,
            city: booking.restaurant.city,
            state: booking.restaurant.state
          }
        } : undefined
      };
      
      // Automatically confirm the booking
      await get().confirmBooking(transformedBooking.id);
      
      set(state => ({ 
        bookings: [...state.bookings, transformedBooking],
        userBookings: [...state.userBookings, transformedBooking],
        isLoading: false 
      }));
      
      return transformedBooking;
    } catch (error) {
      console.error('Error creating booking:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Failed to create booking',
        isLoading: false 
      });
      return null;
    }
  },

  confirmBooking: async (bookingId: string) => {
    try {
      set({ isLoading: true });
      
      const { error } = await supabase
        .from('bookings')
        .update({ status: BookingStatus.CONFIRMED })
        .eq('id', bookingId);
      
      if (error) throw error;
      
      // Update local state
      set(state => {
        const updateBookings = (bookings: Booking[]) =>
          bookings.map(b => 
            b.id === bookingId ? { ...b, status: BookingStatus.CONFIRMED } : b
          );
        
        return {
          bookings: updateBookings(state.bookings),
          userBookings: updateBookings(state.userBookings),
          restaurantBookings: updateBookings(state.restaurantBookings),
          isLoading: false
        };
      });
      
      return true;
    } catch (error) {
      console.error('Error confirming booking:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Failed to confirm booking',
        isLoading: false 
      });
      return false;
    }
  },
  
  cancelBooking: async (bookingId: string) => {
    try {
      set({ isLoading: true });
      
      // First, get the current user's session
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError || !session) {
        throw new Error('You must be logged in to cancel a booking');
      }

      // Update the booking status to cancelled
      const { error: updateError } = await supabase
        .from('bookings')
        .update({ 
          status: BookingStatus.CANCELLED 
        })
        .eq('id', bookingId)
        .eq('customer_id', session.user.id); // Ensure user can only cancel their own bookings
      
      if (updateError) throw updateError;
      
      // Update local state
      set(state => {
        const updateBookings = (bookings: Booking[]) =>
          bookings.map(b => 
            b.id === bookingId ? { ...b, status: BookingStatus.CANCELLED } : b
          );
        
        return {
          bookings: updateBookings(state.bookings),
          userBookings: updateBookings(state.userBookings),
          restaurantBookings: updateBookings(state.restaurantBookings),
          isLoading: false
        };
      });
      
      // Refresh user bookings to get updated stats
      await get().fetchUserBookings(session.user.id);
      
      return true;
    } catch (error) {
      console.error('Error cancelling booking:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Failed to cancel booking',
        isLoading: false 
      });
      return false;
    }
  }
}));