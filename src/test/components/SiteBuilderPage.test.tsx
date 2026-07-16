import "../setup";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { SiteBuilderPage } from "@/pages/SiteBuilderPage";
import { supabase } from "@/integrations/supabase/client";

// Mock sub-builders to simplify rendering
vi.mock("@/components/admin/HomepageBuilderTab", () => ({
  HomepageBuilderTab: () => <div data-testid="homepage-tab">Homepage Builder</div>,
}));
vi.mock("@/components/admin/MegaMenuBuilderTab", () => ({
  MegaMenuBuilderTab: () => <div data-testid="megamenu-tab">Mega Menu Builder</div>,
}));
vi.mock("@/components/admin/RegionalCoverageBuilderTab", () => ({
  RegionalCoverageBuilderTab: () => <div data-testid="regional-tab">Regional Coverage</div>,
}));
vi.mock("@/components/admin/ContactsBuilderTab", () => ({
  ContactsBuilderTab: () => <div data-testid="contacts-tab">Contacts Builder</div>,
}));
vi.mock("@/components/admin/FooterBuilderTab", () => ({
  FooterBuilderTab: () => <div data-testid="footer-tab">Footer Builder</div>,
}));
vi.mock("@/components/admin/CatalogueBuilderTab", () => ({
  CatalogueBuilderTab: () => <div data-testid="catalogue-tab">Catalogue Builder</div>,
}));
vi.mock("@/components/admin/HierarchyTree", () => ({
  HierarchyTree: () => <div data-testid="hierarchy-tree">Hierarchy Tree</div>,
}));
vi.mock("@/components/admin/ContentEditorPanel", () => ({
  ContentEditorPanel: () => <div data-testid="content-editor">Content Editor</div>,
}));

// Mock Supabase
const mockSelect = vi.fn().mockResolvedValue({
  data: [],
  error: null,
});
vi.mock("@/integrations/supabase/client", () => ({
  supabase: {
    from: vi.fn((table) => ({
      select: mockSelect,
    })),
  },
}));

describe("SiteBuilderPage Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders tabs list and horizontal scrolling container", async () => {
    render(<SiteBuilderPage />);

    // Wait for the loader to disappear
    await waitFor(() => {
      expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
    });

    // Check header
    expect(screen.getByText("Site Builder")).toBeInTheDocument();

    // Verify scrolling container exists
    const scrollContainer = screen.getByTestId("site-builder-scroll-container");
    expect(scrollContainer).toBeInTheDocument();
  });
});
