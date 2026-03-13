import { createClient } from "@supabase/supabase-js";

/**
 * Server-side Supabase client with service role key.
 * Use ONLY in API routes or server components - never expose to the client.
 * Bypasses RLS and can access auth.admin.
 */
export function createServerSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) {
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  }
  return createClient(url, serviceKey, { auth: { autoRefreshToken: false, persistSession: false } });
}
