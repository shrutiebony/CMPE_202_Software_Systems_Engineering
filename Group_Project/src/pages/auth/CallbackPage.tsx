import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

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

function CallbackPage() {
  const navigate = useNavigate();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const { data: { session }, error } = await fetchWithRetry(() =>
          supabase.auth.getSession()
        );
        
        if (error) {
          console.error('Session error:', error);
          throw error;
        }
        
        if (session?.user) {
          console.log('User authenticated:', session.user.id);
          
          // Check if profile exists
          const { data: profile, error: profileError } = await fetchWithRetry(() =>
            supabase
              .from('profiles')
              .select('*')
              .eq('id', session.user.id)
              .single()
          );
            
          if (profileError && profileError.code !== 'PGRST116') {
            console.error('Profile fetch error:', profileError);
            throw profileError;
          }
            
          if (!profile) {
            console.log('Creating new profile for user');
            // Create profile for new Google users
            const { error: insertError } = await fetchWithRetry(() =>
              supabase
                .from('profiles')
                .upsert([
                  {
                    id: session.user.id,
                    email: session.user.email,
                    full_name: session.user.user_metadata.full_name,
                    avatar_url: session.user.user_metadata.avatar_url,
                    role: 'customer'
                  }
                ], { onConflict: 'id' })
            );
              
            if (insertError) {
              console.error('Profile creation error:', insertError);
              throw insertError;
            }
          }
          
          navigate('/');
        } else {
          console.error('No session found');
          navigate('/login');
        }
      } catch (error) {
        console.error('Error in auth callback:', error);
        navigate('/login');
      }
    };

    handleCallback();
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <LoadingSpinner />
    </div>
  );
}

export default CallbackPage;