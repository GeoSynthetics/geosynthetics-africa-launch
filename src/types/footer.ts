// ─── Footer Site-Builder Content Types ────────────────────────────────────────
// Stored in Supabase site_config under key: "footer_content"

export interface FooterSocialLink {
  platform: "linkedin" | "facebook" | "instagram" | "youtube" | "twitter" | "whatsapp" | "tiktok";
  url: string;
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
};
