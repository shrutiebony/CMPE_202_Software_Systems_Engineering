import { create } from 'zustand';
import { User, UserRole, AuthState } from '../types/auth';
import { supabase } from '../lib/supabase';

interface AuthStore extends AuthState {
  login: (email: string, password: string) => Promise<User | null>;
  register: (name: string, email: string, password: string) => Promise<User | null>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000;

async function fetchWithRetry(fn: () => Promise<any>, retries = MAX_RETRIES): Promise<any> {
  try {
    return await fn();
  } catch (error) {
    if (retries > 0 && error instanceof TypeError && error.message === 'Failed to fetch') {
      await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
      return fetchWithRetry(fn, retries - 1);
    }
    throw error;
  }
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  
  login: async (email: string, password: string) => {
    try {
      const { data: { user }, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (authError) {
        if (authError.message === 'Invalid login credentials') {
          throw new Error('The email or password you entered is incorrect');
        } else if (authError.message.includes('network')) {
          throw new Error('Unable to connect to the server. Please check your internet connection');
        } else {
          throw new Error('An error occurred during login. Please try again');
        }
      }
      
      if (user) {
        try {
          const { data: profile, error: profileError } = await fetchWithRetry(() =>
            supabase
              .from('profiles')
              .select('*')
              .eq('id', user.id)
              .maybeSingle()
          );
          
          if (profileError) {
            throw new Error('Failed to load user profile');
          }
          
          if (profile) {
            const userData: User = {
              id: user.id,
              email: user.email!,
              name: profile.full_name || user.email!.split('@')[0],
              role: profile.role,
              avatar: profile.avatar_url,
              visitCount: profile.visit_count,
              lastVisit: profile.last_visit ? new Date(profile.last_visit) : undefined,
              isRegular: profile.is_regular,
              customerRating: profile.customer_rating,
              totalSpent: profile.total_spent,
              cancelledBookings: profile.cancelled_bookings,
              noShowCount: profile.no_show_count,
              specialNotes: profile.special_notes
            };
            
            set({ user: userData, isAuthenticated: true, isLoading: false });
            return userData;
          }
        } catch (profileError) {
          // If profile fetch fails, log out the user to maintain consistency
          await supabase.auth.signOut();
          throw new Error('Failed to load user profile. Please try again');
        }
      }
      
      return null;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },
  
  register: async (name: string, email: string, password: string) => {
    try {
      const { data: { user }, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name
          }
        }
      });
      
      if (signUpError) {
        if (signUpError.message.includes('email')) {
          throw new Error('This email is already registered');
        } else if (signUpError.message.includes('network')) {
          throw new Error('Unable to connect to the server. Please check your internet connection');
        } else {
          throw new Error('An error occurred during registration. Please try again');
        }
      }
      
      if (user) {
        const profileData = {
          id: user.id,
          full_name: name,
          email: email,
          role: UserRole.CUSTOMER,
          visit_count: 0,
          is_regular: false,
          total_spent: 0,
          cancelled_bookings: 0,
          no_show_count: 0
        };

        try {
          const { error: profileError } = await fetchWithRetry(() =>
            supabase
              .from('profiles')
              .upsert([profileData], { onConflict: 'id' })
          );
          
          if (profileError) {
            throw new Error('Failed to create user profile');
          }
          
          const userData: User = {
            id: user.id,
            email: email,
            name: name,
            role: UserRole.CUSTOMER,
            visitCount: 0,
            isRegular: false,
            totalSpent: 0,
            cancelledBookings: 0,
            noShowCount: 0
          };
          
          set({ user: userData, isAuthenticated: true, isLoading: false });
          return userData;
        } catch (profileError) {
          // If profile creation fails, delete the auth user to maintain consistency
          await supabase.auth.admin.deleteUser(user.id);
          throw new Error('Failed to complete registration. Please try again');
        }
      }
      
      return null;
    } catch (error) {
      console.error('Register error:', error);
      throw error;
    }
  },
  
  logout: async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        throw new Error('Failed to sign out. Please try again');
      }
      
      set({ user: null, isAuthenticated: false });
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  },
  
  checkAuth: async () => {
    try {
      const { data: { session }, error: sessionError } = await fetchWithRetry(() =>
        supabase.auth.getSession()
      );
      
      if (sessionError) {
        throw new Error('Failed to check authentication status');
      }
      
      if (session?.user) {
        try {
          const { data: profile, error: profileError } = await fetchWithRetry(() =>
            supabase
              .from('profiles')
              .select('*')
              .eq('id', session.user.id)
              .maybeSingle()
          );
          
          if (profileError) {
            throw new Error('Failed to load user profile');
          }
          
          if (profile) {
            const userData: User = {
              id: session.user.id,
              email: session.user.email!,
              name: profile.full_name || session.user.email!.split('@')[0],
              role: profile.role,
              avatar: profile.avatar_url,
              visitCount: profile.visit_count,
              lastVisit: profile.last_visit ? new Date(profile.last_visit) : undefined,
              isRegular: profile.is_regular,
              customerRating: profile.customer_rating,
              totalSpent: profile.total_spent,
              cancelledBookings: profile.cancelled_bookings,
              noShowCount: profile.no_show_count,
              specialNotes: profile.special_notes
            };
            
            set({ user: userData, isAuthenticated: true, isLoading: false });
            return;
          }
        } catch (error) {
          console.error('Profile fetch error:', error);
        }
      }
      
      set({ isLoading: false });
    } catch (error) {
      console.error('Auth check error:', error);
      set({ isLoading: false });
    }
  }
}));