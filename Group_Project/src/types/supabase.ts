export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          role: 'customer' | 'restaurant_manager' | 'admin'
          full_name: string | null
          avatar_url: string | null
          phone: string | null
          email: string
          visit_count: number
          last_visit: string | null
          is_regular: boolean
          customer_rating: number | null
          total_spent: number
          cancelled_bookings: number
          no_show_count: number
          special_notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          role?: 'customer' | 'restaurant_manager' | 'admin'
          full_name?: string | null
          avatar_url?: string | null
          phone?: string | null
          email: string
          visit_count?: number
          last_visit?: string | null
          is_regular?: boolean
          customer_rating?: number | null
          total_spent?: number
          cancelled_bookings?: number
          no_show_count?: number
          special_notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          role?: 'customer' | 'restaurant_manager' | 'admin'
          full_name?: string | null
          avatar_url?: string | null
          phone?: string | null
          email?: string
          visit_count?: number
          last_visit?: string | null
          is_regular?: boolean
          customer_rating?: number | null
          total_spent?: number
          cancelled_bookings?: number
          no_show_count?: number
          special_notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      restaurants: {
        Row: {
          id: string
          owner_id: string | null
          name: string
          description: string | null
          cuisine: string[]
          price_range: number
          street_address: string
          city: string
          state: string
          postal_code: string
          country: string
          latitude: number | null
          longitude: number | null
          phone: string
          email: string
          website: string | null
          images: string[]
          features: string[]
          approved: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          owner_id?: string | null
          name: string
          description?: string | null
          cuisine?: string[]
          price_range: number
          street_address: string
          city: string
          state: string
          postal_code: string
          country?: string
          latitude?: number | null
          longitude?: number | null
          phone: string
          email: string
          website?: string | null
          images?: string[]
          features?: string[]
          approved?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          owner_id?: string | null
          name?: string
          description?: string | null
          cuisine?: string[]
          price_range?: number
          street_address?: string
          city?: string
          state?: string
          postal_code?: string
          country?: string
          latitude?: number | null
          longitude?: number | null
          phone?: string
          email?: string
          website?: string | null
          images?: string[]
          features?: string[]
          approved?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      restaurant_hours: {
        Row: {
          id: string
          restaurant_id: string
          day: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday'
          open_time: string
          close_time: string
          is_closed: boolean
        }
        Insert: {
          id?: string
          restaurant_id: string
          day: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday'
          open_time: string
          close_time: string
          is_closed?: boolean
        }
        Update: {
          id?: string
          restaurant_id?: string
          day?: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday'
          open_time?: string
          close_time?: string
          is_closed?: boolean
        }
      }
      tables: {
        Row: {
          id: string
          restaurant_id: string
          name: string
          capacity: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          restaurant_id: string
          name: string
          capacity: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          restaurant_id?: string
          name?: string
          capacity?: number
          created_at?: string
          updated_at?: string
        }
      }
      bookings: {
        Row: {
          id: string
          restaurant_id: string
          table_id: string | null
          customer_id: string
          date: string
          time: string
          party_size: number
          status: 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'no_show'
          special_requests: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          restaurant_id: string
          table_id?: string | null
          customer_id: string
          date: string
          time: string
          party_size: number
          status?: 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'no_show'
          special_requests?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          restaurant_id?: string
          table_id?: string | null
          customer_id?: string
          date?: string
          time?: string
          party_size?: number
          status?: 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'no_show'
          special_requests?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      reviews: {
        Row: {
          id: string
          restaurant_id: string
          customer_id: string
          rating: number
          text: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          restaurant_id: string
          customer_id: string
          rating: number
          text: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          restaurant_id?: string
          customer_id?: string
          rating?: number
          text?: string
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      customer_stats: {
        Row: {
          id: string
          full_name: string
          email: string
          visit_count: number
          last_visit: string | null
          is_regular: boolean
          customer_rating: number | null
          total_spent: number
          cancelled_bookings: number
          no_show_count: number
          special_notes: string | null
          total_bookings: number
          completed_bookings: number
        }
      }
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      user_role: 'customer' | 'restaurant_manager' | 'admin'
      booking_status: 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'no_show'
      day_of_week: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday'
    }
  }
}