import { createFileRoute } from "@tanstack/react-router";
import { MediaCenterPage } from "@/pages/MediaCenterPage";

export const Route = createFileRoute("/admin/media-center")({
  head: () => ({
    meta: [{ title: "Media Center — Admin" }, { name: "robots", content: "noindex" }],
  }),
  component: MediaCenterPage,
});
