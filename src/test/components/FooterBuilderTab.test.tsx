import "../setup";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { FooterBuilderTab } from "@/components/admin/FooterBuilderTab";
import { supabase } from "@/integrations/supabase/client";

// Mock Supabase
const mockUpsert = vi.fn().mockResolvedValue({ data: null, error: null });
const mockSelect = vi.fn().mockReturnValue({
  eq: vi.fn().mockReturnValue({
    maybeSingle: vi.fn().mockResolvedValue({
      data: {
        value: {
          brandDescription: "Original Brand Desc",
          socialLinks: [],
          certifications: [],
          copyrightText: "Copyright Text",
          columns: [
            {
              id: "col-1",
              title: "Useful Links",
              type: "custom",
              links: [{ label: "Contact Us", to: "/contact" }],
            },
          ],
        },
      },
      error: null,
    }),
  }),
  in: vi.fn().mockResolvedValue({ data: [], error: null }),
});

vi.mock("@/integrations/supabase/client", () => ({
  supabase: {
    from: vi.fn((table) => {
      if (table === "site_config") {
        return {
          select: mockSelect,
          upsert: mockUpsert,
        };
      }
      return {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        in: vi.fn().mockReturnThis(),
        maybeSingle: vi.fn().mockResolvedValue({ data: null, error: null }),
      };
    }),
  },
}));

describe("FooterBuilderTab Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders tabs and allows editing footer brand details and columns", async () => {
    render(<FooterBuilderTab />);

    // Wait for loader to disappear
    await waitFor(() => {
      expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
    });

    // Check if brand details loaded
    expect(screen.getByText("Brand Details")).toBeInTheDocument();

    // Switch to Navigation Columns tab
    const colsTabTrigger = screen.getByRole("tab", { name: /columns/i });
    expect(colsTabTrigger).toBeInTheDocument();

    // Fire complete mouse/pointer event sequence for Radix UI Compatibility in JSDOM
    fireEvent.pointerDown(colsTabTrigger, { button: 0 });
    fireEvent.mouseDown(colsTabTrigger, { button: 0 });
    fireEvent.pointerUp(colsTabTrigger, { button: 0 });
    fireEvent.mouseUp(colsTabTrigger, { button: 0 });
    fireEvent.click(colsTabTrigger);

    // Verify existing column renders using a regex
    expect(await screen.findByText(/Useful Links/)).toBeInTheDocument();
    expect(screen.getByDisplayValue("Contact Us")).toBeInTheDocument();
    expect(screen.getByDisplayValue("/contact")).toBeInTheDocument();

    // Click on Add Column button
    const addColBtn = screen.getByRole("button", { name: /add column/i });
    fireEvent.click(addColBtn);

    // Fill new column title
    const colInputs = screen.getAllByPlaceholderText("Column Title");
    const newColInput = colInputs[colInputs.length - 1];
    fireEvent.change(newColInput, { target: { value: "Support Col" } });

    // Click Save Footer button
    const saveBtn = screen.getByRole("button", { name: /save footer/i });
    fireEvent.click(saveBtn);

    await waitFor(() => {
      expect(mockUpsert).toHaveBeenCalled();
    });

    const lastCallPayload = mockUpsert.mock.calls[0][0];
    expect(lastCallPayload.key).toBe("footer_content");
    expect(lastCallPayload.value.columns).toBeDefined();
    // Support Col is part of the saved columns list
    expect(lastCallPayload.value.columns.some((c: any) => c.title === "Support Col")).toBe(true);
  }, 15000);
});
