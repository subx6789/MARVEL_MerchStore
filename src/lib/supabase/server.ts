import { createClient as createSupabaseClient } from "@supabase/supabase-js";

// ─────────────────────────────────────────────────────────
// Supabase Database Server Client
// Server-side PostgreSQL database queries & Drizzle ORM integration
// ─────────────────────────────────────────────────────────

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://your-project.supabase.co";
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "your-key";

export function createServerClient() {
  return createSupabaseClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      persistSession: false,
    },
  });
}
