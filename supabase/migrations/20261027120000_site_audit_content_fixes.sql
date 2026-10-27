-- Migration: Content accuracy fixes from the October 2026 site audit
-- Date: 2026-10-27
--
-- Fixes CMS-stored text that is wrong against manufacturer documents or
-- public records, and replaces the CSPE page content (it showed rFPP). Product names and codes (Tensar, Solmax/GSE, TechGrid)
-- are NOT changed. Only the sentences listed below are touched.
--
-- Apply in the Supabase SQL editor. Safe to re-run: every change is an exact
-- text match or a field set to a fixed value, and becomes a no-op once applied.
-- Backups of every touched row are kept in admin-only tables (RLS on, no
-- policies) for rollback.
--
-- Sources:
--   Tensar InterAx BBA 23/7063 (ratio 0.60, -0.25):
--     https://tensar.co.uk/media-external/85f7e9a1-5d90-41db-8db9-c284bcc7d321.pdf
--   Ratio definition (min / max radial stiffness at 0.5% strain):
--     https://layfieldgroup.com/wp-content/uploads/2023/03/Tensar%C2%AE-FilterGrid-Technical-Spec.pdf
--   TX150 spec (360 kN/m @ 0.5%, 250 kN/m @ 2%):
--     https://tensarcorp.com/getattachment/a29672e5-3342-4c5f-987a-8e9512224f1d/TX150-Product-Specification.pdf
--   TriAx installation guide (min overlap 300 mm, normally max 600 mm):
--     https://tensar.co.uk/getattachment/bec910a1-8fef-42d0-a716-733e1884f613/IG_TriAx.pdf
--   InterAx installation guide (min overlap 300 mm, normally max 600 mm):
--     https://www.tensar.co.uk/getattachment/9197ab55-aec1-4fb1-9162-2ff9cb04fb8d/Installation-Guide-Tensar-InterAx-geogrid.pdf
--   FC45 / FC60: mill datasheets on file (up to 20 years exposed service, both grades)
--   Burkina Faso left ECOWAS on 29 January 2025:
--     https://african.business/2025/04/apo-newsfeed/extraordinary-session-of-the-economic-community-of-west-african-states-ecowas-council-of-ministers-on-the-contingency-plan-and-modalities-on-the-withdrawal-of-burkina-faso-republics-of-mali-and-nig
--
-- ── Optional preview (run on its own first; each count should be > 0) ────
-- SELECT pattern, (SELECT count(*) FROM public.site_config s
--   WHERE s.key IN ('template_product_categories', 'template_countries')
--     AND s.value::text ~ pattern) AS site_config_hits,
--   (SELECT count(*) FROM public.products p WHERE p::text ~ pattern) AS product_hits
-- FROM (VALUES
--   ('Near-Uniform Radial Performance'),
--   ('near-uniform in all radial directions'),
--   ('meaning more uniform radial load distribution'),
--   ('butt-jointed'),
--   ('250.540 kN/m \(Radial Secant @ 0\.5% strain\)'),
--   ('500 million'),
--   ('depending on the All field seams'),
--   ('51 m² per roll'),
--   ('30-year'),
--   ('SANS 1526 certified'),
--   ('is a ECOWAS member')
-- ) AS t(pattern);

BEGIN;

-- 1. Backups (kept on re-run)
CREATE TABLE IF NOT EXISTS public.site_config_backup_20261027 AS
SELECT * FROM public.site_config;
ALTER TABLE public.site_config_backup_20261027 ENABLE ROW LEVEL SECURITY;

CREATE TABLE IF NOT EXISTS public.products_backup_20261027 AS
SELECT * FROM public.products;
ALTER TABLE public.products_backup_20261027 ENABLE ROW LEVEL SECURITY;

-- 2. Product family pages (template_product_categories), scoped per page
DO $$
DECLARE
  k text;
  e jsonb;
  t text;
BEGIN
  -- 2a. Tensar InterAx (multi-axial geogrids)
  FOR k, e IN
    SELECT j.key, j.val
    FROM public.site_config s, jsonb_each(s.value) AS j(key, val)
    WHERE s.key = 'template_product_categories'
      AND (j.key = 'multi-axial-geogrids' OR j.val->>'slug' = 'multi-axial-geogrids')
  LOOP
    t := e::text;
    -- The stiffness ratio is min / max radial stiffness: 0.60 is less uniform
    -- than TriAx's 0.75-0.80, so it must not be sold as "more uniform".
    t := replace(t,
      'near-uniform radial stiffness and improved MSL performance',
      'high radial stiffness and improved MSL performance');
    t := regexp_replace(t,
      'and a stiffness ratio of 0\.60 [-–—]+ meaning more uniform radial load distribution\.',
      'and a radial secant stiffness ratio of 0.60 (EOTA TR041, the lowest radial stiffness divided by the highest).',
      'g');
    t := regexp_replace(t,
      'The Stiffness Ratio of 0\.60 for both grades means the stiffness is near-uniform in all radial directions [-–—]+ load applied from any direction is resisted with similar efficiency\.',
      'The Radial Secant Stiffness Ratio of 0.60 for both grades is the lowest radial stiffness divided by the highest, measured to EOTA TR041; it is a product identification value, not a performance ranking.',
      'g');
    t := replace(t, 'Near-Uniform Radial Performance', 'Lowest ÷ highest radial stiffness');
    -- Installation section was copied from the TriAx page
    t := replace(t, 'TriAx installation is straightforward', 'InterAx installation is straightforward');
    t := replace(t, 'Unroll TriAx geogrid', 'Unroll InterAx geogrid');
    t := regexp_replace(t,
      'Adjacent rolls are butt-jointed [-–—]+ no overlap required for stabilisation applications',
      'Overlap adjacent rolls by at least 300 mm (normally no more than 600 mm, or as the contract documents direct), and hold overlaps down with small heaps of fill ahead of the main filling',
      'g');
    t := regexp_replace(t,
      'Place aggregate immediately [-–—]+ do not leave geogrid exposed for more than 30 days',
      'Cover the geogrid promptly; for extended exposure on site, follow Tensar''s project-specific advice',
      'g');
    UPDATE public.site_config
    SET value = jsonb_set(value, ARRAY[k], t::jsonb), updated_at = now()
    WHERE key = 'template_product_categories';
  END LOOP;

  -- 2b. Tensar TriAx (triaxial geogrids)
  FOR k, e IN
    SELECT j.key, j.val
    FROM public.site_config s, jsonb_each(s.value) AS j(key, val)
    WHERE s.key = 'template_product_categories'
      AND (j.key = 'triaxial-geogrids' OR j.val->>'slug' = 'triaxial-geogrids')
  LOOP
    t := e::text;
    -- 250 kN/m is TX150 at 2% strain; at 0.5% the range is 360 (TX150) to 540 (TX190L)
    t := regexp_replace(t,
      '250[-–—]540 kN/m \(Radial Secant @ 0\.5% strain\)',
      '360–540 kN/m (Radial Secant @ 0.5% strain)', 'g');
    -- Tensar publishes 500M+ m2 for its biaxial SS/TGSG grids, not TriAx
    t := regexp_replace(t, ' ?Over 500 million square metres installed globally\.', '', 'g');
    t := regexp_replace(t,
      'Adjacent rolls are butt-jointed [-–—]+ no overlap required for stabilisation applications',
      'Overlap adjacent rolls by at least 300 mm (normally no more than 600 mm, or as the contract documents direct), and hold overlaps down with small heaps of fill ahead of the main filling',
      'g');
    t := regexp_replace(t,
      'Place aggregate immediately [-–—]+ do not leave geogrid exposed for more than 30 days',
      'Cover the geogrid promptly; for extended exposure on site, follow Tensar''s project-specific advice',
      'g');
    UPDATE public.site_config
    SET value = jsonb_set(value, ARRAY[k], t::jsonb), updated_at = now()
    WHERE key = 'template_product_categories';
  END LOOP;

  -- 2c. rLLDPE floating covers: repair a truncated sentence and the
  --     dry/wet installation contradiction
  FOR k, e IN
    SELECT j.key, j.val
    FROM public.site_config s, jsonb_each(s.value) AS j(key, val)
    WHERE s.key = 'template_product_categories'
      AND (j.key = 'floating-cover-geomembranes' OR j.val->>'slug' = 'floating-cover-geomembranes')
  LOOP
    t := e::text;
    t := replace(t, 'depending on the All field seams',
      'depending on the anchorage design. All field seams');
    t := replace(t,
      'Cover deployment is carried out with the pond at or near operating liquid level',
      'In a wet installation, cover deployment is carried out with the pond at or near operating liquid level');
    -- Mill datasheets for both grades state up to 20 years of exposed
    -- service depending on location; there is no 30-year grade.
    t := regexp_replace(t,
      'FC45 \(1\.14 ?mm, 20-year outdoor service life\) and FC60 \(1\.52 ?mm, 30-year outdoor service life\)',
      'FC45 (1.14 mm) and FC60 (1.52 mm), both rated for up to 20 years of exposed service depending on location',
      'g');
    t := regexp_replace(t,
      'FC45 \(1\.14 ?mm, 20-year\) and FC60 \(1\.52 ?mm, 30-year\) grades',
      'FC45 (1.14 mm) and FC60 (1.52 mm) grades, rated for up to 20 years of exposed service',
      'g');
    t := regexp_replace(t,
      '1\.14 ?mm \(20yr\) and 1\.52 ?mm \(30yr\) [-–—]+ two grades, matched to project design life',
      '1.14 mm and 1.52 mm - two grades, up to 20 years exposed service depending on location',
      'g');
    t := regexp_replace(t,
      'FC45 \(1\.14 ?mm, 20-year\) is the standard specification.*?Contact our technical team if you are unsure\.',
      'Both grades carry the same rating of up to 20 years of exposed service, depending on location, so choose on thickness and robustness. FC45 (1.14 mm) suits process water dams, effluent ponds, TSF water recovery covers and agricultural storage. FC60 (1.52 mm, GRI GM25 Category 1) adds tear, tensile and puncture margin (600 N tear, 1,602 N grab tensile, 600 N puncture, typical) for large covers, potable reservoirs and digesters where wind, rainwater and maintenance traffic load the cover harder. Ask us for the warranty terms for your site.',
      'g');
    -- Specification table cells for outdoor service life
    t := replace(t, '"20 years"', '"Up to 20 years"');
    t := replace(t, '"30 years"', '"Up to 20 years"');
    UPDATE public.site_config
    SET value = jsonb_set(value, ARRAY[k], t::jsonb), updated_at = now()
    WHERE key = 'template_product_categories';
  END LOOP;
END $$;

-- 3. Catalogue products: exact replacements in every text/jsonb column of the
--    named rows (names, slugs and codes are excluded)
DO $$
DECLARE
  col record;
  r record;
BEGIN
  FOR r IN SELECT * FROM (VALUES
    -- TechGrid TGU: 5.1 m x 100 m = 510 m2
    ('techgrid-tgu-uniaxial-geogrid-40-600-kn-m-africa-supply', '(51 m² per roll)', '(510 m² per roll)'),
    ('techgrid-tgu-uniaxial-geogrid-40-600-kn-m-africa-supply', '30 × 25 mm apertures', '30 × 15 to 30 × 25 mm apertures by grade'),
    -- TriAx card: the 500M+ m2 figure belongs to Tensar biaxial grids
    ('triaxial-geogrid-tensar-triax-tx', ', with over 500 million m² installed globally', '')
  ) AS fixes(slug, old_text, new_text)
  LOOP
    FOR col IN
      SELECT column_name, data_type
      FROM information_schema.columns
      WHERE table_schema = 'public' AND table_name = 'products'
        AND data_type IN ('text', 'character varying', 'jsonb')
        AND column_name NOT IN ('id', 'slug', 'name', 'sku', 'code', 'family_slug')
    LOOP
      IF col.data_type = 'jsonb' THEN
        EXECUTE format(
          'UPDATE public.products SET %1$I = replace(%1$I::text, $1, $2)::jsonb WHERE slug = $3 AND %1$I::text LIKE ''%%'' || $1 || ''%%''',
          col.column_name)
        USING r.old_text, r.new_text, r.slug;
      ELSE
        EXECUTE format(
          'UPDATE public.products SET %1$I = replace(%1$I, $1, $2) WHERE slug = $3 AND %1$I LIKE ''%%'' || $1 || ''%%''',
          col.column_name)
        USING r.old_text, r.new_text, r.slug;
      END IF;
    END LOOP;
  END LOOP;
END $$;

-- 4. Country pages (template_countries)
-- 4a. Grammar on remaining ECOWAS members
UPDATE public.site_config
SET value = replace(value::text, ' is a ECOWAS member.', ' is an ECOWAS member.')::jsonb,
    updated_at = now()
WHERE key = 'template_countries' AND value::text LIKE '% is a ECOWAS member.%';

-- 4b. Burkina Faso: ECOWAS exit, Bamako hub routing, own photos instead of stock
DO $$
DECLARE
  bf_key text;
  ml_key text;
  bf jsonb;
  ml jsonb;
BEGIN
  SELECT j.key, j.val INTO bf_key, bf
  FROM public.site_config s, jsonb_each(s.value) AS j(key, val)
  WHERE s.key = 'template_countries'
    AND (j.key = 'burkina-faso-geosynthetics-supplier-installer'
      OR j.val->>'slug' = 'burkina-faso-geosynthetics-supplier-installer'
      OR j.val->>'country' = 'Burkina Faso')
  LIMIT 1;

  SELECT j.key, j.val INTO ml_key, ml
  FROM public.site_config s, jsonb_each(s.value) AS j(key, val)
  WHERE s.key = 'template_countries'
    AND (j.key = 'mali-geosynthetics-supplier-installer'
      OR j.val->>'slug' = 'mali-geosynthetics-supplier-installer'
      OR j.val->>'country' = 'Mali')
  LIMIT 1;

  IF bf_key IS NULL THEN
    RAISE NOTICE 'Burkina Faso entry not found in template_countries: skipped';
    RETURN;
  END IF;

  bf := bf || jsonb_build_object(
    'customsInfo',
      'Burkina Faso left ECOWAS on 29 January 2025 and is a member of the Alliance of Sahel States (AES) and UEMOA. Imports move under transit documents through Côte d''Ivoire, Ghana or Togo, and we prepare the commercial invoice, packing list, certificate of origin and mill certificates each border needs.',
    'transitTime',
      'Common grades by road from our Bamako stock · container imports via Abidjan, Tema or Lomé: lead time confirmed at quote',
    'logisticsRoutes',
      'Bamako → Sikasso → Bobo-Dioulasso → Ouagadougou and site · Abidjan / Tema / Lomé by sea → road corridor to Ouagadougou and site',
    'officeTitle', 'Served from our Bamako Hub',
    'hubName', 'Bamako Hub — West Africa Mining Supplies SARL',
    'address', 'Bamako, Mali',
    'phone', '+223 65 86 02 12'
  );

  -- Replace Unsplash stock photos with the Mali page's own site photos
  IF ml IS NOT NULL THEN
    IF coalesce(bf->>'heroImage', '') LIKE '%unsplash.com%' AND ml ? 'heroImage' THEN
      bf := jsonb_set(bf, '{heroImage}', ml->'heroImage');
    END IF;
    IF coalesce(bf->>'installationImage', '') LIKE '%unsplash.com%' AND ml ? 'installationImage' THEN
      bf := jsonb_set(bf, '{installationImage}', ml->'installationImage');
    END IF;
  END IF;

  UPDATE public.site_config
  SET value = jsonb_set(value, ARRAY[bf_key], bf), updated_at = now()
  WHERE key = 'template_countries';
END $$;

-- 5. GSE liners meet SANS 1526; they are not "SANS certified"
DO $$
DECLARE
  col record;
  r record;
BEGIN
  FOR r IN SELECT * FROM (VALUES
    (1, 'GRI-GM13 and SANS 1526 certified', 'GRI-GM13 certified, SANS 1526 compliant'),
    (2, 'SANS 1526 & GRI-GM13 Certified', 'GRI-GM13 Certified, Meets SANS 1526'),
    (3, 'SANS 1526 & GRI-GM13 certified', 'GRI-GM13 certified and meeting SANS 1526'),
    (4, 'certified to SANS 1526', 'meeting SANS 1526'),
    (5, 'SANS 1526 certified', 'SANS 1526 compliant'),
    (6, 'SANS 1526 approved', 'SANS 1526 compliant')
  ) AS fixes(ord, old_text, new_text) ORDER BY ord
  LOOP
    UPDATE public.site_config
    SET value = replace(value::text, r.old_text, r.new_text)::jsonb, updated_at = now()
    WHERE value::text LIKE '%' || r.old_text || '%';

    FOR col IN
      SELECT column_name, data_type
      FROM information_schema.columns
      WHERE table_schema = 'public' AND table_name = 'products'
        AND data_type IN ('text', 'character varying', 'jsonb')
        AND column_name NOT IN ('id', 'slug', 'sku', 'code', 'family_slug')
    LOOP
      IF col.data_type = 'jsonb' THEN
        EXECUTE format(
          'UPDATE public.products SET %1$I = replace(%1$I::text, $1, $2)::jsonb WHERE %1$I::text LIKE ''%%'' || $1 || ''%%''',
          col.column_name)
        USING r.old_text, r.new_text;
      ELSE
        EXECUTE format(
          'UPDATE public.products SET %1$I = replace(%1$I, $1, $2) WHERE %1$I LIKE ''%%'' || $1 || ''%%''',
          col.column_name)
        USING r.old_text, r.new_text;
      END IF;
    END LOOP;
  END LOOP;
END $$;

-- 6. CSPE page: the CSPE URL showed rFPP content (rFPP has its own page at
--    /products/geomembrane-liners/rfpp-geomembrane-liners). Replace it with
--    CSPE content. All values are the mill's published CSPE data for the
--    60 mil 3-ply (CS60) and 90 mil 5-ply (CS90) grades. Slug, category and
--    menu placement are kept; the hero image is taken from the floating-cover page.
DO $$
DECLARE
  k text;
  e jsonb;
  fc_image jsonb;
  cspe jsonb := $cspe${"label": "CSPE Geomembranes - CS60 & CS90 for Potable Water & Floating Covers", "subtitle": "Polyester-reinforced chlorosulfonated polyethylene (CSPE) in CS60 (1.52 mm, 3-ply) and CS90 (2.28 mm, 5-ply). NSF/ANSI 61 certified for drinking water, backed by a 30-year mill weathering warranty for approved applications. Fabricated into floating covers, reservoir liners and drop-in tank liners in our own facility, and installed by our own crews.", "description": ["CSPE is a synthetic rubber geomembrane, the polymer once sold as Hypalon. It is calendered into plies and laminated over a polyester reinforcing scrim, which gives a sheet that stays flexible, holds its dimensions in exposed service and resists ozone, UV and cold cracking. It has been used for potable water floating covers and reservoir liners since the late 1970s, which is why many water utilities still specify it by name.", "We supply two grades. CS60 is a 60 mil (1.52 mm) 3-ply sheet for floating covers, reservoir and pond liners and baffle curtains. CS90 is a 90 mil (2.28 mm) 5-ply sheet with two reinforcing plies, for large covers, desalination cell liners and duties where higher tear, puncture and hydrostatic resistance justify the extra mass. Both use a 10 x 10, 1000 denier polyester scrim and are certified to NSF/ANSI 61 for contact with drinking water.", "Most of the seaming is done before the material reaches site. We fabricate covers and liners into large panels in our own facility, accordion fold them and roll them on heavy-duty cores, so field seams are limited to panel joins and details. Field and factory seams are made and tested to the mill's procedures and the project CQA plan, and the handover dossier records every seam."], "technicalHighlights": [{"label": "Grades", "value": "CS60 · CS90"}, {"label": "Thickness", "value": "1.52 mm · 2.28 mm"}, {"label": "Potable water", "value": "NSF/ANSI 61"}, {"label": "Weathering warranty", "value": "30 years (approved applications)"}, {"label": "Reinforcement", "value": "10 x 10, 1000 denier PET scrim"}], "propertiesTable": {"headers": ["Property", "Test Method", "CS60", "CS90"], "rows": [["Construction", "-", "3-ply, polyester scrim", "5-ply, 2 polyester scrims"], ["Scrim", "-", "10 x 10, 1000 denier", "10 x 10, 1000 denier"], ["Thickness, overall (typical / min)", "ASTM D751", "1.52 / 1.47 mm", "2.28 / 2.18 mm"], ["Grab breaking strength (typical / min)", "ASTM D751", "1,556 / 1,334 N", "2,668 / 2,313 N"], ["Elongation at break (typical / min)", "-", "105 / 75 %", "120 / 75 %"], ["Tongue tear, 8 x 8 in (typical / min)", "ASTM D751", "444 / 355 N", "689 / 556 N"], ["Hydrostatic resistance (typical / min)", "ASTM D751 Method A, Proc. I", "3,102 / 2,757 kPa", "4,137 / 3,447 kPa"], ["Puncture resistance (typical / min)", "FTMS 101B Method 2031", "1,334 / 1,112 N", "2,224 / 2,001 N"], ["Bonded seam strength (min)", "ASTM D751 modified", "1,201 N or 90% of parent", "1,000 N (typical 90% of parent)"], ["Ply adhesion", "ASTM D413 Type A", "44 N per 25 mm", "48 N per 25 mm (min 35)"], ["Ozone resistance, 100 pphm, 40 °C, 7 days", "ASTM D1149", "No effect", "No effect"], ["Low-temperature flexibility, -40 °C", "ASTM D2136", "Pass", "Pass"], ["Potable water", "NSF/ANSI 61", "Certified", "Certified"], ["Weathering warranty", "-", "30 years, approved applications", "30 years, approved applications"], ["Colours", "-", "Black, tan, white", "Black, tan, white"]]}, "faqs": [{"question": "When should I choose CSPE over rLLDPE or rFPP for a floating cover?", "answer": "Choose CSPE where the owner wants the longest exposed weathering record and a 30-year weathering warranty, typically municipal potable water reservoirs. Scrim-reinforced LLDPE (our FC45 and FC60) is lighter and rated for up to 20 years of exposed service, and suits process water, effluent and agricultural covers. rFPP sits between the two for exposed liners. We will compare the options against your reservoir size, water quality and design life."}, {"question": "Is CSPE approved for drinking water?", "answer": "Yes. Both CS60 and CS90 are certified to NSF/ANSI 61 for drinking water system components. The certification is held against the mill product, and we supply the certificate and batch documents with every consignment."}, {"question": "What does the 30-year warranty cover?", "answer": "It is the mill's limited weathering warranty for approved CSPE applications. We confirm in writing, before you order, whether your application qualifies and what the terms are, so the warranty is part of the contract documents rather than a brochure claim."}, {"question": "Should I specify CS60 or CS90?", "answer": "CS60 (1.52 mm, 3-ply) is the usual choice for floating covers, reservoir liners and baffle curtains. CS90 (2.28 mm, 5-ply) has about 70% more grab strength and puncture resistance and about 55% more tear strength, and is used for large covers exposed to high wind, desalination cells and liners that take regular maintenance traffic."}, {"question": "Black, tan or white?", "answer": "Black is the standard for most liners. Tan and white surfaces absorb less sun, so they run cooler on exposed covers and reservoirs in hot climates and make the cover surface easier to inspect. All three colours carry the same properties."}, {"question": "Do you supply only, or design and install the cover as well?", "answer": "Both. We supply CS60 and CS90 as material only, or design the panel layout, fabricate the cover in our own facility and install it with our own crews, including floats, ballast lines, rainwater sumps, hatches and anchorage. Every installation is handed over with a full QA/QC dossier."}], "installationSpecs": ["Every CSPE cover or liner starts with a layout drawing: structure geometry, operating water levels, wind uplift, rainwater collection and removal, access hatches, vents and the perimeter anchorage detail. The cover is then fabricated to that layout in our facility as large panels, so site work is limited to deployment, panel joins and detailing.", "Seams are made to the mill's CSPE seaming procedure. Trial seams are made and tested before production seaming, every seam is non-destructively tested along its full length, and destructive samples are taken at the frequency set in the project CQA plan. Bonded seams must reach the mill's minimum bonded seam strength (1,201 N for CS60, 1,000 N for CS90) or 90% of parent material.", "The handover dossier includes the as-built panel layout, mill and NSF/ANSI 61 certificates traceable to the supplied rolls, seam and repair logs, test results, the anchorage and penetration records, and a cover inspection and maintenance guide."], "applications": [{"label": "Floating Covers & Evaporation Control", "slug": "floating-covers-evaporation-control"}, {"label": "Reservoir & Dam Lining", "slug": "reservoir-dam-lining"}, {"label": "Concrete Protection & Tank Lining", "slug": "concrete-protection-lining"}, {"label": "Process Water & Pollution Control Dam Lining", "slug": "process-water-pollution-control-dam-lining"}], "industries": [{"label": "Water Utilities & Irrigation", "slug": "water-utilities-irrigation"}, {"label": "Mining & Minerals Processing", "slug": "mining-minerals-processing"}, {"label": "Agriculture & Aquaculture", "slug": "agriculture-aquaculture"}], "relatedProductGroups": [{"name": "rLLDPE Floating Cover Liners (FC45 & FC60)", "link": "/products/geomembrane-liners/floating-cover-geomembranes"}, {"name": "rFPP Geomembranes", "link": "/products/geomembrane-liners/rfpp-geomembrane-liners"}, {"name": "PVC Potable Water Liners", "link": "/products/geomembrane-liners/pvc-geomembranes"}, {"name": "Floating Cover Installation", "link": "/services/floating-cover-installation-africa"}], "seo": {"title": "CSPE Geomembrane CS60 & CS90 | Potable Water Floating Covers Africa", "description": "NSF/ANSI 61 CSPE geomembranes, CS60 (1.52 mm) and CS90 (2.28 mm), with a 30-year weathering warranty. Floating covers and reservoir liners fabricated and installed across Africa.", "keywords": "CSPE geomembrane, CSPE floating cover, Hypalon liner, potable water floating cover, NSF 61 geomembrane, reservoir cover Africa, CS60, CS90, desalination cell liner, drop-in tank liner"}}$cspe$::jsonb;
BEGIN
  SELECT j.val->'heroImage' INTO fc_image
  FROM public.site_config s, jsonb_each(s.value) AS j(key, val)
  WHERE s.key = 'template_product_categories'
    AND (j.key = 'floating-cover-geomembranes' OR j.val->>'slug' = 'floating-cover-geomembranes')
  LIMIT 1;

  FOR k, e IN
    SELECT j.key, j.val
    FROM public.site_config s, jsonb_each(s.value) AS j(key, val)
    WHERE s.key = 'template_product_categories'
      AND (j.key = 'cspe-geomembranes-for-potable-water-floating-covers'
        OR j.val->>'slug' = 'cspe-geomembranes-for-potable-water-floating-covers')
  LOOP
    e := e || cspe || jsonb_build_object('popularProducts', '[]'::jsonb);
    IF fc_image IS NOT NULL AND jsonb_typeof(fc_image) = 'string' THEN
      e := jsonb_set(e, '{heroImage}', fc_image);
    END IF;
    UPDATE public.site_config
    SET value = jsonb_set(value, ARRAY[k], e), updated_at = now()
    WHERE key = 'template_product_categories';
  END LOOP;
END $$;

COMMIT;

-- ── Post-check (expect zero rows) ───────────────────────────────────────
-- SELECT 'site_config' AS src, key, pattern
-- FROM public.site_config,
--   (VALUES ('Near-Uniform Radial Performance'), ('butt-jointed'),
--     ('250.540 kN/m \(Radial Secant'), ('depending on the All field seams'),
--     ('Burkina Faso is a ECOWAS member'), ('is a ECOWAS member'), ('30-year')) AS t(pattern)
-- WHERE key IN ('template_product_categories', 'template_countries')
--   AND value::text ~ pattern
-- UNION ALL
-- SELECT 'products', slug, '51 m² per roll'
-- FROM public.products WHERE products::text LIKE '%(51 m² per roll)%';
--
-- ── Rollback ────────────────────────────────────────────────────────────
-- UPDATE public.site_config s SET value = b.value, updated_at = now()
-- FROM public.site_config_backup_20261027 b WHERE s.key = b.key;
-- (products: restore the changed columns from public.products_backup_20261027)
