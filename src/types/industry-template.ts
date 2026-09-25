export interface IndustrySeo {
  title: string;
  description: string;
  keywords: string;
}

export interface IndustryApplicationItem {
  heading: string;
  description: string;
  link?: string;
}

export interface IndustryTemplate {
  title: string;
  description: string;
  heroImage: string;
  eyebrow?: string;
  content: {
    challenges: string[];
    applications: (string | IndustryApplicationItem)[];
    sections?: unknown[];
  };
  topSellingProductId?: string;
  topSellingProductIds?: string[];
  caseStudies?: string[];
  keyProducts?: string[];
  seo: IndustrySeo | null;
}

export type AllIndustryTemplates = Record<string, IndustryTemplate>;

export const DEFAULT_INDUSTRY_LANDING: IndustryTemplate = {
  title: "High-Performance Geosynthetic Solutions for African Industries",
  description:
    "Tailored containment, stabilisation, and erosion control systems engineered for the environmental and operational demands of Africa's key industrial sectors.",
  heroImage:
    "https://images.unsplash.com/photo-1541888087405-eb81f5c6e8e7?w=1920&q=80",
  eyebrow: "Industries",
  content: {
    challenges: [],
    applications: [],
    sections: [],
  },
  seo: {
    title: "Industries — Geosynthetics Africa",
    description:
      "High-performance geosynthetic systems tailored for key African industries, including mining, infrastructure, and agriculture.",
    keywords:
      "geosynthetics industries africa, mining geosynthetics, waste management liners, road stabilization, agricultural containment",
  },
};
