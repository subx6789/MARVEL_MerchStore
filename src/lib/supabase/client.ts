import { createClient as createSupabaseClient } from "@supabase/supabase-js";

// ─────────────────────────────────────────────────────────
// Supabase Database & Realtime Client
// Strictly used for PostgreSQL database queries & Realtime subscriptions
// Auth is handled via Better-Auth and Storage via ImageKit CDN
// ─────────────────────────────────────────────────────────

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://your-project.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "your-anon-key";

let clientInstance: ReturnType<typeof createSupabaseClient> | null = null;

export function createClient() {
  if (clientInstance) return clientInstance;

  clientInstance = createSupabaseClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
    realtime: {
      params: {
        eventsPerSecond: 10,
      },
    },
  });

  return clientInstance;
}
