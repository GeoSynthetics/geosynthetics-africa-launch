-- Add family_slug column to public.products table
ALTER TABLE public.products
ADD COLUMN IF NOT EXISTS family_slug text;

-- Drop the products_public view to allow recreating it with the new column
DROP VIEW IF EXISTS public.products_public;

-- Recreate the products_public view to include family_slug and all other fields
CREATE VIEW public.products_public AS
 SELECT p.id,
    p.name,
    p.slug,
    p.sku,
    p.short_description,
    p.description,
    p.stock_quantity,
    p.image_url,
    p.images,
    p.category_id,
    p.manufacturer_id,
    p.is_active,
    p.created_at,
    p.updated_at,
    p.meta_title,
    p.meta_description,
    p.seo_keywords,
    p.long_description,
    p.key_features,
    p.specifications,
    p.applications,
    p.compatible_systems,
    p.datasheet_url,
    p.installation_guide_url,
    p.qa_checklist_url,
    p.chemical_resistance_url,
    p.material,
    p.structure,
    p.colour,
    p.standard,
    p.roll_width,
    p.roll_length,
    p.alternative_ids,
    p.system_component_ids,
    p.family_slug,
    CASE
        WHEN (auth.role() = 'authenticated'::text) THEN p.price
        ELSE NULL::numeric
    END AS price,
    CASE
        WHEN (auth.role() = 'authenticated'::text) THEN p.sale_price
        ELSE NULL::numeric
    END AS sale_price
   FROM public.products p;
