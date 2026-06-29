import * as React from "react";
import { AlertTriangle, Loader2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface DeleteConfirmationDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void | Promise<void>;
  title?: string;
  description?: string;
  itemName?: string;
  isLoading?: boolean;
  idPrefix: string;
}

export function DeleteConfirmationDialog({
  isOpen,
  onOpenChange,
  onConfirm,
  title = "Delete Item",
  description = "Are you sure you want to delete this item? This action cannot be undone.",
  itemName,
  isLoading = false,
  idPrefix,
}: DeleteConfirmationDialogProps) {
  const handleConfirm = async (e: React.MouseEvent) => {
    e.preventDefault();
    try {
      await onConfirm();
    } catch (error) {
      console.error("Error during deletion confirmation:", error);
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogContent className="border border-border/80 bg-card/95 backdrop-blur-md max-w-[420px] shadow-2xl sm:rounded-xl overflow-hidden p-6 gap-6">
        <div className="flex gap-4">
          <div className="h-10 w-10 rounded-full bg-destructive/10 border border-destructive/25 flex items-center justify-center shrink-0 text-destructive animate-pulse">
            <AlertTriangle className="h-5 w-5" />
          </div>
          <div className="flex-1 space-y-1">
            <AlertDialogTitle className="font-display font-bold uppercase tracking-tight text-foreground text-base leading-none">
              {title}
            </AlertDialogTitle>
            <AlertDialogDescription className="text-xs text-muted-foreground/90 leading-relaxed pt-1.5">
              {description}
              {itemName && (
                <span className="block mt-2 font-mono text-[11px] font-semibold text-destructive bg-destructive/5 border border-destructive/10 px-2 py-1.5 rounded truncate">
                  {itemName}
                </span>
              )}
            </AlertDialogDescription>
          </div>
        </div>
        <AlertDialogFooter className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2.5 sm:gap-2 mt-2">
          <AlertDialogCancel
            id={`${idPrefix}-cancel`}
            disabled={isLoading}
            className="flex-1 sm:flex-none uppercase font-bold tracking-wider text-[10px] h-9 border-border hover:bg-muted hover:text-foreground cursor-pointer transition-all"
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            id={`${idPrefix}-confirm`}
            disabled={isLoading}
            onClick={handleConfirm}
            className={cn(
              buttonVariants({ variant: "destructive" }),
              "flex-1 sm:flex-none uppercase font-bold tracking-wider text-[10px] h-9 bg-destructive hover:bg-destructive/90 text-white cursor-pointer border-0 transition-all gap-1.5",
            )}
          >
            {isLoading && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
            {isLoading ? "Deleting…" : "Confirm Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
