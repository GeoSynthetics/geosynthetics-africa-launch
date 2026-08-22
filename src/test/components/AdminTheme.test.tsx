import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { AdminThemeProvider, useAdminTheme } from "@/components/admin/AdminThemeProvider";
import { AdminFloatingThemeToggle } from "@/components/admin/AdminFloatingThemeToggle";

function TestConsumer() {
  const { theme, toggleTheme } = useAdminTheme();
  return (
    <div>
      <span data-testid="current-theme">{theme}</span>
      <button onClick={toggleTheme} data-testid="toggle-btn">
        Toggle
      </button>
    </div>
  );
}

describe("Admin Theme System", () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.classList.remove("dark");
    vi.clearAllMocks();
  });

  it("should default to dark theme and apply .dark class to root element", () => {
    render(
      <AdminThemeProvider>
        <TestConsumer />
      </AdminThemeProvider>,
    );

    expect(screen.getByTestId("current-theme").textContent).toBe("dark");
    expect(document.documentElement.classList.contains("dark")).toBe(true);
  });

  it("should restore theme from localStorage if available", () => {
    localStorage.setItem("gsa-admin-theme", "light");

    render(
      <AdminThemeProvider>
        <TestConsumer />
      </AdminThemeProvider>,
    );

    expect(screen.getByTestId("current-theme").textContent).toBe("light");
    expect(document.documentElement.classList.contains("dark")).toBe(false);
  });

  it("should toggle theme and persist to localStorage when toggleTheme is invoked", () => {
    render(
      <AdminThemeProvider>
        <TestConsumer />
      </AdminThemeProvider>,
    );

    const btn = screen.getByTestId("toggle-btn");
    fireEvent.click(btn);

    expect(screen.getByTestId("current-theme").textContent).toBe("light");
    expect(localStorage.getItem("gsa-admin-theme")).toBe("light");
    expect(document.documentElement.classList.contains("dark")).toBe(false);

    fireEvent.click(btn);
    expect(screen.getByTestId("current-theme").textContent).toBe("dark");
    expect(localStorage.getItem("gsa-admin-theme")).toBe("dark");
    expect(document.documentElement.classList.contains("dark")).toBe(true);
  });

  it("should render AdminFloatingThemeToggle and toggle mode on click", () => {
    render(
      <AdminThemeProvider>
        <AdminFloatingThemeToggle />
      </AdminThemeProvider>,
    );

    const toggleButton = screen.getByRole("button");
    expect(toggleButton).toBeTruthy();
    expect(toggleButton.getAttribute("aria-label")).toContain("light");

    fireEvent.click(toggleButton);
    expect(toggleButton.getAttribute("aria-label")).toContain("dark");
    expect(localStorage.getItem("gsa-admin-theme")).toBe("light");
  });
});
