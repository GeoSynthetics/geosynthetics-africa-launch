import { createFileRoute, notFound } from "@tanstack/react-router";
import { resolveSlugToPath, fetchSeoPages } from "@/hooks/use-page-slugs";
import { lazy, Suspense } from "react";

/**
 * Lazy-load map: original path → lazy component.
 * Each page component lives in src/pages/ (NOT in route files) so that
 * TanStack Router can properly code-split route files.
 */
const PAGE_COMPONENTS: Record<string, React.LazyExoticComponent<React.ComponentType>> = {
  "/about": lazy(() => import("@/pages/AboutPage").then((m) => ({ default: m.AboutPage }))),
  "/contacts": lazy(() => import("@/pages/ContactsPage").then((m) => ({ default: m.ContactsPage }))),
  "/services": lazy(() => import("@/pages/ServicesPage").then((m) => ({ default: m.ServicesPage }))),
  "/products": lazy(() => import("@/pages/ProductsLanding").then((m) => ({ default: m.ProductsLanding }))),
  "/applications": lazy(() => import("@/pages/ApplicationsLanding").then((m) => ({ default: m.ApplicationsLanding }))),
  "/resources": lazy(() => import("@/pages/ResourcesIndexPage").then((m) => ({ default: m.ResourcesIndexPage }))),
  "/quality-assurance": lazy(() => import("@/pages/QAPage").then((m) => ({ default: m.QAPage }))),
  "/projects": lazy(() => import("@/pages/ProjectsPage").then((m) => ({ default: m.ProjectsPage }))),
};

/**
 * Root-level catch-all route for custom SEO slugs.
 *
 * When an admin sets a custom URL slug for a core page (e.g. "/about" → "gse-hdpe-liners"),
 * this route intercepts /{custom-slug} and renders the mapped page component directly,
 * keeping the custom SEO slug visible in the browser URL bar.
 *
 * TanStack Router tries static routes first (/about, /products, etc.)
 * before falling through to /$slug, so this only fires for URLs that
 * don't match an existing file-based route.
 */
export const Route = createFileRoute("/$slug")({
  loader: async ({ params }) => {
    const customSlug = params.slug;

    // Look up which core page this custom slug maps to
    const originalPath = await resolveSlugToPath(customSlug);

    if (!originalPath || !PAGE_COMPONENTS[originalPath]) {
      throw notFound();
    }

    // Fetch the SEO metadata for this page
    const seoMap = await fetchSeoPages();
    const seo = seoMap[originalPath] || null;

    return { originalPath, seo };
  },
  head: ({ loaderData }) => {
    const seo = loaderData?.seo;
    if (!seo) return { meta: [] };

    const title = seo.title || `${seo.pageLabel} — Geosynthetics Africa`;
    const desc = seo.description || "";
    const meta: any[] = [
      { title },
      { name: "description", content: desc },
      { property: "og:title", content: title },
      { property: "og:description", content: desc },
    ];
    if (seo.keywords) {
      meta.push({ name: "keywords", content: seo.keywords });
    }
    return { meta };
  },
  component: CustomSlugPage,
});

function CustomSlugPage() {
  const { originalPath } = Route.useLoaderData();
  const PageComponent = PAGE_COMPONENTS[originalPath];

  if (!PageComponent) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="text-muted-foreground">Page not found</p>
      </div>
    );
  }

  return (
    <Suspense
      fallback={
        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      }
    >
      <PageComponent />
    </Suspense>
  );
}
