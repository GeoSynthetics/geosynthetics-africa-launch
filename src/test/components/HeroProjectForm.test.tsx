import "../setup";
import { describe, expect, it, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { HeroProjectForm } from "@/components/site/HeroProjectForm";

vi.mock("@/services/leadRoutingService", () => ({
  submitHeroProjectRequest: vi.fn().mockResolvedValue({
    message: "Request received",
    routedTo: {
      targetName: "Mamadou Coulibaly",
      targetRole: "Regional Director - West Africa",
      targetEmail: "civ@geosynthetics.co.za",
      isWestAfrica: true,
      country: "Ivory Coast",
    },
  }),
}));

describe("HeroProjectForm Component", () => {
  it("renders with modern glassmorphic styling and provides accessible inputs", () => {
    const { container } = render(<HeroProjectForm />);

    expect(screen.getByText("START YOUR PROJECT")).toBeInTheDocument();
    expect(screen.getByText("ALL OF AFRICA")).toBeInTheDocument();

    const needInput = screen.getByLabelText(/what do you need\?/i);
    expect(needInput).toBeInTheDocument();
    expect(needInput.className).toContain("backdrop-blur-md");
    expect(needInput.className).toContain("bg-white/[0.06]");
    expect(needInput.className).toContain("hover:border-white/40");

    const regionSelect = screen.getByLabelText(/region/i);
    expect(regionSelect).toBeInTheDocument();
    expect(regionSelect.className).toContain("backdrop-blur-md");
    expect(regionSelect.className).toContain("hover:border-white/40");

    const contactInput = screen.getByLabelText(/email or phone/i);
    expect(contactInput).toBeInTheDocument();
    expect(contactInput.className).toContain("backdrop-blur-md");
    expect(contactInput.className).toContain("hover:border-white/40");

    expect(screen.getByText(/attach boq or drawings/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /send request/i })).toBeInTheDocument();

    // Verify glassmorphic container styling
    const formCard = container.firstChild as HTMLElement;
    expect(formCard.className).toContain("backdrop-blur-xl");
    expect(formCard.className).toContain("bg-zinc-950/70");
  });

  it("updates field values when typed into", () => {
    render(<HeroProjectForm />);

    const needInput = screen.getByLabelText(/what do you need\?/i) as HTMLTextAreaElement;
    fireEvent.change(needInput, { target: { value: "50,000 sqm HDPE Geomembrane 2mm" } });
    expect(needInput.value).toBe("50,000 sqm HDPE Geomembrane 2mm");

    const contactInput = screen.getByLabelText(/email or phone/i) as HTMLInputElement;
    fireEvent.change(contactInput, { target: { value: "lead@miningcompany.africa" } });
    expect(contactInput.value).toBe("lead@miningcompany.africa");
  });
});
