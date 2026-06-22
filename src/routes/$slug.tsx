import { createFileRoute, notFound } from "@tanstack/react-router";
import { resolveSlugToPath, fetchSeoPages } from "@/hooks/use-page-slugs";
import { lazy, Suspense } from "react";
import { SERVICES, INDUSTRIES, APPLICATION_CATEGORIES } from "@/components/site/mega-menu-data";
import { loadServiceData, ServiceDetailSkeleton } from "@/routes/services.$slug";
import { loadIndustryData, IndustryDetailSkeleton } from "@/routes/industries.$slug";
import { loadApplicationData, ApplicationCategorySkeleton } from "@/routes/applications.$category";
import { supabase } from "@/integrations/supabase/client";

/**
 * Lazy-load map: original path → lazy component.
 * Each page component lives in src/pages/ (NOT in route files) so that
 * TanStack Router can properly code-split route files.
 */
const PAGE_COMPONENTS: Record<string, React.LazyExoticComponent<React.ComponentType<any>>> = {
  "/about": lazy(() => import("@/pages/AboutPage").then((m) => ({ default: m.AboutPage }))),
  "/contacts": lazy(() => import("@/pages/ContactsPage").then((m) => ({ default: m.ContactsPage }))),
  "/services": lazy(() => import("@/pages/ServicesPage").then((m) => ({ default: m.ServicesPage }))),
  "/products": lazy(() => import("@/pages/ProductsLanding").then((m) => ({ default: m.ProductsLanding }))),
  "/applications": lazy(() => import("@/pages/ApplicationsLanding").then((m) => ({ default: m.ApplicationsLanding }))),
  "/resources": lazy(() => import("@/pages/ResourcesIndexPage").then((m) => ({ default: m.ResourcesIndexPage }))),
  "/quality-assurance": lazy(() => import("@/pages/QAPage").then((m) => ({ default: m.QAPage }))),
  "/projects": lazy(() => import("@/pages/ProjectsPage").then((m) => ({ default: m.ProjectsPage }))),
};

const ServicePageLazy = lazy(() => import("@/pages/ServicePage").then((m) => ({ default: m.ServicePage })));
const IndustryPageLazy = lazy(() => import("@/pages/IndustryPage").then((m) => ({ default: m.IndustryPage })));
const ApplicationCategoryPageLazy = lazy(() => import("@/pages/ApplicationCategoryPage").then((m) => ({ default: m.ApplicationCategoryPage })));

/**
 * Root-level catch-all route that handles custom SEO slugs, services, industries, and applications.
 * Keep the custom SEO slugs visible in the browser URL bar.
 */
export const Route = createFileRoute("/$slug")({
  loader: async ({ params }) => {
    const customSlug = params.slug;

    // 1. Try resolving to custom SEO path for static core pages first
    const originalPath = await resolveSlugToPath(customSlug);
    if (originalPath && PAGE_COMPONENTS[originalPath]) {
      const seoMap = await fetchSeoPages();
      const seo = seoMap[originalPath] || null;
      return { type: "core" as const, originalPath, seo };
    }

    // 2. Check if it's a Service subpage (static fallback or dynamic CMS)
    const isStaticService = SERVICES.some((s) => s.slug === customSlug);
    let isDynamicService = false;
    try {
      const { data } = await supabase
        .from("site_config")
        .select("value")
        .eq("key", "hierarchy_services")
        .maybeSingle();
      const items = (data?.value as any)?.items || [];
      isDynamicService = items.some((item: any) => item.slug === customSlug || item.id === customSlug);

      if (!isDynamicService) {
        const { data: templatesData } = await supabase
          .from("site_config")
          .select("value")
          .eq("key", "template_services")
          .maybeSingle();
        const templates = templatesData?.value as Record<string, any> || {};
        isDynamicService = !!templates[customSlug];
      }
    } catch (err) {
      console.error("Error reading hierarchy_services/template_services:", err);
    }

    if (isStaticService || isDynamicService) {
      const loaderData = await loadServiceData(customSlug);
      return { type: "service" as const, loaderData };
    }

    // 3. Check if it's an Industry subpage (static fallback or dynamic CMS)
    const isStaticIndustry = INDUSTRIES.some((i) => i.slug === customSlug);
    let isDynamicIndustry = false;
    try {
      const { data } = await supabase
        .from("site_config")
        .select("value")
        .eq("key", "hierarchy_industries")
        .maybeSingle();
      const items = (data?.value as any)?.items || [];
      isDynamicIndustry = items.some((item: any) => item.slug === customSlug || item.id === customSlug);

      if (!isDynamicIndustry) {
        const { data: templatesData } = await supabase
          .from("site_config")
          .select("value")
          .eq("key", "template_industries")
          .maybeSingle();
        const templates = templatesData?.value as Record<string, any> || {};
        isDynamicIndustry = !!templates[customSlug];
      }
    } catch (err) {
      console.error("Error reading hierarchy_industries/template_industries:", err);
    }

    if (isStaticIndustry || isDynamicIndustry) {
      const loaderData = await loadIndustryData(customSlug);
      return { type: "industry" as const, loaderData };
    }

    // 4. Check if it's an Application subpage (static fallback or dynamic CMS)
    const isStaticApp = APPLICATION_CATEGORIES.some((a) => a.slug === customSlug);
    let isDynamicApp = false;
    try {
      const { data } = await supabase
        .from("site_config")
        .select("value")
        .eq("key", "hierarchy_applications")
        .maybeSingle();
      const items = (data?.value as any)?.items || [];
      isDynamicApp = items.some((item: any) => item.slug === customSlug || item.id === customSlug);

      if (!isDynamicApp) {
        const { data: templatesData } = await supabase
          .from("site_config")
          .select("value")
          .eq("key", "template_applications")
          .maybeSingle();
        const templates = templatesData?.value as Record<string, any> || {};
        isDynamicApp = !!templates[customSlug];
      }
    } catch (err) {
      console.error("Error reading hierarchy_applications/template_applications:", err);
    }

    if (isStaticApp || isDynamicApp) {
      const loaderData = await loadApplicationData(customSlug);
      return { type: "application" as const, loaderData };
    }

    throw notFound();
  },
  head: ({ loaderData }) => {
    if (!loaderData) return { meta: [] };

    if (loaderData.type === "service") {
      const { service, templateData } = loaderData.loaderData;
      const label = service.label;
      const title = templateData?.seo?.title || `${label} — Geosynthetics Africa`;
      const description = templateData?.seo?.description || `Professional ${label.toLowerCase()} services by Geosynthetics Africa.`;
      return {
        meta: [
          { title },
          { name: "description", content: description },
          { property: "og:title", content: title },
          { property: "og:description", content: description },
        ],
      };
    }

    if (loaderData.type === "industry") {
      const { industry, templateData } = loaderData.loaderData;
      const label = industry.label;
      const title = templateData?.seo?.title || `${label} — Geosynthetics Africa`;
      const description = templateData?.seo?.description || `High-performance geosynthetic solutions for the ${label.toLowerCase()} sector.`;
      return {
        meta: [
          { title },
          { name: "description", content: description },
          { property: "og:title", content: title },
          { property: "og:description", content: description },
        ],
      };
    }

    if (loaderData.type === "application") {
      const { category, templateData } = loaderData.loaderData;
      const label = category.label;
      const title = templateData?.seo?.title || `${label} — Geosynthetics Africa`;
      const description = templateData?.seo?.description || `Explore our advanced ${label.toLowerCase()} applications and projects.`;
      return {
        meta: [
          { title },
          { name: "description", content: description },
          { property: "og:title", content: title },
          { property: "og:description", content: description },
        ],
      };
    }

    // Fallback for core SEO pages
    const seo = (loaderData as any).seo;
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
  const loaderData = Route.useLoaderData();

  if (loaderData.type === "service") {
    return (
      <Suspense fallback={<ServiceDetailSkeleton />}>
        <ServicePageLazy data={loaderData.loaderData} />
      </Suspense>
    );
  }

  if (loaderData.type === "industry") {
    return (
      <Suspense fallback={<IndustryDetailSkeleton />}>
        <IndustryPageLazy data={loaderData.loaderData} />
      </Suspense>
    );
  }

  if (loaderData.type === "application") {
    return (
      <Suspense fallback={<ApplicationCategorySkeleton />}>
        <ApplicationCategoryPageLazy data={loaderData.loaderData} />
      </Suspense>
    );
  }

  const { originalPath } = loaderData as any;
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
