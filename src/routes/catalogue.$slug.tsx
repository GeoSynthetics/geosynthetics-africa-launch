import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { ProductDetailPage } from "@/pages";

interface KeyFeature {
  label: string;
  icon?: string;
}
interface SpecRow {
  property: string;
  test_method?: string;
  unit?: string;
  typical_value?: string;
}
interface StripItem {
  title: string;
  subtitle?: string;
  image_url?: string;
}

interface ProductRow {
  id: string;
  name: string;
  slug: string;
  sku: string | null;
  short_description: string | null;
  long_description: string | null;
  price: number | null;
  sale_price: number | null;
  stock_quantity: number | null;
  image_url: string | null;
  images: string[] | null;
  category_id: string | null;
  manufacturer_id: string | null;
  key_features: KeyFeature[] | null;
  specifications: SpecRow[] | null;
  applications: StripItem[] | null;
  compatible_systems: StripItem[] | null;
  datasheet_url: string | null;
  installation_guide_url: string | null;
  qa_checklist_url: string | null;
  chemical_resistance_url: string | null;
  material: string | null;
  structure: string | null;
  colour: string | null;
  standard: string | null;
  roll_width: string | null;
  roll_length: string | null;
  meta_title: string | null;
  meta_description: string | null;
  seo_keywords: string | null;
  product_categories: {
    id: string;
    name: string;
    slug: string | null;
    selection_guide_url?: string | null;
  } | null;
  manufacturers: { id: string; name: string } | null;
  alternative_ids?: string[] | null;
  system_component_ids?: string[] | null;
  family_slug?: string | null;
}

interface RelatedProduct {
  id: string;
  name: string;
  slug: string;
  image_url: string | null;
  images: string[] | null;
  product_categories: { name: string } | null;
}

const PRODUCT_SELECT =
  "id, name, slug, sku, short_description, long_description, price, sale_price, stock_quantity, image_url, images, category_id, manufacturer_id, key_features, specifications, applications, compatible_systems, datasheet_url, installation_guide_url, qa_checklist_url, chemical_resistance_url, material, structure, colour, standard, roll_width, roll_length, meta_title, meta_description, seo_keywords, alternative_ids, system_component_ids, family_slug, product_categories(id, name, slug, selection_guide_url), manufacturers(id, name)";

async function loadProduct(slug: string) {
  // Try the rich select first; if columns don't exist yet, fall back to a minimal select.
  let { data, error } = await supabase
    .from("products_public")
    .select(PRODUCT_SELECT)
    .eq("slug", slug)
    .eq("is_active", true)
    .maybeSingle();

  if (error && /column .* does not exist/i.test(error.message)) {
    const fallback = await supabase
      .from("products_public")
      .select(
        "id, name, slug, sku, short_description, price, sale_price, stock_quantity, image_url, images, category_id, manufacturer_id, product_categories(id, name, slug), manufacturers(id, name)",
      )
      .eq("slug", slug)
      .eq("is_active", true)
      .maybeSingle();
    if (fallback.error) throw fallback.error;
    data = fallback.data as never;
  } else if (error) {
    throw error;
  }
  if (!data) throw notFound();

  const product = data as unknown as ProductRow;

  // 1. Fetch alternatives from Supabase using alternative_ids
  let alternatives: RelatedProduct[] = [];
  if (product.alternative_ids && product.alternative_ids.length > 0) {
    const { data: altData } = await supabase
      .from("products_public")
      .select("id, name, slug, image_url, images, product_categories(name)")
      .eq("is_active", true)
      .in("id", product.alternative_ids);
    alternatives = (altData ?? []) as unknown as RelatedProduct[];
  } else {
    // Fallback to fetching other products in the same category
    const { data: catData } = await supabase
      .from("products_public")
      .select("id, name, slug, image_url, images, product_categories(name)")
      .eq("is_active", true)
      .neq("id", product.id)
      .eq("category_id", product.category_id ?? "00000000-0000-0000-0000-000000000000")
      .limit(4);
    alternatives = (catData ?? []) as unknown as RelatedProduct[];
  }

  // 2. Fetch system components from Supabase using system_component_ids
  let systemComponents: RelatedProduct[] = [];
  if (product.system_component_ids && product.system_component_ids.length > 0) {
    const { data: sysData } = await supabase
      .from("products_public")
      .select("id, name, slug, image_url, images, product_categories(name)")
      .eq("is_active", true)
      .in("id", product.system_component_ids);
    systemComponents = (sysData ?? []) as unknown as RelatedProduct[];
  }

  // 3. Fetch product family template from site_config
  let familyData = null;
  if (product.family_slug) {
    const { data: templateRes } = await supabase
      .from("site_config")
      .select("value")
      .eq("key", "template_product_categories")
      .maybeSingle();
    const templates = (templateRes?.value as Record<string, any>) || {};
    familyData = templates[product.family_slug] || null;
  }

  // 4. Fetch dynamic Case Studies linked to this product
  let caseStudies: any[] = [];
  const { data: casesData } = await supabase
    .from("case_study_products")
    .select("case_studies(id, title, slug, summary, location, country, hero_image_url)")
    .eq("product_id", product.id);

  if (casesData) {
    caseStudies = casesData.map((item: any) => item.case_studies).filter(Boolean);
  }

  return { product, alternatives, systemComponents, familyData, caseStudies };
}

function ProductDetailSkeleton() {
  return (
    <div className="w-full">
      {/* Breadcrumb + Hero with background skeleton */}
      <section className="relative bg-surface-dark text-surface-dark-foreground overflow-hidden py-12 md:py-16">
        <div className="relative container-page">
          <nav className="flex items-center gap-2 mb-8">
            <Skeleton className="h-3 w-12 bg-white/20" />
            <span className="text-white/30 text-xs">/</span>
            <Skeleton className="h-3 w-16 bg-white/20" />
            <span className="text-white/30 text-xs">/</span>
            <Skeleton className="h-3 w-24 bg-white/20" />
          </nav>

          <div className="max-w-2xl">
            {/* Category skeleton */}
            <Skeleton className="h-4 w-32 bg-primary/30 mb-4" />

            {/* Title skeleton */}
            <Skeleton className="h-12 md:h-16 w-3/4 bg-white/20 mb-6" />

            {/* Short description skeleton */}
            <div className="space-y-2 mb-8">
              <Skeleton className="h-4 w-full bg-white/20" />
              <Skeleton className="h-4 w-5/6 bg-white/20" />
            </div>

            {/* Key features skeleton */}
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-4 max-w-2xl mb-8">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex flex-col items-center">
                  <Skeleton className="h-12 w-12 rounded-full bg-white/10 border border-white/20" />
                  <Skeleton className="h-3 w-16 bg-white/20 mt-2" />
                </div>
              ))}
            </div>

            {/* CTAs skeleton */}
            <div className="flex flex-wrap gap-3">
              <Skeleton className="h-11 w-44 bg-primary/45" />
              <Skeleton className="h-11 w-44 bg-white/20" />
              <Skeleton className="h-11 w-44 bg-white/20" />
            </div>
          </div>
        </div>
      </section>

      {/* Tabs skeleton */}
      <div className="border-b border-border bg-background py-4 sticky z-30 shadow-sm top-[72px] md:top-[96px]">
        <div className="container-page flex gap-2 md:gap-4 overflow-x-auto no-scrollbar">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-8 w-24 shrink-0" />
          ))}
        </div>
      </div>

      {/* Body section skeleton */}
      <section className="bg-background">
        <div className="container-page py-12 grid lg:grid-cols-12 gap-10">
          {/* Main column */}
          <div className="lg:col-span-8 space-y-14">
            {/* Overview */}
            <div>
              <Skeleton className="h-7 w-32 mb-5" />
              <div className="grid md:grid-cols-3 gap-6">
                <div className="md:col-span-2 space-y-3">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-5/6" />
                  <Skeleton className="h-4 w-4/5" />
                </div>
                <div className="rounded border border-border p-4 space-y-3">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div
                      key={i}
                      className="flex justify-between py-1 border-b border-border/50 last:border-0"
                    >
                      <Skeleton className="h-4 w-16" />
                      <Skeleton className="h-4 w-24" />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Specifications */}
            <div>
              <Skeleton className="h-7 w-44 mb-5" />
              <div className="border border-border rounded overflow-hidden">
                <div className="bg-surface p-3 flex justify-between">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-12" />
                  <Skeleton className="h-4 w-24" />
                </div>
                <div className="p-3 divide-y divide-border space-y-3">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="flex justify-between pt-3 first:pt-0">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-4 w-20" />
                      <Skeleton className="h-4 w-12" />
                      <Skeleton className="h-4 w-16" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <aside className="lg:col-span-4 space-y-5">
            {/* Need help */}
            <div className="rounded border border-border bg-card p-5 space-y-3">
              <Skeleton className="h-5 w-24" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-9 w-full mt-4" />
            </div>

            {/* Quote form */}
            <div className="rounded border border-border bg-card p-5 space-y-3">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-9 w-full" />
              <Skeleton className="h-9 w-full" />
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          </aside>
        </div>
      </section>
    </div>
  );
}

export const Route = createFileRoute("/catalogue/$slug")({
  ssr: false,
  loader: ({ params }) => loadProduct(params.slug),
  pendingComponent: ProductDetailSkeleton,
  pendingMs: 0,
  head: ({ loaderData }) => {
    const p = loaderData?.product;
    const title = p
      ? p.meta_title?.trim() || `${p.name} — Geosynthetics Africa`
      : "Product — Geosynthetics Africa";
    const desc =
      p?.meta_description?.trim() ||
      p?.short_description ||
      "Engineered geosynthetic product specified, supplied and certified by Geosynthetics Africa.";
    const keywords = p?.seo_keywords?.trim();
    const img = p?.image_url || p?.images?.[0] || undefined;
    return {
      meta: [
        { title },
        { name: "description", content: desc },
        ...(keywords ? [{ name: "keywords", content: keywords }] : []),
        { property: "og:title", content: title },
        { property: "og:description", content: desc },
        { property: "og:type", content: "product" },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: title },
        { name: "twitter:description", content: desc },
        ...(img
          ? [
              { property: "og:image", content: img },
              { name: "twitter:image", content: img },
            ]
          : []),
      ],
      links: p
        ? [{ rel: "canonical", href: `https://geosynthetics.co.za/catalogue/${p.slug}` }]
        : [],
    };
  },
  errorComponent: ({ error }) => (
    <div className="container-page py-20 text-center">
      <h1 className="font-display text-2xl font-bold uppercase">Something went wrong</h1>
      <p className="mt-2 text-muted-foreground">{error.message}</p>
      <Button asChild className="mt-6">
        <Link to="/catalogue" search={{ q: "", cats: [], mans: [], sort: "newest" }}>
          Back to catalogue
        </Link>
      </Button>
    </div>
  ),
  notFoundComponent: () => (
    <div className="container-page py-20 text-center">
      <h1 className="font-display text-3xl font-bold uppercase">Product not found</h1>
      <p className="mt-2 text-muted-foreground">That product isn't in our catalogue.</p>
      <Button asChild className="mt-6 bg-primary hover:bg-primary-hover">
        <Link to="/catalogue" search={{ q: "", cats: [], mans: [], sort: "newest" }}>
          Back to catalogue
        </Link>
      </Button>
    </div>
  ),
  component: ProductDetailPage,
});
