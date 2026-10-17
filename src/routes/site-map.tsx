import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/site/PageHero";
import { collectSitemapEntries, SITEMAP_SECTIONS, type SitemapEntry } from "@/lib/sitemap";

/**
 * /site-map — every page on the site, grouped by section. Helps visitors find
 * pages and gives search engines a crawlable link to every URL.
 */
export const Route = createFileRoute("/site-map")({
  loader: async () => {
    const entries = await collectSitemapEntries();
    // Images are only needed in the XML sitemap
    return { entries: entries.map(({ images: _images, ...rest }) => rest) as SitemapEntry[] };
  },
  head: () => {
    const title = "Site Map | Geosynthetics Africa";
    const description =
      "Every page on Geosynthetics Africa: products, applications, services, industries, the product catalogue, projects, blog, countries served and French and Portuguese pages.";
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
      ],
    };
  },
  component: SiteMapPage,
});

function SiteMapPage() {
  const { entries } = Route.useLoaderData();
  return (
    <>
      <PageHero
        eyebrow="Site Map"
        title="Every Page on Geosynthetics Africa"
        description={`${entries.length} pages across products, applications, services, countries and languages.`}
      />
      <section className="bg-background">
        <div className="container-page py-14 space-y-12">
          {SITEMAP_SECTIONS.map(({ key, label }) => {
            const items = entries.filter((e) => e.section === key);
            if (!items.length) return null;
            const groups = [...new Set(items.map((e) => e.group))];
            return (
              <div key={key}>
                <h2 className="font-display text-2xl font-bold uppercase tracking-wide border-b border-border pb-2">
                  {label}
                </h2>
                <div className="mt-5 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                  {groups.map((g) => (
                    <div key={g}>
                      {groups.length > 1 && (
                        <h3 className="font-display text-sm font-bold uppercase text-primary mb-2">{g}</h3>
                      )}
                      <ul className="space-y-1.5">
                        {items
                          .filter((e) => e.group === g)
                          .map((e) => (
                            <li key={e.path}>
                              <a href={e.path} className="text-sm text-muted-foreground hover:text-primary">
                                {e.title}
                              </a>
                            </li>
                          ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </>
  );
}
