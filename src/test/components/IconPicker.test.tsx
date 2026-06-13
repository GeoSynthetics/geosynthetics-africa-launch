import "../setup";
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { IconPicker } from "@/components/admin/IconPicker";
import * as React from "react";

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
});
