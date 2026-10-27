-- Migration: Content accuracy fixes from the October 2026 site audit
-- Date: 2026-10-27
--
-- Fixes CMS-stored text that is wrong against manufacturer documents or
-- public records. Product names and codes (Tensar, Solmax/GSE, TechGrid)
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
--   ('is a ECOWAS member')
-- ) AS t(pattern);

BEGIN;

-- 1. Backups (kept on re-run)
CREATE TABLE IF NOT EXISTS public.site_config_backup_20261027 AS
SELECT * FROM public.site_config
WHERE key IN ('template_product_categories', 'template_countries');
ALTER TABLE public.site_config_backup_20261027 ENABLE ROW LEVEL SECURITY;

CREATE TABLE IF NOT EXISTS public.products_backup_20261027 AS
SELECT * FROM public.products
WHERE slug IN (
  'techgrid-tgu-uniaxial-geogrid-40-600-kn-m-africa-supply',
  'triaxial-geogrid-tensar-triax-tx'
);
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

COMMIT;

-- ── Post-check (expect zero rows) ───────────────────────────────────────
-- SELECT 'site_config' AS src, key, pattern
-- FROM public.site_config,
--   (VALUES ('Near-Uniform Radial Performance'), ('butt-jointed'),
--     ('250.540 kN/m \(Radial Secant'), ('depending on the All field seams'),
--     ('Burkina Faso is a ECOWAS member'), ('is a ECOWAS member')) AS t(pattern)
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
