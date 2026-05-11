# Lovable Change Log

This file records **major** changes made to the Geosynthetics Africa platform by the Lovable AI agent.

> **Rule:** the AI agent must **ask for explicit approval before writing to this file**. Every entry must include the date of the change (YYYY-MM-DD) and a short, accurate summary of what was added, changed or removed.

---

## 2026-05-05 — Fix /resources and /resources/$category rendering identical pages

**Scope:** Routing
**Summary:** `/resources` and `/resources/datasheets` (or any category slug) rendered the same page because `resources.tsx` was a layout route with a full page component but no `<Outlet />`. Fixed by extracting the landing page content into a new `resources.index.tsx` and converting `resources.tsx` into a minimal layout route that renders `<Outlet />`.
**Files touched:** `src/routes/resources.tsx`, `src/routes/resources.index.tsx` (new)
**Notes / follow-ups:** None

---

## 2026-05-05 — Fix Vercel deployment (Cloudflare Workers → Nitro)

**Scope:** Deployment / Build
**Summary:** Vercel deployment failed because `@lovable.dev/vite-tanstack-config` always includes `@cloudflare/vite-plugin` during builds, producing a Cloudflare Workers bundle that Vercel can't run. Fixed by creating a separate `vite.config.vercel.ts` that uses `nitro/vite` (which auto-detects the Vercel preset) instead of the Cloudflare plugin. Added a `build:vercel` script and configured `vercel.json` to use it. The Lovable/Cloudflare build pipeline is untouched.
**Files touched:** `vite.config.vercel.ts` (new), `vercel.json`, `package.json`, `.gitignore`
**Notes / follow-ups:** Consider moving hardcoded Supabase env vars to Vercel's environment variable dashboard.

---

## 2026-05-11 — Fix Site Builder config saving issue

**Scope:** Admin / Database
**Summary:** The Site Builder page was failing to save configuration because the `site_config` table was missing from the database (causing a "schema cache" error and forcing the page to use fallback fake data). Fixed by applying a database migration to create the `public.site_config` table along with appropriate Row Level Security (RLS) policies for admin and staff access.
**Files touched:** Supabase Database Schema
**Notes / follow-ups:** None

---

<!--
Entry template — copy when adding a new entry:

## YYYY-MM-DD — <short title>

**Scope:** <feature area, e.g. Auth, Admin, Schema>
**Summary:** <1–3 sentences>
**Files touched:** <key files>
**Notes / follow-ups:** <optional>

---
-->
