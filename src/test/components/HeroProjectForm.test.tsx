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
      targetEmail: "sales@geosyntheticsafrica.com",
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

    const emailInput = screen.getByLabelText(/^email$/i);
    const phoneInput = screen.getByLabelText(/^phone$/i);
    expect(emailInput).toHaveAttribute("type", "email");
    expect(phoneInput).toHaveAttribute("type", "tel");
    expect(emailInput.className).toContain("backdrop-blur-md");
    expect(phoneInput.className).toContain("hover:border-white/40");

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

    const emailInput = screen.getByLabelText(/^email$/i) as HTMLInputElement;
    fireEvent.change(emailInput, { target: { value: "lead@miningcompany.africa" } });
    expect(emailInput.value).toBe("lead@miningcompany.africa");

    const phoneInput = screen.getByLabelText(/^phone$/i) as HTMLInputElement;
    fireEvent.change(phoneInput, { target: { value: "+243 970 000 000" } });
    expect(phoneInput.value).toBe("+243 970 000 000");

    const regionSelect = screen.getByLabelText(/region/i) as HTMLSelectElement;
    expect(screen.getByRole("option", { name: "Southern Africa" })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "West Africa" })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "East Africa" })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "North Africa" })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "Other" })).toBeInTheDocument();
    expect(screen.queryByRole("option", { name: "Central Africa" })).not.toBeInTheDocument();

    fireEvent.change(regionSelect, { target: { value: "Southern Africa" } });
    expect(regionSelect.value).toBe("Southern Africa");
  });
});
