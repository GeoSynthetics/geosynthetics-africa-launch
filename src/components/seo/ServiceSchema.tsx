import { JsonLd } from "./JsonLd";
import { SITE_URL, ORGANIZATION_ID, absoluteUrl } from "@/lib/site-url";

interface ServiceSchemaProps {
  name: string;
  description: string;
  /** Site path of the service page, e.g. /services/geomembrane-liner-installation-africa */
  path: string;
  serviceType?: string;
  image?: string | null;
}

/**
 * Service structured data for a service detail page. The provider points at
 * the global Organization (@id), so search engines and AI assistants connect
 * each service to Geosynthetics Africa.
 *
 * @see https://schema.org/Service
 */
export function ServiceSchema({ name, description, path, serviceType, image }: ServiceSchemaProps) {
  const url = absoluteUrl(path);
  const schema: Record<string, unknown> = {
    "@type": "Service",
    "@id": `${url}#service`,
    name,
    description,
    url,
    serviceType: serviceType || name,
    provider: { "@id": ORGANIZATION_ID },
    areaServed: { "@type": "Continent", name: "Africa" },
  };
  if (image && /^https?:\/\//.test(image)) schema.image = image;
  else if (image?.startsWith("/")) schema.image = `${SITE_URL}${image}`;

  return <JsonLd data={schema} />;
}
