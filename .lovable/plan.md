
# Connect existing Supabase project (manual, no Lovable Cloud)

Wire your blank Supabase project into the app using the URL + publishable key you provided, with a server-side admin client and an auth middleware that the upcoming schema work will rely on.

## What I'll do

1. **Install SDK** (already verified): `bun add @supabase/supabase-js @supabase/ssr`. Note: the shadcn `@supabase/supabase-client-react-router` registry component is for plain React Router and is incompatible with TanStack Start, so I'll skip it and create equivalent TanStack-native files instead.

2. **Create `.env`** with the values you supplied:
   ```
   VITE_SUPABASE_URL=https://fsfwjwyzrtgayujmguvd.supabase.co
   VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_Vjm9iFsH36nX7LsoRSRAgA_sgBYzVf1
   SUPABASE_URL=https://fsfwjwyzrtgayujmguvd.supabase.co
   SUPABASE_PUBLISHABLE_KEY=sb_publishable_Vjm9iFsH36nX7LsoRSRAgA_sgBYzVf1
   ```
   `SUPABASE_SERVICE_ROLE_KEY` is intentionally NOT in this file — see step 5.

3. **`src/integrations/supabase/client.ts`** — browser client using the publishable key, SSR-safe (only persists session in the browser).

4. **`src/integrations/supabase/client.server.ts`** — admin client using the service role key, server-only (never imported from components). Throws clearly if the env var is missing.

5. **`src/integrations/supabase/auth-middleware.ts`** — `requireSupabaseAuth` middleware for `createServerFn`:
   - Client phase: reads the access token from the browser Supabase session and forwards it via `sendContext`.
   - Server phase: verifies the token with `supabase.auth.getUser(bearer)`, builds a Supabase client scoped to that user (so RLS applies as them), and exposes `{ supabase, userId, claims }` in handler context.
   - Falls back to the `Authorization` header if the client middleware didn't run.

6. **No route changes yet** — auth UI, admin UI, and the database schema land in the next loops once this plumbing is in.

## What you need to do

- **Add the service role key as a secret.** After you approve and I write the files, you'll see a prompt to paste `SUPABASE_SERVICE_ROLE_KEY` (Supabase Dashboard → Project Settings → API → `service_role`). I'll request it via the secrets tool so it lives only in the server runtime, never in `.env` or the bundle.
- **In the Supabase dashboard** (you can do this any time before launch):
  - Authentication → Providers → Email: enable, and turn on **Leaked Password Protection (HIBP)**.
  - Authentication → URL Configuration → Site URL: set to your preview URL (`https://id-preview--5b18cafe-9c07-42be-8f12-72e4683fbeac.lovable.app`) and add it to Redirect URLs.

## After this lands

Next loop I'll execute the full PRD schema plan from the previous message — roles + profiles trigger, catalogue, applications, services, manufacturers, case studies, resources, quote/BOQ pipeline, FTS search, and storage buckets — all as Supabase migrations against your project.
