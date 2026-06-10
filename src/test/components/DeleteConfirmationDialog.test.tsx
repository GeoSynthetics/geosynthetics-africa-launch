import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { DeleteConfirmationDialog } from "@/components/ui/delete-confirmation-dialog";

describe("DeleteConfirmationDialog Component", () => {
  it("renders correct title, description, and item name when open", () => {
    const onOpenChange = vi.fn();
    const onConfirm = vi.fn();

    render(
      <DeleteConfirmationDialog
        isOpen={true}
        onOpenChange={onOpenChange}
        onConfirm={onConfirm}
        title="Delete Test Item"
        description="Are you sure you want to delete this test item?"
        itemName="Test Item 123"
        idPrefix="test-delete"
      />
    );

    // Verify Title
    expect(screen.getByText("Delete Test Item")).toBeInTheDocument();

    // Verify Description
    expect(
      screen.getByText("Are you sure you want to delete this test item?")
    ).toBeInTheDocument();

    // Verify Item Name
    expect(screen.getByText("Test Item 123")).toBeInTheDocument();

    // Verify Confirm Button and Cancel Button are present by ID
    const cancelBtn = screen.getByRole("button", { name: /cancel/i });
    const confirmBtn = screen.getByRole("button", { name: /confirm delete/i });

    expect(cancelBtn).toBeInTheDocument();
    expect(confirmBtn).toBeInTheDocument();
    expect(cancelBtn.id).toBe("test-delete-cancel");
    expect(confirmBtn.id).toBe("test-delete-confirm");
  });

  it("does not render when closed", () => {
    const onOpenChange = vi.fn();
    const onConfirm = vi.fn();

    render(
      <DeleteConfirmationDialog
        isOpen={false}
        onOpenChange={onOpenChange}
        onConfirm={onConfirm}
        title="Delete Test Item"
        idPrefix="test-delete"
      />
    );

    expect(screen.queryByText("Delete Test Item")).not.toBeInTheDocument();
  });

  it("calls onConfirm when confirm button is clicked", () => {
    const onOpenChange = vi.fn();
    const onConfirm = vi.fn();

    render(
      <DeleteConfirmationDialog
        isOpen={true}
        onOpenChange={onOpenChange}
        onConfirm={onConfirm}
        title="Delete Test Item"
        idPrefix="test-delete"
      />
    );

    const confirmBtn = screen.getByRole("button", { name: /confirm delete/i });
    fireEvent.click(confirmBtn);

    expect(onConfirm).toHaveBeenCalledTimes(1);
  });

  it("shows loading text and disables buttons when isLoading is true", () => {
    const onOpenChange = vi.fn();
    const onConfirm = vi.fn();

    render(
      <DeleteConfirmationDialog
        isOpen={true}
        onOpenChange={onOpenChange}
        onConfirm={onConfirm}
        title="Delete Test Item"
        isLoading={true}
        idPrefix="test-delete"
      />
    );

    const cancelBtn = screen.getByRole("button", { name: /cancel/i });
    const confirmBtn = screen.getByRole("button", { name: /deleting/i });

    expect(cancelBtn).toBeDisabled();
    expect(confirmBtn).toBeDisabled();
    expect(screen.getByText("Deleting…")).toBeInTheDocument();
  });
});
