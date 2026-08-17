import { JsonLd } from "./JsonLd";

interface BlogPostingSchemaProps {
  title: string;
  description: string;
  slug: string;
  coverImage?: string | null;
  publishedAt?: string | null;
  updatedAt?: string | null;
  authorName?: string | null;
}

/**
 * BlogPosting structured data for individual blog posts.
 * Generates Article rich results with author, dates, and publisher info.
 *
 * @see https://schema.org/BlogPosting
 * @see https://developers.google.com/search/docs/appearance/structured-data/article
 */
export function BlogPostingSchema({
  title,
  description,
  slug,
  coverImage,
  publishedAt,
  updatedAt,
  authorName,
}: BlogPostingSchemaProps) {
  const articleUrl = `https://geosynthetics.co.za/blog/${slug}`;

  const schema: Record<string, unknown> = {
    "@type": "BlogPosting",
    headline: title,
    description,
    url: articleUrl,
    mainEntityOfPage: { "@type": "WebPage", "@id": articleUrl },
    publisher: {
      "@type": "Organization",
      name: "Geosynthetics Africa",
      url: "https://geosynthetics.co.za",
    },
  };

  if (coverImage) {
    schema.image = coverImage;
  }

  if (publishedAt) {
    schema.datePublished = new Date(publishedAt).toISOString();
  }

  if (updatedAt) {
    schema.dateModified = new Date(updatedAt).toISOString();
  } else if (publishedAt) {
    schema.dateModified = new Date(publishedAt).toISOString();
  }

  if (authorName) {
    schema.author = { "@type": "Person", name: authorName };
  }

  return <JsonLd data={schema} />;
}
