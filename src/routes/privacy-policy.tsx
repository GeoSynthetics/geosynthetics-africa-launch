import { createFileRoute } from "@tanstack/react-router";
import { GenericContentPage } from "@/pages/GenericContentPage";
import {
  fetchCompanyPageTemplates,
} from "@/hooks/use-company-page-templates";
import { DEFAULT_COMPANY_PAGE_TEMPLATES } from "@/types/company-page-template";

export const Route = createFileRoute("/privacy-policy")({
  loader: async () => {
    try {
      const templates = await fetchCompanyPageTemplates();
      return { template: templates["privacy-policy"] || DEFAULT_COMPANY_PAGE_TEMPLATES["privacy-policy"] };
    } catch {
      return { template: DEFAULT_COMPANY_PAGE_TEMPLATES["privacy-policy"] };
    }
  },
  head: ({ loaderData }) => {
    const tmpl = loaderData?.template || DEFAULT_COMPANY_PAGE_TEMPLATES["privacy-policy"];
    const title = tmpl?.seo?.title || "Privacy Policy — Geosynthetics Africa";
    const desc =
      tmpl?.seo?.description ||
      "Privacy Policy and data protection terms for Geosynthetics Africa (Pty) Ltd.";
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
  component: PrivacyPolicyRouteComponent,
});

function PrivacyPolicyRouteComponent() {
  const { template } = Route.useLoaderData();
  return <GenericContentPage slug="privacy-policy" initialTemplate={template} />;
}
