import { FileText, BookOpen, Video, FileCheck, Download, type LucideIcon } from "lucide-react";

export type ResourceCategorySlug =
  | "datasheets"
  | "installation-guides"
  | "case-studies"
  | "brochures"
  | "videos";

export interface ResourceCategory {
  slug: ResourceCategorySlug;
  title: string;
  desc: string;
  icon: LucideIcon;
  /** DB `type` values that belong here */
  types: string[];
  /** Match resources whose external_url looks like a video host */
  videoOnly?: boolean;
}

export const RESOURCE_CATEGORIES: ResourceCategory[] = [
  {
    slug: "datasheets",
    title: "Datasheets",
    desc: "Technical specifications (TDS / SDS) for every product.",
    icon: FileText,
    types: ["tds", "sds"],
  },
  {
    slug: "installation-guides",
    title: "Installation Guides",
    desc: "Step-by-step installation procedures.",
    icon: BookOpen,
    types: ["manual"],
  },
  {
    slug: "case-studies",
    title: "Case Studies",
    desc: "Project success stories from across Africa.",
    icon: FileCheck,
    types: ["case_study"],
  },
  {
    slug: "brochures",
    title: "Brochures",
    desc: "Service overviews and capability statements.",
    icon: Download,
    types: ["brochure"],
  },
  {
    slug: "videos",
    title: "Videos",
    desc: "Installation methods and on-site footage.",
    icon: Video,
    types: ["other"],
    videoOnly: true,
  },
];

export const VIDEO_HOST_RE = /(youtube\.com|youtu\.be|vimeo\.com|wistia\.com)/i;

export const getCategory = (slug: string) =>
  RESOURCE_CATEGORIES.find((c) => c.slug === slug);
