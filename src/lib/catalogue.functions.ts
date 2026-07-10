import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { notFound } from "@tanstack/react-router";

export interface KeyFeature {
  label: string;
  icon?: string;
}
export interface SpecRow {
  property: string;
  test_method?: string;
  unit?: string;
  typical_value?: string;
}
export interface StripItem {
  title: string;
  subtitle?: string;
  image_url?: string;
}

export interface ProductRow {
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

export interface RelatedProduct {
  id: string;
  name: string;
  slug: string;
  image_url: string | null;
  images: string[] | null;
  product_categories: { name: string } | null;
}

const PRODUCT_SELECT =
  "id, name, slug, sku, short_description, long_description, price, sale_price, stock_quantity, image_url, images, category_id, manufacturer_id, key_features, specifications, applications, compatible_systems, datasheet_url, installation_guide_url, qa_checklist_url, chemical_resistance_url, material, structure, colour, standard, roll_width, roll_length, meta_title, meta_description, seo_keywords, alternative_ids, system_component_ids, family_slug, product_categories(id, name, slug, selection_guide_url), manufacturers(id, name)";

export const getProductDetail = createServerFn()
  .inputValidator(
    z.object({
      slug: z.string(),
    })
  )
  .handler(async ({ data: { slug } }) => {
    // Try the rich select first; if columns don't exist yet, fall back to a minimal select.
    const result = await supabase
      .from("products_public")
      .select(PRODUCT_SELECT)
      .eq("slug", slug)
      .eq("is_active", true)
      .maybeSingle();

    let data = result.data;
    const error = result.error;

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

    // Start independent queries concurrently to eliminate network waterfalls
    const alternativesPromise = (async () => {
      if (product.alternative_ids && product.alternative_ids.length > 0) {
        const { data: altData } = await supabase
          .from("products_public")
          .select("id, name, slug, image_url, images, product_categories(name)")
          .eq("is_active", true)
          .in("id", product.alternative_ids);
        return (altData ?? []) as unknown as RelatedProduct[];
      } else {
        // Fallback to fetching other products in the same category
        const { data: catData } = await supabase
          .from("products_public")
          .select("id, name, slug, image_url, images, product_categories(name)")
          .eq("is_active", true)
          .neq("id", product.id)
          .eq("category_id", product.category_id ?? "00000000-0000-0000-0000-000000000000")
          .limit(4);
        return (catData ?? []) as unknown as RelatedProduct[];
      }
    })();

    const systemComponentsPromise = (async () => {
      if (product.system_component_ids && product.system_component_ids.length > 0) {
        const { data: sysData } = await supabase
          .from("products_public")
          .select("id, name, slug, image_url, images, product_categories(name)")
          .eq("is_active", true)
          .in("id", product.system_component_ids);
        return (sysData ?? []) as unknown as RelatedProduct[];
      }
      return [] as RelatedProduct[];
    })();

    const familyDataPromise = (async () => {
      if (product.family_slug) {
        const { data: templateRes } = await supabase
          .from("site_config")
          .select("value")
          .eq("key", "template_product_categories")
          .maybeSingle();
        const templates = (templateRes?.value as Record<string, any>) || {};
        return templates[product.family_slug] || null;
      }
      return null;
    })();

    const caseStudiesPromise = (async () => {
      const { data: casesData } = await supabase
        .from("case_study_products")
        .select("case_studies(id, title, slug, summary, location, country, hero_image_url)")
        .eq("product_id", product.id);
      if (casesData) {
        return casesData.map((item: any) => item.case_studies).filter(Boolean);
      }
      return [] as any[];
    })();

    const [alternatives, systemComponents, familyData, caseStudies] = await Promise.all([
      alternativesPromise,
      systemComponentsPromise,
      familyDataPromise,
      caseStudiesPromise,
    ]);

    return { product, alternatives, systemComponents, familyData, caseStudies };
  });
