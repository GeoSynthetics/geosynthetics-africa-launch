# Coding Agent Skill: Geosynthetics Africa Platform Modernization

This document defines the core capabilities, architectural conventions, and development procedures for AI coding agents extending the Geosynthetics Africa codebase. 


---

## 2. Centralized Admin Components
<!--  -->
When developing or modifying features in the Admin Control Panel, always use the following pre-built visual selectors instead of manual text inputs or file path fields:

### A. Lucide Icon Picker (`src/components/admin/IconPicker.tsx`)
- **Use Case:** Navigation icons in the Site Builder, key pillars in Quality Assurance, and Megamenu actions.
- **Behavior:** Dynamically parses all uppercase Lucide icons, provides real-time search filtering, caps rendering at 100 items for performance, and supports 1-click selection and clearing.
- **Rendering:** Public pages resolve the stored name string dynamically (e.g., `const Component = (LucideIcons as any)[name]`).

### B. Centralized Image Picker & Storage (`src/components/admin/ImagePicker.tsx`)
- **Use Case:** Hero background banners, case study images, partner logos, and PDF brochures.
- **Behavior:** Connects to Supabase Storage (specifically the `media-center` bucket). Compress JPEG/PNG inputs to WebP dynamically before uploading to optimize performance. Falls back to `product-images` bucket under virtual subfolders if the primary bucket is unavailable.

### C. Catalog Product Selector (`src/components/admin/ProductSelector.tsx`)
- **Use Case:** Cross-linking catalog items inside Page Templates and the Megamenu.
- **Behavior:** Queries the Supabase `products` table in real-time. Combines Radix `Popover` with `cmdk` command library for instant autocomplete. Automatically filters out already selected product IDs using the `excludeIds` property.

---

## 3. SEO & Structured Data (JSON-LD)

Adhere to Google-compliant schema structures using components under `src/components/seo/`:
- **Organization Schema (`OrganizationSchema.tsx`):** Global schema injected in root layout containing company details.
- **Product Schema (`ProductSchema.tsx`):** Renders item specifications, categories, and stock availability on the `/catalogue/$slug` route.
- **Breadcrumb Schema (`BreadcrumbSchema.tsx`):** Generates breadcrumb paths (Home → Catalogue → Category → Product) on the catalogue details page.
- **Dynamic XML Sitemap:** Rendered dynamically at `/sitemap.xml` via `src/routes/sitemap[.]xml.ts`. It reads custom slugs from Supabase and static pages locally.

---

## 4. Privacy & Consent Compliance (GDPR / POPIA)

- **Cookie Banner (`src/components/site/CookieConsent.tsx`):** Sleek banner prompting users for Necessary, Analytics, and Marketing preferences.
- **State Management:** Toggles are saved in `localStorage` under `gsa-cookie-preferences`.
- **Dynamic Script Loading (`src/components/site/TrackingLoader.tsx`):** Global observer listening for window events (`gsa-cookie-preferences-changed`). It injects Google Analytics 4 (GA4) or Google Tag Manager (GTM) script tags dynamically *only if* Analytical Trackers are approved by the user.

---

## 5. Development & Testing Procedures

- **Local Development Server:** Runs via `bun dev` on `http://localhost:8080`.
- **Testing Credentials:**
  - *Admin Email:* `danjumashiwaju@gmail.com`
  - *Admin Password:* `@Password123!`
- **Unit & Integration Tests:**
  - Written under `src/test/`.
  - Executed using `bun run test` command.

---

## 6. Documenting Agent Operations
All major changes performed by the agent must be recorded in the change log at `file:///.agents/references/roadmap-overview-log.md`. Format entries with date (YYYY-MM-DD), scope, and a concise technical summary of changes.
