import { supabase } from "@/integrations/supabase/client";

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export interface ResolvedProduct {
  id: string;
  name: string;
  slug: string;
  short_description?: string | null;
  image_url?: string | null;
  images?: string[] | null;
  product_categories?: {
    slug: string;
    name?: string;
  } | null;
  [key: string]: any;
}

/**
 * Validates whether a string matches the standard UUID format.
 * Prevents PostgreSQL 22P02 syntax errors when querying UUID columns.
 */
export function isUuid(value: string | undefined | null): boolean {
  if (!value || typeof value !== "string") return false;
  return UUID_PATTERN.test(value.trim());
}

/**
 * Safely fetches products by an array of identifiers that may be either UUIDs or URL slugs.
 * Splits identifiers into valid UUIDs and slugs to avoid PostgreSQL syntax errors,
 * executes targeted queries against `products_public`, and preserves requested order.
 */
export async function fetchProductsByIdsOrSlugs(
  identifiers: string[],
): Promise<ResolvedProduct[]> {
  const cleanIdentifiers = identifiers
    .map((id) => (typeof id === "string" ? id.trim() : ""))
    .filter(Boolean);

  if (cleanIdentifiers.length === 0) {
    return [];
  }

  const validUuids = cleanIdentifiers.filter(isUuid);
  const candidateSlugs = cleanIdentifiers.filter((id) => !isUuid(id));

  const matchedProducts: ResolvedProduct[] = [];
  const productIds = new Set<string>();

  const selectColumns =
    "id, name, slug, short_description, image_url, images, product_categories(slug, name)";

  // 1. Query by UUIDs if any are present
  if (validUuids.length > 0) {
    try {
      const { data, error } = await supabase
        .from("products_public")
        .select(selectColumns)
        .in("id", validUuids);

      if (!error && data) {
        for (const item of data) {
          if (!productIds.has(item.id)) {
            productIds.add(item.id);
            matchedProducts.push(normalizeProductCategory(item));
          }
        }
      }
    } catch (err) {
      console.error("Error querying products by UUID:", err);
    }
  }

  // 2. Query by slug for non-UUID strings (or any unmatched identifier)
  if (candidateSlugs.length > 0) {
    try {
      const { data, error } = await supabase
        .from("products_public")
        .select(selectColumns)
        .in("slug", candidateSlugs);

      if (!error && data) {
        for (const item of data) {
          if (!productIds.has(item.id)) {
            productIds.add(item.id);
            matchedProducts.push(normalizeProductCategory(item));
          }
        }
      }
    } catch (err) {
      console.error("Error querying products by slug:", err);
    }
  }

  // 3. If nothing matched and we have direct table access fallback
  if (matchedProducts.length === 0 && validUuids.length > 0) {
    try {
      const { data } = await supabase
        .from("products")
        .select("id, name, slug, short_description, image_url, images")
        .in("id", validUuids);

      if (data && data.length > 0) {
        for (const item of data) {
          if (!productIds.has(item.id)) {
            productIds.add(item.id);
            matchedProducts.push(item);
          }
        }
      }
    } catch {
      // Ignore fallback error
    }
  }

  // 4. Sort results according to the original input identifiers order
  matchedProducts.sort((a, b) => {
    const indexA = cleanIdentifiers.indexOf(a.id) !== -1
      ? cleanIdentifiers.indexOf(a.id)
      : cleanIdentifiers.indexOf(a.slug);
    const indexB = cleanIdentifiers.indexOf(b.id) !== -1
      ? cleanIdentifiers.indexOf(b.id)
      : cleanIdentifiers.indexOf(b.slug);

    const sortA = indexA === -1 ? Number.MAX_SAFE_INTEGER : indexA;
    const sortB = indexB === -1 ? Number.MAX_SAFE_INTEGER : indexB;

    return sortA - sortB;
  });

  return matchedProducts;
}

function normalizeProductCategory(product: any): ResolvedProduct {
  return {
    ...product,
    product_categories: Array.isArray(product.product_categories)
      ? product.product_categories[0] || null
      : product.product_categories || null,
  };
}
