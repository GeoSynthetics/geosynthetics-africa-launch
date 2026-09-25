-- Migration: Sanitize copied application slugs and match template keys in site_config
-- Date: 2026-07-01

-- 1. Update hierarchy_applications in site_config to use clean slugs for item id/slug/params
UPDATE public.site_config
SET value = jsonb_set(
  value,
  '{items}',
  (
    SELECT jsonb_agg(
      CASE
        WHEN item->>'id' = 'tailings-storage-facilities-tsfs-copy' THEN
          jsonb_build_object(
            'id', 'heap-leach-pad-lining',
            'to', item->>'to',
            'icon', item->>'icon',
            'slug', 'heap-leach-pad-lining',
            'label', 'Heap Leach Pad Lining',
            'params', jsonb_build_object('category', 'heap-leach-pad-lining'),
            'children', COALESCE(item->'children', '[]'::jsonb),
            'pageContent', COALESCE(item->'pageContent', '{}'::jsonb),
            'megaFallback', COALESCE(item->'megaFallback', '{}'::jsonb)
          )
        WHEN item->>'id' = 'heap-leach-pad-lining-copy-9' THEN
          jsonb_build_object(
            'id', 'reservoir-dam-lining',
            'to', item->>'to',
            'icon', item->>'icon',
            'slug', 'reservoir-dam-lining',
            'label', item->>'label',
            'params', jsonb_build_object('category', 'reservoir-dam-lining'),
            'children', COALESCE(item->'children', '[]'::jsonb),
            'pageContent', COALESCE(item->'pageContent', '{}'::jsonb),
            'megaFallback', COALESCE(item->'megaFallback', '{}'::jsonb)
          )
        WHEN item->>'id' = 'heap-leach-pad-lining-copy-8' THEN
          jsonb_build_object(
            'id', 'irrigation-canal-lining',
            'to', item->>'to',
            'icon', item->>'icon',
            'slug', 'irrigation-canal-lining',
            'label', item->>'label',
            'params', jsonb_build_object('category', 'irrigation-canal-lining'),
            'children', COALESCE(item->'children', '[]'::jsonb),
            'pageContent', COALESCE(item->'pageContent', '{}'::jsonb),
            'megaFallback', COALESCE(item->'megaFallback', '{}'::jsonb)
          )
        WHEN item->>'id' = 'heap-leach-pad-lining-copy-7' THEN
          jsonb_build_object(
            'id', 'landfill-ash-bund-lining',
            'to', item->>'to',
            'icon', item->>'icon',
            'slug', 'landfill-ash-bund-lining',
            'label', item->>'label',
            'params', jsonb_build_object('category', 'landfill-ash-bund-lining'),
            'children', COALESCE(item->'children', '[]'::jsonb),
            'pageContent', COALESCE(item->'pageContent', '{}'::jsonb),
            'megaFallback', COALESCE(item->'megaFallback', '{}'::jsonb)
          )
        WHEN item->>'id' = 'heap-leach-pad-lining-copy-6' THEN
          jsonb_build_object(
            'id', 'stabilisation-reinforcement',
            'to', item->>'to',
            'icon', item->>'icon',
            'slug', 'stabilisation-reinforcement',
            'label', item->>'label',
            'params', jsonb_build_object('category', 'stabilisation-reinforcement'),
            'children', COALESCE(item->'children', '[]'::jsonb),
            'pageContent', COALESCE(item->'pageContent', '{}'::jsonb),
            'megaFallback', COALESCE(item->'megaFallback', '{}'::jsonb)
          )
        WHEN item->>'id' = 'heap-leach-pad-lining-copy-5' THEN
          jsonb_build_object(
            'id', 'slope-erosion-protection',
            'to', item->>'to',
            'icon', item->>'icon',
            'slug', 'slope-erosion-protection',
            'label', item->>'label',
            'params', jsonb_build_object('category', 'slope-erosion-protection'),
            'children', COALESCE(item->'children', '[]'::jsonb),
            'pageContent', COALESCE(item->'pageContent', '{}'::jsonb),
            'megaFallback', COALESCE(item->'megaFallback', '{}'::jsonb)
          )
        WHEN item->>'id' = 'heap-leach-pad-lining-copy-4' THEN
          jsonb_build_object(
            'id', 'retaining-wall-systems',
            'to', item->>'to',
            'icon', item->>'icon',
            'slug', 'retaining-wall-systems',
            'label', item->>'label',
            'params', jsonb_build_object('category', 'retaining-wall-systems'),
            'children', COALESCE(item->'children', '[]'::jsonb),
            'pageContent', COALESCE(item->'pageContent', '{}'::jsonb),
            'megaFallback', COALESCE(item->'megaFallback', '{}'::jsonb)
          )
        WHEN item->>'id' = 'heap-leach-pad-lining-copy-3' THEN
          jsonb_build_object(
            'id', 'drainage-filtration',
            'to', item->>'to',
            'icon', item->>'icon',
            'slug', 'drainage-filtration',
            'label', item->>'label',
            'params', jsonb_build_object('category', 'drainage-filtration'),
            'children', COALESCE(item->'children', '[]'::jsonb),
            'pageContent', COALESCE(item->'pageContent', '{}'::jsonb),
            'megaFallback', COALESCE(item->'megaFallback', '{}'::jsonb)
          )
        WHEN item->>'id' = 'heap-leach-pad-lining-copy-2' THEN
          jsonb_build_object(
            'id', 'coastal-protection',
            'to', item->>'to',
            'icon', item->>'icon',
            'slug', 'coastal-protection',
            'label', item->>'label',
            'params', jsonb_build_object('category', 'coastal-protection'),
            'children', COALESCE(item->'children', '[]'::jsonb),
            'pageContent', COALESCE(item->'pageContent', '{}'::jsonb),
            'megaFallback', COALESCE(item->'megaFallback', '{}'::jsonb)
          )
        WHEN item->>'id' = 'heap-leach-pad-lining-copy-1' THEN
          jsonb_build_object(
            'id', 'roads-railways',
            'to', item->>'to',
            'icon', item->>'icon',
            'slug', 'roads-railways',
            'label', item->>'label',
            'params', jsonb_build_object('category', 'roads-railways'),
            'children', COALESCE(item->'children', '[]'::jsonb),
            'pageContent', COALESCE(item->'pageContent', '{}'::jsonb),
            'megaFallback', COALESCE(item->'megaFallback', '{}'::jsonb)
          )
        WHEN item->>'id' = 'mse-retaining-wall-geogrids' THEN
          jsonb_build_object(
            'id', 'mse-retaining-walls-reinforced-soil',
            'to', item->>'to',
            'icon', item->>'icon',
            'slug', 'mse-retaining-walls-reinforced-soil',
            'label', item->>'label',
            'params', jsonb_build_object('slug', 'mse-retaining-walls-reinforced-soil'),
            'children', COALESCE(item->'children', '[]'::jsonb),
            'pageContent', COALESCE(item->'pageContent', '{}'::jsonb),
            'megaFallback', COALESCE(item->'megaFallback', '{}'::jsonb)
          )
        ELSE item
      END
      FROM jsonb_array_elements(value->'items') AS item
    )
  )
)
WHERE key = 'hierarchy_applications';

-- 2. Update template_applications keys in site_config to align with new clean slugs
UPDATE public.site_config
SET value = (
  SELECT jsonb_object_agg(
    CASE
      WHEN k = 'tailings-storage-facilities-tsfs-copy' THEN 'heap-leach-pad-lining'
      WHEN k = 'heap-leach-pad-lining-copy-9' THEN 'reservoir-dam-lining'
      WHEN k = 'heap-leach-pad-lining-copy-8' THEN 'irrigation-canal-lining'
      WHEN k = 'heap-leach-pad-lining-copy-7' THEN 'landfill-ash-bund-lining'
      WHEN k = 'heap-leach-pad-lining-copy-6' THEN 'stabilisation-reinforcement'
      WHEN k = 'heap-leach-pad-lining-copy-5' THEN 'slope-erosion-protection'
      WHEN k = 'heap-leach-pad-lining-copy-4' THEN 'retaining-wall-systems'
      WHEN k = 'heap-leach-pad-lining-copy-3' THEN 'drainage-filtration'
      WHEN k = 'heap-leach-pad-lining-copy-2' THEN 'coastal-protection'
      WHEN k = 'heap-leach-pad-lining-copy-1' THEN 'roads-railways'
      WHEN k = 'mse-retaining-wall-geogrids' THEN 'mse-retaining-walls-reinforced-soil'
      ELSE k
    END,
    CASE
      WHEN k IN (
        'tailings-storage-facilities-tsfs-copy', 'heap-leach-pad-lining-copy-9',
        'heap-leach-pad-lining-copy-8', 'heap-leach-pad-lining-copy-7',
        'heap-leach-pad-lining-copy-6', 'heap-leach-pad-lining-copy-5',
        'heap-leach-pad-lining-copy-4', 'heap-leach-pad-lining-copy-3',
        'heap-leach-pad-lining-copy-2', 'heap-leach-pad-lining-copy-1',
        'mse-retaining-wall-geogrids'
      ) THEN
        v || jsonb_build_object(
          'slug',
          CASE
            WHEN k = 'tailings-storage-facilities-tsfs-copy' THEN 'heap-leach-pad-lining'
            WHEN k = 'heap-leach-pad-lining-copy-9' THEN 'reservoir-dam-lining'
            WHEN k = 'heap-leach-pad-lining-copy-8' THEN 'irrigation-canal-lining'
            WHEN k = 'heap-leach-pad-lining-copy-7' THEN 'landfill-ash-bund-lining'
            WHEN k = 'heap-leach-pad-lining-copy-6' THEN 'stabilisation-reinforcement'
            WHEN k = 'heap-leach-pad-lining-copy-5' THEN 'slope-erosion-protection'
            WHEN k = 'heap-leach-pad-lining-copy-4' THEN 'retaining-wall-systems'
            WHEN k = 'heap-leach-pad-lining-copy-3' THEN 'drainage-filtration'
            WHEN k = 'heap-leach-pad-lining-copy-2' THEN 'coastal-protection'
            WHEN k = 'heap-leach-pad-lining-copy-1' THEN 'roads-railways'
            WHEN k = 'mse-retaining-wall-geogrids' THEN 'mse-retaining-walls-reinforced-soil'
          END
        )
      ELSE v
    END
  )
  FROM jsonb_each(value) AS t(k, v)
)
WHERE key = 'template_applications';
