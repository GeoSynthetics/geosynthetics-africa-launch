import "../setup";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, within } from "@testing-library/react";
import { HomePage } from "@/pages/HomePage";
import { Route } from "@/routes/index";

const { quickQuoteOpen } = vi.hoisted(() => ({ quickQuoteOpen: vi.fn() }));

vi.mock("@/routes/index", () => ({
  Route: { useLoaderData: vi.fn() },
}));

vi.mock("@tanstack/react-router", () => ({
  Link: ({ children, to, ...props }: any) => (
    <a href={to} {...props}>
      {children}
    </a>
  ),
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

vi.mock("@/components/site/shapes", () => ({
  DrainageMesh: () => null,
  FiberStrand: () => null,
  GeoGrid: () => null,
  HexCell: () => null,
  MembraneFold: () => null,
}));

describe("HomePage hero", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(Route.useLoaderData).mockReturnValue({
      hp: {
        hero: {
          headlinePrefix: "Engineered for",
          headlineAccent: "Africa",
          headlineSuffix: "projects",
          tagline: "Designed and delivered locally.",
          subtext: "A complete geosynthetics delivery partner.",
          bgImage: "https://example.com/hero.jpg",
          btn1Text: "Upload BOQ",
          btn1Url: "/contacts",
          btn2Text: "Request supply",
          btn2Url: "/supply",
          btn3Text: "Speak to an engineer",
          btn3Url: "/technical-team",
        },
      },
    } as any);
  });

  it("provides an accessible hero landmark with its configured content and CTAs", () => {
    render(<HomePage />);

    const hero = document.querySelector<HTMLElement>(
      '[aria-labelledby="home-page-hero-heading"]',
    );
    expect(hero).toHaveAccessibleName("Engineered for Africa projects");

    const withinHero = within(hero!);
    expect(withinHero.getByRole("heading", { level: 1 })).toBeInTheDocument();
    expect(withinHero.getByText("Designed and delivered locally.")).toBeInTheDocument();
    expect(withinHero.getByText("A complete geosynthetics delivery partner.")).toBeInTheDocument();

    fireEvent.click(withinHero.getByRole("button", { name: "Upload BOQ" }));
    expect(quickQuoteOpen).toHaveBeenCalledOnce();
    expect(withinHero.getByRole("link", { name: "Request supply" })).toHaveAttribute(
      "href",
      "/supply",
    );
    expect(withinHero.getByRole("link", { name: "Speak to an engineer" })).toHaveAttribute(
      "href",
      "/technical-team",
    );
  });

  it("renders slider controls when multiple sliderImages are configured and handles prev/next navigation", () => {
    vi.mocked(Route.useLoaderData).mockReturnValue({
      hp: {
        hero: {
          headlinePrefix: "Engineered for",
          headlineAccent: "Africa",
          headlineSuffix: "projects",
          tagline: "Designed and delivered locally.",
          subtext: "A complete geosynthetics delivery partner.",
          sliderImages: ["https://example.com/slide1.jpg", "https://example.com/slide2.jpg"],
          btn1Text: "Upload BOQ",
          btn1Url: "/contacts",
        },
      },
    } as any);

    render(<HomePage />);

    const nextBtn = document.querySelector('button[aria-label="Next slide"]');
    const prevBtn = document.querySelector('button[aria-label="Previous slide"]');
    expect(nextBtn).toBeInTheDocument();
    expect(prevBtn).toBeInTheDocument();

    // Verify slide counter is rendered
    expect(document.body.textContent).toContain("01 / 02");

    // Click next slide
    fireEvent.click(nextBtn!);
    expect(document.body.textContent).toContain("02 / 02");

    // Click prev slide
    fireEvent.click(prevBtn!);
    expect(document.body.textContent).toContain("01 / 02");
  });
});
