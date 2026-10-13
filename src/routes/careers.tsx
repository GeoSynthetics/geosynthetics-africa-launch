import { createFileRoute } from "@tanstack/react-router";
import { GenericContentPage } from "@/pages/GenericContentPage";
import {
  fetchCompanyPageTemplates,
} from "@/hooks/use-company-page-templates";
import { DEFAULT_COMPANY_PAGE_TEMPLATES } from "@/types/company-page-template";

export const Route = createFileRoute("/careers")({
  loader: async () => {
    try {
      const templates = await fetchCompanyPageTemplates();
      return { template: templates["careers"] || DEFAULT_COMPANY_PAGE_TEMPLATES["careers"] };
    } catch {
      return { template: DEFAULT_COMPANY_PAGE_TEMPLATES["careers"] };
    }
  },
  head: ({ loaderData }) => {
    const tmpl = loaderData?.template || DEFAULT_COMPANY_PAGE_TEMPLATES["careers"];
    const title = tmpl?.seo?.title || "Careers — Geosynthetics Africa";
    const desc =
      tmpl?.seo?.description ||
      "Explore career opportunities in geotechnical engineering and geosynthetics across Africa.";
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
  component: CareersRouteComponent,
});

function CareersRouteComponent() {
  const { template } = Route.useLoaderData();
  return <GenericContentPage slug="careers" initialTemplate={template} />;
}
