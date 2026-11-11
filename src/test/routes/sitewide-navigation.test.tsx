import "@testing-library/jest-dom/vitest";
import React from "react";
import { act, render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
const mock = vi.hoisted(() => ({ from: vi.fn(), products: vi.fn() }));
vi.mock("@/integrations/supabase/client", () => ({ supabase: { from: mock.from } }));
vi.mock("@/lib/products-query", () => ({ fetchProductsByIdsOrSlugs: mock.products }));
vi.mock("@/pages/IndustryPage", () => ({ IndustryPage: () => null }));
vi.mock("@/pages/ServicePage", () => ({ ServicePage: () => null }));
vi.mock("@/pages/ApplicationCategoryPage", () => ({ ApplicationCategoryPage: () => null }));
import { Route as Services } from "@/routes/services.$slug";
import { Route as Industries } from "@/routes/industries.$slug";
import { Route as Applications } from "@/routes/applications.$category";
import { DeferredRelated } from "@/components/site/DeferredRelated";
const deferred = <T,>() => {
  let resolve!: (value: T) => void;
  const promise = new Promise<T>((done) => {
    resolve = done;
  });
  return { promise, resolve };
};
beforeEach(() => vi.clearAllMocks());

describe("public section navigation", () => {
  for (const [section, route, param] of [
    ["services", Services, "slug"],
    ["industries", Industries, "slug"],
    ["applications", Applications, "category"],
  ] as const) {
    it(`${section}: reads only its own configuration once and shows core content before related requests finish`, async () => {
      const cases = deferred<any[]>();
      const products = deferred<any[]>();
      const slug = "custom-fabrication";
      mock.products.mockReturnValue(products.promise);
      mock.from.mockImplementation((table: string) => {
        const q: any = {};
        for (const method of ["select", "eq", "order"]) q[method] = vi.fn(() => q);
        q.in = vi.fn(() => q);
        const get = () =>
          table === "site_config"
            ? Promise.resolve({
                data: [
                  {
                    key: `template_${section}`,
                    value: {
                      [slug]: {
                        title: "Fabrication for African projects",
                        products: ["p1"],
                        keyProducts: ["p1"],
                        caseStudies: ["c1"],
                      },
                    },
                  },
                  {
                    key: `hierarchy_${section}`,
                    value: { items: [{ id: "legacy-id", slug, label: "Manufacturing" }] },
                  },
                ],
                error: null,
              })
            : cases.promise.then((data) => ({ data, error: null }));
        q.then = (ok: any, fail: any) => get().then(ok, fail);
        q.maybeSingle = () => get().then((result) => ({ ...result, data: result.data[0] }));
        return q;
      });
      const data = await (route.options.loader as any)({ params: { [param]: slug } });
      expect(data.templateData.title).toBe("Manufacturing");
      expect(mock.from.mock.calls.filter(([table]) => table === "site_config")).toHaveLength(1);
      expect(mock.products).toHaveBeenCalledWith(["p1"]);
      let finished = false;
      data.related.then(() => {
        finished = true;
      });
      await Promise.resolve();
      expect(finished).toBe(false);
      cases.resolve([{ id: "c1", title: "Manufacturing case", sector: "Manufacturing" }]);
      products.resolve([{ id: "p1", name: "Related product" }]);
      const related = await data.related;
      expect(related.linkedProducts || related.keyProducts).toHaveLength(1);
    });
  }

  it("keeps the quote form mounted and typed text intact while related cards finish", async () => {
    const pending = deferred<any>();
    const data = { related: pending.promise };
    await act(async () => {
      render(
        <>
          <h1>Manufacturing</h1>
          <input aria-label="Project description" />
          <DeferredRelated data={data}>{({ items }) => <p>{items[0]}</p>}</DeferredRelated>
        </>,
      );
    });
    const input = screen.getByRole("textbox", { name: "Project description" });
    await act(async () => {
      fireEvent.change(input, { target: { value: "Tank liner quote" } });
    });
    expect(screen.getByRole("heading", { name: "Manufacturing" })).toBeTruthy();
    await act(async () => {
      pending.resolve({ items: ["Fabrication example"] });
      await pending.promise;
    });
    expect(await screen.findByText("Fabrication example")).toBeTruthy();
    expect(screen.getByRole("textbox", { name: "Project description" })).toBe(input);
    expect(input).toHaveValue("Tank liner quote");
  });
});
