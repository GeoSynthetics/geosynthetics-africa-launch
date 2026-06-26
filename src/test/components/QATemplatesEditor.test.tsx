import "../setup";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { QATemplatesEditor } from "@/components/admin/QATemplatesEditor";

// Mock Supabase data
const mockDocs = [
  {
    id: "doc-1",
    slug: "gse-solmax",
    category_name: "GSE® / Solmax",
    short_description: "Short desc",
    hero_image_url: null,
    eyebrow: "IAGI-Aligned",
    hero_title: "Hero title",
    hero_body: "Hero body",
    content_sections: [],
    stats: [{ label: "Accuracy", value: "100%" }],
    industries_served: ["Mining"],
    key_pillars: [{ icon: "ShieldCheck", title: "Pillar 1", desc: "Pillar desc" }],
    cta_label: "Request Info",
    sort_order: 1,
    status: "published",
  },
];

const mockLanding = {
  heroTitle: "Landing Title",
  heroSubtitle: "Landing Subtitle",
  heroImage: "landing.jpg",
  heroChecklist: ["Verify material"],
  heroStats: [{ value: "100%", label: "Tested" }],
  frameworkTitle: "Framework Title",
  frameworkEyebrow: "Framework Eyebrow",
  pillars: [{ icon: "Award", title: "Standard", desc: "Accredited" }],
  iagiTitle: "IAGI Title",
  iagiDescription: "IAGI Description",
  iagiStats: [{ value: "One of 5", label: "Members" }],
  seo: {
    title: "SEO Title",
    description: "SEO Desc",
    keywords: "QA, QC",
  },
};

vi.mock("@/integrations/supabase/client", () => {
  return {
    supabase: {
      from: vi.fn((table) => {
        if (table === "qa_documents") {
          const limitMock = vi.fn().mockResolvedValue({ data: mockDocs, error: null });
          const orderMock = vi.fn().mockReturnValue({ limit: limitMock });
          const selectMock = vi.fn().mockReturnValue({ order: orderMock });
          const updateMock = vi
            .fn()
            .mockReturnValue({ eq: vi.fn().mockResolvedValue({ data: null, error: null }) });
          const insertMock = vi.fn().mockResolvedValue({ data: null, error: null });
          const deleteMock = vi
            .fn()
            .mockReturnValue({ eq: vi.fn().mockResolvedValue({ data: null, error: null }) });
          return {
            select: selectMock,
            update: updateMock,
            insert: insertMock,
            delete: deleteMock,
          };
        }
        if (table === "site_config") {
          const maybeSingleMock = vi
            .fn()
            .mockResolvedValue({ data: { value: mockLanding }, error: null });
          const eqMock = vi.fn().mockReturnValue({ maybeSingle: maybeSingleMock });
          const selectMock = vi.fn().mockReturnValue({ eq: eqMock });
          const upsertMock = vi.fn().mockResolvedValue({ data: null, error: null });
          return {
            select: selectMock,
            upsert: upsertMock,
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

// Mock ImagePicker and IconPicker to simplify rendering and avoid asset loading
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

vi.mock("@/components/admin/IconPicker", () => ({
  IconPicker: ({ value, onChange }: any) => (
    <input
      data-testid="icon-picker"
      value={value || ""}
      onChange={(e) => onChange(e.target.value)}
    />
  ),
}));

describe("QATemplatesEditor Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders split-pane layout and sidebar options", async () => {
    render(<QATemplatesEditor />);

    // Wait for loader to disappear
    await waitFor(() => {
      expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
    });

    // Check layout and header title
    expect(screen.getByText("Quality Assurance Templates")).toBeInTheDocument();

    // Verify main options are present in sidebar (using getAllByText since titles are duplicated in panel header)
    expect(screen.getAllByText("QA Landing Page").length).toBeGreaterThan(0);
    expect(screen.getAllByText("GSE® / Solmax").length).toBeGreaterThan(0);
  });

  it("switches to subpage when clicked and binds form inputs", async () => {
    render(<QATemplatesEditor />);

    await waitFor(() => {
      expect(screen.getAllByText("GSE® / Solmax").length).toBeGreaterThan(0);
    });

    // Click the sidebar item for the subpage
    fireEvent.click(screen.getAllByText("GSE® / Solmax")[0]);

    // Check form panel header updates to selected subpage name (rendered as heading)
    expect(screen.getByRole("heading", { name: "GSE® / Solmax" })).toBeInTheDocument();

    // Check basic tab inputs bind correct value
    const catInput = screen.getByDisplayValue("GSE® / Solmax") as HTMLInputElement;
    expect(catInput).toBeInTheDocument();

    // Modify Category Name
    fireEvent.change(catInput, { target: { value: "New Category Name" } });
    expect(screen.getByText("● Unsaved Changes")).toBeInTheDocument();
  });

  it("handles New QA Document creation", async () => {
    render(<QATemplatesEditor />);

    await waitFor(() => {
      expect(screen.getAllByText("QA Landing Page").length).toBeGreaterThan(0);
    });

    // Click New QA Document button
    fireEvent.click(screen.getByText("New QA Document"));

    // Verify right panel updates to New QA Document form
    expect(screen.getByRole("heading", { name: "New QA Document" })).toBeInTheDocument();

    // Check that inputs are empty/default
    const catInput = screen.getByPlaceholderText(
      "e.g. GSE® / Solmax Quality Assurance",
    ) as HTMLInputElement;
    expect(catInput).toBeInTheDocument();
    expect(catInput.value).toBe("");
  });
});
