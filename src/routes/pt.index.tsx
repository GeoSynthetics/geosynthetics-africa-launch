import { createFileRoute } from "@tanstack/react-router";
import { LocalizedLandingPage } from "@/pages/LocalizedLandingPage";
import { loadLocalizedPage, localizedHead } from "@/i18n/localized-route";

export const Route = createFileRoute("/pt/")({
  loader: () => loadLocalizedPage("pt", ""),
  head: ({ loaderData }) => localizedHead(loaderData?.page),
  component: () => <LocalizedLandingPage page={Route.useLoaderData().page} />,
});
