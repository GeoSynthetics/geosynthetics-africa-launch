import "../setup";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { Footer } from "@/components/site/Footer";

// Mock TanStack Router
vi.mock("@tanstack/react-router", () => {
  return {
    Link: ({ children, to, params, ...props }: any) => {
      let href = typeof to === "string" ? to : "/";
      if (params) {
        Object.entries(params).forEach(([key, val]) => {
          href = href.replace(`$${key}`, val as string);
        });
      }
      return (
        <a href={href} {...props}>
          {children}
        </a>
      );
    },
  };
});

// Mock react-i18next to act like a real translation engine with default keys
vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string, fallback: string) => {
      const translations: Record<string, string> = {
        "nav.products": "Products",
        "nav.applications": "Applications",
        "nav.services": "Services",
        "nav.industries": "Industries",
        "footer.resources": "Resources",
        "footer.company": "Company",
      };
      return translations[key] || fallback;
    },
  }),
}));

// Mock useFooterContent
const mockUseFooterContent = vi.fn();
vi.mock("@/hooks/use-footer-content", () => ({
  useFooterContent: () => mockUseFooterContent(),
}));

// Mock usePageSlugs
vi.mock("@/hooks/use-page-slugs", () => ({
  usePageSlugs: () => ({
    loaded: true,
    resolve: (to: string) => to,
  }),
}));

// Mock useDynamicMegaMenus
vi.mock("@/hooks/use-dynamic-menus", () => ({
  useDynamicMegaMenus: () => ({
    menus: [
      {
        key: "products",
        columns: {
          primary: [
            { label: "Geomembranes", to: "/products/geomembranes", params: { category: "geomembranes" } },
          ],
        },
      },
    ],
    isLoading: false,
  }),
}));

describe("Footer Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders custom and dynamic columns when configured in footerContent", () => {
    mockUseFooterContent.mockReturnValue({
      brandDescription: "Dynamic Footer description text",
      socialLinks: [{ platform: "linkedin", url: "https://linkedin.com" }],
      certifications: ["Cert 1", "Cert 2"],
      copyrightText: "Copyright {{year}} Geosynthetics Africa",
      columns: [
        {
          id: "custom-col-1",
          title: "Useful Links",
          type: "custom",
          links: [
            { label: "Contact Us", to: "/contact" },
            { label: "Careers Page", to: "/careers" },
          ],
        },
        {
          id: "dynamic-col-products",
          title: "Product!!!",
          type: "products",
        },
      ],
    });

    render(<Footer />);

    // Brand and description
    expect(screen.getByText("Dynamic Footer description text")).toBeInTheDocument();

    // Custom column title & links
    expect(screen.getByText("Useful Links")).toBeInTheDocument();
    expect(screen.getByText("Contact Us")).toBeInTheDocument();
    expect(screen.getByText("Careers Page")).toBeInTheDocument();

    // Dynamic column title & links (assert customized title is rendered)
    expect(screen.getByText("Product!!!")).toBeInTheDocument();
    expect(screen.getByText("Geomembranes")).toBeInTheDocument();

    // Certifications
    expect(screen.getByText("Cert 1")).toBeInTheDocument();
    expect(screen.getByText("Cert 2")).toBeInTheDocument();
  });
});
