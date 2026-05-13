---
trigger: always_on
---

TanStack Router: Route / Page Separation Pattern
Rule
In this project, route files (src/routes/*.tsx) must only export Route (via createFileRoute). All page component JSX must live in src/pages/*.tsx.

Why
TanStack Router's file-based routing code-splits each route file into its own lazy-loaded chunk. If a route file has any named export beyond export const Route, the router cannot code-split it — everything in that file gets bundled into the main chunk, increasing bundle size and producing console warnings.

Architecture
src/routes/about.tsx            → Route config ONLY (createFileRoute, head, loader, component)
                                   imports AboutPage from @/pages/AboutPage
src/pages/AboutPage.tsx         → Full page component JSX, all sub-components, data, etc.
                                   exports: AboutPage
src/routes/$slug.tsx            → Dynamic SEO slug catch-all route
                                   lazy(() => import("@/pages/AboutPage").then(m => ({ default: m.AboutPage })))
src/pages/index.ts              → Barrel re-export of all page components
Route File Template
tsx
// src/routes/example.tsx
import { createFileRoute } from "@tanstack/react-router";
import { ExamplePage } from "@/pages/ExamplePage";
export const Route = createFileRoute("/example")({
  head: () => ({ meta: [{ title: "Example — Geosynthetics Africa" }] }),
  component: ExamplePage,
});
// ❌ NEVER export anything else from this file
Page Component Template
tsx
// src/pages/ExamplePage.tsx
import { Link } from "@tanstack/react-router";
// ... all imports
export function ExamplePage() {
  return (
    <>
      {/* Full page content */}
    </>
  );
}
Dynamic Slug ($slug.tsx)
When adding a new core page that should support custom SEO slugs:

Create the page component in src/pages/NewPage.tsx
Create the route in src/routes/new-page.tsx (imports from @/pages/)
Add a lazy entry in $slug.tsx:
tsx
"/new-page": lazy(() => import("@/pages/NewPage").then(m => ({ default: m.NewPage }))),
Current Page Components (as of 2026-05-13)
Route File	Page Component File	Export Name
routes/about.tsx	pages/AboutPage.tsx	AboutPage
routes/products.tsx	pages/ProductsLanding.tsx	ProductsLanding
routes/projects.tsx	pages/ProjectsPage.tsx	ProjectsPage
routes/contacts.tsx	pages/ContactsPage.tsx	ContactsPage
routes/quality-assurance.tsx	pages/QAPage.tsx	QAPage
routes/applications.tsx	pages/ApplicationsLanding.tsx	ApplicationsLanding
routes/services.tsx	pages/ServicesPage.tsx	ServicesPage
routes/resources.index.tsx	pages/ResourcesIndexPage.tsx	ResourcesIndexPage
Common Mistake to Avoid
tsx
// ❌ BAD — exporting component from route file breaks code-splitting
export function AboutPage() { ... }
export const Route = createFileRoute("/about")({ component: AboutPage });
// ✅ GOOD — component lives in src/pages/, route file only exports Route
import { AboutPage } from "@/pages/AboutPage";
export const Route = createFileRoute("/about")({ component: AboutPage });
