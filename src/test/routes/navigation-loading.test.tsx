import "@testing-library/jest-dom/vitest";
import React from "react";
import { act, render, screen } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach } from "vitest";
const mocks = vi.hoisted(() => ({
  hierarchy: vi.fn(),
  canonical: vi.fn(),
  from: vi.fn(),
  content: vi.fn(),
}));
vi.mock("@/lib/section-paths", () => ({
  fetchProductHierarchy: mocks.hierarchy,
  canonicalProductPath: mocks.canonical,
}));
vi.mock("@/integrations/supabase/client", () => ({ supabase: { from: mocks.from } }));
vi.mock("@/data/product-pages", () => ({ getProductPageContent: mocks.content }));
vi.mock("@/pages/ProductFamilyPage", () => ({ ProductFamilyPage: () => null }));
vi.mock("@/pages/ProductCategoryPage", () => ({ ProductCategoryPage: () => null }));
import { Route as FamilyRoute } from "@/routes/products.$category.$family";
import { Route as CategoryRoute } from "@/routes/products.$category.index";
import { PageLoading } from "@/components/site/PageLoading";
import {
  createRootRoute,
  createRoute,
  createRouter,
  createMemoryHistory,
  RouterProvider,
  Outlet,
} from "@tanstack/react-router";

const deferred = <T,>() => {
  let resolve!: (value: T) => void;
  const promise = new Promise<T>((done) => {
    resolve = done;
  });
  return { promise, resolve };
};

beforeEach(() => {
  vi.clearAllMocks();
  mocks.canonical.mockReturnValue(null);
});

describe("navigation loading", () => {
  it("starts family content and case studies before hierarchy lookup finishes, preserving older id-keyed templates", async () => {
    const hierarchy = deferred<any[]>();
    mocks.hierarchy.mockReturnValue(hierarchy.promise);
    mocks.canonical.mockReturnValue({ path: "/products/liners/epdm", family: { id: "old-id" } });
    mocks.from.mockImplementation((table) => {
      const q: any = {};
      for (const method of ["select", "eq"]) q[method] = () => q;
      q.maybeSingle = vi
        .fn()
        .mockResolvedValue({ data: { value: { "old-id": { title: "EPDM" } } }, error: null });
      q.then = (ok: any, fail: any) =>
        Promise.resolve({
          data: [{ case_studies: { id: "case-1" } }, { case_studies: { id: "case-1" } }],
          error: null,
        }).then(ok, fail);
      return q;
    });
    const pending = (FamilyRoute.options.loader as any)({
      params: { category: "liners", family: "epdm" },
    });
    expect(mocks.from.mock.calls.map(([table]) => table)).toEqual([
      "site_config",
      "case_study_products",
    ]);
    hierarchy.resolve([]);
    const result = await pending;
    expect(result.familyData.title).toBe("EPDM");
    expect(result.dynamicCaseStudies).toHaveLength(1);
  });

  it("loads category content concurrently and keeps canonical redirects", async () => {
    const hierarchy = deferred<any[]>();
    mocks.hierarchy.mockReturnValue(hierarchy.promise);
    mocks.content.mockResolvedValue({ label: "Liners" });
    mocks.canonical.mockReturnValue({ path: "/products/liners" });
    const pending = (CategoryRoute.options.loader as any)({ params: { category: "old-liners" } });
    expect(mocks.content).toHaveBeenCalledWith("old-liners");
    hierarchy.resolve([]);
    await expect(pending).rejects.toMatchObject({
      options: { href: "/products/liners", statusCode: 301 },
    });
  });

  it("shows readable content during a delayed navigation and replaces it when ready", async () => {
    const content = deferred<string>();
    const root = createRootRoute({ component: Outlet });
    const home = createRoute({
      getParentRoute: () => root,
      path: "/",
      component: () => <h1>Home</h1>,
    });
    const product = createRoute({
      getParentRoute: () => root,
      path: "/product",
      loader: () => content.promise,
      component: () => <h1>EPDM product information</h1>,
    });
    const router = createRouter({
      routeTree: root.addChildren([home, product]),
      history: createMemoryHistory({ initialEntries: ["/"] }),
      defaultPendingComponent: PageLoading,
      defaultPendingMs: 1,
      defaultPendingMinMs: 0,
    });
    await router.load();
    render(<RouterProvider router={router} />);
    let navigation: Promise<void>;
    await act(async () => {
      navigation = router.navigate({ href: "/product" });
    });
    expect(await screen.findByRole("status")).toHaveTextContent(
      "Loading product and project information",
    );
    expect(screen.getByRole("heading", { name: "Opening your page" })).toBeTruthy();
    await act(async () => {
      content.resolve("ready");
      await navigation;
    });
    expect(await screen.findByRole("heading", { name: "EPDM product information" })).toBeTruthy();
    expect(screen.queryByRole("status")).toBeNull();
  });
});
