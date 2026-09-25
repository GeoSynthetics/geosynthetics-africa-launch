import "../setup";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { IndustriesTemplatesEditor } from "@/components/admin/IndustriesTemplatesEditor";

const mockTemplates = {
  __landing: {
    title: "High-Performance Geosynthetic Solutions for African Industries",
    description: "Tailored containment, stabilisation, and erosion control systems...",
    heroImage: "https://images.unsplash.com/landing.jpg",
    eyebrow: "Industries",
    seo: {
      title: "Industries — Geosynthetics Africa",
      description: "High-performance geosynthetic systems...",
      keywords: "mining, infrastructure, agriculture",
    },
  },
  mining: {
    title: "Mining & Minerals Processing",
    description: "Containment and drainage solutions for mining operations.",
    heroImage: "https://images.unsplash.com/mining.jpg",
    content: {
      challenges: ["Acid mine drainage", "Tailings containment"],
      applications: [{ heading: "Heap Leach Pads", description: "Lining system" }],
    },
    topSellingProductIds: ["prod-1"],
    caseStudies: ["cs-1"],
    keyProducts: ["prod-1"],
    seo: {
      title: "Mining Geosynthetics",
      description: "Mining solutions",
      keywords: "mining",
    },
  },
};

const mockHierarchy = {
  items: [
    { id: "mining", label: "Mining & Minerals Processing" },
    { id: "water", label: "Water Utilities & Irrigation" },
  ],
};

const mockUpsert = vi.fn().mockResolvedValue({ error: null });

vi.mock("@/integrations/supabase/client", () => {
  return {
    supabase: {
      from: vi.fn((table: string) => {
        if (table === "site_config") {
          return {
            select: vi.fn().mockReturnValue({
              eq: vi.fn((_col: string, val: string) => ({
                maybeSingle: vi.fn().mockImplementation(async () => {
                  if (val === "hierarchy_industries") {
                    return { data: { value: mockHierarchy }, error: null };
                  }
                  if (val === "template_industries") {
                    return { data: { value: mockTemplates }, error: null };
                  }
                  return { data: null, error: null };
                }),
              })),
            }),
            upsert: mockUpsert,
          };
        }
        if (table === "products" || table === "case_studies") {
          return {
            select: vi.fn().mockReturnValue({
              order: vi.fn().mockResolvedValue({ data: [], error: null }),
            }),
          };
        }
        return {
          select: vi.fn().mockReturnThis(),
          eq: vi.fn().mockReturnThis(),
          maybeSingle: vi.fn().mockResolvedValue({ data: null, error: null }),
        };
      }),
    },
  };
});

vi.mock("@/components/admin/ImagePicker", () => ({
  ImagePicker: ({ label, value, onChange }: any) => (
    <div data-testid="image-picker">
      <label>{label}</label>
      <input
        data-testid="image-picker-input"
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  ),
}));

vi.mock("@/components/admin/ProductSelector", () => ({
  ProductSelector: () => <div data-testid="product-selector">ProductSelector</div>,
}));

describe("IndustriesTemplatesEditor Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders Main Pages section with Industries Landing Page and selects it by default", async () => {
    render(<IndustriesTemplatesEditor />);

    await waitFor(() => {
      expect(screen.getByText("Industry Page Templates")).toBeInTheDocument();
    });

    // Check sidebar Main Pages and Categories sections
    expect(screen.getByText("Main Pages")).toBeInTheDocument();
    expect(screen.getAllByText("Industries Landing Page").length).toBeGreaterThan(0);
    expect(screen.getAllByText("/industries").length).toBeGreaterThan(0);

    // Check default landing page editor header and fields
    expect(screen.getByText("Landing Hero Section")).toBeInTheDocument();
    expect(screen.getByText("Landing Title (H1)")).toBeInTheDocument();
    expect(screen.getByText("Landing Hero Image")).toBeInTheDocument();
    expect(screen.getByText("Landing Subtitle / Description")).toBeInTheDocument();

    // Verify only Hero and SEO tabs are visible for __landing
    expect(screen.getByRole("tab", { name: /^hero$/i })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: /^seo$/i })).toBeInTheDocument();
    expect(screen.queryByRole("tab", { name: /^challenges$/i })).not.toBeInTheDocument();
  });

  it("switches to industry category and renders full category tabs", async () => {
    render(<IndustriesTemplatesEditor />);

    await waitFor(() => {
      expect(screen.getByText("Industry Categories (2)")).toBeInTheDocument();
    });

    // Click on Mining category in sidebar
    const miningButton = screen.getByRole("button", { name: /mining & minerals processing/i });
    fireEvent.click(miningButton);

    await waitFor(() => {
      expect(screen.getByRole("tab", { name: /^challenges$/i })).toBeInTheDocument();
      expect(screen.getByRole("tab", { name: /^applications$/i })).toBeInTheDocument();
      expect(screen.getByRole("tab", { name: /^case studies$/i })).toBeInTheDocument();
      expect(screen.getByRole("tab", { name: /^products$/i })).toBeInTheDocument();
    });
  });

  it("allows editing landing page and saving to Supabase", async () => {
    render(<IndustriesTemplatesEditor />);

    await waitFor(() => {
      expect(screen.getByText("Landing Title (H1)")).toBeInTheDocument();
    });

    const titleInput = screen.getByPlaceholderText(
      "e.g. High-Performance Geosynthetic Solutions for African Industries",
    );
    fireEvent.change(titleInput, { target: { value: "Custom Industries Header" } });

    // Save button should become enabled
    const saveButton = screen.getByRole("button", { name: /^save$/i });
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(mockUpsert).toHaveBeenCalledWith(
        expect.objectContaining({
          key: "template_industries",
          value: expect.objectContaining({
            __landing: expect.objectContaining({
              title: "Custom Industries Header",
            }),
          }),
        }),
        expect.anything(),
      );
    });
  });
});
