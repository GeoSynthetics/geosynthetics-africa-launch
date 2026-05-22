import { createFileRoute } from "@tanstack/react-router";
import { TrackingAdminPage } from "@/pages/TrackingAdminPage";

export const Route = createFileRoute("/admin/tracking")({
  head: () => ({
    meta: [
      { title: "Tracking & Cookies — Admin" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: TrackingAdminPage,
});
