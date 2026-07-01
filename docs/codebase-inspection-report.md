# Codebase Inspection & Bug Report

This report documents the unused variables, console logging statements, and TypeScript compilation errors found across the codebase during our audit.

---

## 1. Unused Variables, Imports & Parameters

These elements are declared or imported but never read. Cleaning them up will keep the bundle size optimized and code readability high.

### Admin & Editor Components

- **[AdminNav.tsx](file:///c:/Users/pc/dev/work-dev/geosynthetics-africa-launch/src/components/admin/AdminNav.tsx#L18)**:
  - `ShieldCheck` icon imported but not used.
- **[ApplicationsTemplatesEditor.tsx](file:///c:/Users/pc/dev/work-dev/geosynthetics-africa-launch/src/components/admin/ApplicationsTemplatesEditor.tsx#L133)**:
  - `COMMON_ICONS` constant defined but not used.
- **[ContentEditorPanel.tsx](file:///c:/Users/pc/dev/work-dev/geosynthetics-africa-launch/src/components/admin/ContentEditorPanel.tsx#L22)**:
  - `QuickActionsEditor`, `ProductSelector` imported but not used.
  - `allProducts` state variable declared but never read.
- **[HomepageBuilderTab.tsx](file:///c:/Users/pc/dev/work-dev/geosynthetics-africa-launch/src/components/admin/HomepageBuilderTab.tsx#L18)**:
  - `Upload`, `Copy`, `Check`, `X`, `compressImage`, `GsaDifference`, and `FormField` imported or declared but not used.
- **[ImagePicker.tsx](file:///c:/Users/pc/dev/work-dev/geosynthetics-africa-launch/src/components/admin/ImagePicker.tsx#L1)**:
  - `useCallback`, `TabsContent`, `Upload`, and `data` imported or declared but not used.
- **[MegaMenuBuilderTab.tsx](file:///c:/Users/pc/dev/work-dev/geosynthetics-africa-launch/src/components/admin/MegaMenuBuilderTab.tsx#L6)**:
  - `TabsContent`, `ChevronRight`, `LinkIcon`, `HelpCircle`, `ImageIcon`, and `MegaContent` (type) imported or declared but not used.
- **[ProductSelector.tsx](file:///c:/Users/pc/dev/work-dev/geosynthetics-africa-launch/src/components/admin/ProductSelector.tsx#L2)**:
  - `Check` and `cn` utility imported but not used.
- **[ProjectsTemplatesEditor.tsx](file:///c:/Users/pc/dev/work-dev/geosynthetics-africa-launch/src/components/admin/ProjectsTemplatesEditor.tsx#L21)**:
  - `ProductData` and `ListEditorHeader` declared but not used.
- **[QATemplatesEditor.tsx](file:///c:/Users/pc/dev/work-dev/geosynthetics-africa-launch/src/components/admin/QATemplatesEditor.tsx#L13)**:
  - `Skeleton`, `Badge`, `Pencil`, and `Eye` imported but not used.
- **[SeoAnalyzer.tsx](file:///c:/Users/pc/dev/work-dev/geosynthetics-africa-launch/src/components/admin/SeoAnalyzer.tsx#L31)**:
  - `tokenize` helper function declared but not used.

### Site & Layout Components

- **[AuthLayout.tsx](file:///c:/Users/pc/dev/work-dev/geosynthetics-africa-launch/src/components/site/AuthLayout.tsx#L10)**:
  - `TRUST_BADGES` constant declared but not used.
- **[Header.tsx](file:///c:/Users/pc/dev/work-dev/geosynthetics-africa-launch/src/components/site/Header.tsx#L1)**:
  - `useMemo`, `X`, `UserIcon`, `LogOut`, `ShieldCheck`, `ChevronDown`, and `useAuth` imported but not used.
- **[MegaMenu.tsx](file:///c:/Users/pc/dev/work-dev/geosynthetics-africa-launch/src/components/site/MegaMenu.tsx#L15)**:
  - Unused icons imported from `lucide-react`: `Download`, `FileText`, `MessageCircle`, `PencilRuler`, `FileCheck`, `Upload`, `Layers`, `Grid3x3`, `Grid2x2`, `Hexagon`, `Sheet`, `Waves`, `Mountain`, `Pickaxe`, `Droplets`, `Trash2`, `Construction`, `Sprout`, `Truck`, `HardHat`, `ClipboardCheck`, `Ship`, `LifeBuoy`, `Building2`, and `Zap`.
- **[TrackingLoader.tsx](file:///c:/Users/pc/dev/work-dev/geosynthetics-africa-launch/src/components/site/TrackingLoader.tsx#L17)**:
  - `preferences` state variable declared but never read.

### Pages & Routes

- **[AboutPage.tsx](file:///c:/Users/pc/dev/work-dev/geosynthetics-africa-launch/src/pages/AboutPage.tsx#L1)**:
  - `Link` and `Mail` imported but not used.
- **[ApplicationCategoryPage.tsx](file:///c:/Users/pc/dev/work-dev/geosynthetics-africa-launch/src/pages/ApplicationCategoryPage.tsx#L35)**:
  - `quoteLink` declared but not used.
- **[MediaCenterPage.tsx](file:///c:/Users/pc/dev/work-dev/geosynthetics-africa-launch/src/pages/MediaCenterPage.tsx#L8)**:
  - `TabsContent`, `Upload`, and `data` imported/declared but not used.
- **[ProductDetailPage.tsx](file:///c:/Users/pc/dev/work-dev/geosynthetics-africa-launch/src/pages/ProductDetailPage.tsx#L26)**:
  - `supabase` and `toast` imported but not used.
- **[ProductFamilyPage.tsx](file:///c:/Users/pc/dev/work-dev/geosynthetics-africa-launch/src/pages/ProductFamilyPage.tsx#L11)**:
  - `Check`, `ChevronDown`, and `location` imported/declared but not used.
- **[ProductsAdminPage.tsx](file:///c:/Users/pc/dev/work-dev/geosynthetics-africa-launch/src/pages/ProductsAdminPage.tsx#L1)**:
  - `useMemo`, `useRef`, `Layers`, `ShieldCheck`, `Sun`, `Wrench`, `Sparkles`, `Droplets`, and `CheckCircle2` imported/declared but not used.
- **[ProjectDetailPage.tsx](file:///c:/Users/pc/dev/work-dev/geosynthetics-africa-launch/src/pages/ProjectDetailPage.tsx#L8)**:
  - Unused imports: `Wrench`, `FileText`, `Sparkles`, `ArrowRight`, `Search`, `CheckCircle2`, `Clock`, `TrendingUp`, `Map`, `ArrowLeftRight`.
- **[ProjectsPage.tsx](file:///c:/Users/pc/dev/work-dev/geosynthetics-africa-launch/src/pages/ProjectsPage.tsx#L14)**:
  - `Button` imported but not used.
- **[QADetailPage.tsx](file:///c:/Users/pc/dev/work-dev/geosynthetics-africa-launch/src/pages/QADetailPage.tsx#L9)**:
  - Unused imports: `Microscope`, `BadgeCheck`, `Wrench`, `Award`, `ArrowRight`, `AlertCircle`.
- **[ServicePage.tsx](file:///c:/Users/pc/dev/work-dev/geosynthetics-africa-launch/src/pages/ServicePage.tsx#L8)**:
  - `cn` and `renderIcon` imported/declared but not used.
- **[SiteBuilderPage.tsx](file:///c:/Users/pc/dev/work-dev/geosynthetics-africa-launch/src/pages/SiteBuilderPage.tsx#L1)**:
  - `useCallback` and `Button` imported but not used.
- **[\_\_root.tsx](file:///c:/Users/pc/dev/work-dev/geosynthetics-africa-launch/src/routes/__root.tsx#L1)**:
  - `redirect` imported but not used.
- **[products.$category.$family.tsx](file:///c:/Users/pc/dev/work-dev/geosynthetics-africa-launch/src/routes/products.$category.$family.tsx#L1)**:
  - `notFound` and destructured parameter `label` declared but not used.
- **[applications.$category.tsx](file:///c:/Users/pc/dev/work-dev/geosynthetics-africa-launch/src/routes/applications.$category.tsx#L198)**:
  - Destructured parameter `label` declared but not used.
- **[hierarchy-utils.ts](file:///c:/Users/pc/dev/work-dev/geosynthetics-africa-launch/src/lib/hierarchy-utils.ts#L1)**:
  - `MegaContent` type imported but not used.
- **[resources.$category.index.tsx](file:///c:/Users/pc/dev/work-dev/geosynthetics-africa-launch/src/routes/resources.$category.index.tsx#L10)**:
  - `RESOURCE_CATEGORIES` declared but not used.

---

## 2. Console Logging Statements

A full codebase search shows only one active `console.log` statement in the `src/` directory.

- **[MediaCenterPage.tsx:L113](file:///c:/Users/pc/dev/work-dev/geosynthetics-africa-launch/src/pages/MediaCenterPage.tsx#L113)**:

  ```typescript
  console.log(
    "Using 'product-images' bucket inside 'media-center/' folder as a zero-fail fallback.",
  );
  ```

  - _Status_: This is a fallback log message triggered when the programmatic creation of the `media-center` bucket fails. It is useful for debugging storage permissions in production. We can keep it, downgrade it to `console.info`, or remove it if desired.

- **`console.warn` & `console.error`**:
  - There are several warnings and errors in try-catch blocks for API responses, bucket permissions, or localStorage fallbacks. These are standard error monitoring practices and should be retained.

---

## 3. Real Bugs & TypeScript Compiler Violations

The TypeScript compiler (`tsc --noEmit`) fails with exit code 1 due to the following type safety bugs:

### A. Missing `industries` Property in `mockData`

- **File**: [ProductFamilyPage.tsx:L857](file:///c:/Users/pc/dev/work-dev/geosynthetics-africa-launch/src/pages/ProductFamilyPage.tsx#L857)
- **Error**: `Property 'industries' does not exist on type ...`
- **Root Cause**: `data` is type-cast as `typeof mockData & { heroImage?: string }`. However, `mockData` does not contain an `industries` property, even though `mapFamilyData` returns one.
- **Proposed Fix**: Add an empty or mock `industries: []` array to `mockData` to unify the types.

### B. Unsafe Option Types in Sorting Function

- **File**: [ProjectsPage.tsx:L72](file:///c:/Users/pc/dev/work-dev/geosynthetics-africa-launch/src/pages/ProjectsPage.tsx#L72)
- **Error**: `Argument of type 'string | undefined' is not assignable to parameter of type 'string'.`
- **Root Cause**: The sorting function `getNum` takes a strict `string`, but is invoked with `a.scale` and `b.scale`, which are optional properties on the case studies interface.
- **Proposed Fix**: Fallback to an empty string: `getNum(a.scale || "")` and `getNum(b.scale || "")`.

### C. Type-Unsafe Redirects in TanStack Router

- **Files**:
  - [applications.$category.tsx:L310](file:///c:/Users/pc/dev/work-dev/geosynthetics-africa-launch/src/routes/applications.$category.tsx#L310)
  - [industries.$slug.tsx:L262](file:///c:/Users/pc/dev/work-dev/geosynthetics-africa-launch/src/routes/industries.$slug.tsx#L262)
  - [services.$slug.tsx:L211](file:///c:/Users/pc/dev/work-dev/geosynthetics-africa-launch/src/routes/services.$slug.tsx#L211)
- **Error**: `Type '/${string}' is not assignable to type ...`
- **Root Cause**: Dynamically built path strings are being supplied to `to`, violating TanStack Router's strict static path matching rules.
- **Proposed Fix**: Use the static path `to: "/$slug"` (or `to: "/$category"`) and supply the variable in the `params` field.

### D. Parameter Type Implicitly 'any'

- **Files**:
  - [ApplicationCategoryPage.tsx:L266](file:///c:/Users/pc/dev/work-dev/geosynthetics-africa-launch/src/pages/ApplicationCategoryPage.tsx#L266)
  - [ServicePage.tsx:L267](file:///c:/Users/pc/dev/work-dev/geosynthetics-africa-launch/src/pages/ServicePage.tsx#L267)
- **Error**: `Parameter 'para' / 'idx' / 'bullet' implicitly has an 'any' type.`
- **Proposed Fix**: Explicitly annotate the arguments, e.g., `(para: string, idx: number)`.

### E. SEO Landing Content Type Mismatch

- **File**: [ProjectsTemplatesEditor.tsx:L136](file:///c:/Users/pc/dev/work-dev/geosynthetics-africa-launch/src/components/admin/ProjectsTemplatesEditor.tsx#L136)
- **Error**: Type mismatch on optional nested property values for SEO.
- **Root Cause**: Spreading optional properties from template initialization makes the required SEO title and description field types incompatible.
- **Proposed Fix**: Ensure default/fallback values exist or cast using `as ProjectsLandingContent['seo']`.

### F. Breadcrumb Route Params Cast Error

- **File**: [Breadcrumbs.tsx:L73](file:///c:/Users/pc/dev/work-dev/geosynthetics-africa-launch/src/components/site/Breadcrumbs.tsx#L73)
- **Error**: `Type 'Record<string, string> | undefined' is not assignable to type...`
- **Proposed Fix**: Cast `params` explicitly using `params={item.params as any}` because the breadcrumb elements utilize dynamic routes.

### G. Missing `slug` Property on Fallback `CASE_STUDIES`

- **File**: [ContactsPage.tsx:L1220](file:///c:/Users/pc/dev/work-dev/geosynthetics-africa-launch/src/pages/ContactsPage.tsx#L1220)
- **Error**: `Property 'slug' does not exist on type ...`
- **Root Cause**: Fallback data element elements are missing `slug` property, breaking rendering expectations.
- **Proposed Fix**: Add `slug: ""` to the fallback objects.

### H. Test Suite Code compilation mismatches

- **Files**:
  - `src/test/lib/hierarchy-utils.test.ts`
  - `src/test/routes/dynamic-loaders.test.ts`
  - `src/test/routes/route-seo-metadata.test.ts`
  - `src/test/setup.ts`
- **Error**: Testing mocks use outdated properties (e.g. `label` instead of `title`), lack required properties, or trigger DOM/jsdom compilation check errors.
- **Proposed Fix**: Align the mock structures and resolve the type warnings in setup test scripts.
