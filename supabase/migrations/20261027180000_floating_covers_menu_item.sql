-- Add Floating Covers & Evaporation Control to the Applications mega menu
-- (hierarchy_applications), directly after Reservoir & Dam Lining.
-- Idempotent: does nothing if the item is already there.
DO $$
DECLARE
  pos int;
  item jsonb := $item${
    "id": "floating-covers-evaporation-control",
    "to": "/$slug",
    "icon": "Waves",
    "slug": "floating-covers-evaporation-control",
    "label": "Floating Covers & Evaporation Control",
    "params": {"category": "floating-covers-evaporation-control"},
    "children": [],
    "pageContent": {},
    "megaFallback": {
      "featuredTitle": "OUR FLOATING COVER RANGE",
      "featured": [
        {
          "to": "/catalogue/$slug",
          "spec": "FC45 & FC60 scrim-reinforced LLDPE, NSF/ANSI 61",
          "image": "/api/storage/media-center/Floating-Covers-South-Africa-Geosynthetics-Africa_5536bff0-c2ff-45e1-b671-e9a6bc317abd.webp",
          "label": "rLLDPE Floating Cover Membrane",
          "params": {"slug": "rlldpe-floating-cover-exposed-membrane"}
        }
      ],
      "topSellingProductIds": ["4ba9b604-fe8b-4138-8ef4-6116ab5dd086"]
    }
  }$item$::jsonb;
BEGIN
  IF EXISTS (
    SELECT 1 FROM public.site_config s, jsonb_array_elements(s.value->'items') i
    WHERE s.key = 'hierarchy_applications' AND i->>'slug' = 'floating-covers-evaporation-control'
  ) THEN
    RAISE NOTICE 'Floating covers menu item already present: skipped';
    RETURN;
  END IF;

  SELECT t.ord::int INTO pos
  FROM public.site_config s, jsonb_array_elements(s.value->'items') WITH ORDINALITY AS t(i, ord)
  WHERE s.key = 'hierarchy_applications' AND t.i->>'slug' = 'reservoir-dam-lining';

  -- ord is 1-based, so inserting at index `pos` places the item after Reservoir & Dam Lining
  UPDATE public.site_config
  SET value = jsonb_insert(value, ARRAY['items', coalesce(pos, jsonb_array_length(value->'items'))::text], item)
  WHERE key = 'hierarchy_applications';
END $$;
