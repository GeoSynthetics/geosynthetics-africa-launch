-- Migration: Rename legacy service, application and country slugs in site_config
-- Date: 2026-10-17
--
-- Commit daa8c9f renamed these slugs in code and added 301 redirects in
-- vercel.json, but the CMS data in site_config still used the old slugs, so
-- the new URLs returned 404 and menus/footer still linked to the old URLs.
--
-- Apply in the Supabase SQL editor. Safe to re-run (replacements are exact
-- quoted tokens and become no-ops once applied). The script enables RLS on
-- the only table it creates, so no "Run and enable RLS" choice is needed.
--
-- ── Optional preview (run on its own first) ─────────────────────────────
-- Counts of old tokens (should be > 0 before) and new tokens already present
-- (a non-zero "new" count on a template_* key means a key collision: review).
--
-- WITH renames(old_slug, new_slug) AS (VALUES
--   ('gse-hdpe-liner-installer-africa', 'geomembrane-liner-installation-africa'),
--   ('floating-cover-systems-africa', 'floating-cover-installation-africa'),
--   ('gabion-basket-installation', 'gabion-installation-contractor-africa'),
--   ('channel-lining-gccm-installation-africa', 'gccm-channel-lining-contractor-africa'),
--   ('geocell-installations-africa', 'geocell-installation-contractor-africa'),
--   ('gcl-liner-installation', 'gcl-installation-contractor-africa'),
--   ('drainage-filtration', 'drainage-filtration-systems-africa'),
--   ('gse-hdpe-liner-smooth-geomembrane-supplier-south-africa', 'south-africa-geosynthetics-supplier-installer'),
--   ('tanzania-geosynthetics-supplier-hdpe-liners-geotextiles-geogrids', 'tanzania-geosynthetics-supplier-installer'),
--   ('botswana-geomembranes-hdpe-geotextiles-geogrids-supplier', 'botswana-geosynthetics-supplier-installer'),
--   ('zimbabwe-river-rehabilitation-jutesoillock-292-erosion-control', 'zimbabwe-geosynthetics-supplier-installer'),
--   ('zimbabwe-geosynthetics-supplier-contact', 'zimbabwe-geosynthetics-supplier-installer'),
--   ('zambia-hdpe-liners-bidim-geotextiles-geogrids-supplier', 'zambia-geosynthetics-supplier-installer'),
--   ('drc-congo-geosynthetics-bidim-hdpe-geomembranes-supplier', 'drc-geosynthetics-supplier-installer')
-- )
-- SELECT s.key, r.old_slug,
--   (length(s.value::text) - length(replace(s.value::text, '"' || r.old_slug || '"', ''))) / length('"' || r.old_slug || '"')
--   + (length(s.value::text) - length(replace(s.value::text, '"/' || r.old_slug, ''))) / length('"/' || r.old_slug) AS old_hits,
--   (length(s.value::text) - length(replace(s.value::text, '"' || r.new_slug || '"', ''))) / length('"' || r.new_slug || '"') AS new_hits
-- FROM public.site_config s CROSS JOIN renames r
-- WHERE s.key IN ('hierarchy_services', 'template_services', 'hierarchy_applications',
--   'template_applications', 'template_countries', 'footer_content', 'homepage_content',
--   'template_industries', 'hierarchy_products', 'template_product_categories')
-- ORDER BY s.key, r.old_slug;

BEGIN;

-- 1. Backup of every row this migration touches (kept on re-run)
CREATE TABLE IF NOT EXISTS public.site_config_backup_20261017 AS
SELECT * FROM public.site_config
WHERE key IN ('hierarchy_services', 'template_services', 'hierarchy_applications',
  'template_applications', 'template_countries', 'footer_content', 'homepage_content',
  'template_industries', 'hierarchy_products', 'template_product_categories');

-- Backup is admin-only: RLS on with no policies hides it from the anon /
-- authenticated API keys (the SQL editor still reads it for rollback)
ALTER TABLE public.site_config_backup_20261017 ENABLE ROW LEVEL SECURITY;

-- 2 + 3. Replace exact quoted tokens: "old", "/old" and "/old/" (slugs, ids,
--    params, template keys and internal link paths). The old → new map is
--    inline (no temp table) so the SQL editor's RLS prompt can't break it.
DO $$
DECLARE
  r record;
BEGIN
  FOR r IN SELECT * FROM (VALUES
  -- Services
  ('gse-hdpe-liner-installer-africa', 'geomembrane-liner-installation-africa'),
  ('floating-cover-systems-africa', 'floating-cover-installation-africa'),
  ('gabion-basket-installation', 'gabion-installation-contractor-africa'),
  ('channel-lining-gccm-installation-africa', 'gccm-channel-lining-contractor-africa'),
  ('geocell-installations-africa', 'geocell-installation-contractor-africa'),
  ('gcl-liner-installation', 'gcl-installation-contractor-africa'),
  -- Application
  ('drainage-filtration', 'drainage-filtration-systems-africa'),
  -- Countries
  ('gse-hdpe-liner-smooth-geomembrane-supplier-south-africa', 'south-africa-geosynthetics-supplier-installer'),
  ('tanzania-geosynthetics-supplier-hdpe-liners-geotextiles-geogrids', 'tanzania-geosynthetics-supplier-installer'),
  ('botswana-geomembranes-hdpe-geotextiles-geogrids-supplier', 'botswana-geosynthetics-supplier-installer'),
  ('zimbabwe-river-rehabilitation-jutesoillock-292-erosion-control', 'zimbabwe-geosynthetics-supplier-installer'),
  ('zimbabwe-geosynthetics-supplier-contact', 'zimbabwe-geosynthetics-supplier-installer'),
  ('zambia-hdpe-liners-bidim-geotextiles-geogrids-supplier', 'zambia-geosynthetics-supplier-installer'),
  ('drc-congo-geosynthetics-bidim-hdpe-geomembranes-supplier', 'drc-geosynthetics-supplier-installer')
  ) AS renames(old_slug, new_slug) LOOP
    UPDATE public.site_config
    SET value = replace(replace(replace(value::text,
          '"/' || r.old_slug || '/"', '"/' || r.new_slug || '"'),
          '"/' || r.old_slug || '"', '"/' || r.new_slug || '"'),
          '"' || r.old_slug || '"', '"' || r.new_slug || '"')::jsonb,
        updated_at = now()
    WHERE key IN ('hierarchy_services', 'template_services', 'hierarchy_applications',
      'template_applications', 'template_countries', 'footer_content', 'homepage_content',
      'template_industries', 'hierarchy_products', 'template_product_categories')
      AND (value::text LIKE '%"' || r.old_slug || '"%'
        OR value::text LIKE '%"/' || r.old_slug || '"%'
        OR value::text LIKE '%"/' || r.old_slug || '/"%');
  END LOOP;
END $$;

-- 4. Homepage office cards: stop linking to geosynthetics.co.za
UPDATE public.site_config
SET value = jsonb_set(
      value,
      '{presence,offices}',
      (
        SELECT jsonb_agg(
          CASE
            WHEN office->>'linkUrl' LIKE 'https://geosynthetics.co.za%'
              OR office->>'linkUrl' LIKE 'https://www.geosynthetics.co.za%'
            THEN jsonb_set(office, '{linkUrl}', '"/contacts"'::jsonb)
            ELSE office
          END
          ORDER BY ord
        )
        FROM jsonb_array_elements(value->'presence'->'offices') WITH ORDINALITY AS o(office, ord)
      )
    ),
    updated_at = now()
WHERE key = 'homepage_content'
  AND jsonb_typeof(value->'presence'->'offices') = 'array'
  AND jsonb_array_length(value->'presence'->'offices') > 0;

COMMIT;

-- ── Post-check (expect zero rows) ───────────────────────────────────────
-- SELECT s.key, r.old_slug
-- FROM public.site_config s
-- CROSS JOIN (VALUES ('gse-hdpe-liner-installer-africa'), ('floating-cover-systems-africa'),
--   ('gabion-basket-installation'), ('channel-lining-gccm-installation-africa'),
--   ('geocell-installations-africa'), ('gcl-liner-installation'), ('drainage-filtration'),
--   ('gse-hdpe-liner-smooth-geomembrane-supplier-south-africa'),
--   ('tanzania-geosynthetics-supplier-hdpe-liners-geotextiles-geogrids'),
--   ('botswana-geomembranes-hdpe-geotextiles-geogrids-supplier'),
--   ('zimbabwe-river-rehabilitation-jutesoillock-292-erosion-control'),
--   ('zimbabwe-geosynthetics-supplier-contact'),
--   ('zambia-hdpe-liners-bidim-geotextiles-geogrids-supplier'),
--   ('drc-congo-geosynthetics-bidim-hdpe-geomembranes-supplier')) AS r(old_slug)
-- WHERE s.value::text LIKE '%"' || r.old_slug || '"%'
--    OR s.value::text LIKE '%"/' || r.old_slug || '"%'
--    OR s.value::text LIKE '%"/' || r.old_slug || '/"%'
-- UNION ALL
-- SELECT 'homepage_content (offices)', office->>'linkUrl'
-- FROM public.site_config,
--   jsonb_array_elements(value->'presence'->'offices') AS office
-- WHERE key = 'homepage_content' AND office->>'linkUrl' LIKE '%geosynthetics.co.za%';
--
-- ── Rollback ────────────────────────────────────────────────────────────
-- UPDATE public.site_config s SET value = b.value, updated_at = now()
-- FROM public.site_config_backup_20261017 b WHERE s.key = b.key;
