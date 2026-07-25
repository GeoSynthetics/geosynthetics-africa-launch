import "../setup";
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { AboutPage } from "@/pages/AboutPage";
import { DEFAULT_ABOUT_PAGE_CONTENT } from "@/types/about";

// Mock matchMedia for GSAP in test env
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

// Mock TanStack Router Link component
vi.mock("@tanstack/react-router", () => ({
  Link: ({ children, to, ...props }: any) => (
    <a href={to} {...props}>
      {children}
    </a>
  ),
}));

// Mock useAboutContent hook
vi.mock("@/hooks/use-about-content", () => ({
  useAboutContent: () => ({
    ...DEFAULT_ABOUT_PAGE_CONTENT,
    contact: {
      ...DEFAULT_ABOUT_PAGE_CONTENT.contact,
      mapHeading: "Custom Store Location",
      mapDescription: "Custom store location description",
      mapEmbedUrl: "https://www.google.com/maps?q=custom+location&output=embed",
      catalogButtonText: "View Catalog Products",
      catalogButtonUrl: "/catalogue",
    },
  }),
}));

describe("AboutPage Store Location Map & Form Removal", () => {
  it("should not render the quote form input fields on the About Page", () => {
    render(<AboutPage />);

    // Ensure form inputs are removed
    expect(screen.queryByPlaceholderText(/Your name/i)).toBeNull();
    expect(screen.queryByPlaceholderText(/Email address/i)).toBeNull();
    expect(screen.queryByText(/SUBMIT & GET PROPOSAL/i)).toBeNull();
  });

  it("should render the Store Location Map iframe with the configured embed URL", () => {
    render(<AboutPage />);

    expect(screen.getAllByText("Custom Store Location")[0]).toBeInTheDocument();
    expect(screen.getAllByText("Custom store location description")[0]).toBeInTheDocument();

    const mapIframe = screen.getAllByTitle("Store location map")[0] as HTMLIFrameElement;
    expect(mapIframe).toBeInTheDocument();
    expect(mapIframe.src).toBe("https://www.google.com/maps?q=custom+location&output=embed");
  });

  it("should render the catalog products CTA button at the bottom of the map pointing to /catalogue", () => {
    render(<AboutPage />);

    const catalogBtns = screen.getAllByRole("link", { name: /View Catalog Products/i });
    expect(catalogBtns.length).toBeGreaterThan(0);
    expect(catalogBtns[0].getAttribute("href")).toBe("/catalogue");
  });
});
