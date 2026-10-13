import { createFileRoute } from "@tanstack/react-router";
import { GenericContentPage } from "@/pages/GenericContentPage";
import {
  fetchCompanyPageTemplates,
} from "@/hooks/use-company-page-templates";
import { DEFAULT_COMPANY_PAGE_TEMPLATES } from "@/types/company-page-template";

export const Route = createFileRoute("/sustainability")({
  loader: async () => {
    try {
      const templates = await fetchCompanyPageTemplates();
      return { template: templates["sustainability"] || DEFAULT_COMPANY_PAGE_TEMPLATES["sustainability"] };
    } catch {
      return { template: DEFAULT_COMPANY_PAGE_TEMPLATES["sustainability"] };
    }
  },
  head: ({ loaderData }) => {
    const tmpl = loaderData?.template || DEFAULT_COMPANY_PAGE_TEMPLATES["sustainability"];
    const title = tmpl?.seo?.title || "Sustainability & Environmental Protection — Geosynthetics Africa";
    const desc =
      tmpl?.seo?.description ||
      "Our commitment to environmental containment, groundwater protection, and sustainable civil engineering across Africa.";
    const meta = [
      { title },
      { name: "description", content: desc },
      { property: "og:title", content: title },
      { property: "og:description", content: desc },
    ];
    if (tmpl?.seo?.keywords) {
      meta.push({ name: "keywords", content: tmpl.seo.keywords });
    }
    return { meta };
  },
  component: SustainabilityRouteComponent,
});

function SustainabilityRouteComponent() {
  const { template } = Route.useLoaderData();
  return <GenericContentPage slug="sustainability" initialTemplate={template} />;
}
