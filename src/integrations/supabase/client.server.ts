import { createClient } from "@supabase/supabase-js";

// Server-only admin client. NEVER import this from client/component code.
// Service role key bypasses RLS — only use in trusted server functions or
// verified webhook handlers.
const supabaseUrl = process.env.SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  throw new Error(
    "Missing server Supabase env vars: SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY",
  );
}

export const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});
