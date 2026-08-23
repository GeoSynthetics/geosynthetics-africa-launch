import "../setup";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { HomePage } from "@/pages/HomePage";
import { Route } from "@/routes/index";

const { quickQuoteOpen } = vi.hoisted(() => ({ quickQuoteOpen: vi.fn() }));

vi.mock("@/routes/index", () => ({
  Route: { useLoaderData: vi.fn() },
}));

vi.mock("@tanstack/react-router", () => ({
  Link: ({ children, to, params, search, ...props }: any) => {
    let href = to;
    if (params?.slug) href = `/projects/${params.slug}`;
    return (
      <a href={href} {...props}>
        {children}
      </a>
    );
  },
}));

vi.mock("@/hooks/use-quick-quote", () => ({
  useQuickQuote: () => ({ open: quickQuoteOpen }),
}));

vi.mock("@/components/site/PartnerStrip", () => ({
  PartnerStrip: () => null,
}));

vi.mock("@/components/site/BoqCtaBand", () => ({
  BoqCtaBand: () => null,
}));

vi.mock("@/components/site/HeroSlider", () => ({
  HeroSlider: () => null,
}));

vi.mock("@/components/site/shapes", () => ({
  DrainageMesh: () => null,
  FiberStrand: () => null,
  GeoGrid: () => null,
  HexCell: () => null,
  MembraneFold: () => null,
}));

describe("HomePage Projects Section (Dynamic Case Studies)", () => {
  const mockCaseStudies = [
    {
      id: "cs-1",
      slug: "west-wits-tsf-lining",
      title: "West Wits TSF Lift 4 Lining",
      hero_image_url: "https://example.com/westwits.jpg",
      sector: "Mining",
      country: "South Africa",
      location: "Gauteng",
      scale: "320,000 m²",
      summary: "HDPE composite lining for gold tailings facility",
    },
    {
      id: "cs-2",
      slug: "kolwezi-liner-supply",
      title: "Kolwezi Stage 1 — Liner Supply",
      hero_image_url: "https://example.com/kolwezi.jpg",
      sector: "Mining",
      country: "DRC",
      location: "Lualaba",
      scale: "85,000 m²",
      summary: "85,000 m² HDPE liner supply for copper TSF",
    },
    {
      id: "cs-3",
      slug: "nouakchott-floating-cover",
      title: "Nouakchott Reservoir Floating Cover",
      hero_image_url: "https://example.com/nouakchott.jpg",
      sector: "Water Containment",
      country: "Mauritania",
      location: "Nouakchott",
      scale: "9,000 m²",
      summary: "Reinforced LLDPE floating cover",
    },
    {
      id: "cs-4",
      slug: "brandvlei-reservoir",
      title: "Brandvlei Reservoir Lining",
      hero_image_url: "https://example.com/brandvlei.jpg",
      sector: "Agriculture",
      country: "South Africa",
      location: "Western Cape",
      scale: "45,000 m²",
      summary: "Agricultural reservoir lining system",
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should dynamically render the top 3 published case studies and link to /projects/:slug", () => {
    vi.mocked(Route.useLoaderData).mockReturnValue({
      hp: null,
      caseStudies: mockCaseStudies,
    });

    render(<HomePage />);

    expect(screen.getByText("PROVEN ON PROJECTS ACROSS AFRICA")).toBeInTheDocument();
    expect(screen.getByText("West Wits TSF Lift 4 Lining")).toBeInTheDocument();
    expect(screen.getByText("Kolwezi Stage 1 — Liner Supply")).toBeInTheDocument();
    expect(screen.getByText("Nouakchott Reservoir Floating Cover")).toBeInTheDocument();

    const westWitsLinks = screen.getAllByRole("link").filter(
      (a) => a.getAttribute("href") === "/projects/west-wits-tsf-lining",
    );
    expect(westWitsLinks.length).toBeGreaterThan(0);
  });

  it("should respect admin selected featuredProjectIds and order", () => {
    vi.mocked(Route.useLoaderData).mockReturnValue({
      hp: {
        projects: {
          sectionTitle: "FEATURED MINING & WATER PROJECTS",
          featuredProjectIds: ["cs-4", "cs-2", "cs-1"],
        },
      },
      caseStudies: mockCaseStudies,
    });

    render(<HomePage />);

    expect(screen.getByText("FEATURED MINING & WATER PROJECTS")).toBeInTheDocument();
    expect(screen.getByText("Brandvlei Reservoir Lining")).toBeInTheDocument();
    expect(screen.getByText("Kolwezi Stage 1 — Liner Supply")).toBeInTheDocument();
    expect(screen.getByText("West Wits TSF Lift 4 Lining")).toBeInTheDocument();
  });
});
