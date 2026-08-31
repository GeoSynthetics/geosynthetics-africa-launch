import { createFileRoute, notFound } from "@tanstack/react-router";
import { resolveSlugToPath, fetchSeoPages } from "@/hooks/use-page-slugs";
import { lazy, Suspense } from "react";
import { SERVICES, INDUSTRIES, APPLICATION_CATEGORIES } from "@/components/site/mega-menu-data";
import { loadServiceData, ServiceDetailSkeleton } from "@/routes/services.$slug";
import { loadIndustryData, IndustryDetailSkeleton } from "@/routes/industries.$slug";
import { loadApplicationData, ApplicationCategorySkeleton } from "@/routes/applications.$category";
import { supabase } from "@/integrations/supabase/client";
import { DEFAULT_COUNTRY_TEMPLATES, type CountryTemplate } from "@/types/country-template";
import { fetchCountryTemplates } from "@/hooks/use-country-templates";

/**
 * Lazy-load map: original path → lazy component.
 * Each page component lives in src/pages/ (NOT in route files) so that
 * TanStack Router can properly code-split route files.
 */
const PAGE_COMPONENTS: Record<string, React.LazyExoticComponent<React.ComponentType<any>>> = {
  "/about": lazy(() => import("@/pages/AboutPage").then((m) => ({ default: m.AboutPage }))),
  "/contacts": lazy(() =>
    import("@/pages/ContactsPage").then((m) => ({ default: m.ContactsPage })),
  ),
  "/services": lazy(() =>
    import("@/pages/ServicesPage").then((m) => ({ default: m.ServicesPage })),
  ),
  "/products": lazy(() =>
    import("@/pages/ProductsLanding").then((m) => ({ default: m.ProductsLanding })),
  ),
  "/applications": lazy(() =>
    import("@/pages/ApplicationsLanding").then((m) => ({ default: m.ApplicationsLanding })),
  ),
  "/resources": lazy(() =>
    import("@/pages/ResourcesIndexPage").then((m) => ({ default: m.ResourcesIndexPage })),
  ),
  "/quality-assurance": lazy(() => import("@/pages/QAPage").then((m) => ({ default: m.QAPage }))),
  "/projects": lazy(() =>
    import("@/pages/ProjectsPage").then((m) => ({ default: m.ProjectsPage })),
  ),
  "/industries": lazy(() =>
    import("@/pages/IndustriesLanding").then((m) => ({ default: m.IndustriesLanding })),
  ),
};

const ServicePageLazy = lazy(() =>
  import("@/pages/ServicePage").then((m) => ({ default: m.ServicePage })),
);
const IndustryPageLazy = lazy(() =>
  import("@/pages/IndustryPage").then((m) => ({ default: m.IndustryPage })),
);
const ApplicationCategoryPageLazy = lazy(() =>
  import("@/pages/ApplicationCategoryPage").then((m) => ({ default: m.ApplicationCategoryPage })),
);
const CountryPageLazy = lazy(() =>
  import("@/pages/CountryPage").then((m) => ({ default: m.CountryPage })),
);

export async function loadCountryData(customSlug: string) {
  let countryTemplate: CountryTemplate | null = null;

  try {
    const templates = await fetchCountryTemplates();
    countryTemplate =
      templates[customSlug] ||
      Object.values(templates).find((t) => t.slug === customSlug) ||
      null;

    if (!countryTemplate) {
      const countryMeta = COUNTRY_SEO_MAP[customSlug];
      if (countryMeta) {
        countryTemplate =
          Object.values(templates).find(
            (t) => t.country.toLowerCase() === countryMeta.country.toLowerCase(),
          ) || null;
      }
    }
  } catch (err) {
    console.error("Error reading country templates:", err);
  }

  if (!countryTemplate) {
    countryTemplate =
      DEFAULT_COUNTRY_TEMPLATES[customSlug] ||
      Object.values(DEFAULT_COUNTRY_TEMPLATES).find((t) => t.slug === customSlug) ||
      null;
  }

  // Fetch linked products
  let linkedProducts: any[] = [];
  if (countryTemplate?.featuredProductIds && countryTemplate.featuredProductIds.length > 0) {
    try {
      const ids = countryTemplate.featuredProductIds.filter(Boolean);
      const { data: prodData, error } = await supabase
        .from("products_public")
        .select(
          "id, name, slug, short_description, image_url, images, product_categories(slug, name)",
        )
        .in("id", ids);

      let matched = (!error && prodData) ? [...prodData] : [];
      if (matched.length < ids.length) {
        const { data: slugData } = await supabase
          .from("products_public")
          .select(
            "id, name, slug, short_description, image_url, images, product_categories(slug, name)",
          )
          .in("slug", ids);
        if (slugData && slugData.length > 0) {
          const existingIds = new Set(matched.map((p) => p.id));
          for (const sp of slugData) {
            if (!existingIds.has(sp.id)) {
              matched.push(sp);
            }
          }
        }
      }

      if (matched.length === 0) {
        const { data: directData } = await supabase
          .from("products")
          .select("id, name, slug, short_description, image_url, images")
          .in("id", ids);
        if (directData && directData.length > 0) {
          matched = directData;
        }
      }

      if (matched.length > 0) {
        matched.sort((a, b) => {
          const idxA = ids.indexOf(a.id) !== -1 ? ids.indexOf(a.id) : ids.indexOf(a.slug);
          const idxB = ids.indexOf(b.id) !== -1 ? ids.indexOf(b.id) : ids.indexOf(b.slug);
          return (idxA === -1 ? 999 : idxA) - (idxB === -1 ? 999 : idxB);
        });
      }
      linkedProducts = matched;
    } catch (err) {
      console.error("Error loading products for country template:", err);
    }
  }

  if (linkedProducts.length === 0) {
    try {
      const { data: defaultProds } = await supabase
        .from("products_public")
        .select(
          "id, name, slug, short_description, image_url, images, product_categories(slug, name)",
        )
        .limit(3);
      if (defaultProds && defaultProds.length > 0) {
        linkedProducts = defaultProds;
      }
    } catch {
      // ignore fallback error
    }
  }

  if (linkedProducts.length === 0) {
    linkedProducts = [
      {
        id: "hdpe-smooth",
        name: "GSE Smooth HDPE Geomembrane",
        slug: "gse-hdpe-liner-smooth-geomembrane",
        short_description: "High-density polyethylene lining for TSF, water reservoirs, and landfill containment.",
        image_url: "https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=600&q=80",
      },
      {
        id: "bidim-geotextile",
        name: "Bidim Non-Woven Geotextile",
        slug: "bidim-non-woven-continuous-filament-geotextile",
        short_description: "Continuous filament non-woven geotextile for cushion protection, filtration, and drainage.",
        image_url: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=600&q=80",
      },
    ];
  }

  // Fetch featured case studies
  let caseStudies: any[] = [];
  try {
    const countryName = countryTemplate?.country || "";
    if (countryName) {
      const { data: cData } = await supabase
        .from("case_studies")
        .select("id, title, slug, summary, location, country, hero_image_url")
        .eq("status", "published")
        .ilike("country", `%${countryName}%`)
        .limit(3);
      caseStudies = cData || [];
    }

    if (caseStudies.length === 0) {
      const { data: fallbackData } = await supabase
        .from("case_studies")
        .select("id, title, slug, summary, location, country, hero_image_url")
        .eq("status", "published")
        .order("project_year", { ascending: false })
        .limit(3);
      caseStudies = fallbackData || [];
    }
  } catch (err) {
    console.error("Error loading case studies for country:", err);
  }

  return {
    countryTemplate,
    linkedProducts,
    caseStudies,
  };
}

const COUNTRY_SEO_MAP: Record<
  string,
  { country: string; title: string; description: string; keywords: string }
> = {
  "gse-hdpe-liner-smooth-geomembrane-supplier-south-africa": {
    country: "South Africa",
    title: "GSE HDPE Liner & Smooth Geomembrane Supplier South Africa | Geosynthetics Africa",
    description:
      "Geosynthetics Africa is a leading supplier and IAGI-certified installer of GSE HDPE liners and smooth geomembranes in South Africa. Contact our Johannesburg head office.",
    keywords:
      "GSE HDPE Liner, smooth geomembrane supplier, South Africa geomembrane, geosynthetics installation South Africa",
  },
  "botswana-geomembranes-hdpe-geotextiles-geogrids-supplier": {
    country: "Botswana",
    title: "Botswana Geomembranes, HDPE, Geotextiles & Geogrids Supplier | Geosynthetics Africa",
    description:
      "Leading supplier of HDPE geomembranes, geotextiles, and geogrids for mining and infrastructure projects in Botswana. Reliable cross-border logistics to Gaborone.",
    keywords:
      "Botswana geomembranes, HDPE supplier Botswana, geotextiles Gaborone, geogrids Botswana",
  },
  "tanzania-geosynthetics-supplier-hdpe-liners-geotextiles-geogrids": {
    country: "Tanzania",
    title:
      "Tanzania Geosynthetics Supplier — HDPE Liners, Geotextiles, Geogrids | Geosynthetics Africa",
    description:
      "High-quality HDPE liners, geotextiles, and geogrids for mining TSF and water containment projects in Tanzania. East Africa operations hub.",
    keywords:
      "Tanzania geosynthetics, HDPE liners Tanzania, geotextiles Dar es Salaam, geogrids Tanzania",
  },
  "zimbabwe-river-rehabilitation-jutesoillock-292-erosion-control": {
    country: "Zimbabwe",
    title:
      "Zimbabwe River Rehabilitation & JuteSoilLock 292 Erosion Control | Geosynthetics Africa",
    description:
      "Erosion control, river rehabilitation, and JuteSoilLock 292 supply and installation in Zimbabwe. Technical support and logistics cleared to Harare.",
    keywords:
      "Zimbabwe river rehabilitation, JuteSoilLock 292, erosion control Zimbabwe, Harare geosynthetics",
  },
  "zambia-hdpe-liners-bidim-geotextiles-geogrids-supplier": {
    country: "Zambia",
    title: "Zambia HDPE Liners, Bidim Geotextiles & Geogrids Supplier | Geosynthetics Africa",
    description:
      "Premium HDPE liners, Bidim geotextiles, and geogrids supplier in Zambia. Specializing in mining TSF lining and agricultural reservoirs.",
    keywords: "Zambia HDPE liners, Bidim geotextiles Zambia, geogrids Lusaka, mining lining Zambia",
  },
  "drc-congo-geosynthetics-bidim-hdpe-geomembranes-supplier": {
    country: "Democratic Republic of Congo (DRC)",
    title: "DRC Congo Geosynthetics — Bidim HDPE Geomembranes Supplier | Geosynthetics Africa",
    description:
      "Bidim geotextiles and HDPE geomembranes supplier in the Democratic Republic of Congo (DRC) for mining and heavy confinement projects.",
    keywords: "DRC geosynthetics, Bidim Congo, HDPE geomembranes DRC, Kolwezi mining lining",
  },
  "kenya-geosynthetics-supplier-contact": {
    country: "Kenya",
    title: "Kenya Geosynthetics Supplier — Contact & Technical Support | Geosynthetics Africa",
    description:
      "Contact Geosynthetics Africa for premium agricultural and municipal water containment supply and lining installations in Kenya.",
    keywords:
      "Kenya geosynthetics, geomembrane supplier Kenya, Nairobi lining installations, water containment Kenya",
  },
  "cote-divoire-geosynthetics-supplier-contact": {
    country: "Côte d'Ivoire",
    title: "Côte d'Ivoire Geosynthetics Supplier — Contact & Supply | Geosynthetics Africa",
    description:
      "Contact our West Africa hub in Abidjan for geosynthetics supply, coastal erosion control, and port infrastructure projects in Côte d'Ivoire.",
    keywords:
      "Côte d'Ivoire geosynthetics, Abidjan geomembrane supplier, coastal erosion Côte d'Ivoire",
  },
  "mozambique-geosynthetics-supplier-contact": {
    country: "Mozambique",
    title: "Mozambique Geosynthetics Supplier — Maputo Regional Office | Geosynthetics Africa",
    description:
      "Contact our Maputo regional hub for coastal works supply, geosynthetic clay liners (GCL), and geomembrane installation QA/QC in Mozambique.",
    keywords:
      "Mozambique geosynthetics, Maputo geomembrane, GCL Mozambique, coastal works Mozambique",
  },
  "ghana-geosynthetics-supplier-contact": {
    country: "Ghana",
    title: "Ghana Geosynthetics Supplier — West Africa Mining Hub | Geosynthetics Africa",
    description:
      "Contact Geosynthetics Africa in Accra for West African gold mining TSF lining projects, geosynthetics supply, and IAGI-certified installations.",
    keywords:
      "Ghana geosynthetics, Accra geomembrane supplier, gold mining TSF Ghana, geosynthetics West Africa",
  },
  "namibia-geosynthetics-supplier-contact": {
    country: "Namibia",
    title: "Namibia Geosynthetics Supplier — Windhoek Logistics Hub | Geosynthetics Africa",
    description:
      "Contact our Windhoek office for uranium mining lining, water conservation reservoirs, and geosynthetics supply across Namibia.",
    keywords: "Namibia geosynthetics, Windhoek geomembrane supplier, uranium mining lining Namibia",
  },
};

/**
 * Root-level catch-all route that handles custom SEO slugs, services, industries, and applications.
 * Keep the custom SEO slugs visible in the browser URL bar.
 */
export const Route = createFileRoute("/$slug")({
  loader: async ({ params }) => {
    const customSlug = params.slug;

    // Check if it's a country-specific SEO page slug or country template
    const countryLoaderData = await loadCountryData(customSlug);
    if (countryLoaderData.countryTemplate) {
      return { type: "country" as const, loaderData: countryLoaderData };
    }

    // 1. Try resolving to custom SEO path for static core pages first
    const originalPath = await resolveSlugToPath(customSlug);
    if (originalPath && PAGE_COMPONENTS[originalPath]) {
      const seoMap = await fetchSeoPages();
      const seo = seoMap[originalPath] || null;
      const extraData: any = {};
      if (originalPath === "/contacts") {
        const { data: contentData } = await supabase
          .from("site_config")
          .select("value")
          .eq("key", "contacts_page_content")
          .maybeSingle();
        const { data: regionalData } = await supabase
          .from("site_config")
          .select("value")
          .eq("key", "regional_coverage")
          .maybeSingle();
        extraData.content = contentData?.value || null;
        extraData.regionalCoverage = regionalData?.value || null;

        const { data: caseStudies } = await supabase
          .from("case_studies")
          .select("id, title, slug, summary, location, country, hero_image_url")
          .eq("status", "published")
          .order("project_year", { ascending: false })
          .order("created_at", { ascending: false })
          .limit(3);
        extraData.caseStudies = caseStudies || [];
      } else if (originalPath === "/industries") {
        const { data: rows } = await supabase
          .from("site_config")
          .select("key, value")
          .in("key", ["template_industries", "hierarchy_industries"]);
        extraData.templates =
          (rows?.find((r) => r.key === "template_industries")?.value as Record<string, any>) || {};
        extraData.hierarchy =
          (rows?.find((r) => r.key === "hierarchy_industries")?.value as any) || null;
      }
      return { type: "core" as const, originalPath, seo, ...extraData };
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
      isDynamicService = items.some(
        (item: any) => item.slug === customSlug || item.id === customSlug,
      );

      if (!isDynamicService) {
        const { data: templatesData } = await supabase
          .from("site_config")
          .select("value")
          .eq("key", "template_services")
          .maybeSingle();
        const templates = (templatesData?.value as Record<string, any>) || {};
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
      isDynamicIndustry = items.some(
        (item: any) => item.slug === customSlug || item.id === customSlug,
      );

      if (!isDynamicIndustry) {
        const { data: templatesData } = await supabase
          .from("site_config")
          .select("value")
          .eq("key", "template_industries")
          .maybeSingle();
        const templates = (templatesData?.value as Record<string, any>) || {};
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
        const templates = (templatesData?.value as Record<string, any>) || {};
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
      const description =
        templateData?.seo?.description ||
        `Professional ${label.toLowerCase()} services by Geosynthetics Africa.`;
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
      const description =
        templateData?.seo?.description ||
        `High-performance geosynthetic solutions for the ${label.toLowerCase()} sector.`;
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
      const description =
        templateData?.seo?.description ||
        `Explore our advanced ${label.toLowerCase()} applications and projects.`;
      return {
        meta: [
          { title },
          { name: "description", content: description },
          { property: "og:title", content: title },
          { property: "og:description", content: description },
        ],
      };
    }

    if (loaderData.type === "country") {
      const { countryTemplate } = loaderData.loaderData;
      const title =
        countryTemplate?.seo?.title ||
        `${countryTemplate?.country || "Pan-African"} Geosynthetics Supplier — Geosynthetics Africa`;
      const description =
        countryTemplate?.seo?.description ||
        `High-performance geosynthetic solutions, material supply, installation and QA/QC in ${countryTemplate?.country}.`;
      const meta: any[] = [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
      ];
      if (countryTemplate?.seo?.keywords) {
        meta.push({ name: "keywords", content: countryTemplate.seo.keywords });
      }
      return { meta };
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

  if (loaderData.type === "country") {
    return (
      <Suspense
        fallback={
          <div className="flex min-h-[60vh] items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          </div>
        }
      >
        <CountryPageLazy data={loaderData.loaderData} />
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
      <PageComponent data={loaderData} />
    </Suspense>
  );
}
