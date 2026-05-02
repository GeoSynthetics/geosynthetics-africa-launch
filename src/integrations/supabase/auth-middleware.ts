import { createMiddleware } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import { createClient } from "@supabase/supabase-js";

/**
 * Server-function middleware that:
 *  1. Forwards the browser's Supabase access token to the server.
 *  2. Builds a Supabase client scoped to that user (RLS applies as the user).
 *  3. Verifies the token and exposes { supabase, userId, claims } in context.
 */
export const requireSupabaseAuth = createMiddleware({ type: "function" })
  .client(async ({ next }) => {
    let token: string | null = null;
    if (typeof window !== "undefined") {
      try {
        const { supabase } = await import("./client");
        const { data } = await supabase.auth.getSession();
        token = data.session?.access_token ?? null;
      } catch {
        token = null;
      }
    }
    return next({ sendContext: { accessToken: token } });
  })
  .server(async ({ next, context }) => {
    const accessToken =
      (context as { accessToken?: string | null }).accessToken ?? null;

    const supabaseUrl = process.env.SUPABASE_URL;
    const publishableKey = process.env.SUPABASE_PUBLISHABLE_KEY;
    if (!supabaseUrl || !publishableKey) {
      throw new Error("Server Supabase env vars are not configured");
    }

    // Fall back to Authorization header when client middleware didn't run.
    let bearer = accessToken;
    if (!bearer) {
      try {
        const req = getRequest();
        const header = req?.headers.get("authorization") ?? "";
        if (header.toLowerCase().startsWith("bearer ")) {
          bearer = header.slice(7);
        }
      } catch {
        // no request context — leave bearer as null
      }
    }

    if (!bearer) {
      throw new Error("Unauthorized: missing Supabase access token");
    }

    const supabase = createClient(supabaseUrl, publishableKey, {
      auth: { persistSession: false, autoRefreshToken: false },
      global: { headers: { Authorization: `Bearer ${bearer}` } },
    });

    const { data, error } = await supabase.auth.getUser(bearer);
    if (error || !data.user) {
      throw new Error("Unauthorized: invalid Supabase session");
    }

    return next({
      context: {
        supabase,
        userId: data.user.id,
        claims: data.user,
      },
    });
  });
