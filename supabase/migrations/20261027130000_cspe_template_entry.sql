-- Migration: Give the CSPE page its own content entry
-- Date: 2026-10-27
--
-- The CSPE menu item (slug cspe-geomembranes-for-potable-water-floating-covers)
-- carries the id "rfpp-geomembrane-liners", and template_product_categories had
-- no entry under the CSPE slug, so the CSPE URL fell back to the rFPP entry and
-- showed rFPP content. This adds a CSPE entry under the CSPE slug, which the
-- product family route reads first. The rFPP entry and menu are not changed.
--
-- Apply in the Supabase SQL editor after 20261027120000. Safe to re-run.
-- All CSPE values are the mill's published data for the 60 mil 3-ply (CS60)
-- and 90 mil 5-ply (CS90) grades.

BEGIN;

DO $$
DECLARE
  base jsonb;
  fc_image jsonb;
  cspe jsonb := $cspe${"label": "CSPE Geomembranes - CS60 & CS90 for Potable Water & Floating Covers", "subtitle": "Polyester-reinforced chlorosulfonated polyethylene (CSPE) in CS60 (1.52 mm, 3-ply) and CS90 (2.28 mm, 5-ply). NSF/ANSI 61 certified for drinking water, backed by a 30-year mill weathering warranty for approved applications. Fabricated into floating covers, reservoir liners and drop-in tank liners in our own facility, and installed by our own crews.", "description": ["CSPE is a synthetic rubber geomembrane, the polymer once sold as Hypalon. It is calendered into plies and laminated over a polyester reinforcing scrim, which gives a sheet that stays flexible, holds its dimensions in exposed service and resists ozone, UV and cold cracking. It has been used for potable water floating covers and reservoir liners since the late 1970s, which is why many water utilities still specify it by name.", "We supply two grades. CS60 is a 60 mil (1.52 mm) 3-ply sheet for floating covers, reservoir and pond liners and baffle curtains. CS90 is a 90 mil (2.28 mm) 5-ply sheet with two reinforcing plies, for large covers, desalination cell liners and duties where higher tear, puncture and hydrostatic resistance justify the extra mass. Both use a 10 x 10, 1000 denier polyester scrim and are certified to NSF/ANSI 61 for contact with drinking water.", "Most of the seaming is done before the material reaches site. We fabricate covers and liners into large panels in our own facility, accordion fold them and roll them on heavy-duty cores, so field seams are limited to panel joins and details. Field and factory seams are made and tested to the mill's procedures and the project CQA plan, and the handover dossier records every seam."], "technicalHighlights": [{"label": "Grades", "value": "CS60 · CS90"}, {"label": "Thickness", "value": "1.52 mm · 2.28 mm"}, {"label": "Potable water", "value": "NSF/ANSI 61"}, {"label": "Weathering warranty", "value": "30 years (approved applications)"}, {"label": "Reinforcement", "value": "10 x 10, 1000 denier PET scrim"}], "propertiesTable": {"headers": ["Property", "Test Method", "CS60", "CS90"], "rows": [["Construction", "-", "3-ply, polyester scrim", "5-ply, 2 polyester scrims"], ["Scrim", "-", "10 x 10, 1000 denier", "10 x 10, 1000 denier"], ["Thickness, overall (typical / min)", "ASTM D751", "1.52 / 1.47 mm", "2.28 / 2.18 mm"], ["Grab breaking strength (typical / min)", "ASTM D751", "1,556 / 1,334 N", "2,668 / 2,313 N"], ["Elongation at break (typical / min)", "-", "105 / 75 %", "120 / 75 %"], ["Tongue tear, 8 x 8 in (typical / min)", "ASTM D751", "444 / 355 N", "689 / 556 N"], ["Hydrostatic resistance (typical / min)", "ASTM D751 Method A, Proc. I", "3,102 / 2,757 kPa", "4,137 / 3,447 kPa"], ["Puncture resistance (typical / min)", "FTMS 101B Method 2031", "1,334 / 1,112 N", "2,224 / 2,001 N"], ["Bonded seam strength (min)", "ASTM D751 modified", "1,201 N or 90% of parent", "1,000 N (typical 90% of parent)"], ["Ply adhesion", "ASTM D413 Type A", "44 N per 25 mm", "48 N per 25 mm (min 35)"], ["Ozone resistance, 100 pphm, 40 °C, 7 days", "ASTM D1149", "No effect", "No effect"], ["Low-temperature flexibility, -40 °C", "ASTM D2136", "Pass", "Pass"], ["Potable water", "NSF/ANSI 61", "Certified", "Certified"], ["Weathering warranty", "-", "30 years, approved applications", "30 years, approved applications"], ["Colours", "-", "Black, tan, white", "Black, tan, white"]]}, "faqs": [{"question": "When should I choose CSPE over rLLDPE or rFPP for a floating cover?", "answer": "Choose CSPE where the owner wants the longest exposed weathering record, typically municipal potable water reservoirs. Scrim-reinforced LLDPE (our FC45 and FC60) is lighter and suits process water, effluent, agricultural and potable covers; FC60 carries a 30-year warranty (20 years full plus 10 years pro-rata). rFPP sits between the two for exposed liners. We will compare the options against your reservoir size, water quality and design life."}, {"question": "Is CSPE approved for drinking water?", "answer": "Yes. Both CS60 and CS90 are certified to NSF/ANSI 61 for drinking water system components. The certification is held against the mill product, and we supply the certificate and batch documents with every consignment."}, {"question": "What does the 30-year warranty cover?", "answer": "It is the mill's limited weathering warranty for approved CSPE applications. We confirm in writing, before you order, whether your application qualifies and what the terms are, so the warranty is part of the contract documents rather than a brochure claim."}, {"question": "Should I specify CS60 or CS90?", "answer": "CS60 (1.52 mm, 3-ply) is the usual choice for floating covers, reservoir liners and baffle curtains. CS90 (2.28 mm, 5-ply) has about 70% more grab strength and puncture resistance and about 55% more tear strength, and is used for large covers exposed to high wind, desalination cells and liners that take regular maintenance traffic."}, {"question": "Black, tan or white?", "answer": "Black is the standard for most liners. Tan and white surfaces absorb less sun, so they run cooler on exposed covers and reservoirs in hot climates and make the cover surface easier to inspect. All three colours carry the same properties."}, {"question": "Do you supply only, or design and install the cover as well?", "answer": "Both. We supply CS60 and CS90 as material only, or design the panel layout, fabricate the cover in our own facility and install it with our own crews, including floats, ballast lines, rainwater sumps, hatches and anchorage. Every installation is handed over with a full QA/QC dossier."}], "installationSpecs": ["Every CSPE cover or liner starts with a layout drawing: structure geometry, operating water levels, wind uplift, rainwater collection and removal, access hatches, vents and the perimeter anchorage detail. The cover is then fabricated to that layout in our facility as large panels, so site work is limited to deployment, panel joins and detailing.", "Seams are made to the mill's CSPE seaming procedure. Trial seams are made and tested before production seaming, every seam is non-destructively tested along its full length, and destructive samples are taken at the frequency set in the project CQA plan. Bonded seams must reach the mill's minimum bonded seam strength (1,201 N for CS60, 1,000 N for CS90) or 90% of parent material.", "The handover dossier includes the as-built panel layout, mill and NSF/ANSI 61 certificates traceable to the supplied rolls, seam and repair logs, test results, the anchorage and penetration records, and a cover inspection and maintenance guide."], "applications": [{"label": "Floating Covers & Evaporation Control", "slug": "floating-covers-evaporation-control"}, {"label": "Reservoir & Dam Lining", "slug": "reservoir-dam-lining"}, {"label": "Concrete Protection & Tank Lining", "slug": "concrete-protection-lining"}, {"label": "Process Water & Pollution Control Dam Lining", "slug": "process-water-pollution-control-dam-lining"}], "industries": [{"label": "Water Utilities & Irrigation", "slug": "water-utilities-irrigation"}, {"label": "Mining & Minerals Processing", "slug": "mining-minerals-processing"}, {"label": "Agriculture & Aquaculture", "slug": "agriculture-aquaculture"}], "relatedProductGroups": [{"name": "rLLDPE Floating Cover Liners (FC45 & FC60)", "link": "/products/geomembrane-liners/floating-cover-geomembranes"}, {"name": "rFPP Geomembranes", "link": "/products/geomembrane-liners/rfpp-geomembrane-liners"}, {"name": "PVC Potable Water Liners", "link": "/products/geomembrane-liners/pvc-geomembranes"}, {"name": "Floating Cover Installation", "link": "/services/floating-cover-installation-africa"}], "seo": {"title": "CSPE Geomembrane CS60 & CS90 | Potable Water Floating Covers Africa", "description": "NSF/ANSI 61 CSPE geomembranes, CS60 (1.52 mm) and CS90 (2.28 mm), with a 30-year weathering warranty. Floating covers and reservoir liners fabricated and installed across Africa.", "keywords": "CSPE geomembrane, CSPE floating cover, Hypalon liner, potable water floating cover, NSF 61 geomembrane, reservoir cover Africa, CS60, CS90, desalination cell liner, drop-in tank liner"}}$cspe$::jsonb;
BEGIN
  SELECT j.val INTO base
  FROM public.site_config s, jsonb_each(s.value) AS j(key, val)
  WHERE s.key = 'template_product_categories' AND j.key = 'rfpp-geomembrane-liners';

  SELECT j.val->'heroImage' INTO fc_image
  FROM public.site_config s, jsonb_each(s.value) AS j(key, val)
  WHERE s.key = 'template_product_categories'
    AND (j.key = 'floating-cover-geomembranes' OR j.val->>'slug' = 'floating-cover-geomembranes')
  LIMIT 1;

  -- Keep only structural fields from the rFPP entry (category and the like);
  -- every content field comes from the CSPE data
  base := coalesce(base, '{}'::jsonb)
    - 'label' - 'title' - 'subtitle' - 'description' - 'technicalSpecText'
    - 'technicalHighlights' - 'typicalValues' - 'propertiesTable' - 'properties'
    - 'faqs' - 'questions' - 'installationSpecs' - 'applications' - 'industries'
    - 'relatedProductGroups' - 'popularProducts' - 'popularCatalogue'
    - 'projectReferences' - 'projects' - 'features' - 'types' - 'benefits' - 'seo';

  base := base || cspe || jsonb_build_object(
    'slug', 'cspe-geomembranes-for-potable-water-floating-covers',
    'popularProducts', '[]'::jsonb,
    'projectReferences', '[]'::jsonb);
  IF fc_image IS NOT NULL AND jsonb_typeof(fc_image) = 'string' THEN
    base := jsonb_set(base, '{heroImage}', fc_image);
  END IF;

  UPDATE public.site_config
  SET value = jsonb_set(value, '{cspe-geomembranes-for-potable-water-floating-covers}', base),
      updated_at = now()
  WHERE key = 'template_product_categories';
END $$;

COMMIT;

-- Rollback: remove the CSPE entry (the page falls back to rFPP content again)
-- UPDATE public.site_config
-- SET value = value - 'cspe-geomembranes-for-potable-water-floating-covers', updated_at = now()
-- WHERE key = 'template_product_categories';
