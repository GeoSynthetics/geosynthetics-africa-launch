-- Migration: Extend case_studies schema and seed high-fidelity case studies
-- Date: 2026-05-28

-- 1. Add columns to public.case_studies table
ALTER TABLE public.case_studies
ADD COLUMN IF NOT EXISTS service_type text CHECK (service_type IN ('supply_only', 'supply_install', 'services_only')) DEFAULT 'supply_install',
ADD COLUMN IF NOT EXISTS scale text,
ADD COLUMN IF NOT EXISTS project_year integer,
ADD COLUMN IF NOT EXISTS sector text,
ADD COLUMN IF NOT EXISTS logistics_details jsonb DEFAULT '{}'::jsonb,
ADD COLUMN IF NOT EXISTS qa_details jsonb DEFAULT '{}'::jsonb,
ADD COLUMN IF NOT EXISTS service_details jsonb DEFAULT '{}'::jsonb,
ADD COLUMN IF NOT EXISTS products_used jsonb DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS spec_compliance jsonb DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS testimonial jsonb DEFAULT '{}'::jsonb;

-- 2. Clean existing seed placeholders to prevent duplicate key conflicts
DELETE FROM public.case_study_products;
DELETE FROM public.case_studies WHERE slug IN ('west-wits-tsf-lining', 'kolwezi-liner-supply', 'integrity-review-west-africa');

-- 3. Seed Case Studies
INSERT INTO public.case_studies (
  slug, title, client_name, location, country, summary, body, hero_image_url, gallery,
  status, published_at, service_type, scale, project_year, sector,
  logistics_details, qa_details, service_details, products_used, spec_compliance, testimonial
) VALUES
(
  'west-wits-tsf-lining',
  'West Wits TSF Lift 4 Lining',
  'West Wits Gold Mining',
  'Gauteng',
  'South Africa',
  '320,000 m² HDPE composite TSF lining for a gold tailings facility in Gauteng, South Africa. Designed, supplied, installed, tested and certified by Geosynthetics Africa to SANS standards.',
  'Brief: West Wits gold tailings storage facility required a high-performance double-liner composite system to align with SANS 1526 and GISTM standards for high-toxicity tailings. GSA executed the complete turn-key project covering design support, mill sourcing, site logistics, and professional installation under certified IAGI inspectors.',
  'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=1200&q=80',
  '[]'::jsonb,
  'published',
  now(),
  'supply_install',
  '320,000 m²',
  2024,
  'Mining',
  '{}'::jsonb,
  '{
    "welders": "14 Certified",
    "compliance": "SANS 1526",
    "checklist": [
      "Subgrade Acceptance: free of sharp protrusions (>10mm)",
      "Daily Trial Welds: pre-shift thermal calibration logs filed",
      "100% Non-Destructive Testing: double-track fusion pressure test logs",
      "Destructive Tensiometer Testing: shear & peel tests per ASTM D7177",
      "Certified Inspectors: all seams signed off by IAGI inspectors",
      "As-Built QA Dossier: final panels mapped with coordinates"
    ],
    "photos": [
      {"url": "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=400&q=80", "caption": "Subgrade validation check"},
      {"url": "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=400&q=80", "caption": "Wedge welding in progress"},
      {"url": "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400&q=80", "caption": "Air pressure channel verification"},
      {"url": "https://images.unsplash.com/photo-1541888087405-eb81f5c6e8e7?w=400&q=80", "caption": "Finished secondary containment pad"}
    ]
  }'::jsonb,
  '{}'::jsonb,
  '[
    {"category": "Geomembrane", "name": "GSE® Smooth HDPE 2.0 mm", "qty": "240,000 m²", "origin": "EU (Netherlands)"},
    {"category": "Geotextile", "name": "Typar® 800 Woven Filter", "qty": "320,000 m²", "origin": "EU (Belgium)"},
    {"category": "GCL", "name": "Bentomat® DN Geosynthetic Clay Liner", "qty": "80,000 m²", "origin": "South Africa"}
  ]'::jsonb,
  '[
    {"property": "Thickness", "method": "ASTM D5199", "spec": "2.00 mm", "delivered": "2.06 mm", "margin": "+3.0%"},
    {"property": "Density", "method": "ASTM D1505", "spec": "0.940 g/cm³", "delivered": "0.945 g/cm³", "margin": "PASS"},
    {"property": "Tensile Yield", "method": "ASTM D6693", "spec": "29 kN/m", "delivered": "32.4 kN/m", "margin": "+11.7%"},
    {"property": "Tensile Break", "method": "ASTM D6693", "spec": "53 kN/m", "delivered": "59.1 kN/m", "margin": "+11.5%"},
    {"property": "Stress Crack (SP-NCTL)", "method": "ASTM D5397", "spec": "500 hours", "delivered": "740 hours", "margin": "+48.0%"}
  ]'::jsonb,
  '{
    "quote": "GSA delivered an outstanding turn-key lining package. Their on-site CQA was exceptionally rigorous, keeping our environmental audit fully compliant with GRI and local regulations.",
    "name": "Johan Botha",
    "role": "Lead Tailings Engineer",
    "company": "West Wits Operations",
    "avatar": "JB"
  }'::jsonb
),
(
  'kolwezi-liner-supply',
  'Kolwezi Stage 1 — Liner Supply',
  'Lualaba Copper Operations',
  'Lualaba Province',
  'DRC',
  '85,000 m² HDPE liner supply for a copper TSF in Lualaba, DRC. Full Pan-African logistics — Africa to site, customs cleared, on-spec, on-time, with mill certificates and Certificate of Origin.',
  'Brief: A supply-only commission for a major copper producer in the DRC''s Lualaba copper belt. 85,000 m² of certified HDPE primary liner was manufactured in our partner mill, shipped through Durban port, and road-freighted over 3,420 km across four southern African borders just-in-time to the site.',
  'https://images.unsplash.com/photo-1541888087405-eb81f5c6e8e7?w=1200&q=80',
  '[]'::jsonb,
  'published',
  now(),
  'supply_only',
  '85,000 m²',
  2023,
  'Mining',
  '{
    "tonnage": "340 t",
    "route": "3,420 km",
    "borders": "4 borders",
    "ontime": "100%",
    "route_steps": [
      {"stage": "Stage 01", "name": "Heerenveen Mill", "desc": "Manufacturer extrusion run, mill-certificated, batch-numbered & sealed.", "duration": "D0 - D+3"},
      {"stage": "Stage 02", "name": "Rotterdam → Durban", "desc": "Sea freight, temperature-logged storage, full track & trace.", "duration": "D+3 - D+24"},
      {"stage": "Stage 03", "name": "Durban Port", "desc": "SARS customs clearance, SADC Certificate of Origin issued.", "duration": "D+24 - D+27"},
      {"stage": "Stage 04", "name": "Cross-Border Road", "desc": "12 articulated trucks road-freighted through Botswana, Zambia, DRC.", "duration": "D+27 - D+38"},
      {"stage": "Stage 05", "name": "Kolwezi Site", "desc": "Just-in-time layout delivery directly onto laydown according to welder program.", "duration": "D+38 - D+41"}
    ],
    "documents": [
      {"title": "Mill Test Certificates", "desc": "Issued per extrusion batch, roll serials cross-referenced.", "status": "Issued"},
      {"title": "SADC Certificate of Origin", "desc": "Form CO for preferential custom duties clearance.", "status": "Issued"},
      {"title": "Bill of Lading", "desc": "6 sealed containers logged with seal number validation.", "status": "Issued"},
      {"title": "SGS Pre-Shipment Inspection", "desc": "Condition validation and packing list verification at Durban.", "status": "Issued"},
      {"title": "Independent Lab Tests", "desc": "GSA JHB lab batch sampling verification report.", "status": "Issued"},
      {"title": "Customs Clearances", "desc": "SAD500, T1 transit and COMESA documentation.", "status": "Issued"}
    ]
  }'::jsonb,
  '{}'::jsonb,
  '{}'::jsonb,
  '[
    {"category": "Geomembrane", "name": "GSE® Smooth HDPE 1.5mm", "qty": "68,000 m² (272 t)", "origin": "EU (Netherlands)"},
    {"category": "Geomembrane", "name": "GSE® Textured HDPE 1.5mm", "qty": "17,000 m² (68 t)", "origin": "EU (Netherlands)"}
  ]'::jsonb,
  '[
    {"property": "Thickness", "method": "ASTM D5199", "spec": "1.50 mm", "delivered": "1.54 mm", "margin": "+2.7%"},
    {"property": "Density", "method": "ASTM D1505", "spec": "0.940 g/cm³", "delivered": "0.946 g/cm³", "margin": "PASS"},
    {"property": "Tensile Yield Strength", "method": "ASTM D6693", "spec": "22 kN/m", "delivered": "24.8 kN/m", "margin": "+12.7%"},
    {"property": "Tensile Break Strength", "method": "ASTM D6693", "spec": "40 kN/m", "delivered": "46.2 kN/m", "margin": "+15.5%"},
    {"property": "Stress Crack Resistance", "method": "ASTM D5397", "spec": "500 hours", "delivered": "720 hours", "margin": "+44.0%"}
  ]'::jsonb,
  '{
    "quote": "Moving 340 tons of liner through 4 African borders is a logistical nightmare. Geosynthetics Africa made it look simple — delivering on spec, on timeline, with zero paperwork delays.",
    "name": "Jean-Pierre Kabange",
    "role": "Logistics Lead",
    "company": "Lualaba Copper",
    "avatar": "JK"
  }'::jsonb
),
(
  'integrity-review-west-africa',
  'Independent TSF Liner Integrity Review',
  'West African Gold Mine',
  'Kenieba District',
  'Mali',
  'Independent third-party liner integrity review of an operational gold TSF in West Africa. Tensile testing, OIT, ESCR, thickness verification, electrical leak location — regulator-ready report by IAGI-member specialists.',
  'Brief: The environmental affairs team of a major gold mine in West Africa engaged GSA to perform a forensic, third-party liner integrity review of an operational tailings storage facility ahead of regulatory audits. The review stood as a pure services-only engagement, guaranteeing complete technical independence.',
  'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1200&q=80',
  '[]'::jsonb,
  'published',
  now(),
  'services_only',
  '94 samples',
  2024,
  'Mining',
  '{}'::jsonb,
  '{}'::jsonb,
  '{
    "duration": "5 weeks",
    "tests": "6 streams",
    "samples": "94 coupons",
    "deliverable": "CQA Report",
    "independence_statement": "To guarantee complete objectivity, GSA had no role in supplying the geomembrane or installing the original 2018 lining system. The engagement was strictly service-fee based, producing uncompromised, auditor-ready engineering results.",
    "forensic_protocol": [
      {"step": "01", "name": "Document Review", "desc": "Original CQA package, panel layout drawing logs, and as-built comparisons from 2018.", "output": "Baseline register"},
      {"step": "02", "name": "Visual Audit", "desc": "Strategic site walk-over, high-definition photo audit, GPS mapping of exposed embankments.", "output": "Visual defect register"},
      {"step": "03", "name": "Coupon Extraction", "desc": "94 strategic coupons cold-cut from exposed sections, anchor trenches, and repairs.", "output": "Chain-of-custody log"},
      {"step": "04", "name": "ISO Laboratory Testing", "desc": "Forensic testing matrix including antioxidant depletion and environmental stress cracking.", "output": "Lab certified certificates"},
      {"step": "05", "name": "Electrical Leak Survey", "desc": "Standard ASTM D7007 water-lance leak detection over uncovered segments.", "output": "Pinhole coordinates map"}
    ],
    "findings": [
      {"area": "Main Embankment", "title": "UV Aging Performance", "desc": "Remaining Standard OIT exceeded 70 minutes (well above 30 min aging limit).", "status": "PASS"},
      {"area": "Anchor Trench", "title": "Stress Crack Signs", "desc": "Visible stress-induced tensioning detected. Remedial trench relaxation recommended.", "status": "ATTENTION"},
      {"area": "Sump Area", "title": "Pinhole Leak Located", "desc": "ASTM D7007 spark survey located a 2mm pinhole puncture. Patched and verified.", "status": "ACTION"}
    ]
  }'::jsonb,
  '[
    {"category": "Testing Stream", "name": "ASTM D5199 Thickness check", "qty": "94 samples", "origin": "JHB Laboratory"},
    {"category": "Testing Stream", "name": "ASTM D3895 Standard OIT", "qty": "94 samples", "origin": "JHB Laboratory"},
    {"category": "Testing Stream", "name": "ASTM D5397 Stress Crack (SP-NCTL)", "qty": "24 samples", "origin": "JHB Laboratory"}
  ]'::jsonb,
  '[
    {"property": "Thickness Verification", "method": "ASTM D5994", "spec": "1.50 mm (baseline)", "delivered": "1.49 mm", "margin": "PASS (Stable)"},
    {"property": "Tensile Yield", "method": "ASTM D6693", "spec": "15 kN/m (aged min)", "delivered": "17.2 kN/m", "margin": "PASS"},
    {"property": "Antioxidant (OIT)", "method": "ASTM D3895", "spec": "100 min (mill) / 30 (limit)", "delivered": "72 min", "margin": "PASS (High Reserve)"},
    {"property": "HP-OIT", "method": "ASTM D5885", "spec": "80% retention", "delivered": "84%", "margin": "PASS"}
  ]'::jsonb,
  '{
    "quote": "GSA''s independent review was outstanding. The clinical forensics and independence from supplier influence gave our board and the state regulators absolute confidence in our GISTM compliance.",
    "name": "Dr. Amadou Diallo",
    "role": "Environmental Director",
    "company": "Kenieba Gold Mine",
    "avatar": "AD"
  }'::jsonb
);
