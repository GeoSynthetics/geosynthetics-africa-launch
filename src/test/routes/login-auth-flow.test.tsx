import "../setup";
import { describe, it, expect } from "vitest";
import { Route as LoginRoute } from "@/routes/login";

describe("Login Route Configuration", () => {
  it("should define proper route metadata with meta tags", () => {
    const headResult = (LoginRoute.options.head as any)();
    expect(headResult).toBeDefined();
    expect(headResult.meta).toBeDefined();
    expect(headResult.meta).toContainEqual({ title: "Sign In — Geosynthetics Africa" });
  });

  it("should validate search params schema with optional redirect", () => {
    const schema = (LoginRoute.options as any).validateSearch;
    expect(schema).toBeDefined();
    const parsedValid = schema.parse({ redirect: "/admin" });
    expect(parsedValid.redirect).toBe("/admin");
    const parsedEmpty = schema.parse({});
    expect(parsedEmpty.redirect).toBeUndefined();
  });
});
