// ─── Footer Site-Builder Content Types ────────────────────────────────────────
// Stored in Supabase site_config under key: "footer_content"

export interface FooterSocialLink {
  platform: "linkedin" | "facebook" | "instagram" | "youtube" | "twitter" | "whatsapp" | "tiktok";
  url: string;
}

export interface FooterLink {
  label: string;
  to: string;
  params?: Record<string, string>;
}

export interface FooterColumn {
  id: string;
  title: string;
  type: "custom" | "products" | "applications" | "services" | "industries";
  links?: FooterLink[];
}

export interface FooterContent {
  /** Brand description paragraph displayed below the logo */
  brandDescription: string;

  /** Social media links displayed as icon buttons */
  socialLinks: FooterSocialLink[];

  /** Certification badges shown in the bottom bar */
  certifications: string[];

  /** Copyright text — supports {{year}} interpolation */
  copyrightText: string;

  /** Dynamic columns of links */
  columns?: FooterColumn[];
}

export const DEFAULT_FOOTER_CONTENT: FooterContent = {
  brandDescription:
    "Africa's integrated geosynthetics platform delivering quality products, expert services and technical solutions.",
  socialLinks: [
    { platform: "linkedin", url: "#" },
    { platform: "facebook", url: "#" },
    { platform: "instagram", url: "#" },
    { platform: "youtube", url: "#" },
  ],
  certifications: [
    "IAGI Member - One of only 5 in Africa",
    "B-BBEE Level 2",
    "Pan-African Logistics",
    "QA/QC Certified",
  ],
  copyrightText:
    "© {{year}} Geosynthetics Africa (Pty) Ltd. All Rights Reserved.",
  columns: [
    {
      id: "col-products",
      title: "Products",
      type: "products",
    },
    {
      id: "col-applications",
      title: "Applications",
      type: "applications",
    },
    {
      id: "col-industries",
      title: "Industries",
      type: "industries",
    },
    {
      id: "col-services",
      title: "Services",
      type: "services",
    },
    {
      id: "col-resources",
      title: "Resources",
      type: "custom",
      links: [
        { label: "Datasheets", to: "/resources" },
        { label: "Installation Guides", to: "/resources" },
        { label: "QA Checklists", to: "/quality-assurance" },
        { label: "Technical Articles", to: "/resources" },
        { label: "Videos", to: "/resources" },
        { label: "FAQs", to: "/resources" },
      ],
    },
    {
      id: "col-company",
      title: "Company",
      type: "custom",
      links: [
        { label: "About Us", to: "/about" },
        { label: "Careers", to: "/" },
        { label: "News", to: "/resources" },
        { label: "Sustainability", to: "/" },
        { label: "Privacy Policy", to: "/" },
        { label: "Terms & Conditions", to: "/" },
      ],
    },
  ],
};
