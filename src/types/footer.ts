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
  type: "custom" | "products" | "applications" | "services" | "industries" | "countries";
  links?: FooterLink[];
}

export interface FooterContent {
  /** Brand description paragraph displayed below the logo */
  brandDescription: string;

  /** Physical address displayed below brand description in footer */
  address?: string;

  /** Contact phone number displayed below address */
  phone?: string;

  /** Contact email address displayed below phone */
  email?: string;

  /** Google Maps link opened when clicking the address */
  addressMapUrl?: string;

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
  address: "7 Tamar Avenue, Lea Glen, Randburg, Johannesburg, 2191, South Africa",
  phone: "+27 72 343 0868",
  email: "sales@geosyntheticsafrica.com",
  addressMapUrl: "https://maps.app.goo.gl/dWqBYitmU8ziMmDd8",
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
  copyrightText: "© {{year}} Geosynthetics Africa (Pty) Ltd. All Rights Reserved.",
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
      id: "col-countries",
      title: "Pan-African Coverage & Regional Pages",
      type: "countries",
      links: [
        { label: "Geosynthetics South Africa →", to: "/south-africa-geosynthetics-supplier-installer" },
        { label: "Geosynthetics Botswana →", to: "/botswana-geosynthetics-supplier-installer" },
        { label: "Geosynthetics Tanzania →", to: "/tanzania-geosynthetics-supplier-installer" },
        { label: "Geosynthetics Zimbabwe →", to: "/zimbabwe-geosynthetics-supplier-contact" },
        { label: "Geosynthetics Zambia →", to: "/zambia-geosynthetics-supplier-installer" },
        { label: "Geosynthetics Democratic Republic of Congo (DRC) →", to: "/drc-geosynthetics-supplier-installer" },
        { label: "Geosynthetics Kenya →", to: "/kenya-geosynthetics-supplier-contact" },
        { label: "Geosynthetics Côte d'Ivoire →", to: "/cote-divoire-geosynthetics-supplier-contact" },
        { label: "Geosynthetics Mozambique →", to: "/mozambique-geosynthetics-supplier-contact" },
        { label: "Geosynthetics Ghana →", to: "/ghana-geosynthetics-supplier-contact" },
        { label: "Geosynthetics Namibia →", to: "/namibia-geosynthetics-supplier-contact" },
      ],
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
        { label: "Careers", to: "/careers" },
        { label: "Blog", to: "/blog" },
        { label: "Sustainability", to: "/sustainability" },
        { label: "Privacy Policy", to: "/privacy-policy" },
        { label: "Terms & Conditions", to: "/terms-and-conditions" },
      ],
    },
  ],
};
