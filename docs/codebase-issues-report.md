# Codebase Inspection & Issue Report

This report outlines the critical React Hook bugs, unused variables, prefer-const violations, console log messages, and type safety issues identified in the codebase after running the TypeScript compiler and ESLint audits.

No code changes have been made yet, in accordance with the directive to inspect first and draft these issues for approval.

---

## 1. Critical React Hook Bugs (Violation of Rules of Hooks)

We identified a critical bug in three major page components where a React hook is called conditionally. This violates React's **Rules of Hooks** (hooks must be called unconditionally on every render in the exact same order) and can cause React to crash or behave unpredictably at runtime.

### Affected Components & Code

- **[ApplicationCategoryPage.tsx:L22](file:///c:/Users/pc/dev/work-dev/geosynthetics-africa-launch/src/pages/ApplicationCategoryPage.tsx#L22)**:
  ```typescript
  const loaderData = data ? data : Route.useLoaderData();
  ```
- **[IndustryPage.tsx:L11](file:///c:/Users/pc/dev/work-dev/geosynthetics-africa-launch/src/pages/IndustryPage.tsx#L11)**:
  ```typescript
  const loaderData = data ? data : Route.useLoaderData();
  ```
- **[ServicePage.tsx:L39](file:///c:/Users/pc/dev/work-dev/geosynthetics-africa-launch/src/pages/ServicePage.tsx#L39)**:
  ```typescript
  const loaderData = data ? data : Route.useLoaderData();
  ```

### Root Cause & Risks

1. **Short-Circuiting Hook Calls**: When the page is rendered with a `data` prop passed from its parent component (e.g., when lazy loaded in `/$slug.tsx`), the ternary expression short-circuits. Consequently, the hook `Route.useLoaderData()` is **not** called. When rendered via the direct route, `data` is empty, so `Route.useLoaderData()` **is** called. This variance in hook counts/calls violates React's hook call order guidelines.
2. **Context Mismatch**: In `/$slug.tsx`, these pages are rendered under the `/$slug` route. Calling `Route.useLoaderData()` inside a component rendered under `/$slug` (where `Route` is defined for `/applications/$category`, `/industries/$slug`, or `/services/$slug`) would throw a runtime error if executed, because the active route context is different.

### Proposed Elegant Fix

Instead of checking for `data` inside the presentation pages, we should extract the loader hook calls into wrapper components inside the route files, making the main pages pure presentational components that always accept `data` as a required prop.

For example, in `src/routes/applications.$category.tsx`:

```tsx
// 1. Define a wrapper component inside the route file
function ApplicationCategoryRoute() {
  const data = Route.useLoaderData();
  return <ApplicationCategoryPage data={data} />;
}

// 2. Register the wrapper component with the route
export const Route = createFileRoute("/applications/$category")({
  ...
  component: ApplicationCategoryRoute,
});
```

Then, update `ApplicationCategoryPage.tsx` to accept and use `data` directly, removing the conditional `Route.useLoaderData()` call entirely:

```typescript
export function ApplicationCategoryPage({ data }: { data: any }) {
  const loaderData = data;
  ...
}
```

This keeps the presentation layer decoupled from routing hooks, resolving both the React hook violation and the routing context mismatch cleanly.

---

## 2. Unused Variables, Imports & Parameters

TypeScript identified **unused imports and variables** via code `TS6133`, `TS6192`, and `TS6196`. Cleaning them up will reduce bundle clutter and improve readability.

### Admin/Editor Components

- **[ContactsBuilderTab.tsx](file:///c:/Users/pc/dev/work-dev/geosynthetics-africa-launch/src/components/admin/ContactsBuilderTab.tsx#L1)**: `useId` is declared but never read.
- **[HomepageBuilderTab.tsx](file:///c:/Users/pc/dev/work-dev/geosynthetics-africa-launch/src/components/admin/HomepageBuilderTab.tsx#L1)**: `useId` is declared but never read.
- **[RegionalCoverageBuilderTab.tsx](file:///c:/Users/pc/dev/work-dev/geosynthetics-africa-launch/src/components/admin/RegionalCoverageBuilderTab.tsx#L8)**: `MapPin` is declared but never read.
- **[SeoAnalyzer.tsx](file:///c:/Users/pc/dev/work-dev/geosynthetics-africa-launch/src/components/admin/SeoAnalyzer.tsx#L27)**: `STOP` constant is declared but never read.

### Site & Layout Components

- **[Header.tsx](file:///c:/Users/pc/dev/work-dev/geosynthetics-africa-launch/src/components/site/Header.tsx#L30)**: Entire unused import block.
- **[TopBar.tsx](file:///c:/Users/pc/dev/work-dev/geosynthetics-africa-launch/src/components/site/TopBar.tsx#L5)**: `Globe` is declared but never read.
- **[TrackingLoader.tsx](file:///c:/Users/pc/dev/work-dev/geosynthetics-africa-launch/src/components/site/TrackingLoader.tsx#L4)**: `CookiePreferences` type is declared but never used.
- **[delete-confirmation-dialog.tsx](file:///c:/Users/pc/dev/work-dev/geosynthetics-africa-launch/src/components/ui/delete-confirmation-dialog.tsx#L10)**: `AlertDialogHeader` is imported but never read.

### Pages, Hooks & Routes

- **[use-dynamic-menus.ts](file:///c:/Users/pc/dev/work-dev/geosynthetics-africa-launch/src/hooks/use-dynamic-menus.ts#L6)**: `MegaProductItem` and `MegaFeatureItem` declared but never used.
- **[ContactsPage.tsx](file:///c:/Users/pc/dev/work-dev/geosynthetics-africa-launch/src/pages/ContactsPage.tsx#L13)**: Unused Lucide icons: `Target`, `ShieldCheck`, `Truck`, `Layers`, `HardHat`, `Waves`, and `Wrench`. Also `ImageIcon` (L28), `MAP_EMBED` (L303), and `MAP_LINK` (L305) are declared but never read.
- **[ProjectDetailPage.tsx](file:///c:/Users/pc/dev/work-dev/geosynthetics-africa-launch/src/pages/ProjectDetailPage.tsx#L19)**: `QuoteCard` is declared but never read.
- **[QADetailPage.tsx](file:///c:/Users/pc/dev/work-dev/geosynthetics-africa-launch/src/pages/QADetailPage.tsx#L16)**: `QuoteCard` and `PartnerStrip` declared but never read.
- **[SiteBuilderPage.tsx](file:///c:/Users/pc/dev/work-dev/geosynthetics-africa-launch/src/pages/SiteBuilderPage.tsx#L6)**: All imports in import declaration are unused.

---

## 3. Prefer-Const Violations

ESLint identified variables declared with `let` that are never reassigned. They should be declared with `const` for immutability:

- **[ApplicationsTemplatesEditor.tsx:L1269](file:///c:/Users/pc/dev/work-dev/geosynthetics-africa-launch/src/components/admin/ApplicationsTemplatesEditor.tsx#L1269)**: `currentIds`
- **[IndustriesTemplatesEditor.tsx:L971](file:///c:/Users/pc/dev/work-dev/geosynthetics-africa-launch/src/components/admin/IndustriesTemplatesEditor.tsx#L971)**: `currentIds`
- **[IndustriesTemplatesEditor.tsx:L1030](file:///c:/Users/pc/dev/work-dev/geosynthetics-africa-launch/src/components/admin/IndustriesTemplatesEditor.tsx#L1030)**: `currentIds`
- **[ServicesTemplatesEditor.tsx:L1441](file:///c:/Users/pc/dev/work-dev/geosynthetics-africa-launch/src/components/admin/ServicesTemplatesEditor.tsx#L1441)**: `currentIds`
- **[QuickQuoteModal.tsx:L179](file:///c:/Users/pc/dev/work-dev/geosynthetics-africa-launch/src/components/site/QuickQuoteModal.tsx#L179)**: `payload`
- **[QuoteCard.tsx:L144](file:///c:/Users/pc/dev/work-dev/geosynthetics-africa-launch/src/components/site/QuoteCard.tsx#L144)**: `payload`
- **[use-dynamic-menus.ts:L174](file:///c:/Users/pc/dev/work-dev/geosynthetics-africa-launch/src/hooks/use-dynamic-menus.ts#L174)**: `productMap`
- **[catalogue.$slug.tsx:L80](file:///c:/Users/pc/dev/work-dev/geosynthetics-africa-launch/src/routes/catalogue.$slug.tsx#L80)**: `error`

---

## 4. Leftover/Useless Console Messages

A codebase search for `console.info`, `console.warn`, `console.error`, and `console.log` yielded the following:

- **`console.log`**: No `console.log` statements are present in any application file within the `src/` directory.
- **`console.info`**: One statement is present in **[MediaCenterPage.tsx:L113](file:///c:/Users/pc/dev/work-dev/geosynthetics-africa-launch/src/pages/MediaCenterPage.tsx#L113)**:
  ```typescript
  console.info(
    "Using 'product-images' bucket inside 'media-center/' folder as a zero-fail fallback.",
  );
  ```

  - _Status_: This is a warning fallback strategy log when bucket creation fails. It is valid and useful for system diagnostics, so we should keep it.
- **`console.warn` & `console.error`**: There are standard try-catch error loggers (e.g. logging database errors, bucket permissions, local storage failures). These are necessary diagnostic logs and should remain.

---

## 5. TypeScript Compiler Type Safety Violations

These are compilation errors caught by `tsc --noEmit` that pose runtime risks or prevent strict compiling:

### A. Missing `industries` Property Type Mismatch

- **File**: [ProductFamilyPage.tsx:L851](file:///c:/Users/pc/dev/work-dev/geosynthetics-africa-launch/src/pages/ProductFamilyPage.tsx#L851)
- **Error**: `Property 'industries' does not exist on type ...`
- **Root Cause**: `data` is type-cast as `typeof mockData & { heroImage?: string }`. However, `mockData` does not contain an `industries` key, while the actual `mapFamilyData` mapper function does return `industries`.
- **Proposed Fix**: Add an empty `industries: []` array to `mockData` or broaden the type assertion of `data` to include `industries?: { label: string; slug: string }[]`.

### B. Unsafe Option Types in Sorting

- **File**: [ProjectsPage.tsx:L77](file:///c:/Users/pc/dev/work-dev/geosynthetics-africa-launch/src/pages/ProjectsPage.tsx#L77)
- **Error**: `Argument of type 'string | undefined' is not assignable to parameter of type 'string'.`
- **Root Cause**: The sorting function `getNum` takes a strict `string`, but is invoked with `a.scale` and `b.scale`, which are optional properties (`scale?: string`) on the `CaseStudy` interface.
- **Proposed Fix**: Change the calls to `getNum(b.scale || "")` and `getNum(a.scale || "")` to ensure type safety.

### C. Type-Unsafe Redirects in TanStack Router

- **Files**:
  - [applications.$category.tsx:L280](file:///c:/Users/pc/dev/work-dev/geosynthetics-africa-launch/src/routes/applications.$category.tsx#L280)
  - [industries.$slug.tsx:L247](file:///c:/Users/pc/dev/work-dev/geosynthetics-africa-launch/src/routes/industries.$slug.tsx#L247)
  - [services.$slug.tsx:L203](file:///c:/Users/pc/dev/work-dev/geosynthetics-africa-launch/src/routes/services.$slug.tsx#L203)
- **Error**: `Type '/${string}' is not assignable to type ...`
- **Root Cause**: These files redirect to a dynamic path string using string interpolation (e.g. `to: "/${params.category}"`). TanStack Router enforces strict path literal type safety.
- **Proposed Fix**: Redirect to the root dynamic slug route `to: "/$slug"` and pass the parameter explicitly: `params: { slug: params.category }` (or `slug: params.slug`).

### D. Parameter Type Implicitly 'any'

- **Files**:
  - [ApplicationCategoryPage.tsx:L251, L305, L320](file:///c:/Users/pc/dev/work-dev/geosynthetics-africa-launch/src/pages/ApplicationCategoryPage.tsx#L251)
  - [ServicePage.tsx:L210, L282](file:///c:/Users/pc/dev/work-dev/geosynthetics-africa-launch/src/pages/ServicePage.tsx#L210)
- **Error**: `Parameter 'para' / 'idx' / 'bullet' implicitly has an 'any' type.`
- **Proposed Fix**: Type them explicitly (e.g. `para: string, idx: number`).

### E. SEO Landing Content Type Mismatch

- **File**: [ProjectsTemplatesEditor.tsx:L115, L143](file:///c:/Users/pc/dev/work-dev/geosynthetics-africa-launch/src/components/admin/ProjectsTemplatesEditor.tsx#L115)
- **Error**: `Type '{ title?: string | undefined; ... }' is not assignable to type '{ title: string; description: string; ... }'.`
- **Proposed Fix**: Use non-null assertion or cast `defaultLandingContent().seo!` since we know it is defined.

### F. Breadcrumb Route Params Cast Error

- **File**: [Breadcrumbs.tsx:L72](file:///c:/Users/pc/dev/work-dev/geosynthetics-africa-launch/src/components/site/Breadcrumbs.tsx#L72)
- **Error**: `Type 'Record<string, string> | undefined' is not assignable to type 'true | ParamsReducerFn<...>'`
- **Proposed Fix**: Cast `params={item.params as any}`.

### G. Invalid Loader / Search Hook parameters when strict: false

- **File**: [ContactsPage.tsx:L540, L548, L1032, L1039](file:///c:/Users/pc/dev/work-dev/geosynthetics-africa-launch/src/pages/ContactsPage.tsx#L540)
- **Proposed Fix**: Remove the `from` argument from `useSearch` and `useLoaderData` calls where `strict: false` is used.

### H. Missing `slug` Property on Fallback `CASE_STUDIES`

- **File**: [ContactsPage.tsx:L1205, L1208](file:///c:/Users/pc/dev/work-dev/geosynthetics-africa-launch/src/pages/ContactsPage.tsx#L1205)
- **Proposed Fix**: Add `slug: ""` to the static `CASE_STUDIES` array elements.

### I. Test File Failures

- **[hierarchy-utils.test.ts](file:///c:/Users/pc/dev/work-dev/geosynthetics-africa-launch/src/test/lib/hierarchy-utils.test.ts#L31)**: Uses `label` instead of `title` in test mock `quickActions` array.
- **[dynamic-loaders.test.ts](file:///c:/Users/pc/dev/work-dev/geosynthetics-africa-launch/src/test/routes/dynamic-loaders.test.ts#L112)**: Directly calls `Route.options.loader(...)` which is union-typed as possibly not callable. Needs a cast `(Route.options.loader as any)(...)`.
- **[route-seo-metadata.test.ts](file:///c:/Users/pc/dev/work-dev/geosynthetics-africa-launch/src/test/routes/route-seo-metadata.test.ts#L20)**: Accesses `headResult.meta` on an `Awaitable` return type which could be a `Promise`.
- **[setup.ts](file:///c:/Users/pc/dev/work-dev/geosynthetics-africa-launch/src/test/setup.ts#L2)**: Missing `@types/jsdom` devDependency; root element assignment type mismatch.

---

## Summary of Recommended Actions

1. **Keep Code Intact**: No changes have been applied to the code logic, in alignment with the directive to inspect first.
2. **Resolve React Hook Bugs**: Update route component definitions to fetch loader data externally, making pages pure presentation components.
3. **Clean Up Unused Code**: Safely prune the unused imports listed in Section 2.
4. **Fix Compiler Errors**: Apply the proposed fixes in Section 5 to ensure the project passes typechecking (`tsc --noEmit`) cleanly.
