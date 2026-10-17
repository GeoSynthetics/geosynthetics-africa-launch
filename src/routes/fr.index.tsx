import { createFileRoute } from "@tanstack/react-router";
import { LocalizedLandingPage } from "@/pages/LocalizedLandingPage";
import { loadLocalizedPage, localizedHead } from "@/i18n/localized-route";

export const Route = createFileRoute("/fr/")({
  loader: () => loadLocalizedPage("fr", ""),
  head: ({ loaderData }) => localizedHead(loaderData?.page),
  component: () => <LocalizedLandingPage page={Route.useLoaderData().page} />,
});
