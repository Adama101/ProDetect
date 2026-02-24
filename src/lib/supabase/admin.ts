import { createClient } from '@supabase/supabase-js';

/**
 * Server-only Supabase client with service role key.
 * Use for API routes that need full CRUD (bypasses RLS).
 * Never expose this client or SUPABASE_SERVICE_ROLE_KEY to the browser.
 */
export function getSupabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceRoleKey) {
    throw new Error(
      'Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY. Set them in .env to use Supabase for data.'
    );
  }
  return createClient(url, serviceRoleKey, {
    auth: { persistSession: false },
  });
}

/** Use Supabase for data when URL and service role key are set. */
export function isSupabaseConfigured(): boolean {
  return !!(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );
}
