import { createFileRoute } from "@tanstack/react-router";
import { GenericContentPage } from "@/pages/GenericContentPage";
import {
  fetchCompanyPageTemplates,
} from "@/hooks/use-company-page-templates";
import { DEFAULT_COMPANY_PAGE_TEMPLATES } from "@/types/company-page-template";

export const Route = createFileRoute("/terms-and-conditions")({
  loader: async () => {
    try {
      const templates = await fetchCompanyPageTemplates();
      return {
        template:
          templates["terms-and-conditions"] ||
          DEFAULT_COMPANY_PAGE_TEMPLATES["terms-and-conditions"],
      };
    } catch {
      return { template: DEFAULT_COMPANY_PAGE_TEMPLATES["terms-and-conditions"] };
    }
  },
  head: ({ loaderData }) => {
    const tmpl =
      loaderData?.template || DEFAULT_COMPANY_PAGE_TEMPLATES["terms-and-conditions"];
    const title = tmpl?.seo?.title || "Terms & Conditions — Geosynthetics Africa";
    const desc =
      tmpl?.seo?.description ||
      "Terms and conditions for Geosynthetics Africa supply, quotation, and installation services.";
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
  component: TermsAndConditionsRouteComponent,
});

function TermsAndConditionsRouteComponent() {
  const { template } = Route.useLoaderData();
  return <GenericContentPage slug="terms-and-conditions" initialTemplate={template} />;
}
