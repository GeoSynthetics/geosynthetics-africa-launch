import "../setup";
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, waitFor, act } from "@testing-library/react";
import { IconPicker } from "@/components/admin/IconPicker";

describe("IconPicker Component", () => {
  it("renders trigger button with placeholder when no value is provided", () => {
    const onChange = vi.fn();
    render(<IconPicker value="" onChange={onChange} placeholder="Choose an icon" />);

    const button = screen.getByRole("combobox");
    expect(button).toBeInTheDocument();
    expect(screen.getByText("Choose an icon")).toBeInTheDocument();
  });

  it("renders trigger button with selected icon name", () => {
    const onChange = vi.fn();
    render(<IconPicker value="Shield" onChange={onChange} />);

    expect(screen.getByText("Shield")).toBeInTheDocument();
  });

  it("calls onChange with empty string when clear button is clicked", () => {
    const onChange = vi.fn();
    render(<IconPicker value="Shield" onChange={onChange} />);

    const clearBtn = screen.getByTitle("Clear icon");
    expect(clearBtn).toBeInTheDocument();

    fireEvent.click(clearBtn);
    expect(onChange).toHaveBeenCalledWith("");
  });

  it("opens popover on click and shows search input and icons list", async () => {
    const onChange = vi.fn();
    render(<IconPicker value="" onChange={onChange} />);

    const button = screen.getByRole("combobox");
    fireEvent.click(button);

    const searchInput = screen.getByPlaceholderText("Search icons...");
    expect(searchInput).toBeInTheDocument();

    const iconButtons = screen.getAllByRole("button");
    expect(iconButtons.length).toBeGreaterThan(1);
  });

  it("shows exactly 100 icons initially", () => {
    const onChange = vi.fn();
    render(<IconPicker value="" onChange={onChange} />);

    const button = screen.getByRole("combobox");
    fireEvent.click(button);

    const statusText = screen.getByText(/100 of \d+ shown/);
    expect(statusText).toBeInTheDocument();
  });

  it("supports fuzzy matching when standard substring search yields no results", () => {
    const onChange = vi.fn();
    render(<IconPicker value="" onChange={onChange} />);

    const button = screen.getByRole("combobox");
    fireEvent.click(button);

    const searchInput = screen.getByPlaceholderText("Search icons...");
    // Type "shld" which is a subsequence of "Shield" but not a substring
    fireEvent.change(searchInput, { target: { value: "shld" } });

    // "Shield" should be displayed in the list
    const shieldIconBtn = screen.getByTitle("Shield");
    expect(shieldIconBtn).toBeInTheDocument();
  });

  it("loads more icons when the IntersectionObserver triggers", async () => {
    const onChange = vi.fn();
    render(<IconPicker value="" onChange={onChange} />);

    const button = screen.getByRole("combobox");
    fireEvent.click(button);

    // Initial limit should be 100
    expect(screen.getByText(/100 of \d+ shown/)).toBeInTheDocument();

    const loadMoreTrigger = screen.getByText("Loading more...");
    expect(loadMoreTrigger).toBeInTheDocument();

    // Wait for the effect to attach the IntersectionObserver
    let observer: any;
    await waitFor(() => {
      observer = (loadMoreTrigger as any)._intersectionObserver;
      expect(observer).toBeDefined();
    });

    // Trigger the callback with isIntersecting: true
    act(() => {
      observer.callback([{ isIntersecting: true }] as any, observer);
    });

    // It should now show 200 items
    await waitFor(() => {
      expect(screen.getByText(/200 of \d+ shown/)).toBeInTheDocument();
    });
  });

  it("saves selected icon to localStorage and displays recently used section", async () => {
    const onChange = vi.fn();
    localStorage.clear();

    // 1. Initial render with empty localStorage: "Recently Used" should not be visible
    const { unmount } = render(<IconPicker value="" onChange={onChange} />);
    const button = screen.getByRole("combobox");
    fireEvent.click(button);
    expect(screen.queryByText("Recently Used")).not.toBeInTheDocument();

    // Select an icon to populate localStorage
    const iconBtn = screen.getByTitle("Activity");
    fireEvent.click(iconBtn);
    expect(onChange).toHaveBeenCalledWith("Activity");

    // Unmount and remount to simulate opening again with stored items
    unmount();

    render(<IconPicker value="" onChange={onChange} />);
    const button2 = screen.getByRole("combobox");
    fireEvent.click(button2);

    // "Recently Used" section should now be visible and contain the selected icon
    await waitFor(() => {
      expect(screen.getByText("Recently Used")).toBeInTheDocument();
    });
    expect(screen.getByTitle("Activity (Recent)")).toBeInTheDocument();
  });
});
