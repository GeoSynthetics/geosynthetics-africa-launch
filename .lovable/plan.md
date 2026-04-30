
# Geosynthetics Africa — Marketing Site v1

A high-quality, fully responsive marketing site that mirrors the Figma design. All content is placeholder where real data isn't yet available; every page is a real route (no hash-section navigation) for SEO and shareability. No backend in this pass — CTAs (Upload BOQ, Quick Quote, Contact) open friendly "coming soon" toasts so the UX is complete.

## Design System

Pulled from the Figma:
- **Brand red** (primary CTA): `#E11D2E` style red — used on logo accent, primary buttons, hover/active states.
- **Dark surface** (top utility bar, header on hero, footer, dark CTA cards): near-black `#0A0A0A` / `#111`.
- **Light surface**: white background for body sections, with `#F7F7F7` for alternating bands.
- **Text**: near-black headings, neutral grey body.
- **Typography**: clean industrial sans (Inter via system stack — closest free match to the Figma).
- **Radius**: small (4–8px) — industrial, not playful.
- **Iconography**: lucide-react throughout.

These will be wired into `src/styles.css` as semantic tokens (`--primary`, `--background`, `--surface-dark`, etc.) so the whole app stays consistent.

## Routes (all real TanStack Start routes, each with proper `head()` metadata)

```text
/                     Home
/products             Products landing
/products/$category   Geomembranes, Geotextiles, Geogrids, Geocells, GCLs,
                      Drainage Composites, Erosion Control, Accessories
/applications         Applications landing
/applications/$category   Mining, Water Containment, Waste & Landfills,
                          Roads & Infrastructure, Erosion Control,
                          Drainage Systems, Agriculture & Aquaculture
/services             Services overview (Supply, Installation, QA/QC, Design,
                      Logistics, After Sales)
/quality-assurance    QA/QC standards & process
/catalogue            Searchable catalogue placeholder (UI only, no live search)
/resources            Datasheets, Installation Guides, Case Studies, FAQ
/contacts             Contact form + regional offices (SA, Ghana, Tanzania, Zimbabwe)
```

Category pages use a single dynamic file each (`products.$category.tsx`, `applications.$category.tsx`) backed by a typed in-file content map — easy to swap for CMS data later.

## Global Layout (in `__root.tsx` shell)

1. **Top utility bar** (dark): IAGI Member · B-BBEE Level 2 · QA/QC Certified · Pan-African Logistics · EN selector.
2. **Header**: Geosynthetics Africa logo (Africa silhouette + red accent), nav (Products, Applications, Services, Quality Assurance, Catalogue, Resources, Contacts), prominent red **Upload Project BOQ** CTA.
3. **Footer**: 6-column link grid mirroring nav (Products / Applications / Services / Quality Assurance / Resources / Contacts), brand block with social icons, bottom legal bar with cert badges.

## Mega Menu (the centerpiece)

Built with Radix `NavigationMenu` (already in `src/components/ui/navigation-menu.tsx`) so we get accessible keyboard nav and focus management for free.

Three mega menus, each a 4-column panel matching the Figma exactly:

- **Products** (image 2): Browse Products list · Subcategory list (e.g. Geomembrane variants) · Popular Products with thumbnails · Quick Actions (View Catalogue, Download Data Sheets, Installation Guides, Speak to Expert).
- **Applications** (image 4): Application Categories · Sub-systems (e.g. TSF) · Featured Applications with images & "View Case Study" · Application Support actions.
- **Services** (image 3): Our Services list · Supply Services list · Service Highlights (3 image cards) · Quick Actions.

Below each panel: the **Global Best-in-Class Partners** strip (GSE, Tensar, Eurobent, Tiltex, Bera, Flowtex, Polytape, SoilLock — text logos).

Catalogue, Quality Assurance, Resources, Contacts are simple links (no flyout).

### Responsive behaviour

- **≥ lg (1024px+)**: full mega menu on hover/focus.
- **md / sm**: mega menus collapse into a slide-in `Sheet` (right-side drawer) with accordion sections for each menu group — same content, finger-friendly. Top utility bar collapses to a single icon row.

## Home Page Sections (matches image 1, top-to-bottom)

1. **Hero**: full-bleed dark image of geomembrane install, headline "Africa's Integrated Geosynthetics Execution Platform", red sub-emphasis, three CTAs (Upload BOQ, Request Material Supply, Speak to Technical Team).
2. **Trust strip**: 4 certification badges with icons.
3. **The GSA Difference — One System. One Partner. One Accountability.**: copy block + 5-step horizontal process (Design → Supply → Install → Test → Certify) with images and red arrows.
4. **Engineered Systems for Every Application**: 6-card grid with image overlays linking to `/applications/...`.
5. **Global Best-in-Class Materials**: partner logo strip.
6. **Our Services**: 5 icon cards + dark "No System Leaves Site Unverified" panel with bullet list and red CTA.
7. **Stats + Pan-African Presence**: dark band with 4 KPI counters (20+ Years, 1000+ Projects, 50+ Countries, 200+ Products) and a stylised Africa map with regional office flags.
8. **Proven On Projects Across Africa**: 3 case study cards + "Explore Our Catalogue" search teaser.
9. **Submit your BOQ** CTA band (red).
10. Footer.

## Inner Page Templates

- **Products / Applications landing**: hero strip, intro copy, grid of category cards, partner strip, BOQ CTA band.
- **Category detail (`/products/$category`, `/applications/$category`)**: breadcrumb, hero with category name, intro, related products/applications grid, "Speak to expert" sidebar CTA, BOQ band.
- **Services / QA / Resources / Contacts**: hero + content sections (cards, accordions for FAQ on Resources, simple form on Contacts that toasts on submit).
- **Catalogue**: search bar (UI only), filter sidebar (categories, polymer type, thickness — disabled controls with "search coming soon" tooltip), placeholder result grid.

## Reusable Components

`src/components/site/`
- `TopBar.tsx`, `Header.tsx`, `MegaMenu.tsx` (+ `mega-menu-data.ts`), `MobileNav.tsx`
- `Footer.tsx`, `PartnerStrip.tsx`, `BoqCtaBand.tsx`, `StatsBand.tsx`
- `SectionHeading.tsx`, `CategoryCard.tsx`, `ServiceCard.tsx`, `CaseStudyCard.tsx`, `ProcessStep.tsx`
- `PageHero.tsx` (shared inner-page hero)

All accept content via props so swapping in CMS data later is trivial.

## Imagery

For v1 we use Unsplash hot-link URLs (mining, geomembrane installs, water reservoirs, roads, landfills) — already permitted, no upload needed. Partner names render as styled text logos to avoid trademark issues until real assets are provided.

## Technical Notes

- TanStack Start file-based routes only; `__root.tsx` hosts the global TopBar/Header/Footer wrapper and `<Outlet />`. Each route file defines `head()` with route-specific title, description, and og tags.
- Each route with no loader still gets `notFoundComponent`; root keeps its `notFoundComponent`; router keeps `defaultErrorComponent` (already present).
- `sonner` toaster mounted in the root shell to back the form/CTA toasts.
- Mega menu data lives in a single typed `mega-menu-data.ts` so desktop and mobile navs stay in sync.
- Strict TypeScript; no new npm dependencies needed (everything uses existing shadcn primitives + lucide-react).

## Out of Scope (next iterations)

- Lovable Cloud / Supabase, Payload CMS, Meilisearch, real product data, BOQ file upload, partner portal auth, freight calculator, tiered pricing, analytics, Resend email. The PRD's medium-priority items will land once you confirm v1 looks right.
