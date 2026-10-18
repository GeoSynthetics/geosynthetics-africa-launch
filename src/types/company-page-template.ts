// ─── Company & Generic Content Page Template Types ─────────────────────────
// Stored in Supabase site_config under key: "template_company_pages"

export interface CompanyPageSection {
  id: string;
  heading: string;
  subtitle?: string;
  body: string;
  bullets?: string[];
}

export interface CompanyPageCta {
  heading: string;
  text: string;
  buttonLabel: string;
  buttonLink: string;
}

export interface CompanyPageSeo {
  title: string;
  description: string;
  keywords: string;
}

export interface CompanyPageTemplate {
  slug: string;
  title: string;
  eyebrow: string;
  heroDescription: string;
  heroImage?: string;
  badge?: string;
  sections: CompanyPageSection[];
  cta?: CompanyPageCta;
  seo: CompanyPageSeo;
  updatedAt?: string;
}

export const DEFAULT_COMPANY_PAGE_TEMPLATES: Record<string, CompanyPageTemplate> = {
  careers: {
    slug: "careers",
    title: "Careers at Geosynthetics Africa",
    eyebrow: "Join Our Team",
    heroDescription:
      "Build Africa's infrastructure with certified engineering, specialized technical sales, and master seaming installation crews across 30+ African countries.",
    heroImage: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1920&q=80",
    badge: "Opportunities Across Africa",
    sections: [
      {
        id: "careers-why-us",
        heading: "Why Build Your Career With Us?",
        body: "At Geosynthetics Africa, our people lead containment and geotechnical engineering excellence across the continent. From certified IAGI master seamers to technical design engineers and cross-border logistics specialists, we work on landmark mining, civil infrastructure, and water conservation projects across Africa.",
        bullets: [
          "Continental project exposure across SADC, West Africa, and East Africa",
          "IAGI-certified welding and CQC technical training programs",
          "Competitive compensation and performance-driven advancement",
          "Safety-first culture adhering to ISO 45001 and Mine Health & Safety standards",
        ],
      },
      {
        id: "careers-openings",
        heading: "Current Disciplines & Specializations",
        body: "We regularly recruit across core operational disciplines. If you are passionate about civil engineering, quality assurance, environmental containment, or commercial operations, explore our active departments.",
        bullets: [
          "IAGI Certified Master Seamers & Field Supervisors",
          "Civil & Geotechnical Sales Engineers",
          "Logistics & Customs Clearance Coordinators",
          "QA/QC Field Laboratory Technicians",
        ],
      },
      {
        id: "careers-apply",
        heading: "How to Apply",
        body: "Send your CV and a brief cover letter describing your field experience or technical qualifications to our human resources desk. Please specify your country of residence and preferred operational role.",
        bullets: [
          "Email your resume to careers@geosynthetics.com",
          "Include reference to any relevant engineering certifications or welding accreditations",
          "Applications are reviewed on a rolling basis by our regional management team",
        ],
      },
    ],
    cta: {
      heading: "Ready to Make an Impact?",
      text: "Submit your CV directly to our operations and human resources desk for current and upcoming African projects.",
      buttonLabel: "Email Careers Desk",
      buttonLink: "mailto:careers@geosynthetics.com",
    },
    seo: {
      title: "Careers — Geosynthetics Africa",
      description:
        "Explore career opportunities in geotechnical engineering, HDPE geomembrane lining, and technical project management across Africa.",
      keywords: "geosynthetics careers, civil engineering jobs Africa, geomembrane installer jobs, geotechnical careers",
    },
  },
  sustainability: {
    slug: "sustainability",
    title: "Sustainability & Environmental Responsibility",
    eyebrow: "Our Environmental Commitment",
    heroDescription:
      "Safeguarding Africa's precious groundwater, soil, and ecosystems through advanced geosynthetic containment barrier systems and responsible engineering practices.",
    heroImage: "https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?w=1920&q=80",
    badge: "Eco-Compliant Containment",
    sections: [
      {
        id: "sustainability-groundwater",
        heading: "Zero-Permeation Groundwater Protection",
        body: "Mining tailings storage facilities, heap leach pads, and municipal waste containment sites represent significant environmental risks without engineered barriers. Our high-density polyethylene (HDPE) and geosynthetic clay liners (GCL) ensure zero-leak integrity to protect surrounding agricultural lands and vital aquifers.",
        bullets: [
          "Certified GRI-GM13 virgin resin containment materials",
          "100% non-destructive dual-track pressure testing on field seams",
          "Independent CQA third-party sign-off on environmental barriers",
        ],
      },
      {
        id: "sustainability-water",
        heading: "Water Conservation & Resource Preservation",
        body: "Across arid and water-stressed African regions, agricultural reservoirs, raw water canals, and industrial evaporation ponds lined with our geomembranes prevent catastrophic water seepage, enabling drought resilience and agricultural food security.",
        bullets: [
          "Reduction of reservoir seepage by up to 99.8%",
          "High UV-stabilized geomembranes engineered for 50+ year operational life",
          "Biodegradable erosion control matrices for rapid vegetative revegetation",
        ],
      },
      {
        id: "sustainability-carbon",
        heading: "Carbon Footprint & Lifecycle Efficiency",
        body: "Compared to traditional reinforced concrete lining or bulk clay transport, geosynthetic systems require significantly less freight tonnage, reduced heavy machine earthmoving, and produce a substantially lower lifecycle carbon footprint.",
        bullets: [
          "Up to 80% lower transport emissions compared to concrete structures",
          "Long-term environmental durability minimizing replacement waste",
          "Engineered solutions that restore native vegetation and stabilize riverbanks",
        ],
      },
    ],
    cta: {
      heading: "Design for Environmental Compliance",
      text: "Consult with our engineering team for ASTM and SANS environmental specification compliance for your upcoming project.",
      buttonLabel: "Consult Our Engineers",
      buttonLink: "/contacts",
    },
    seo: {
      title: "Sustainability & Environmental Protection — Geosynthetics Africa",
      description:
        "Our commitment to environmental containment, groundwater protection, and sustainable civil engineering across Africa.",
      keywords: "environmental containment, groundwater protection Africa, sustainable geosynthetics, tailings lining sustainability",
    },
  },
  "privacy-policy": {
    slug: "privacy-policy",
    title: "Privacy Policy",
    eyebrow: "Legal & Compliance",
    heroDescription:
      "How Geosynthetics Africa collects, uses, protects, and handles your personal information in compliance with the Protection of Personal Information Act (POPIA) and international data privacy standards.",
    badge: "POPIA & GDPR Compliant",
    sections: [
      {
        id: "privacy-collection",
        heading: "1. Information We Collect",
        body: "We collect information you provide directly to us when you request a quotation, submit a Bill of Quantities (BOQ), upload technical drawings, contact our offices, or subscribe to our technical newsletter. This includes your name, email address, phone number, company name, country, and project specifications.",
      },
      {
        id: "privacy-use",
        heading: "2. How We Use Your Information",
        body: "We use the information we collect to provide quotation estimates, technical specifications, dispatch material deliveries, coordinate regional engineering services, communicate project updates, and comply with legal export requirements.",
        bullets: [
          "Processing and answering RFQs and technical inquiries",
          "Coordinating cross-border logistics and customs documentation",
          "Improving our digital tools and user experience",
        ],
      },
      {
        id: "privacy-sharing",
        heading: "3. Information Sharing and Disclosure",
        body: "We do not sell, trade, or rent your personal information to third parties. We may share project documentation with authorized freight logistics carriers, customs clearing agents, or certified installation partners strictly for the fulfillment of your project requirements.",
      },
      {
        id: "privacy-security",
        heading: "4. Data Security & Retention",
        body: "We implement robust technical and organizational security measures to protect your data against unauthorized access, disclosure, or destruction. Project documents and files uploaded via our platform are stored on encrypted cloud servers.",
      },
      {
        id: "privacy-contact",
        heading: "5. Contact Our Information Officer",
        body: "If you have questions regarding this Privacy Policy or wish to request access or correction of your personal information, please contact our information officer at info@geosynthetics.com or write to our head office in Cape Town, South Africa.",
      },
    ],
    seo: {
      title: "Privacy Policy — Geosynthetics Africa",
      description: "Privacy Policy and data protection terms for Geosynthetics Africa (Pty) Ltd.",
      keywords: "privacy policy, data protection, POPIA compliance, geosynthetics privacy",
    },
  },
  "terms-and-conditions": {
    slug: "terms-and-conditions",
    title: "Terms & Conditions",
    eyebrow: "Legal Agreement",
    heroDescription:
      "Terms and conditions governing the use of the Geosynthetics Africa website, technical quotation requests, and supply & installation contracts.",
    badge: "Official Terms",
    sections: [
      {
        id: "terms-acceptance",
        heading: "1. Acceptance of Terms",
        body: "By accessing or using the Geosynthetics Africa website, requesting project quotations, or downloading technical datasheets, you agree to be bound by these Terms and Conditions and all applicable laws and regulations.",
      },
      {
        id: "terms-quotes",
        heading: "2. Quotations & Project Estimates",
        body: "All preliminary quotations and cost estimates generated online or via our technical sales desks are subject to formal site inspection, roll width optimization, freight route validation, and material price confirmation. Quotations remain valid for 30 days unless otherwise agreed in writing.",
      },
      {
        id: "terms-specifications",
        heading: "3. Material Specifications & Mill Certificates",
        body: "Geosynthetic materials supplied comply with published manufacturer quality control (MQC) standards, ASTM test protocols, and SANS specifications. Mill test certificates (MTC) and roll test logs are supplied with every dispatch.",
      },
      {
        id: "terms-installation",
        heading: "4. Installation & Site Preparation",
        body: "For supply and installation contracts, site earthworks, subgrade preparation, anchor trench excavation, and site dewatering must adhere to Geosynthetics Africa subgrade acceptance guidelines before deployment.",
      },
      {
        id: "terms-ip",
        heading: "5. Intellectual Property",
        body: "All content, designs, technical diagrams, trademarks, and documentation on this website are the proprietary intellectual property of Geosynthetics Africa (Pty) Ltd and may not be reproduced without prior written permission.",
      },
    ],
    seo: {
      title: "Terms & Conditions — Geosynthetics Africa",
      description: "Terms and conditions for Geosynthetics Africa supply, quotation, and installation services.",
      keywords: "terms and conditions, geosynthetics terms of service, legal terms",
    },
  },
};
