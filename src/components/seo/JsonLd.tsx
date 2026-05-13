/**
 * Renders a JSON-LD structured data `<script>` tag.
 *
 * Usage:
 *   <JsonLd data={{ "@type": "Organization", ... }} />
 *
 * Supports single schemas or arrays (for multiple schemas on one page).
 */
export function JsonLd({ data }: { data: Record<string, unknown> | Record<string, unknown>[] }) {
  const items = Array.isArray(data) ? data : [data];
  return (
    <>
      {items.map((schema, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              ...schema,
            }),
          }}
        />
      ))}
    </>
  );
}
