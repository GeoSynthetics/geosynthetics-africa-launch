import "../setup";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { ProjectDetailPage } from "@/pages/ProjectDetailPage";
import { Route } from "@/routes/projects.$slug";

// Mock TanStack Router
vi.mock(import("@tanstack/react-router"), async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    Link: ({ children, to, ...props }: any) => (
      <a href={to} {...props}>
        {children}
      </a>
    ),
  };
});

vi.mock("@/routes/projects.$slug", () => {
  return {
    Route: {
      useLoaderData: vi.fn(),
    },
  };
});

// Mock Supabase client
vi.mock("@/integrations/supabase/client", () => {
  return {
    supabase: {
      from: vi.fn(() => ({
        select: vi.fn().mockReturnThis(),
        in: vi.fn().mockResolvedValue({ data: [], error: null }),
      })),
    },
  };
});

// Mock partner strip and boq components to avoid deep rendering issues
vi.mock("@/components/site/PartnerStrip", () => ({
  PartnerStrip: () => <div data-testid="partner-strip">Partner Strip</div>,
}));

vi.mock("@/components/site/BoqCtaBand", () => ({
  BoqCtaBand: () => <div data-testid="boq-cta-band">BOQ CTA Band</div>,
}));

describe("ProjectDetailPage - Installation Sequence", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render custom installation sequence steps if provided in qa_details", () => {
    const mockProject = {
      id: "project-123",
      title: "Custom Lining Project",
      location: "Johannesburg",
      country: "South Africa",
      project_year: 2026,
      sector: "Mining",
      scale: "50,000 m²",
      service_type: "supply_install",
      qa_details: {
        sequence: [
          { title: "Custom Step 1 Title", description: "Custom Step 1 Desc" },
          { title: "Custom Step 2 Title", description: "Custom Step 2 Desc" },
          { title: "Custom Step 3 Title", description: "Custom Step 3 Desc" },
          { title: "Custom Step 4 Title", description: "Custom Step 4 Desc" },
        ],
      },
    };

    vi.mocked(Route.useLoaderData).mockReturnValue({ project: mockProject });

    render(<ProjectDetailPage />);

    // Check custom sequence steps are rendered
    expect(screen.getByText("Custom Step 1 Title")).toBeInTheDocument();
    expect(screen.getByText("Custom Step 1 Desc")).toBeInTheDocument();
    expect(screen.getByText("Custom Step 4 Title")).toBeInTheDocument();
    expect(screen.getByText("Custom Step 4 Desc")).toBeInTheDocument();
  });

  it("should fall back to default sequence steps if sequence is not defined in qa_details", () => {
    const mockProject = {
      id: "project-123",
      title: "Custom Lining Project",
      location: "Johannesburg",
      country: "South Africa",
      project_year: 2026,
      sector: "Mining",
      scale: "50,000 m²",
      service_type: "supply_install",
      qa_details: {}, // Empty qa_details
    };

    vi.mocked(Route.useLoaderData).mockReturnValue({ project: mockProject });

    render(<ProjectDetailPage />);

    // Check default sequence steps are rendered as fallback
    expect(screen.getByText("Subgrade Accept")).toBeInTheDocument();
    expect(screen.getByText("Clay base compaction and clearance check.")).toBeInTheDocument();
    expect(screen.getByText("Air Pressure Test")).toBeInTheDocument();
    expect(screen.getByText("Double seam channels locked and pressure tested.")).toBeInTheDocument();
  });

  it("should fall back to default sequence steps if sequence is an empty array in qa_details", () => {
    const mockProject = {
      id: "project-123",
      title: "Custom Lining Project",
      location: "Johannesburg",
      country: "South Africa",
      project_year: 2026,
      sector: "Mining",
      scale: "50,000 m²",
      service_type: "supply_install",
      qa_details: {
        sequence: [], // Empty array
      },
    };

    vi.mocked(Route.useLoaderData).mockReturnValue({ project: mockProject });

    render(<ProjectDetailPage />);

    // Check default sequence steps are rendered as fallback
    expect(screen.getByText("Subgrade Accept")).toBeInTheDocument();
    expect(screen.getByText("Clay base compaction and clearance check.")).toBeInTheDocument();
    expect(screen.getByText("Air Pressure Test")).toBeInTheDocument();
    expect(screen.getByText("Double seam channels locked and pressure tested.")).toBeInTheDocument();
  });
});
