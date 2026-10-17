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

  it("should hide the installation sequence if sequence is not defined in qa_details", () => {
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

    // No invented placeholder steps: the section is hidden when no steps are entered
    expect(screen.queryByText("Installation Sequence")).not.toBeInTheDocument();
    expect(screen.queryByText("Subgrade Accept")).not.toBeInTheDocument();
    expect(screen.queryByText("Air Pressure Test")).not.toBeInTheDocument();
  });

  it("should hide the installation sequence if sequence is an empty array in qa_details", () => {
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

    // No invented placeholder steps: the section is hidden when no steps are entered
    expect(screen.queryByText("Installation Sequence")).not.toBeInTheDocument();
    expect(screen.queryByText("Subgrade Accept")).not.toBeInTheDocument();
    expect(screen.queryByText("Air Pressure Test")).not.toBeInTheDocument();
  });

  it("should render the field label as 'Resources' and not 'Field Welders', mapping to project.qa_details.welders", () => {
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
        welders: "12 Certified Welders",
      },
    };

    vi.mocked(Route.useLoaderData).mockReturnValue({ project: mockProject });

    render(<ProjectDetailPage />);

    // Assert that the label is 'Resources'
    expect(screen.getByText("Resources")).toBeInTheDocument();

    // Assert that the label 'Field Welders' is NOT rendered
    expect(screen.queryByText("Field Welders")).not.toBeInTheDocument();

    // Assert that the resource value is rendered under the label
    expect(screen.getByText("12 Certified Welders")).toBeInTheDocument();
  });

  it("should render the Logistics Performance KPIs from project.logistics_details when using supply_only service_type", () => {
    const mockProject = {
      id: "project-456",
      title: "Supply Only Case Study",
      location: "Kolwezi",
      country: "Democratic Republic of the Congo",
      project_year: 2026,
      sector: "Mining",
      scale: "340 t",
      service_type: "supply_only",
      logistics_details: {
        kpi_demurrage_free: "98% Free",
        kpi_frontier_delays: "1 Day delay",
        kpi_sealed_consignments: "24 Sealed Trucks",
        kpi_ontime_laydown: "99% On-Time",
      },
    };

    vi.mocked(Route.useLoaderData).mockReturnValue({ project: mockProject });

    render(<ProjectDetailPage />);

    // Assert that the Logistics Performance KPIs section header is rendered
    expect(screen.getByText("Logistics Performance KPIs")).toBeInTheDocument();

    // Assert that the custom KPI values are rendered
    expect(screen.getByText("98% Free")).toBeInTheDocument();
    expect(screen.getByText("1 Day delay")).toBeInTheDocument();
    expect(screen.getByText("24 Sealed Trucks")).toBeInTheDocument();
    expect(screen.getByText("99% On-Time")).toBeInTheDocument();

    // Assert that the labels are rendered
    expect(screen.getByText("Demurrage Free")).toBeInTheDocument();
    expect(screen.getByText("Frontier Delays")).toBeInTheDocument();
    expect(screen.getByText("Sealed Consignments")).toBeInTheDocument();
    expect(screen.getByText("On-Time laydown")).toBeInTheDocument();
  });

  it("should hide the Logistics Performance KPIs if they are not defined in logistics_details when using supply_only service_type", () => {
    const mockProject = {
      id: "project-456",
      title: "Supply Only Case Study",
      location: "Kolwezi",
      country: "Democratic Republic of the Congo",
      project_year: 2026,
      sector: "Mining",
      scale: "340 t",
      service_type: "supply_only",
      logistics_details: {}, // Empty logistics_details
    };

    vi.mocked(Route.useLoaderData).mockReturnValue({ project: mockProject });

    render(<ProjectDetailPage />);

    // No invented figures are shown
    expect(screen.queryByText("Logistics Performance KPIs")).not.toBeInTheDocument();
    expect(screen.queryByText("0 Days")).not.toBeInTheDocument();
    expect(screen.queryByText("12 Trucks")).not.toBeInTheDocument();
    expect(screen.queryByText("3,420 km")).not.toBeInTheDocument();
  });

  it("should hide placeholder dashes and invented copy for a supply_only project with partial data", () => {
    const mockProject = {
      id: "project-789",
      title: "HDPE Geomembrane Supply – Ikongwe Iron Ore Mine, Botswana",
      location: "Ikongwe",
      country: "Botswana",
      project_year: 2026,
      sector: "Mining",
      scale: "61,600 m²",
      service_type: "supply_only",
      summary: "Supply of 61,600 m² of GSE HDPE geomembrane.",
      logistics_details: {
        tonnage: "—",
        route: "—",
        borders: "—",
        ontime: "—",
        kpi_demurrage_free: "—",
        route_steps: [{ stage: "Workflow 01", name: "Order preparation", desc: "Verify grades." }],
      },
      spec_compliance: [],
    };

    vi.mocked(Route.useLoaderData).mockReturnValue({ project: mockProject });

    render(<ProjectDetailPage />);

    // Headline is the project title plus scale, never "— — delivered on time"
    expect(screen.getByRole("heading", { level: 1 }).textContent).toBe(
      "HDPE Geomembrane Supply – Ikongwe Iron Ore Mine, Botswana — 61,600 m²",
    );
    expect(screen.queryByText(/delivered on time/i)).not.toBeInTheDocument();
    expect(screen.queryByText("—")).not.toBeInTheDocument();
    expect(screen.queryByText("Distance Route")).not.toBeInTheDocument();
    expect(screen.queryByText(/Rotterdam/)).not.toBeInTheDocument();
    // Empty spec table and empty KPI section are hidden
    expect(screen.queryByText(/Specification Conformity/)).not.toBeInTheDocument();
    expect(screen.queryByText("Logistics Performance KPIs")).not.toBeInTheDocument();
    // Real route steps still render
    expect(screen.getByText("Order preparation")).toBeInTheDocument();
    // The fake download button is replaced by a contact link
    expect(screen.queryByText("Download Delivery Pack")).not.toBeInTheDocument();
    expect(screen.getByText("Request Project Documents").closest("a")).toHaveAttribute(
      "href",
      "/contacts",
    );
  });
});
