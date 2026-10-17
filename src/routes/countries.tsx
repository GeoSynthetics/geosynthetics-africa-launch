import { createFileRoute } from "@tanstack/react-router";
import { fetchCountryTemplates } from "@/hooks/use-country-templates";
import { DEFAULT_COUNTRY_TEMPLATES, type CountryTemplate } from "@/types/country-template";
import { regionForCountry } from "@/data/country-expansion";
import { CountriesPage, type CountryLink } from "@/pages/CountriesPage";
import { SITE_URL } from "@/lib/site-url";

export function toCountryLinks(templates: Record<string, CountryTemplate>): CountryLink[] {
  const seen = new Set<string>();
  const links: CountryLink[] = [];
  for (const t of Object.values(templates)) {
    if (!t?.slug || !t.country) continue;
    const key = t.country.trim().toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    links.push({
      country: t.country,
      slug: t.slug,
      flag: t.flag,
      region: regionForCountry(t.country),
      summary: t.badge,
    });
  }
  return links;
}

export const Route = createFileRoute("/countries")({
  loader: async () => {
    try {
      return { countries: toCountryLinks(await fetchCountryTemplates()) };
    } catch {
      return { countries: toCountryLinks(DEFAULT_COUNTRY_TEMPLATES) };
    }
  },
  head: ({ loaderData }) => {
    const count = loaderData?.countries.length || 0;
    const title = "Countries We Serve | Geosynthetics Supplier & Installer Across Africa";
    const description = `Geomembranes, GCLs, geotextiles and geogrids supplied, installed and tested in ${count} African countries across Southern, East, West, Central and North Africa.`;
    const itemList = {
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: "Countries served by Geosynthetics Africa",
      itemListElement: (loaderData?.countries || []).map((c, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: `Geosynthetics ${c.country}`,
        url: `${SITE_URL}/${c.slug}`,
      })),
    };
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
      ],
      scripts: [{ type: "application/ld+json", children: JSON.stringify(itemList) }],
    };
  },
  component: CountriesRoute,
});

function CountriesRoute() {
  const { countries } = Route.useLoaderData();
  return <CountriesPage countries={countries} />;
}
