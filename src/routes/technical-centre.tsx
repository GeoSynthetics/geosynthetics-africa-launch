import { createFileRoute } from "@tanstack/react-router";
import { TechnicalCentrePage } from "@/pages/TechnicalCentrePage";

export const Route = createFileRoute("/technical-centre")({
  head: () => {
    const title = "Geosynthetics Technical Centre Africa | Selection & QA";
    const description =
      "Select geosynthetics for African projects. Review material functions, specification inputs, installation controls and QA/QC records. Request a technical proposal.";
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { name: "twitter:title", content: title },
        { name: "twitter:description", content: description },
      ],
    };
  },
  component: TechnicalCentrePage,
});
