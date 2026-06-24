# Codebase Inspection & Issue Report

This report outlines the unused variables, console log messages, and type safety/bug issues identified in the codebase after running the TypeScript compiler and ESLint audits.

No code changes have been made yet, in accordance with the requirement to draft these issues for approval first.

---

## 1. Unused Variables, Imports & Parameters

TypeScript identifies **unused imports and variables** via code `TS6133`, `TS6192`, and `TS6196`. Since `"@typescript-eslint/no-unused-vars": "off"` is configured in `eslint.config.js` and `"noUnusedLocals": false` in `tsconfig.json`, these do not currently fail the build, but they clutter the codebase.

### Admin/Editor Components
* **[AdminNav.tsx](file:///c:/Users/pc/dev/work-dev/geosynthetics-africa-launch/src/components/admin/AdminNav.tsx#L18)**: `ShieldCheck` icon imported but never used.
* **[ApplicationsTemplatesEditor.tsx](file:///c:/Users/pc/dev/work-dev/geosynthetics-africa-launch/src/components/admin/ApplicationsTemplatesEditor.tsx#L118)**: `COMMON_ICONS` constant defined but never used.
* **[ContentEditorPanel.tsx](file:///c:/Users/pc/dev/work-dev/geosynthetics-africa-launch/src/components/admin/ContentEditorPanel.tsx#L22)**: `QuickActionsEditor`, `ProductSelector`, and `allProducts` declared/imported but never used.
* **[HomepageBuilderTab.tsx](file:///c:/Users/pc/dev/work-dev/geosynthetics-africa-launch/src/components/admin/HomepageBuilderTab.tsx#L18)**: `Upload`, `Copy`, `Check`, `X`, `compressImage`, `GsaDifference`, and `FormField` declared/imported but never used.
* **[ImagePicker.tsx](file:///c:/Users/pc/dev/work-dev/geosynthetics-africa-launch/src/components/admin/ImagePicker.tsx#L1)**: `useCallback`, `TabsContent`, `Upload`, and `data` imported/declared but never used.
* **[MegaMenuBuilderTab.tsx](file:///c:/Users/pc/dev/work-dev/geosynthetics-africa-launch/src/components/admin/MegaMenuBuilderTab.tsx#L6)**: `TabsContent`, `ChevronRight`, `LinkIcon`, `HelpCircle`, `ImageIcon`, and type `MegaContent` imported/declared but never used.
* **[ProductSelector.tsx](file:///c:/Users/pc/dev/work-dev/geosynthetics-africa-launch/src/components/admin/ProductSelector.tsx#L2)**: `Check` and helper `cn` imported but never used.
* **[ProjectsTemplatesEditor.tsx](file:///c:/Users/pc/dev/work-dev/geosynthetics-africa-launch/src/components/admin/ProjectsTemplatesEditor.tsx#L21)**: `ProductData` and `ListEditorHeader` declared but never used.
* **[QATemplatesEditor.tsx](file:///c:/Users/pc/dev/work-dev/geosynthetics-africa-launch/src/components/admin/QATemplatesEditor.tsx#L13)**: `Skeleton`, `Badge`, `Pencil`, and `Eye` imported but never used.
* **[SeoAnalyzer.tsx](file:///c:/Users/pc/dev/work-dev/geosynthetics-africa-launch/src/components/admin/SeoAnalyzer.tsx#L31)**: Helper function `tokenize` declared but never used.

### Site & Layout Components
* **[AuthLayout.tsx](file:///c:/Users/pc/dev/work-dev/geosynthetics-africa-launch/src/components/site/AuthLayout.tsx#L10)**: `TRUST_BADGES` constant declared but never used.
* **[Header.tsx](file:///c:/Users/pc/dev/work-dev/geosynthetics-africa-launch/src/components/site/Header.tsx#L1)**: `useMemo`, `X`, `UserIcon`, `LogOut`, `ShieldCheck`, `ChevronDown`, and `useAuth` imported but never used. Also has a completely unused import block.
* **[MegaMenu.tsx](file:///c:/Users/pc/dev/work-dev/geosynthetics-africa-launch/src/components/site/MegaMenu.tsx#L15)**: Huge list of unused icons imported from `lucide-react`: `Download`, `FileText`, `MessageCircle`, `PencilRuler`, `FileCheck`, `Upload`, `Layers`, `Grid3x3`, `Grid2x2`, `Hexagon`, `Sheet`, `Waves`, `Mountain`, `Pickaxe`, `Droplets`, `Trash2`, `Construction`, `Sprout`, `Truck`, `HardHat`, `ClipboardCheck`, `Ship`, `LifeBuoy`, `Building2`, and `Zap`.
* **[TrackingLoader.tsx](file:///c:/Users/pc/dev/work-dev/geosynthetics-africa-launch/src/components/site/TrackingLoader.tsx#L17)**: `preferences` state variable declared but never used.

### Pages & Routes
* **[AboutPage.tsx](file:///c:/Users/pc/dev/work-dev/geosynthetics-africa-launch/src/pages/AboutPage.tsx#L1)**: `Link` and `Mail` imported but never used.
* **[ApplicationCategoryPage.tsx](file:///c:/Users/pc/dev/work-dev/geosynthetics-africa-launch/src/pages/ApplicationCategoryPage.tsx#L35)**: `quoteLink` declared but never used.
* **[MediaCenterPage.tsx](file:///c:/Users/pc/dev/work-dev/geosynthetics-africa-launch/src/pages/MediaCenterPage.tsx#L8)**: `TabsContent`, `Upload`, and `data` imported/declared but never used.
* **[ProductDetailPage.tsx](file:///c:/Users/pc/dev/work-dev/geosynthetics-africa-launch/src/pages/ProductDetailPage.tsx#L26)**: `supabase` and `toast` imported but never used.
* **[ProductFamilyPage.tsx](file:///c:/Users/pc/dev/work-dev/geosynthetics-africa-launch/src/pages/ProductFamilyPage.tsx#L11)**: `Check`, `ChevronDown`, and `location` imported/declared but never used.
* **[ProductsAdminPage.tsx](file:///c:/Users/pc/dev/work-dev/geosynthetics-africa-launch/src/pages/ProductsAdminPage.tsx#L1)**: `useMemo`, `useRef`, `Layers`, `ShieldCheck`, `Sun`, `Wrench`, `Sparkles`, `Droplets`, and `CheckCircle2` imported/declared but never used.
* **[ProjectDetailPage.tsx](file:///c:/Users/pc/dev/work-dev/geosynthetics-africa-launch/src/pages/ProjectDetailPage.tsx#L8)**: `Wrench`, `FileText`, `Sparkles`, `ArrowRight`, `Search`, `CheckCircle2`, `Clock`, `TrendingUp`, `Map`, and `ArrowLeftRight` imported but never used.
* **[ProjectsPage.tsx](file:///c:/Users/pc/dev/work-dev/geosynthetics-africa-launch/src/pages/ProjectsPage.tsx#L14)**: `Button` imported but never used.
* **[QADetailPage.tsx](file:///c:/Users/pc/dev/work-dev/geosynthetics-africa-launch/src/pages/QADetailPage.tsx#L9)**: `Microscope`, `BadgeCheck`, `Wrench`, `Award`, `ArrowRight`, and `AlertCircle` imported but never used.
* **[ServicePage.tsx](file:///c:/Users/pc/dev/work-dev/geosynthetics-africa-launch/src/pages/ServicePage.tsx#L8)**: `cn` and `renderIcon` imported/declared but never used.
* **[SiteBuilderPage.tsx](file:///c:/Users/pc/dev/work-dev/geosynthetics-africa-launch/src/pages/SiteBuilderPage.tsx#L1)**: `useCallback` and `Button` imported but never used, plus an entirely unused import statement.
* **[__root.tsx](file:///c:/Users/pc/dev/work-dev/geosynthetics-africa-launch/src/routes/__root.tsx#L1)**: `redirect` imported but never used.
* **[products.$category.$family.tsx](file:///c:/Users/pc/dev/work-dev/geosynthetics-africa-launch/src/routes/products.$category.$family.tsx#L1)**: `notFound` and destructured parameter `label` declared but never used.
* **[applications.$category.tsx](file:///c:/Users/pc/dev/work-dev/geosynthetics-africa-launch/src/routes/applications.$category.tsx#L198)**: Destructured parameter `label` declared but never used.
* **[hierarchy-utils.ts](file:///c:/Users/pc/dev/work-dev/geosynthetics-africa-launch/src/lib/hierarchy-utils.ts#L1)**: `MegaContent` type imported but never used.
* **[resources.$category.index.tsx](file:///c:/Users/pc/dev/work-dev/geosynthetics-africa-launch/src/routes/resources.$category.index.tsx#L10)**: `RESOURCE_CATEGORIES` declared but never used.

---

## 2. Leftover/Useless Console Messages

A code search was performed for `console.` statements. 

* **`console.log`**: Only one statement exists in the entire `src/` directory.
  * **[MediaCenterPage.tsx:L104](file:///c:/Users/pc/dev/work-dev/geosynthetics-africa-launch/src/pages/MediaCenterPage.tsx#L104)**: `console.log("Using 'product-images' bucket inside 'media-center/' folder as a zero-fail fallback.");`
  * *Status*: This is a fallback log message. It can be kept or downgraded to `console.info` or removed if it is too chatty.

* **`console.warn` & `console.error`**: There are several warning and error messages throughout the app (mainly in catch blocks for Supabase operations, localStorage fallbacks, and bucket configurations). All of these appear to be standard error handling logs and are useful for monitoring and debugging.

---

## 3. Real Bugs and Type Safety Violations

These are actual errors caught by the TypeScript compiler (`tsc`) that pose runtime risks or prevent strict compilation:

### A. Missing `industries` Property Type Mismatch
* **File**: [ProductFamilyPage.tsx:L856](file:///c:/Users/pc/dev/work-dev/geosynthetics-africa-launch/src/pages/ProductFamilyPage.tsx#L856)
* **Error**: `Property 'industries' does not exist on type ...`
* **Root Cause**: `data` is type-cast as `typeof mockData & { heroImage?: string }`. However, `mockData` does not contain an `industries` key, while the actual `mapFamilyData` mapper function does return `industries`. This results in a type compilation error when attempting to map `data.industries`.
* **Proposed Fix**: Add an empty or mock `industries: [...]` array to `mockData` or broaden the type assertion of `data` to include `industries?: { label: string; slug: string }[]`.

### B. Unsafe Option Types in Sorting
* **File**: [ProjectsPage.tsx:L70](file:///c:/Users/pc/dev/work-dev/geosynthetics-africa-launch/src/pages/ProjectsPage.tsx#L70)
* **Error**: `Argument of type 'string | undefined' is not assignable to parameter of type 'string'.`
* **Root Cause**: The sorting function `getNum` takes a strict `string`, but is invoked with `a.scale` and `b.scale`, which are optional properties (`scale?: string`) on the `CaseStudy` interface.
* **Proposed Fix**: Change the calls to `getNum(b.scale || "")` and `getNum(a.scale || "")` to ensure type safety.

### C. Type-Unsafe Redirects in TanStack Router
* **Files**:
  * [applications.$category.tsx:L280](file:///c:/Users/pc/dev/work-dev/geosynthetics-africa-launch/src/routes/applications.$category.tsx#L280)
  * [industries.$slug.tsx:L247](file:///c:/Users/pc/dev/work-dev/geosynthetics-africa-launch/src/routes/industries.$slug.tsx#L247)
  * [services.$slug.tsx:L203](file:///c:/Users/pc/dev/work-dev/geosynthetics-africa-launch/src/routes/services.$slug.tsx#L203)
* **Error**: `Type '/${string}' is not assignable to type ...`
* **Root Cause**: These files redirect to a dynamic path string using string interpolation (e.g. `to: "/${params.category}"`). TanStack Router enforces strict path literal type safety.
* **Proposed Fix**: Redirect to the root dynamic slug route `to: "/$slug"` and pass the parameter explicitly: `params: { slug: params.category }` (or `slug: params.slug`). This makes the redirect type-safe and compile-friendly.

### D. Parameter Type Implicitly 'any'
* **Files**:
  * [ApplicationCategoryPage.tsx:L249, L303, L318](file:///c:/Users/pc/dev/work-dev/geosynthetics-africa-launch/src/pages/ApplicationCategoryPage.tsx#L249)
  * [ServicePage.tsx:L208, L280](file:///c:/Users/pc/dev/work-dev/geosynthetics-africa-launch/src/pages/ServicePage.tsx#L208)
* **Error**: `Parameter 'para' / 'idx' / 'bullet' implicitly has an 'any' type.`
* **Root Cause**: Array mapping functions destructure parameters without explicit types while `noImplicitAny` is enabled or in strict type-check mode.
* **Proposed Fix**: Type them explicitly (e.g. `para: string, idx: number`).

### E. Test File Failures
* **[hierarchy-utils.test.ts](file:///c:/Users/pc/dev/work-dev/geosynthetics-africa-launch/src/test/lib/hierarchy-utils.test.ts#L31)**:
  * Uses `label` instead of `title` in test mock `quickActions` array.
  * Uses `label` and `imageUrl` for `FeaturedImage`/`FeaturedProduct` array which lacks expected properties like `spec` and `to`.
* **[dynamic-loaders.test.ts](file:///c:/Users/pc/dev/work-dev/geosynthetics-africa-launch/src/test/routes/dynamic-loaders.test.ts#L112)**:
  * Directly calls `Route.options.loader(...)` which is union-typed as possibly not callable. Needs a cast `(Route.options.loader as any)(...)`.
* **[route-seo-metadata.test.ts](file:///c:/Users/pc/dev/work-dev/geosynthetics-africa-launch/src/test/routes/route-seo-metadata.test.ts#L20)**:
  * Accesses `headResult.meta` on an `Awaitable` return type which could be a `Promise`. Needs type casting or resolving.
* **[setup.ts](file:///c:/Users/pc/dev/work-dev/geosynthetics-africa-launch/src/test/setup.ts#L2)**:
  * Missing `@types/jsdom` devDependency.
  * `this.root = options.root ?? null` has assignment type mismatch (`Element | Document | null` assigned to `Element | null`).

---

## Summary of Recommended Actions

1. **Keep Code Intact**: No changes have been applied.
2. **Clean Up Unused Code**: Safely prune the unused imports listed above to keep the bundle size clean and codebase easy to read.
3. **Fix Real Compiler Errors**: Apply the proposed fixes in Section 3 to ensure the project passes typechecking (`tsc --noEmit`) cleanly, preventing future regressions.
