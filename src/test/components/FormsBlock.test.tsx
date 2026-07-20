import "../setup";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor, within } from "@testing-library/react";
import { FormsBlock } from "@/pages/ContactsPage";
import { supabase } from "@/integrations/supabase/client";
import { ContactHeadOffice } from "@/types/contacts";

// Mock TanStack Router
vi.mock("@tanstack/react-router", () => ({
  Link: ({ children, to }: any) => <a href={to}>{children}</a>,
  useLoaderData: () => ({ caseStudies: [] }),
}));

// Mock useAuth
vi.mock("@/hooks/use-auth", () => ({
  useAuth: () => ({ user: { id: "test-user-id", email: "test@example.com" } }),
}));

// Mock Supabase
const mockInsert = vi.fn().mockResolvedValue({ data: null, error: null });
vi.mock("@/integrations/supabase/client", () => ({
  supabase: {
    from: vi.fn(() => ({
      insert: mockInsert,
    })),
  },
}));

describe("FormsBlock Component (React Hook Form)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const mockHeadOffice: ContactHeadOffice = {
    company: "Geosynthetics Africa (Pty) Ltd",
    address: ["123 Street", "Johannesburg", "South Africa"],
    contactPerson: "James Chabata",
    contactRole: "Sales Admin Manager",
    phone: "+27 12 345 6789",
    email: "test@geosynthetics.co.za",
    hours: ["Mon - Fri: 08:00 - 17:00"],
    mapEmbedUrl: "https://maps.google.com",
  };

  it("submits the Quick Contact form successfully with valid inputs", async () => {
    render(<FormsBlock headOffice={mockHeadOffice} />);

    // Scope queries to the Quick Contact container
    const quickContactAside = screen.getByText("Quick Contact").closest("aside")!;
    expect(quickContactAside).toBeInTheDocument();

    const nameInput = within(quickContactAside).getByLabelText(/Full Name/i);
    const emailInput = within(quickContactAside).getByLabelText(/Email/i);
    const messageInput = within(quickContactAside).getByLabelText(/Message/i);

    fireEvent.change(nameInput, { target: { value: "John Doe" } });
    fireEvent.change(emailInput, { target: { value: "john@example.com" } });
    fireEvent.change(messageInput, { target: { value: "Hello world" } });

    const submitBtn = within(quickContactAside).getByRole("button", { name: /send inquiry/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(mockInsert).toHaveBeenCalled();
    });

    const callPayload = mockInsert.mock.calls[0][0];
    expect(callPayload.contact_name).toBe("John Doe");
    expect(callPayload.contact_email).toBe("john@example.com");
    expect(callPayload.project_description).toContain("Hello world");
  }, 15000);
});
