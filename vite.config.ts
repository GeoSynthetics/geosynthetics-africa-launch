// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - tanstackStart, viteReact, tailwindcss, tsConfigPaths, cloudflare (build-only),
//     componentTagger (dev-only), VITE_* env injection, @ path alias, React/TanStack dedupe,
//     error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... } }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

const externalSupabaseUrl = "https://fsfwjwyzrtgayujmguvd.supabase.co";
const externalSupabasePublishableKey = "sb_publishable_Vjm9iFsH36nX7LsoRSRAgA_sgBYzVf1";

export default defineConfig({
  vite: {
    define: {
      "import.meta.env.VITE_SUPABASE_URL": JSON.stringify(externalSupabaseUrl),
      "import.meta.env.VITE_SUPABASE_PROJECT_URL": JSON.stringify(externalSupabaseUrl),
      "import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY": JSON.stringify(externalSupabasePublishableKey),
      "import.meta.env.VITE_SUPABASE_PUBLISABLE_KEY": JSON.stringify(externalSupabasePublishableKey),
      "import.meta.env.VITE_SUPABASE_PROJECT_ID": JSON.stringify("fsfwjwyzrtgayujmguvd"),
    },
  },
});
