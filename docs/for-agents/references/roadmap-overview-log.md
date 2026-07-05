# Lovable Change Log

This file records **major** changes made to the Geosynthetics Africa platform by the Lovable AI agent.

> **Rule:** the AI agent must **ask for explicit approval before writing to this file**. Every entry must include the date of the change (YYYY-MM-DD) and a short, accurate summary of what was added, changed or removed.

---

# Application Directory Structure

Below is an overview of the folder hierarchy and modular architectural layout utilized throughout the Geosynthetics Africa codebase:

```text
docs/                               # Developer and administrator manuals, guides, assets, and documentation styles
├── design-images-from-james/       # Project visual reference designs and graphic mockups
├── index.html                      # The Unified Admin & Developer Portal documentation manual (UI & UX Guide)
├── lovable-docs.md                 # Lovable AI agent change log, architecture summaries, and folder structure
├── old-sitemap.md                  # Legacy sitemap definitions and slug reference mappings
└── style.css                       # Stylings for the documentation portal
public/                             # Raw public-facing static assets, icons, and root media
supabase/                           # Database configurations, SQL migrations, schemas, and local Supabase instance files
src/                                # Principal application source code
├── assets/                         # Global static images, vector graphics, logos, and UI assets
├── components/                     # Reusable React components organized by scope
│   ├── admin/                      # Admin-specific modules (Site Builder tree, Content Editor panels, Homepage tab)
│   ├── seo/                        # Google-compliant JSON-LD schema compilers (Product, Breadcrumbs, Organization)
│   ├── site/                       # Client-facing layout components (Sticky Headers, Footers, Scroll progress)
│   └── ui/                         # Primitive Shadcn components (Button, Input, Tabs, Dialogs, Tooltips)
├── data/                           # Hardcoded site configurations, products list, and static template pages
├── hooks/                          # Custom utility hooks (e.g. database, layout query triggers)
├── integrations/                   # Supabase client bridges, queries, and auto-generated database schemas
├── lib/                            # Helper functions, CSS merge utilities, and visual tree operators
├── pages/                          # Standalone page view components (TanStack Router route-page separation split)
├── routes/                         # Dynamic routing configs, page loaders, head SEO meta generators, and endpoints
├── styles.css                      # Master application stylesheet defining theme palettes and Tailwind tokens
└── types/                          # Shared TypeScript interface declarations (e.g., site builder layouts, homepage)
```

## 2026-06-29 — Resolve Codebase Type Safety & React Hook Violations

**Scope:** Code Health / Routing / Tests
**Summary:** Resolved "Rules of Hooks" violations where reusable page components (e.g. `ApplicationCategoryPage.tsx`, `ServicePage.tsx`) conditionally or directly called `Route.useLoaderData()`. Resolved this by introducing thin route-level wrappers in the route files and passing data down as props. Fixed 7 unused variables and parameters in the test suite (prefixing unused parameters with underscores), adjusted ESLint to warn on unused variables, and verified that all vitest unit tests pass.
**Files touched:** `eslint.config.js`, `src/pages/ApplicationCategoryPage.tsx`, `src/pages/ServicePage.tsx`, `src/pages/ProductFamilyPage.tsx`, `src/routes/services.$slug.tsx`, `src/routes/applications.$category.tsx`, test suite files, etc.
**Notes / follow-ups:** Restored codebase compilation and clean build status.

---

## 2026-06-27 — Refactor Unused Imports & Compile Warnings

**Scope:** Code Refactoring
**Summary:** Cleaned up the main application code (`src/` excluding tests) by removing unused variables, unused imports, and redundant Lucide icon imports to minimize bundle size. Fixed TypeScript compilation issues.
**Files touched:** Over 20 files under `src/components/` and `src/pages/`.
**Notes / follow-ups:** Paved the way for strict unused variable checking.

---

## 2026-06-26 — Implement Internationalization (i18n), Regional Coverage & Contacts Page

**Scope:** Core Features / Navigation / SEO
**Summary:** Implemented the modernization foundations of the platform including:

1. Multi-language (i18n) support (French and Portuguese localizations).
2. Connected Navigation mega menus showing Applications before Products.
3. Leaflet-based dynamic Regional Coverage map showing African branches.
4. ContactsPage displaying dynamic Case Studies fetched from Supabase.
5. Country-specific SEO landing pages.
   **Files touched:** `src/pages/ContactsPage.tsx`, `src/routes/__root.tsx`, `src/locales/`, `src/components/site/Header.tsx`, `src/components/site/Footer.tsx`, etc.
   **Notes / follow-ups:** Leaflet dependency added to handle map rendering.

---

## 2026-06-10 — Integrate Centralized Image Picker & Product Selector Components

**Scope:** Admin / UI / UX / Assets & Database Linkers
**Summary:** Implemented and integrated the **ImagePicker** and **ProductSelector** components to replace manual, error-prone text input fields for storage media and catalogue product linkages. `ImagePicker` wraps Supabase storage buckets with image compression, drag-and-drop uploading, tabbed media vault filtering, sorting, and an automatic directory fallback. `ProductSelector` utilizes a Radix popover and cmdk command list to search catalog products in real-time, filtering out duplicates and passing complete metadata payloads to parent editors for automated path/info auto-population.
**Files touched:** `src/components/admin/ImagePicker.tsx` (new), `src/components/admin/ProductSelector.tsx` (new), `src/components/admin/ContentEditorPanel.tsx`, `src/components/admin/QATemplatesEditor.tsx`, `src/components/admin/TemplateEditorShared.tsx`, `docs/index.html`, `docs/lovable-docs.md`
**Notes / follow-ups:** Streamlines content entry and ensures catalog link and asset URL integrity.

---

## 2026-06-10 — Implement Real-Time Slug Sync & Validation UX

**Scope:** Admin / UI / UX / Slug Inputs
**Summary:** Implemented a reusable custom React hook (`useSlugSync`) and string utility (`formatSlugInput`) to automatically sync, format, and validate slug inputs across the admin dashboard. Slug inputs now format in real-time as the administrator types (converting spaces and special character sequences to hyphens, collapsing consecutive hyphens, and forcing lowercase). Upon field blur (`onBlur`), a full clean (`slugify`) is performed to remove leading/trailing hyphens. The slug automatically matches changes in the title/label input until the user manually focuses and types in the slug input (detaching the auto-sync). Clearing the slug input entirely resets and re-enables the auto-sync.
**Files touched:** `src/lib/utils.ts`, `src/hooks/use-slug-sync.ts` (new), `src/components/admin/ContentEditorPanel.tsx`, `src/components/admin/ProjectsTemplatesEditor.tsx`, `src/components/admin/QATemplatesEditor.tsx`, `src/pages/ProductsAdminPage.tsx`, `src/components/admin/ServicesTemplatesEditor.tsx`, `src/components/admin/IndustriesTemplatesEditor.tsx`, `src/components/admin/ApplicationsTemplatesEditor.tsx`, `src/pages/PageTemplatesAdminPage.tsx`, `src/test/hooks/use-slug-sync.test.tsx` (new), `docs/lovable-docs.md`
**Notes / follow-ups:** Includes comprehensive vitest unit tests in `src/test/hooks/use-slug-sync.test.tsx` which pass successfully.

---

## 2026-06-10 — Implement Lucide Icon Picker

**Scope:** Admin / UI / UX / Lucide Icons
**Summary:** Replaced error-prone manual text inputs for Lucide icon selection with an interactive visual **IconPicker** popover component. The picker dynamically reads and filters all available Lucide icons from the `lucide-react` library, offering real-time search, hover previews, lazy loading grids of up to 100 matching entries (for performance), and a single-click selection/clear mechanism. Integrated this component across three admin editors: navigation nodes (Site Builder Identity tab), Quality Assurance document pillars (QA Templates editor), and navigation quick actions (Site Builder Megamenu).
**Files touched:** `src/components/admin/IconPicker.tsx` (new), `src/components/admin/ContentEditorPanel.tsx`, `src/components/admin/QATemplatesEditor.tsx`, `src/components/admin/TemplateEditorShared.tsx`, `docs/index.html`, `docs/lovable-docs.md`
**Notes / follow-ups:** Improves the admin UX by eliminating typos and rendering issues on the public site layout.

---

## 2026-06-09 — Document Application Categories and Sub-pages Admin Guide

**Scope:** Admin / Site Builder / Documentation
**Summary:** Added a comprehensive step-by-step guide to `docs/lovable-docs.md` explaining how administrators can manage Application Categories and their associated sub-pages via the Site Builder and Page Templates editors.
**Files touched:** `docs/lovable-docs.md`
**Notes / follow-ups:** None

---

## 2026-05-29 — Fix runtime 'cn is not defined' error on /projects page

**Scope:** UI / Projects Page / Bug Fix
**Summary:** Resolved a runtime compilation crash on the `/projects` page caused by a missing import of the `cn` class utility. Added `import { cn } from "@/lib/utils"` at the top of the `ProjectsPage.tsx` page component.
**Files touched:** `src/pages/ProjectsPage.tsx`
**Notes / follow-ups:** Verified using dynamic build test.

---

## 2026-05-22 — Move Tracking & Cookies to Dedicated Admin Control Panel Route

**Scope:** Admin / Analytics / Routing
**Summary:** Moved the visual Tracking & Cookies credentials configurations panel out of the Site Builder and into a dedicated admin control panel route (`/admin/tracking`) under the Pages SEO section. Added the "Tracking & Cookies" item to the collapsible sidebar navigation with a custom `Cookie` icon from Lucide. Documented the entire credentials connection guide, granular cookie consent state rules, storage event lifecycle, and dynamic script loader architecture in the documentation portal.
**Files touched:** `src/pages/TrackingAdminPage.tsx` (new), `src/routes/admin.tracking.tsx` (new), `src/pages/index.ts`, `src/routes/admin.site-builder.tsx`, `src/components/admin/AdminNav.tsx`, `docs/index.html`, `docs/lovable-docs.md`
**Notes / follow-ups:** None.

---

## 2026-05-22 — Implement Granular Cookie Preferences & Admin Tracking Configuration

**Scope:** Admin / Analytics / GDPR Compliance / UI
**Summary:** Expanded the cookie consent banner into a premium, granular preferences manager. Visitors can selectively toggle and save consent for **Necessary Cookies** (always on), **Analytical Trackers**, and **Marketing Pixels** via a sleek Radix-based `Dialog` with animated switches. Added a new "Tracking & Cookies" tab in the Admin Site Builder that allows admins to save Google Analytics GA4 Measurement IDs and Google Tag Manager Container IDs to the Supabase `site_config` database table. Created a global client-side `TrackingLoader` component that dynamically injects GA4 and GTM tracking tags dynamically and safely if and only if the visitor has enabled Analytical trackers, ensuring full GDPR, CCPA, and POPIA privacy compliance.
**Files touched:** `src/components/site/CookieConsent.tsx`, `src/components/admin/TrackingBuilderTab.tsx` (new), `src/components/site/TrackingLoader.tsx` (new), `src/routes/admin.site-builder.tsx`, `src/routes/__root.tsx`, `docs/lovable-docs.md`
**Notes / follow-ups:** Includes legacy consent key migration and a custom reactive event channel to instantly initialize tracking scripts upon consent. Also resolved banner overlapping by temporarily hiding the banner when the preferences dialog is open, and added a 3-hour banner dismissal grace period when the banner is closed via the direct close button.

---

## 2026-05-22 — Implement Global Cookie Consent Banner

**Scope:** UI / UX / Layout
**Summary:** Created a premium, glassmorphic **CookieConsent** notification banner. The banner automatically loads with a slide-up fade-in entrance transition after a 1000ms delay if no consent choice is saved. Includes an expandable brief, custom vector icons, Decline/Accept toggles, and smooth state tracking via `localStorage` so that the cookie notice respects visitor decisions and stays hidden once resolved.
**Files touched:** `src/components/site/CookieConsent.tsx` (new), `src/routes/__root.tsx`, `docs/lovable-docs.md`
**Notes / follow-ups:** None

---

## 2026-05-22 — Implement Dynamic Homepage Builder & Image Optimization

**Scope:** Admin / Homepage / Site Builder / Media
**Summary:** Implemented a visual **Homepage Builder** tab within the Site Builder admin interface. This empowers administrators to visually configure and customize all sections of the public landing page (Hero headlines, Trust Badges, Engineered Systems cards, Partner Logos carousel, Services checklist, Pan-African branches map pins, Projects Showcase, and BOQ Callout Banner), backing up the changes dynamically under the `homepage_content` key inside the Supabase `site_config` database table. Added an automatic client-side image compression utility that optimizes and converts non-GIF/non-SVG uploaded files to low-payload `.webp` images before saving them to Supabase storage buckets, ensuring top-tier Core Web Vitals loading metrics.
**Files touched:** `src/routes/admin.site-builder.tsx`, `src/components/admin/HomepageBuilderTab.tsx` (new), `src/types/homepage.ts` (new), `src/routes/index.tsx`, `docs/lovable-docs.md`
**Notes / follow-ups:** Registered the full admin operations manual and user guide in `docs/index.html`.

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

## 2026-05-20 — Dynamic Page Templates & Admin Integration Unification

**Scope:** Admin / Dynamic Pages / Database
**Summary:** Connected and unified the admin `Page Templates` visual builder with the public product category dynamic pages (`/products/$category`). All inputs from the 12-tab admin editor (including Hero, Description paragraphs, key feature bullets, technical highlight badges, properties & specifications table, product types, benefits, FAQs accordion, installation specs, popular catalog products, and applications/industries tags) are now dynamically retrieved from the Supabase `site_config` table and rendered in real-time. This provides administrators full self-service control over page content, SEO metadata, and product properties.
**Files touched:** `src/pages/PageTemplatesAdminPage.tsx`, `src/routes/products.$category.index.tsx`, `src/data/product-pages.ts`, `src/pages/ProductCategoryPage.tsx`
**Notes / follow-ups:** Documented the complete field mapping schema, creation, editing, deletion flows, and megamenu integration inside `docs/index.html` and `docs/style.css` for future developers and administrators.

---

## 2026-05-20 — Megamenu UX Simplification & Autocomplete Autopopulation

**Scope:** Admin / Megamenu / UX Unification
**Summary:** Fixed the tedious, manual megamenu linking issue where administrators had to switch screens, search visual trees, and copy-paste paths manually (risking spelling errors and 404s), by automating it into a 1-click linker pill in the category templates editor, adding a template autocomplete selector in the Site Builder identity editor, and integrating referential menu cleanup upon template deletion.
**Files touched:** `src/pages/PageTemplatesAdminPage.tsx`, `src/components/admin/ContentEditorPanel.tsx`, `docs/index.html`
**Notes / follow-ups:** Updated the developer/admin manual in `docs/index.html` to document the simplified two-step automated linking process.

## 2026-05-21 — Resolve Admin Panel Conflicts & Align Category Overrides

**Scope:** Admin UI / Megamenu / Page Templates / Database integration
**Summary:** Resolved configuration and layout conflicts between parent product categories and child sub-page templates by renaming the template editor to "Product Page Templates" and blocking the creation of templates using protected parent slugs. Restored parent category editing in the Site Builder "Page Content" tab and implemented a loader that dynamically merges these visual site modifications onto public category fallbacks.
**Files touched:** `src/pages/PageTemplatesAdminPage.tsx`, `src/components/admin/ContentEditorPanel.tsx`, `src/data/product-pages.ts`, `src/lib/hierarchy-utils.ts`, `docs/index.html`
**Notes / follow-ups:** Updated user manuals in `docs/index.html` and verified the build using the bun package manager.

## 2026-07-04 — Fix Saving "Installation Guide / Manual" Resources

**Scope:** Admin UI / Resources / Database Integration
**Summary:** Resolved the issue where "Installation Guide / Manual" and "Case Study" resources could not be saved to Supabase due to missing values in the `resource_type` database enum. Added JSDOM integration/unit tests for `ResourcesAdminPage` verifying listing, searching, and correct saving of `manual` resource types. Refactored the resources admin list table to render friendly, localized labels (e.g. "Installation Guide / Manual") instead of the raw uppercase enum keys.
**Files touched:** `src/pages/ResourcesAdminPage.tsx`, `src/test/components/ResourcesAdminPage.test.tsx` (new)
**Notes / follow-ups:** Developers/administrators must ensure that the `20260701140000_add_resource_types.sql` migration is applied to their self-managed Supabase instance so that the database supports the `manual` and `case_study` enum values.

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

# Admin Guide: Managing Application Categories & Sub-pages in Site Builder

This guide explains how administrators can customize, create, reorder, and configure **Application Categories** (e.g. _Containment & Lining_) and their **Sub-pages** (e.g. _Mining TSF Lining_) in the Geosynthetics Africa Admin Control Panel.

## 1. Accessing the Site Builder

1. Log in to the application.
2. Click your account menu in the top right of the navigation header and select **Admin** (or go directly to `/admin`).
3. Click **Site Builder** in the left admin sidebar navigation (or go directly to `/admin/site-builder`).

## 2. Managing the Applications Navigation Hierarchy

1. Within the Site Builder screen, select the **Applications** tab in the main tab menu.
2. The left panel shows the dynamic **Application Categories** tree. From here you can perform the following actions:
   - **Reorder categories or sub-pages:** Click and hold the vertical drag grip (`⋮⋮`) next to any item, then drag it up/down to change its position, or drag sub-pages to move them under a different parent category.
   - **Add a new top-level category:** Enter a label in the input field at the bottom of the tree panel and click the `+` button.
   - **Add a new sub-page:** Hover over any parent category item in the tree list and click the `+` icon that appears on the right edge of the item. Enter the name and press Enter.
   - **Delete an item:** Hover over any item (category or sub-page) and click the red trash can icon to remove it.
   - **Rename or edit configuration:** Click on any category or sub-page item in the tree. This opens its details in the **Content Editor Panel** on the right side.
3. Click the **Save Applications** button in the top-right corner to persist all changes to Supabase.

## 3. Configuring Category Page Content & Templates

If you want to customize the page template content (e.g. Hero title, images, specifications, features, or search metadata):

1. Navigate to the **Page Templates** section from the left admin sidebar (or go to `/admin/page-templates`).
2. Click the **Application Templates** sub-tab.
3. Select the category page on the left sidebar to edit:
   - **Hero Tab:** Edit the main H1 Page Title, Hero Background Image, and Description.
   - **Content Tab:** Manage the sub-systems checklist (each entry appears as a descriptive card on the category page).
   - **SEO Tab:** Update the Google-compliant Meta Title, Description, and Keywords.
4. Click **Save** (or **Save All**) to persist your changes to the database.
