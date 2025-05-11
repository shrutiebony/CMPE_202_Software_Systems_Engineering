import { create } from 'zustand';
import { Review } from '../types/review';
import { supabase } from '../lib/supabase';

// UUID validation regex
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

interface ReviewStore {
  reviews: Review[];
  restaurantReviews: Review[];
  isLoading: boolean;
  error: string | null;
  
  fetchRestaurantReviews: (restaurantId: string) => Promise<void>;
  getReviewsByRestaurantId: (restaurantId: string) => Promise<Review[]>;
  addReview: (reviewData: Omit<Review, 'id' | 'date'>) => Promise<Review | null>;
}

export const useReviewStore = create<ReviewStore>((set, get) => ({
  reviews: [],
  restaurantReviews: [],
  isLoading: false,
  error: null,
  
  fetchRestaurantReviews: async (restaurantId: string) => {
    try {
      // Validate UUID format
      if (!UUID_REGEX.test(restaurantId)) {
        throw new Error('Invalid restaurant ID format');
      }

      set({ isLoading: true });
      
      const { data: reviews, error } = await supabase
        .from('reviews')
        .select(`
          *,
          customer:profiles(
            id,
            full_name,
            avatar_url
          )
        `)
        .eq('restaurant_id', restaurantId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      const formattedReviews = reviews.map(review => ({
        id: review.id,
        restaurantId: review.restaurant_id,
        userId: review.customer_id,
        userName: review.customer?.full_name || 'Anonymous',
        userAvatar: review.customer?.avatar_url || null,
        rating: review.rating,
        text: review.text,
        date: review.created_at
      }));
      
      set({ 
        restaurantReviews: formattedReviews,
        isLoading: false 
      });
    } catch (error) {
      console.error('Error fetching reviews:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch reviews. Please try again later.',
        isLoading: false 
      });
    }
  },

  getReviewsByRestaurantId: async (restaurantId: string) => {
    try {
      // Validate UUID format
      if (!UUID_REGEX.test(restaurantId)) {
        throw new Error('Invalid restaurant ID format');
      }

      const { data: reviews, error } = await supabase
        .from('reviews')
        .select(`
          *,
          customer:profiles(
            id,
            full_name,
            avatar_url
          )
        `)
        .eq('restaurant_id', restaurantId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      return reviews.map(review => ({
        id: review.id,
        restaurantId: review.restaurant_id,
        userId: review.customer_id,
        userName: review.customer?.full_name || 'Anonymous',
        userAvatar: review.customer?.avatar_url || null,
        rating: review.rating,
        text: review.text,
        date: review.created_at
      }));
    } catch (error) {
      console.error('Error fetching reviews:', error);
      return [];
    }
  },
  
  addReview: async (reviewData) => {
    try {
      // Validate UUID format for both restaurant and user IDs
      if (!UUID_REGEX.test(reviewData.restaurantId) || !UUID_REGEX.test(reviewData.userId)) {
        throw new Error('Invalid restaurant or user ID format');
      }

      set({ isLoading: true });
      
      const { data: review, error } = await supabase
        .from('reviews')
        .insert([{
          restaurant_id: reviewData.restaurantId,
          customer_id: reviewData.userId,
          rating: reviewData.rating,
          text: reviewData.text
        }])
        .select(`
          *,
          customer:profiles(
            id,
            full_name,
            avatar_url
          )
        `)
        .single();
      
      if (error) throw error;
      
      const formattedReview = {
        id: review.id,
        restaurantId: review.restaurant_id,
        userId: review.customer_id,
        userName: review.customer?.full_name || 'Anonymous',
        userAvatar: review.customer?.avatar_url || null,
        rating: review.rating,
        text: review.text,
        date: review.created_at
      };
      
      set(state => ({ 
        reviews: [...state.reviews, formattedReview],
        restaurantReviews: [...state.restaurantReviews, formattedReview],
        isLoading: false 
      }));
      
      return formattedReview;
    } catch (error) {
      console.error('Error adding review:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Failed to add review. Please try again later.',
        isLoading: false 
      });
      return null;
    }
  }
}));