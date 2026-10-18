import { createClient } from "@supabase/supabase-js";

const supabaseUrl =
  // Static `import.meta.env.X` access only: optional chaining makes Vite inline the whole
  // env object (every VITE_* secret) into the browser bundle.
  (import.meta.env.VITE_SUPABASE_URL as string | undefined) ?? process.env.SUPABASE_URL;
const supabasePublishableKey =
  (import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string | undefined) ??
  process.env.SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !supabasePublishableKey) {
  throw new Error("Missing Supabase env vars: VITE_SUPABASE_URL / VITE_SUPABASE_PUBLISHABLE_KEY");
}

export const supabase = createClient(supabaseUrl, supabasePublishableKey, {
  auth: {
    persistSession: typeof window !== "undefined",
    autoRefreshToken: typeof window !== "undefined",
    detectSessionInUrl: typeof window !== "undefined",
  },
});
