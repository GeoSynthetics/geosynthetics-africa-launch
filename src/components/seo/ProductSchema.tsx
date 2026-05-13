import { JsonLd } from "./JsonLd";

interface ProductSchemaProps {
  name: string;
  description: string;
  slug: string;
  image?: string | null;
  sku?: string | null;
  category?: string | null;
  manufacturer?: string | null;
  price?: number | null;
  inStock?: boolean;
  material?: string | null;
}

/**
 * Product structured data for individual catalogue pages.
 * Generates Google-compliant Product schema for rich product snippets.
 *
 * @see https://schema.org/Product
 * @see https://developers.google.com/search/docs/appearance/structured-data/product
 */
export function ProductSchema({
  name,
  description,
  slug,
  image,
  sku,
  category,
  manufacturer,
  price,
  inStock,
  material,
}: ProductSchemaProps) {
  const productUrl = `https://geosynthetics.co.za/catalogue/${slug}`;

  const schema: Record<string, unknown> = {
    "@type": "Product",
    name,
    description,
    url: productUrl,
    brand: {
      "@type": "Brand",
      name: manufacturer || "Geosynthetics Africa",
    },
    manufacturer: {
      "@type": "Organization",
      name: manufacturer || "Geosynthetics Africa",
    },
  };

  if (image) {
    schema.image = image;
  }

  if (sku) {
    schema.sku = sku;
    schema.productID = sku;
  }

  if (category) {
    schema.category = category;
  }

  if (material) {
    schema.material = material;
  }

  // Offers — only include if we have meaningful availability info
  const offers: Record<string, unknown> = {
    "@type": "Offer",
    url: productUrl,
    availability: inStock
      ? "https://schema.org/InStock"
      : "https://schema.org/PreOrder",
    priceCurrency: "ZAR",
    seller: {
      "@type": "Organization",
      name: "Geosynthetics Africa",
    },
  };

  // Only include price if available (prices are hidden for non-authenticated users)
  if (price !== null && price !== undefined && price > 0) {
    offers.price = price.toFixed(2);
  } else {
    // Use 0 to indicate "contact for price" — required by Google if Offer is present
    offers.price = "0";
    offers.priceValidUntil = new Date(
      Date.now() + 365 * 24 * 60 * 60 * 1000,
    )
      .toISOString()
      .split("T")[0];
  }

  schema.offers = offers;

  return <JsonLd data={schema} />;
}
