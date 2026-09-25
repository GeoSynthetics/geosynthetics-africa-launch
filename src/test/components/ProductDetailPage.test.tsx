import "../setup";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { ProductDetailPage } from "@/pages/ProductDetailPage";
import { Route } from "@/routes/catalogue.$slug";

// Mock TanStack Router
vi.mock(import("@tanstack/react-router"), async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    Link: ({ children, to, params, ...props }: any) => {
      // Create a mock href string to check in tests
      const href = to.replace("$slug", params?.slug || "");
      return (
        <a href={href} {...props}>
          {children}
        </a>
      );
    },
  };
});

// Mock catalogue route
vi.mock("@/routes/catalogue.$slug", () => {
  return {
    Route: {
      useLoaderData: vi.fn(),
    },
  };
});

// Mock useQuickQuote hook
vi.mock("@/hooks/use-quick-quote", () => ({
  useQuickQuote: () => ({
    open: vi.fn(),
  }),
}));

// Mock BoqCtaBand and other visual sub-components to prevent rendering issues
vi.mock("@/components/site/BoqCtaBand", () => ({
  BoqCtaBand: () => <div data-testid="boq-cta-band">BOQ CTA Band</div>,
}));

vi.mock("@/components/site/Breadcrumbs", () => ({
  Breadcrumbs: () => <div data-testid="breadcrumbs">Breadcrumbs</div>,
}));

describe("ProductDetailPage - Linked Projects", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    // Mock window.matchMedia
    Object.defineProperty(window, "matchMedia", {
      writable: true,
      value: vi.fn().mockImplementation((query) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    });
  });

  it("should render linked case studies with the correct project details route and slug parameter", () => {
    const mockProduct = {
      id: "prod-123",
      name: "HDPE Geomembrane",
      slug: "hdpe-geomembrane",
      category_id: "cat-1",
      key_features: [],
      specifications: [],
      compatible_systems: [],
      downloads: [],
    };

    const mockCaseStudies = [
      {
        id: "cs-999",
        title: "Gold Mine TSF Lining System",
        slug: "gold-mine-tsf-lining",
        summary: "Composite liner installation details.",
        location: "Klerksdorp",
        country: "South Africa",
        hero_image_url: "mining-hero.jpg",
      },
    ];

    vi.mocked(Route.useLoaderData).mockReturnValue({
      product: mockProduct,
      alternatives: [],
      systemComponents: [],
      familyData: null,
      caseStudies: mockCaseStudies,
    } as any);

    render(<ProductDetailPage />);

    // Assert that the project card details are rendered
    expect(screen.getByText("Projects Using HDPE Geomembrane")).toBeInTheDocument();
    expect(screen.getByText("Gold Mine TSF Lining System")).toBeInTheDocument();
    expect(screen.getByText("Composite liner installation details.")).toBeInTheDocument();

    // Assert that the Link component points to the correct dynamic route and passes the slug parameter
    const link = screen.getByRole("link", { name: /View Case Study/i });
    expect(link).toHaveAttribute("href", "/projects/gold-mine-tsf-lining");
  });
});
