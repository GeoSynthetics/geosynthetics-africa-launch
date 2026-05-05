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

const externalSupabaseUrl = "https://fsfwjwyzrtgayujmguvd.supabase.co";
const externalSupabasePublishableKey =
  "sb_publishable_Vjm9iFsH36nX7LsoRSRAgA_sgBYzVf1";

export default defineConfig(({ mode }) => {
  // Load VITE_* env vars from .env files (same as Lovable config does)
  const loadedEnv = loadEnv(mode, process.cwd(), "VITE_");
  const envDefine: Record<string, string> = {};
  for (const [key, value] of Object.entries(loadedEnv)) {
    envDefine[`import.meta.env.${key}`] = JSON.stringify(value);
  }

  return {
    define: {
      ...envDefine,
      "import.meta.env.VITE_SUPABASE_URL": JSON.stringify(externalSupabaseUrl),
      "import.meta.env.VITE_SUPABASE_PROJECT_URL":
        JSON.stringify(externalSupabaseUrl),
      "import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY": JSON.stringify(
        externalSupabasePublishableKey,
      ),
      "import.meta.env.VITE_SUPABASE_PUBLISABLE_KEY": JSON.stringify(
        externalSupabasePublishableKey,
      ),
      "import.meta.env.VITE_SUPABASE_PROJECT_ID":
        JSON.stringify("fsfwjwyzrtgayujmguvd"),
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
      nitro(),
      viteReact(),
    ],
  };
});
