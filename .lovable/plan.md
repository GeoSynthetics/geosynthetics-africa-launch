## Goal

Add a fully designed single product page at `/catalogue/$slug` that matches the uploaded Figma reference (everything except header/footer). Wire it to Supabase using the existing `products` schema, plus a small migration to support the richer content the design shows (typical properties table, key features, applications, datasheet link, long description).

## 1. Database additions (migration)

The current `products` table has: name, slug, sku, short_description, price, sale_price, stock_quantity, weight/dim fields, image_url, images, category_id, manufacturer_id, is_active. The Figma needs more. Add nullable columns so existing rows stay valid:

- `long_description text` — Overview body copy
- `key_features jsonb` — array of `{ label, icon }` (e.g. "High Filtration Efficiency")
- `specifications jsonb` — array of `{ property, test_method, unit, typical_value }` for the Typical Properties table
- `applications jsonb` — array of `{ title, subtitle, image_url }` for Typical Applications strip
- `compatible_systems jsonb` — array of `{ title, subtitle, image_url }` for Compatible Systems strip
- `datasheet_url text`, `installation_guide_url text`, `qa_checklist_url text`, `chemical_resistance_url text` — Quick Downloads
- `material text`, `structure text`, `colour text`, `standard text`, `roll_width text`, `roll_length text` — the small "at a glance" panel beside the hero image

All optional. The page renders sections only when data exists.

## 2. New route: `src/routes/catalogue.$slug.tsx`

File-based dynamic route using `createFileRoute("/catalogue/$slug")`.

- `loader` fetches the product by `slug` (with category + manufacturer joined). Throws `notFound()` if missing or `is_active=false`.
- Also fetches up to 4 related products (same `category_id`, exclude current).
- `head()` derives `<title>`, `description`, `og:title`, `og:description`, `og:image` from the product (uses `image_url`/first image as og:image).
- `errorComponent` and `notFoundComponent` provided.

### Page layout (top to bottom, matching Figma)

1. **Breadcrumb bar** (full width on hero background): Home › Catalogue › {Category} › {Manufacturer} › {Product name}.
2. **Hero section** (dark background, two-column on lg):
   - Left: eyebrow (category, uppercase red), big product name, short_description, row of 5 **key feature icons** (rendered from `key_features` with lucide icons; sensible fallback set if empty), then 3 CTA buttons: **Request Material Supply** (primary red), **Upload Project BOQ** (outline → /contacts), **Download Datasheet** (outline, disabled if no `datasheet_url`).
   - Right: large product image (uses `image_url` or first of `images`).
3. **Tabs strip** (sticky under hero): Overview · Specifications · Applications · Systems · Installation · QA & Testing · Documents · Case Studies. Smooth-scroll to in-page anchors. Built with shadcn `Tabs` + `useState` for active styling, anchors via `id` attributes on each section.
4. **Overview section** (3-column grid):
   - Col 1–2: heading "Overview", paragraphs from `long_description` (or `short_description` fallback).
   - Col 3: "At a glance" panel — `material / structure / colour / standard / roll_width / roll_length` rows with small icons (lucide).
   - Right rail (sidebar, sticky): **Need Help?** card with phone + email, **Quick Downloads** list (datasheet, installation guide, qa checklist, chemical resistance — each row with a download icon, only shown if URL exists), **Request a Quote** card with drag-and-drop file upload zone (PDF/DWG/DOC/XLS, max 20MB), name/email/message fields, "Submit & Get Proposal" button. Submission inserts into existing `quotes` table (verified to exist) plus uploads file to a `quote-attachments` Supabase Storage bucket (created in the migration).
5. **Typical Properties** table — renders `specifications` jsonb with columns Property / Test Method / Unit / Typical Value. Hidden if empty.
6. **Typical Applications** strip — 5 cards from `applications` jsonb, each `{ image, title, subtitle }`. "View all applications →" link to `/applications`.
7. **Compatible Systems** strip — same shape as applications, links to `/services`.
8. **Projects Using {Product}** — pulls latest 3 case studies (placeholder cards if no case-studies table; we'll render static stubs filtered by category).
9. **Related Products** sidebar/strip — uses fetched related-products list, links to their `/catalogue/$slug` pages, shows thumbnail + name + category + "View Product →".
10. **BoqCtaBand** at the bottom (existing component) followed by site footer (already in root).

### Quote form behavior

- Drag-drop zone using a hidden `<input type="file">` and `onDrop` handlers on a styled div ("Drag & drop files here or click to browse"). Validates type and 20MB size.
- On submit: upload file (if any) to `quote-attachments/{uuid}-{filename}`, then `supabase.from("quotes").insert({ product_id, name, email, message, attachment_url })`. Toasts success/error.

### Catalogue card link fix

Update `ProductCard` in `src/routes/catalogue.tsx` so cards link to `/catalogue/$slug` (currently they link back to `/catalogue` — bug). Also update `src/routes/products.$category.tsx` and any other place that should deep-link.

## 3. Files

- **new** `src/routes/catalogue.$slug.tsx`
- **edit** `src/routes/catalogue.tsx` — fix `ProductCard` link
- **migration** add the columns above + create `quote-attachments` storage bucket (public read) with policy allowing anon insert. Confirm `quotes` table shape; add `product_id uuid` and `attachment_url text` columns if missing.

## 4. Out of scope (follow-up)

- Extending the admin **New Product** form to edit the new jsonb/spec fields. After this page is approved, the next step is to expand `admin.products.tsx` with editors for `long_description`, `specifications` rows, `key_features`, `applications`, datasheet uploads, and the at-a-glance fields. Page will gracefully render whatever subset is filled in.
