import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
dotenv.config();

const { SUPABASE_URL, SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY } = process.env;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.warn(
    "⚠️  SUPABASE_URL / SUPABASE_ANON_KEY not set — Supabase features disabled. " +
    "Using in-memory fallback for development."
  );
}

// Public client (respects RLS) — use for normal queries
export const supabase = SUPABASE_URL
  ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  : null;

// Service-role client (bypasses RLS) — use only for server-side operations
export const supabaseAdmin = SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY
  ? createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
      auth: { persistSession: false },
    })
  : null;

/**
 * Returns the best available Supabase client.
 * Falls back gracefully when Supabase is not configured.
 */
export function getClient(useAdmin = false) {
  if (useAdmin && supabaseAdmin) return supabaseAdmin;
  if (supabase) return supabase;
  return null;
}
