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

## 2026-05-13 — Fix TanStack Router code-splitting warnings

**Scope:** Routing / Bundle Optimization

**Problem:** Running `bun dev` produced repeated `[tanstack-router]` warnings for every core page route:
```
[tanstack-router] These exports from ".../src/routes/products.tsx" will not be code-split
and will increase your bundle size: - ProductsLanding
```
TanStack Router's file-based routing relies on code-splitting each route file into its own chunk. When a route file has **named exports** (beyond the mandatory `export const Route`), the router cannot tree-shake or lazy-load those exports — they get bundled into the main chunk instead. The named exports existed because `$slug.tsx` (the dynamic SEO slug catch-all route) needed to `lazy(() => import("./about").then(m => ({ default: m.AboutPage })))` to render the correct page under a custom URL slug. This affected 8 route files: `about`, `products`, `projects`, `contacts`, `quality-assurance`, `applications`, `services`, and `resources.index`.

**Solution:** Separated page component code from route configuration:
1. Created `src/pages/` directory with standalone page component files (`AboutPage.tsx`, `ProductsLanding.tsx`, `ProjectsPage.tsx`, `ContactsPage.tsx`, `QAPage.tsx`, `ApplicationsLanding.tsx`, `ServicesPage.tsx`, `ResourcesIndexPage.tsx`) — each exports its component function.
2. Slimmed each route file in `src/routes/` down to **only** route configuration (`createFileRoute` with `head`, `loader`, and `component`) — importing the component from `@/pages/`.
3. Updated `$slug.tsx` to lazy-import from `@/pages/` files instead of route files.

This ensures route files only export `Route`, allowing TanStack Router to fully code-split them.

**Architecture pattern (for future reference):**
```
src/routes/about.tsx        → Route config only, imports AboutPage from @/pages/
src/pages/AboutPage.tsx     → All JSX/component code lives here
src/routes/$slug.tsx        → lazy(() => import("@/pages/AboutPage"))
```

**Files touched:** `src/pages/*.tsx` (8 new files + barrel `index.ts`), `src/routes/about.tsx`, `src/routes/products.tsx`, `src/routes/projects.tsx`, `src/routes/contacts.tsx`, `src/routes/quality-assurance.tsx`, `src/routes/applications.tsx`, `src/routes/services.tsx`, `src/routes/resources.index.tsx`, `src/routes/$slug.tsx`
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
