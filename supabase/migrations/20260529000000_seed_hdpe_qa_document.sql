-- Migration: Seed high-fidelity GSE HDPE Geomembrane QA standard data
-- Date: 2026-05-29

INSERT INTO public.qa_documents (
  slug,
  category_name,
  short_description,
  hero_image_url,
  eyebrow,
  hero_title,
  hero_body,
  content_sections,
  stats,
  industries_served,
  key_pillars,
  cta_label,
  sort_order,
  status
) VALUES (
  'gse-solmax-quality-assurance',
  'GSE® / Solmax Quality Assurance',
  'Our comprehensive Quality Assurance / Quality Control (QA/QC) programme for GSE® HDPE Geomembranes ensures 100% integrity of containment systems. From initial roll inspection through to final as-built documentation, every weld, panel, and subgrade preparation step is rigorously tested and logged.',
  'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=1920&q=80',
  'IAGI-Aligned Quality Assurance',
  'GSE® HDPE Geomembranes Quality Assurance',
  'Standard-setting lining quality assurance aligning with IAGI and international standards, deployed across major mining, water, and environmental infrastructure projects in Africa.',
  '[
    {
      "type": "text",
      "heading": "Manufacturer-Aligned Installation Standards",
      "body": "Geosynthetics Africa installs GSE® HDPE geomembranes in accordance with manufacturer QA requirements, GRI-GM13 standards, and international installation best practice. Every roll of lining is fully traced from the plant to final deployment."
    },
    {
      "type": "numbered",
      "heading": "GSE® HDPE QA Methodology — Applied on African Sites",
      "items": [
        {
          "title": "Material Delivery, Identification & Traceability",
          "desc": "Upon arrival, every roll is inspected. We check manufacturer quality control certificates, match roll numbers with batch certificates, and inspect for transit damage. We trace every square meter from the manufacturing plant to final on-site installation."
        },
        {
          "title": "Unloading, Storage & Handling Controls",
          "desc": "Handling on-site is strictly controlled using specialized spreader bars for loading/unloading. Rolls are stored on level, dry ground, protected from excessive moisture and UV exposure. Site transit and storage zones are restricted to authorized vehicles."
        },
        {
          "title": "Subgrade Preparation & Acceptance",
          "desc": "Before panel deployment, the subgrade is verified to be free of stones, roots, or sharp protrusions. Compaction density and moisture content must meet specifications (typically 95% Standard Proctor). A signed subgrade acceptance certificate is mandatory."
        },
        {
          "title": "Panel Deployment & Identification",
          "desc": "Each panel is assigned a unique number for full traceability. Panels are deployed using methods that avoid pulling or dragging. All panels are oriented parallel to the slope direction and deployed with slack to account for thermal expansion."
        },
        {
          "title": "Welding Equipment Qualification & Trial Welds",
          "desc": "Trial welds are mandatory at the start of each shift (morning and afternoon) for each welding machine and operator. Test specimens are tested in peel and shear using an on-site calibrated tensiometer, logging temperature, speed, and pressure."
        },
        {
          "title": "Field Seaming — Fusion & Extrusion Welding",
          "desc": "Dual-track fusion welding is utilized for long, straight seams, creating a testable air channel. Extrusion welding is reserved for repairs, detailing, and patches. All seam overlaps (125-150mm) are thoroughly cleaned before welding."
        },
        {
          "title": "Non-Destructive Testing (NDT)",
          "desc": "Air pressure testing is performed on 100% of dual-track fusion seams (holding 250-300 kPa for 5 minutes). Vacuum box testing (minimum 50 kPa vacuum) is conducted on all extrusion welds and repairs. Spark testing is applied to detail areas."
        },
        {
          "title": "Destructive Seam Testing",
          "desc": "Samples are cut at a frequency of 1 sample per 150m of seam length. On-site tensiometer testing verifies peel and shear strength for 5 specimens each. Independent laboratory verification is conducted to ensure compliance with GRI-GM19."
        },
        {
          "title": "Defects, Repairs & Re-testing",
          "desc": "All defects and non-destructive test failures are immediately marked and logged. Repairs are executed via patching, capping, or extrusion beads. All repaired areas are 100% re-tested using vacuum box or spark testing methods and logged."
        },
        {
          "title": "As-Built Documentation & Handover",
          "desc": "A complete QA dossier is prepared, including as-built panel layout drawings with unique roll/panel mapping, trial weld logs, NDT pressure logs, destructive test results, manufacturer warranty certificates, and formal engineering sign-off."
        }
      ]
    },
    {
      "type": "table",
      "heading": "Regional Installation Coverage & Capabilities",
      "headers": ["Region", "Countries Covered", "Experience Level"],
      "rows": [
        ["Southern Africa", "South Africa, Namibia, Botswana, Zimbabwe, Mozambique", "Over 500,000 m² installed"],
        ["East Africa", "Kenya, Tanzania, Uganda, Rwanda, Zambia", "Over 350,000 m² installed"],
        ["West & Central Africa", "Ghana, Mali, Guinea, Democratic Republic of Congo (DRC)", "Over 400,000 m² installed"],
        ["Other Infrastructure Projects", "Ash dams, Heap leach pads, Tailing storage facilities (TSFs)", "100% certified welds"]
      ]
    },
    {
      "type": "checklist",
      "heading": "HDPE Liner Applications & Coverage",
      "items": [
        "Mining & Mineral Processing: Tailings storage facilities (TSFs), heap leach pads, process ponds, solution channels.",
        "Waste Management & Environmental Containment: Municipal solid waste landfills, hazardous waste containment, heap leach pads, ash dams.",
        "Water Infrastructure & Hydraulic Works: Water storage reservoirs, irrigation canals, wastewater treatment ponds.",
        "Industrial & Energy Applications: Evaporation ponds, secondary containment, petrochemical storage, brine ponds.",
        "Agriculture & Aquaculture: Irrigation dams, aquaculture ponds, farm reservoirs."
      ]
    },
    {
      "type": "callout",
      "heading": "Continental Experience, Local Execution",
      "body": "Our installation team brings a combined track record of over 1.5 million square meters of high-density polyethylene (HDPE) geomembrane installations across Africa. We deliver international IAGI standards with local execution expertise."
    }
  ]'::jsonb,
  '[
    {"label": "Welds Tested", "value": "100%"},
    {"label": "Projects QA''d", "value": "340+"},
    {"label": "Countries Covered", "value": "17"},
    {"label": "IAGI Membership", "value": "Member"}
  ]'::jsonb,
  '["Mining & Minerals", "Waste & Landfill", "Water & Sanitation", "Petrochemical & Energy", "Agriculture & Aquaculture"]'::jsonb,
  '[
    {
      "title": "Material Verification",
      "icon": "ShieldCheck",
      "desc": "Mill certs, batch numbers, and roll traceability checked upon delivery."
    },
    {
      "title": "Installation Control",
      "icon": "Wrench",
      "desc": "IAGI-certified installation procedures followed on every project."
    },
    {
      "title": "On-Site Quality Control",
      "icon": "Microscope",
      "desc": "Daily trial welds, air pressure testing, and vacuum box checks."
    },
    {
      "title": "Documentation",
      "icon": "FileCheck",
      "desc": "Full handover package with panel layouts, seam logs, and test results."
    }
  ]'::jsonb,
  'View GSE® QA Documentation',
  1,
  'published'
)
ON CONFLICT (slug) DO UPDATE SET
  category_name = EXCLUDED.category_name,
  short_description = EXCLUDED.short_description,
  hero_image_url = EXCLUDED.hero_image_url,
  eyebrow = EXCLUDED.eyebrow,
  hero_title = EXCLUDED.hero_title,
  hero_body = EXCLUDED.hero_body,
  content_sections = EXCLUDED.content_sections,
  stats = EXCLUDED.stats,
  industries_served = EXCLUDED.industries_served,
  key_pillars = EXCLUDED.key_pillars,
  cta_label = EXCLUDED.cta_label,
  sort_order = EXCLUDED.sort_order,
  status = EXCLUDED.status,
  updated_at = now();
