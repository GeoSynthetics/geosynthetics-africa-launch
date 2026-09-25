-- Migration: 20260924000000_sync_product_categories.sql
-- Description: Synchronize product categories to unify categories between Catalogue, Products, and Navigation.
-- Adds missing categories 'Geocells' and 'GCLs', and ensures 'Tools & Accessories' naming consistency.

-- 1. Ensure 'Tools & Accessories' has the standardized name for slug 'accessories'
UPDATE public.product_categories
SET name = 'Tools & Accessories', updated_at = now()
WHERE slug = 'accessories';

-- 2. Insert 'Geocells' if it does not already exist
INSERT INTO public.product_categories (id, name, slug, sort_order, created_at, updated_at)
SELECT
    gen_random_uuid(),
    'Geocells',
    'geocells',
    10,
    now(),
    now()
WHERE NOT EXISTS (
    SELECT 1 FROM public.product_categories WHERE slug = 'geocells'
);

-- 3. Insert 'GCLs' if it does not already exist
INSERT INTO public.product_categories (id, name, slug, sort_order, created_at, updated_at)
SELECT
    gen_random_uuid(),
    'GCLs',
    'gcls',
    11,
    now(),
    now()
WHERE NOT EXISTS (
    SELECT 1 FROM public.product_categories WHERE slug = 'gcls'
);
