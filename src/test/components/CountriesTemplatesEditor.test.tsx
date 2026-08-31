import "../setup";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { CountriesTemplatesEditor } from "@/components/admin/CountriesTemplatesEditor";
import { invalidateCountryTemplatesCache } from "@/hooks/use-country-templates";

const mockCountries = {
  "gse-hdpe-liner-smooth-geomembrane-supplier-south-africa": {
    country: "South Africa",
    slug: "gse-hdpe-liner-smooth-geomembrane-supplier-south-africa",
    flag: "🇿🇦",
    code: "RSA",
    title: "GSE HDPE Liner & Smooth Geomembrane Supplier South Africa",
    description: "Geosynthetics Africa is a leading supplier...",
    heroImage: "https://images.unsplash.com/sa.jpg",
    qaqcTitle: "Rigorous Third-Party & On-Site QA/QC Protocols",
    qaqcDescription: "We operate dedicated field testing rigs...",
    complianceStandards: ["SANS 1526", "GRI-GM13"],
    featuredProductIds: ["prod-1", "prod-2"],
    seo: {
      title: "South Africa Geosynthetics",
      description: "SA Supplier",
      keywords: "south africa geosynthetics",
    },
  },
};

const mockProducts = [
  { id: "prod-1", name: "GSE Smooth HDPE Geomembrane", slug: "gse-hdpe-liner-smooth-geomembrane", image_url: "https://images.unsplash.com/hdpe.jpg" },
  { id: "prod-2", name: "Bidim Non-Woven Geotextile", slug: "bidim-geotextile", image_url: "https://images.unsplash.com/bidim.jpg" },
];

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
                  if (val === "template_countries") {
                    return { data: { value: mockCountries }, error: null };
                  }
                  return { data: null, error: null };
                }),
              })),
            }),
            upsert: mockUpsert,
          };
        }
        if (table === "products") {
          return {
            select: vi.fn().mockReturnValue({
              order: vi.fn().mockResolvedValue({ data: mockProducts, error: null }),
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
  ProductSelector: ({ onSelect }: any) => (
    <div data-testid="product-selector">
      <button
        onClick={() =>
          onSelect({
            id: "prod-3",
            name: "GCL Bentonite Liner",
            slug: "gcl-bentonite-liner",
          })
        }
      >
        Select Prod 3
      </button>
    </div>
  ),
}));

describe("CountriesTemplatesEditor Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    invalidateCountryTemplatesCache();
  });

  it("renders countries editor and loads South Africa template", async () => {
    render(<CountriesTemplatesEditor />);

    await waitFor(() => {
      expect(screen.getByText("Pan-African Country & Regional Templates")).toBeInTheDocument();
    });

    expect(screen.getAllByText("South Africa").length).toBeGreaterThan(0);
  });

  it("renders QA/QC tab with selected featured products and allows adding a product", async () => {
    render(<CountriesTemplatesEditor />);

    await waitFor(() => {
      expect(screen.getByRole("tab", { name: /^qa\/qc$/i })).toBeInTheDocument();
    });

    // Switch to QA/QC tab using full mouse/pointer event sequence for Radix UI
    const qaqcTab = screen.getByRole("tab", { name: /^qa\/qc$/i });
    fireEvent.pointerDown(qaqcTab, { button: 0 });
    fireEvent.mouseDown(qaqcTab, { button: 0 });
    fireEvent.pointerUp(qaqcTab, { button: 0 });
    fireEvent.mouseUp(qaqcTab, { button: 0 });
    fireEvent.click(qaqcTab);

    expect(await screen.findByText("Featured Products Offered in this Country")).toBeInTheDocument();

    // Products from mock should be visible
    expect(screen.getByText("GSE Smooth HDPE Geomembrane")).toBeInTheDocument();
    expect(screen.getByText("Bidim Non-Woven Geotextile")).toBeInTheDocument();

    // Select prod-3 via mock ProductSelector
    fireEvent.click(screen.getByText("Select Prod 3"));

    // Save changes
    const saveButton = screen.getByRole("button", { name: /save all country templates/i });
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(mockUpsert).toHaveBeenCalled();
    });

    const lastCall = mockUpsert.mock.calls[0][0];
    expect(lastCall.key).toBe("template_countries");
    expect(
      lastCall.value["gse-hdpe-liner-smooth-geomembrane-supplier-south-africa"].featuredProductIds
    ).toEqual(["prod-1", "prod-2", "prod-3"]);
  });
});
