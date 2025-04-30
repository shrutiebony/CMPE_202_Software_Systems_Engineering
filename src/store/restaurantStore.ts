import { create } from 'zustand';
import { Restaurant, RestaurantSearchParams, AvailableTable } from '../types/restaurant';
import { supabase } from '../lib/supabase';
import { generateTimeSlots } from '../utils/dateUtils';

interface RestaurantStore {
  restaurants: Restaurant[];
  filteredRestaurants: Restaurant[];
  selectedRestaurant: Restaurant | null;
  isLoading: boolean;
  error: string | null;
  
  fetchRestaurants: () => Promise<void>;
  searchRestaurants: (params: RestaurantSearchParams) => Promise<void>;
  getRestaurantById: (id: string) => Promise<Restaurant | null>;
  getAvailableTimes: (restaurantId: string, date: string, partySize: number) => string[];
  checkAvailability: (restaurantId: string, date: string, time: string, partySize: number) => Promise<AvailableTable | null>;
}

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const fetchWithRetry = async <T>(
  fn: () => Promise<T>,
  retries = MAX_RETRIES,
  delay = RETRY_DELAY
): Promise<T> => {
  try {
    return await fn();
  } catch (error) {
    if (retries > 0) {
      await wait(delay);
      return fetchWithRetry(fn, retries - 1, delay * 2);
    }
    throw error;
  }
};

export const useRestaurantStore = create<RestaurantStore>((set, get) => ({
  restaurants: [],
  filteredRestaurants: [],
  selectedRestaurant: null,
  isLoading: false,
  error: null,
  
  fetchRestaurants: async () => {
    try {
      set({ isLoading: true });
      
      const { data: restaurants, error } = await fetchWithRetry(async () => 
        await supabase
          .from('restaurants')
          .select(`
            *,
            hours:restaurant_hours(*)
          `)
          .order('created_at', { ascending: false })
      );
      
      if (error) throw error;
      
      set({ 
        restaurants: restaurants || [],
        filteredRestaurants: restaurants || [],
        isLoading: false 
      });
    } catch (error) {
      console.error('Error fetching restaurants:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch restaurants',
        isLoading: false 
      });
    }
  },
  
  searchRestaurants: async (params: RestaurantSearchParams) => {
    try {
      set({ isLoading: true });
      
      const { data: restaurants, error } = await fetchWithRetry(async () => {
        let query = supabase
          .from('restaurants')
          .select(`
            *,
            hours:restaurant_hours(*)
          `)
          .eq('approved', true);
        
        if (params.cuisine) {
          query = query.contains('cuisine', [params.cuisine]);
        }
        
        if (params.location) {
          query = query.or(`city.ilike.%${params.location}%,name.ilike.%${params.location}%`);
        }
        
        if (params.price) {
          query = query.eq('price_range', params.price.length);
        }
        
        return await query;
      });
      
      if (error) throw error;
      
      set({ 
        filteredRestaurants: restaurants || [],
        isLoading: false 
      });
    } catch (error) {
      console.error('Error searching restaurants:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Failed to search restaurants',
        isLoading: false 
      });
    }
  },
  
  getRestaurantById: async (id: string) => {
    try {
      set({ isLoading: true });
      
      const { data: restaurant, error } = await fetchWithRetry(async () =>
        await supabase
          .from('restaurants')
          .select(`
            *,
            hours:restaurant_hours(*)
          `)
          .eq('id', id)
          .single()
      );
      
      if (error) throw error;
      
      if (!restaurant) {
        throw new Error('Restaurant not found');
      }
      
      set({ 
        selectedRestaurant: restaurant,
        isLoading: false 
      });
      
      return restaurant;
    } catch (error) {
      console.error('Error fetching restaurant:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch restaurant details',
        isLoading: false 
      });
      return null;
    }
  },
  
  getAvailableTimes: (restaurantId: string, date: string, partySize: number) => {
    const restaurant = get().restaurants.find(r => r.id === restaurantId);
    
    if (!restaurant?.hours) return [];
    
    const dayOfWeek = new Date(date).toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
    const dayHours = restaurant.hours.find(h => h.day === dayOfWeek && !h.is_closed);
    
    if (!dayHours) return [];
    
    return generateTimeSlots(dayHours.open_time, dayHours.close_time, 30);
  },
  
  checkAvailability: async (restaurantId: string, date: string, time: string, partySize: number) => {
    try {
      const { data: tables, error } = await fetchWithRetry(async () =>
        await supabase
          .from('tables')
          .select('*')
          .eq('restaurant_id', restaurantId)
          .gte('capacity', partySize)
          .order('capacity')
      );
      
      if (error) throw error;
      
      if (!tables || tables.length === 0) return null;
      
      // Check existing bookings for this time slot
      const { data: bookings, error: bookingsError } = await fetchWithRetry(async () =>
        await supabase
          .from('bookings')
          .select('table_id')
          .eq('restaurant_id', restaurantId)
          .eq('date', date)
          .eq('time', time)
          .in('status', ['pending', 'confirmed'])
      );
      
      if (bookingsError) throw bookingsError;
      
      // Find first available table
      const bookedTableIds = bookings?.map(b => b.table_id) || [];
      const availableTable = tables.find(t => !bookedTableIds.includes(t.id));
      
      if (!availableTable) return null;
      
      return {
        restaurantId,
        date,
        time,
        tableSize: partySize,
        tableId: availableTable.id
      };
    } catch (error) {
      console.error('Error checking availability:', error);
      return null;
    }
  }
}));