import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing Supabase environment variables. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.'
  );
}

/** Supabase client instance configured with public anon key. */
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Returns the Supabase client.
 * Placeholder for future server-side usage where a service-role key would be
 * used instead of the anon key.
 */
export function getServiceRole() {
  return supabase;
}
