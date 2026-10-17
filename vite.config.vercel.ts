// Vercel-specific Vite config.
// This uses Nitro (which auto-detects the Vercel preset) instead of the
// Cloudflare plugin that @lovable.dev/vite-tanstack-config includes.
// The default vite.config.ts (Lovable/Cloudflare) is left untouched.

import { defineConfig, loadEnv } from "vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import { nitro } from "nitro/vite";
import viteReact from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import tsConfigPaths from "vite-tsconfig-paths";

const PUBLIC_CACHE = "public, max-age=0, s-maxage=300, stale-while-revalidate=86400";
const NO_STORE = "private, no-store";

export default defineConfig(({ mode }) => {
  // Load env variables (Vite loads from process.cwd() .env by default)
  const env = loadEnv(mode, process.cwd(), "");

  const supabaseUrl = env.VITE_SUPABASE_URL || env.SUPABASE_URL;
  const supabasePublishableKey = env.VITE_SUPABASE_PUBLISHABLE_KEY || env.SUPABASE_PUBLISHABLE_KEY;
  const supabaseProjectId = env.VITE_SUPABASE_PROJECT_ID;

  if (!supabaseUrl || !supabasePublishableKey) {
    throw new Error(
      "Missing required environment variables: VITE_SUPABASE_URL / VITE_SUPABASE_PUBLISHABLE_KEY. Please check your .env file.",
    );
  }

  // Load VITE_* env vars from .env files (same as Lovable config does)
  const loadedEnv = loadEnv(mode, process.cwd(), "VITE_");
  const envDefine: Record<string, string> = {};
  for (const [key, value] of Object.entries(loadedEnv)) {
    envDefine[`import.meta.env.${key}`] = JSON.stringify(value);
  }

  return {
    define: {
      ...envDefine,
      "import.meta.env.VITE_SUPABASE_URL": JSON.stringify(supabaseUrl),
      "import.meta.env.VITE_SUPABASE_PROJECT_URL": JSON.stringify(supabaseUrl),
      "import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY": JSON.stringify(supabasePublishableKey),
      "import.meta.env.VITE_SUPABASE_PUBLISABLE_KEY": JSON.stringify(supabasePublishableKey),
      "import.meta.env.VITE_SUPABASE_PROJECT_ID": JSON.stringify(supabaseProjectId || ""),
    },
    resolve: {
      alias: {
        "@": `${process.cwd()}/src`,
      },
      dedupe: [
        "react",
        "react-dom",
        "react/jsx-runtime",
        "react/jsx-dev-runtime",
        "@tanstack/react-query",
        "@tanstack/query-core",
      ],
    },
    plugins: [
      tsConfigPaths({ projects: ["./tsconfig.json"] }),
      tailwindcss(),
      tanstackStart(),
      nitro({
        // Serve public pages from Vercel's CDN: cached for 5 minutes, then
        // refreshed in the background, so visitors never wait for a full
        // server render. Site Builder edits appear within about 5 minutes.
        routeRules: {
          "/**": { headers: { "cache-control": PUBLIC_CACHE } },
          "/sitemap.xml": { headers: { "cache-control": "public, max-age=0, s-maxage=3600, stale-while-revalidate=86400" } },
          "/admin": { headers: { "cache-control": NO_STORE } },
          "/admin/**": { headers: { "cache-control": NO_STORE } },
          "/api/**": { headers: { "cache-control": NO_STORE } },
          "/_serverFn/**": { headers: { "cache-control": NO_STORE } },
          "/login": { headers: { "cache-control": NO_STORE } },
          "/signup": { headers: { "cache-control": NO_STORE } },
          "/profile": { headers: { "cache-control": NO_STORE } },
        },
      }),
      viteReact(),
    ],
  };
});
