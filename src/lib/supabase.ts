import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

function initSupabase(): SupabaseClient | null {
  try {
    if (!supabaseUrl || !supabaseKey || !supabaseUrl.startsWith('http')) {
      return null;
    }
    return createClient(supabaseUrl, supabaseKey);
  } catch (e) {
    console.warn('Supabase client init failed:', e);
    return null;
  }
}

export const supabase = initSupabase();

