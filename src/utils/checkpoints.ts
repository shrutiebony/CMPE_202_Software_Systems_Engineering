import { supabase } from '../lib/supabase';

export interface Checkpoint {
  id: string;
  name: string;
  description: string;
  timestamp: string;
  metadata: {
    version: string;
    features: string[];
    lastMigration: string;
  };
}

export async function createCheckpoint(name: string, description: string): Promise<Checkpoint | null> {
  try {
    const { data: checkpoint, error } = await supabase
      .from('checkpoints')
      .insert([{
        name,
        description,
        timestamp: new Date().toISOString(),
        metadata: {
          version: '1.0.0',
          features: [
            'Admin dashboard',
            'Restaurant management',
            'User profiles',
            'Booking system',
            'Review system'
          ],
          lastMigration: '20250424230959_dark_delta'
        }
      }])
      .select()
      .single();

    if (error) throw error;
    return checkpoint;
  } catch (error) {
    console.error('Error creating checkpoint:', error);
    return null;
  }
}

export async function getCheckpoint(id: string): Promise<Checkpoint | null> {
  try {
    const { data: checkpoint, error } = await supabase
      .from('checkpoints')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return checkpoint;
  } catch (error) {
    console.error('Error fetching checkpoint:', error);
    return null;
  }
}