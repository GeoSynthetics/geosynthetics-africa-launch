// ─── Contacts Page Site-Builder Content Types ────────────────────────────────
// Stored in Supabase site_config under key: "contacts_page_content"

export interface ContactHeroBadge {
  icon: string; // Lucide icon name, e.g. "Target"
  title: string;
  subtitle: string;
}

export interface ContactHero {
  title: string; // e.g. "Johannesburg\nHead Office"
  subtitle: string; // e.g. "Southern Africa Regional Hub"
  description: string; // e.g. "Proudly serving Southern Africa and cross-border projects."
  bgImage: string; // e.g. "/src/assets/contact-page-hero.png"
  tags: string[]; // e.g. ["Supply", "Installation", "QA/QC", "Logistics"]
  badges: ContactHeroBadge[];
}

export interface ContactHeadOffice {
  company: string; // e.g. "Geosynthetics Africa (Pty) Ltd"
  address: string[]; // e.g. ["7 Tamar Avenue, Lea Glen", "Randburg, Johannesburg, 2191", "South Africa"]
  contactPerson: string; // e.g. "James Chabata"
  contactRole: string; // e.g. "Sales Admin Manager"
  phone: string; // e.g. "+27 78 1355 926"
  email: string; // e.g. "sales@geosynthetics.co.za"
  hours: string[]; // e.g. ["Mon - Fri: 08:00 - 17:00", "Saturday: Closed", "Sunday: Closed"]
  mapEmbedUrl: string; // e.g. "https://www.google.com/maps..."
}

export interface ContactOfficeService {
  icon: string; // Lucide icon name, e.g. "Layers"
  label: string; // e.g. "Material Supply"
}

export interface ContactsPageContent {
  hero: ContactHero;
  headOffice: ContactHeadOffice;
  officeServices: ContactOfficeService[];
}

export const DEFAULT_CONTACTS_PAGE_CONTENT: ContactsPageContent = {
  hero: {
    title: "Johannesburg\nHead Office",
    subtitle: "Southern Africa Regional Hub",
    description: "Proudly serving Southern Africa and cross-border projects.",
    bgImage: "/src/assets/contact-page-hero.png",
    tags: ["Supply", "Installation", "QA/QC", "Logistics"],
    badges: [
      { icon: "Target", title: "Expert Technical", subtitle: "Support" },
      { icon: "ShieldCheck", title: "Quality Products", subtitle: "& Services" },
      { icon: "Truck", title: "Reliable Regional", subtitle: "Logistics" },
    ],
  },
  headOffice: {
    company: "Geosynthetics Africa (Pty) Ltd",
    address: ["7 Tamar Avenue, Lea Glen", "Randburg, Johannesburg, 2191", "South Africa"],
    contactPerson: "James Chabata",
    contactRole: "Sales Admin Manager",
    phone: "+27 78 1355 926",
    email: "sales@geosynthetics.co.za",
    hours: ["Mon - Fri: 08:00 - 17:00", "Saturday: Closed", "Sunday: Closed"],
    mapEmbedUrl:
      "https://www.google.com/maps?q=7+Tamar+Avenue,+Lea+Glen,+Randburg,+Johannesburg&output=embed",
  },
  officeServices: [
    { icon: "Layers", label: "Material Supply" },
    { icon: "HardHat", label: "HDPE Liner Installation" },
    { icon: "Waves", label: "Floating Cover Installation" },
    { icon: "ClipboardCheck", label: "QA/QC Testing" },
    { icon: "Truck", label: "Logistics & Export" },
    { icon: "Wrench", label: "Technical Support" },
  ],
};
