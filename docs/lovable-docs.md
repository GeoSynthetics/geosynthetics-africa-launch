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

## 2026-05-13 — Add dynamic sitemap.xml and robots.txt server routes

**Scope:** SEO / Server Routes
**Summary:** Created two TanStack Start server routes to improve search engine discoverability. `sitemap[.]xml.ts` dynamically generates an XML sitemap at `/sitemap.xml` containing all static core pages (with priority/changefreq), product category pages, application category pages, service detail pages, 125+ catalogue product pages (with `lastmod` from Supabase `updated_at`), and custom SEO slug pages. `robots[.]txt.ts` serves a `robots.txt` at `/robots.txt` that allows all crawlers, blocks admin/auth routes, and points to the sitemap. Both derive the hostname from the incoming request so they work automatically on any deployment (localhost, Vercel, Cloudflare).
**Files touched:** `src/routes/sitemap[.]xml.ts` (new), `src/routes/robots[.]txt.ts` (new)
**Notes / follow-ups:** None

---

## 2026-05-13 — Add structured data (JSON-LD) and sitemap head link

**Scope:** SEO / Structured Data
**Summary:** Implemented Google-compliant structured data using JSON-LD `<script>` tags to enhance rich search results:

1. **`<link rel="sitemap">`** added to `__root.tsx` `head.links` so search engines can autodiscover `/sitemap.xml` from every page.
2. **Organization schema** — Global JSON-LD rendered in the root layout on every page. Includes company legal name, address (7 Tamar Avenue, Lea Glen, Randburg), phone, email, service area (ZA, BW, NA, ZW, MZ, ZM), logo, and area of expertise.
3. **Product schema** — Renders on each `/catalogue/$slug` page with product name, description, SKU, brand/manufacturer, category, material, price (when available), and stock availability.
4. **BreadcrumbList schema** — Renders on each `/catalogue/$slug` page with a proper breadcrumb trail (Home → Catalogue → Category → Product).

All schemas are built with reusable components in `src/components/seo/`:
- `JsonLd.tsx` — Base component that renders `<script type="application/ld+json">`
- `OrganizationSchema.tsx` — Global company info
- `ProductSchema.tsx` — Individual product data
- `BreadcrumbSchema.tsx` — Breadcrumb trail

**Files touched:** `src/routes/__root.tsx`, `src/routes/catalogue.$slug.tsx`, `src/components/seo/JsonLd.tsx` (new), `src/components/seo/OrganizationSchema.tsx` (new), `src/components/seo/ProductSchema.tsx` (new), `src/components/seo/BreadcrumbSchema.tsx` (new)

**Developer: How to update the sitemap**

The sitemap at `/sitemap.xml` is generated dynamically on each request (cached for 1 hour via `Cache-Control`). It automatically picks up:
- New products added in Supabase → appear immediately
- New static routes → add them to the `staticPages` array in `src/routes/sitemap[.]xml.ts`
- Custom SEO slugs → read from `site_config.seo_pages` in Supabase

To force a sitemap refresh in production: simply visit `{YOUR_DOMAIN}/sitemap.xml` — it regenerates on every request. The CDN cache expires after 1 hour (`s-maxage=3600`).

To validate: paste the sitemap URL into [Google's Rich Results Test](https://search.google.com/test/rich-results) or submit via [Google Search Console](https://search.google.com/search-console) → Sitemaps.

## 2026-05-15 — Implement reveal-on-scroll sticky Header

**Scope:** UI / UX
**Summary:** Refactored the `Header` component to implement a reveal-on-scroll effect. The static header and TopBar scroll out of view naturally, and a cloned, fixed header smoothly slides down from the top and fades in after 200px of scrolling. This provides persistent navigation without losing the TopBar context at the top of the page.
**Files touched:** `src/components/site/Header.tsx`
**Notes / follow-ups:** None

---

## 2026-05-15 — Implement Back to Top button with scroll progress

**Scope:** UI / UX
**Summary:** Created a custom `ScrollToTop` component that appears after scrolling down 300px. It features a circular progress indicator that updates based on scroll percentage and uses brand colors. Integrated it globally in the root layout.
**Files touched:** `src/components/site/ScrollToTop.tsx` (new), `src/routes/__root.tsx`
**Notes / follow-ups:** None

---

## 2026-05-15 — Restructure Header sticky behavior

**Scope:** UI / Header
**Summary:** Modified the `Header` component to move the `TopBar` outside of the sticky container. This ensures the main navigation remains fixed at the top while the TopBar scrolls away with the page content.
**Files touched:** `src/components/site/Header.tsx`
**Notes / follow-ups:** None

---

## 2026-05-15 — Implement TopBar certifications slider for mobile

## 2026-05-15 — Fix double close button in mobile navigation

**Scope:** UI / Mobile Navigation
**Summary:** Removed a redundant manual close button from the mobile navigation `SheetHeader` that was overlapping with the default close button provided by `SheetContent`. Also added a visually hidden `SheetDescription` to improve accessibility and resolve console warnings.
**Files touched:** `src/components/site/Header.tsx`
**Notes / follow-ups:** None

---

## 2026-05-15 — Implement Mega Menu Admin Builder

**Scope:** Admin / Navigation
**Summary:** Overhauled the `Site Builder` page to support comprehensive, recursive visual editing of the `megaMenus` array. Administrators can now add, edit, and delete primary categories, secondary links, featured products/images, and quick actions directly from the UI. The navigation structure is saved as JSON in the Supabase `site_config` table and loaded dynamically by the `Header` component. The `products`, `applications`, and `services` catch-all routes were also decoupled from hardcoded category lists so newly created admin categories route successfully without throwing 404 errors.
**Files touched:** `src/routes/admin.site-builder.tsx`, `src/components/site/Header.tsx`, `src/routes/products.$category.tsx`, `src/routes/applications.$category.tsx`, `src/routes/services.$slug.tsx`
**Notes / follow-ups:** Initializing the database is handled seamlessly — visiting the Site Builder will load defaults if the database is empty, and clicking "Save" will seed it.

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
