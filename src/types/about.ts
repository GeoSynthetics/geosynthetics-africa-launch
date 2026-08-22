export interface AboutHero {
  eyebrow: string;
  title: string;
  description: string;
  image: string;
}

export interface AccountabilityCard {
  id?: string;
  icon: string;
  title: string;
  description: string;
}

export interface AboutAccountability {
  title: string;
  description: string;
  cards: AccountabilityCard[];
}

export interface CapabilityItem {
  id?: string;
  title: string;
  description: string;
}

export interface AboutExecution {
  capabilities: CapabilityItem[];
  philosophyTitle: string;
  philosophySubtitle: string;
  philosophyImage: string;
}

export interface AboutPartners {
  title: string;
  description: string;
  partnerNames: string[];
}

export interface FaqItem {
  id?: string;
  q: string;
  a: string;
}

export interface AboutFaqs {
  title: string;
  items: FaqItem[];
}

export interface AboutTrademark {
  title: string;
  trademarkNotice: string;
}

export interface AboutContactSection {
  title: string;
  subtitle: string;
  backgroundImage: string;
  headOfficeTitle: string;
  headOfficeAddress: string;
  contactTitle: string;
  contactDetails: string;
  operatingHoursTitle: string;
  operatingHoursDetails: string;
  formHeading: string;
  formDescription: string;
  mapEmbedUrl?: string;
  mapHeading?: string;
  mapDescription?: string;
  catalogButtonText?: string;
  catalogButtonUrl?: string;
}

export interface AboutPageContent {
  hero: AboutHero;
  accountability: AboutAccountability;
  execution: AboutExecution;
  partners: AboutPartners;
  faqs: AboutFaqs;
  trademark: AboutTrademark;
  contact: AboutContactSection;
}

export const DEFAULT_ABOUT_PAGE_CONTENT: AboutPageContent = {
  hero: {
    eyebrow: "About Us",
    title: "Africa's Only Integrated Geosynthetics Execution Partner",
    description:
      "Geosynthetics Africa is Africa's only integrated geosynthetic systems execution partner – delivering spec-compliant products, pan-African logistics, and QA/QC-certified installation as one accountable system.",
    image: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=1920&q=80",
  },
  accountability: {
    title: "One System. One Accountability.",
    description:
      "We exist to eliminate the failure risk created by fragmented delivery models, where material supply, logistics, installation, and quality assurance are separated. We integrate the full geosynthetics lifecycle.",
    cards: [
      {
        id: "1",
        icon: "ShieldCheck",
        title: "Specification-Controlled Supply",
        description:
          "Geosynthetics Africa controls the integrity of every system from the first input - the material itself. We do not offer alternatives or substitutions. Every product supplied is fully aligned to engineer specifications, manufactured to international standards (GRI, ASTM), and traceable to source.",
      },
      {
        id: "2",
        icon: "Truck",
        title: "Integrated Logistics & Execution",
        description:
          "We integrate logistics directly into project execution - ensuring materials, equipment, and installation teams arrive aligned and on schedule. We operate across complex African environments, including remote mining operations and cross-border logistics. We don't just deliver materials - we deliver execution readiness.",
      },
      {
        id: "3",
        icon: "Cog",
        title: "QA/QC-Controlled Installation",
        description:
          "Installation is where most geosynthetic systems fail - not because of materials, but because of execution. We eliminate this risk through controlled installation governed by qualified teams, defined welding procedures, continuous quality control, and independent testing. We don't install to complete scope - we install to certify performance.",
      },
    ],
  },
  execution: {
    capabilities: [
      {
        id: "cap-1",
        title: "Pan-African Execution Capability",
        description:
          "Operating across the African continent – with proven delivery in Southern, West, East and Central Africa – including remote mining operations and cross-border logistics environments.",
      },
      {
        id: "cap-2",
        title: "Trusted Where Failure Is Not an Option",
        description:
          "Geosynthetics Africa is one of only five IAGI Installer Members in Africa, trusted by engineers, EPC contractors and asset owners to deliver systems exactly as designed – from specification through to installation sign-off.",
      },
      {
        id: "cap-3",
        title: "Geosynthetics Africa",
        description:
          "One system and accountable. 100+ proven tracks on QA/QC certified installation delivered for leading mines across Africa.",
      },
    ],
    philosophyTitle: "Our Execution Philosophy",
    philosophySubtitle: "We do not participate in fragmented delivery.",
    philosophyImage: "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?w=1200&q=80",
  },
  partners: {
    title: "Our Global Supply Partners",
    description:
      "We are proud to have partnered with globally renowned providers of sustainable and innovative geosynthetics. Our 10+ global partnerships across different product ranges allows us to meet specifications, offer quick delivery turnaround across Africa, and supply exact specs rather than alternatives on projects.",
    partnerNames: ["Solmax", "Tensar", "Thrace", "Eurobent", "Tiltex"],
  },
  faqs: {
    title: "Frequently Asked Questions",
    items: [
      {
        id: "faq-1",
        q: "Is Geosynthetics Africa an IAGI-Certified Installer?",
        a: "Geosynthetics Africa is an IAGI Installer Member, ensuring every project meets global geomembrane welding and QA/QC standards. Our teams are factory-trained and certified, guaranteeing professional, leak-free installations that comply with GRI-GM13 and ASTM standards.",
      },
      {
        id: "faq-2",
        q: "Where does Geosynthetics Africa operate?",
        a: "Geosynthetics Africa operates across the continent, with proven delivery in Southern, West, East and Central Africa – including remote mining operations and cross-border logistics environments.",
      },
      {
        id: "faq-3",
        q: "What does a '360-Degree Solution' mean?",
        a: "It means we integrate the full lifecycle of a geosynthetics project: from specification-controlled supply, through to pan-African logistics, and finally QA/QC-certified installation. One partner, full accountability.",
      },
      {
        id: "faq-4",
        q: "How is Geosynthetics Africa different from other suppliers?",
        a: "Geosynthetics Africa is not a reseller — we execute engineered specifications. We do not participate in fragmented delivery models where supply, logistics, and installation are separated.",
      },
    ],
  },
  trademark: {
    title: "Your 360° Partner in Lining, Reinforcement & Erosion Control",
    trademarkNotice:
      "Mirafi® and GSE® are registered trademarks of Solmax. Tensar® is a registered trademark of Tensar International Corporation, a division of CMC. Eurobent® is a registered trademark of Eurobent Sp. z o.o. Geosynthetics Africa (Pty) Ltd supplies these products under authorization and does not claim ownership of any of the above trademarks.",
  },
  contact: {
    title: "Let's Start a Conversation",
    subtitle: "Reach out to our experts to discuss your specific project requirements.",
    backgroundImage: "https://images.unsplash.com/photo-1541888087405-eb81f5c6e8e7?w=1920&q=80",
    headOfficeTitle: "Head Office",
    headOfficeAddress: "7 Tamar Avenue, Lea Glen\nRandburg, Johannesburg, 2191\nSouth Africa",
    contactTitle: "Contact",
    contactDetails: "E: info@geosynthetics.co.za\nSales: +27 78 1355 926\nAdmin: +27 11 083 8384",
    operatingHoursTitle: "Operating Hours",
    operatingHoursDetails:
      "Monday – Friday: 08:00 AM – 17:00 PM\nWeekends: Closed on Saturday & Sunday",
    formHeading: "Store Location & Directions",
    formDescription: "Visit our primary head office and logistics hub in Johannesburg.",
    mapEmbedUrl:
      "https://www.google.com/maps?q=7+Tamar+Avenue,+Lea+Glen,+Randburg,+Johannesburg&output=embed",
    mapHeading: "Store & Office Location",
    mapDescription: "Visit our primary head office and distribution center in Johannesburg.",
    catalogButtonText: "View Catalog Products",
    catalogButtonUrl: "/catalogue",
  },
};
