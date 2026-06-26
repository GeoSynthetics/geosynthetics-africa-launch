import * as React from "react";
import { ArrowUp, ArrowDown, X, Loader2, Save, Layers, ArrowLeftRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ProductSelector, type ProductData } from "./ProductSelector";
import { toast } from "sonner";

interface AlternativeProductsEditorProps {
  productId: string;
  productName: string;
  currentAlternativeIds: string[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function AlternativeProductsEditor({
  productId,
  productName,
  currentAlternativeIds,
  open,
  onOpenChange,
  onSuccess,
}: AlternativeProductsEditorProps) {
  const [selectedProducts, setSelectedProducts] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [saving, setSaving] = React.useState(false);

  React.useEffect(() => {
    if (!open) return;

    async function loadSelectedProducts() {
      if (!currentAlternativeIds || currentAlternativeIds.length === 0) {
        setSelectedProducts([]);
        return;
      }

      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("products")
          .select("id, name, slug, image_url, product_categories(name)")
          .in("id", currentAlternativeIds);

        if (error) throw error;

        if (data) {
          const mapped = data.map((d: any) => ({
            ...d,
            product_categories: Array.isArray(d.product_categories)
              ? d.product_categories[0]
              : d.product_categories,
          }));

          // Maintain the exact ordering saved in alternative_ids
          const ordered = [...mapped].sort((a, b) => {
            return currentAlternativeIds.indexOf(a.id) - currentAlternativeIds.indexOf(b.id);
          });

          setSelectedProducts(ordered);
        }
      } catch (err: any) {
        toast.error("Failed to load alternative products: " + err.message);
      } finally {
        setLoading(false);
      }
    }

    loadSelectedProducts();
  }, [open, currentAlternativeIds]);

  const handleAddProduct = (prod: ProductData) => {
    setSelectedProducts((prev) => {
      if (prev.some((p) => p.id === prod.id)) return prev;
      return [
        ...prev,
        {
          id: prod.id,
          name: prod.name,
          slug: prod.slug,
          image_url: prod.image_url,
          product_categories: prod.product_categories,
        },
      ];
    });
    toast.success(`Added ${prod.name} to alternatives list.`);
  };

  const handleRemoveProduct = (id: string) => {
    setSelectedProducts((prev) => prev.filter((p) => p.id !== id));
  };

  const handleMoveProduct = (index: number, direction: "up" | "down") => {
    setSelectedProducts((prev) => {
      const next = [...prev];
      const targetIndex = direction === "up" ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= next.length) return prev;
      const temp = next[index];
      next[index] = next[targetIndex];
      next[targetIndex] = temp;
      return next;
    });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const ids = selectedProducts.map((p) => p.id);
      const { error } = await supabase
        .from("products")
        .update({ alternative_ids: ids })
        .eq("id", productId);

      if (error) throw error;

      toast.success("Alternative products updated successfully!");
      onSuccess();
      onOpenChange(false);
    } catch (err: any) {
      toast.error(err.message || "Failed to save alternative products.");
    } finally {
      setSaving(false);
    }
  };

  const excludeIds = React.useMemo(() => {
    return [productId, ...selectedProducts.map((p) => p.id)];
  }, [productId, selectedProducts]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl w-[calc(100vw-2rem)] max-h-[85vh] flex flex-col p-6 overflow-hidden bg-card border border-border shadow-xl rounded-xl">
        <DialogHeader className="shrink-0 pb-4 border-b border-border/60">
          <div className="flex items-center gap-2 text-primary mb-1">
            <ArrowLeftRight className="h-5 w-5" />
            <DialogTitle className="font-display font-bold uppercase tracking-tight text-lg">
              Manage Alternative Products
            </DialogTitle>
          </div>
          <DialogDescription className="text-xs text-muted-foreground leading-normal">
            Configure the alternative solutions displayed on the public page for{" "}
            <strong>{productName}</strong>. If no custom alternatives are specified, fallback
            category products will be loaded dynamically.
          </DialogDescription>
        </DialogHeader>

        {/* List & Selection Body */}
        <div className="flex-1 overflow-y-auto py-5 space-y-5 pr-1">
          {/* Product Picker */}
          <div className="bg-surface/50 border border-border rounded-xl p-4 space-y-3.5 shadow-sm">
            <div className="flex items-center justify-between">
              <label className="text-[10px] font-bold uppercase tracking-wider text-primary">
                🔍 Search & Add Alternatives
              </label>
              <span className="text-[10px] text-muted-foreground">
                Current count: {selectedProducts.length} selected
              </span>
            </div>
            <ProductSelector onSelect={handleAddProduct} excludeIds={excludeIds} />
          </div>

          {/* Current Alternatives List */}
          <div className="space-y-3">
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
              Selected Alternatives (Sorted Order)
            </h4>

            {loading ? (
              <div className="flex flex-col items-center justify-center py-10 space-y-2 border border-dashed border-border rounded-xl bg-surface/20">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
                <span className="text-xs text-muted-foreground">Loading products...</span>
              </div>
            ) : selectedProducts.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 px-6 text-center border border-dashed border-border rounded-xl bg-surface/30 space-y-3">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <ArrowLeftRight className="h-5 w-5" />
                </div>
                <div className="space-y-1">
                  <h5 className="text-xs font-bold uppercase text-foreground">
                    No Specific Alternatives Selected
                  </h5>
                  <p className="text-[11px] text-muted-foreground max-w-sm leading-normal">
                    This product currently displays automatic category products as a fallback. Use
                    the picker above to specify custom alternatives.
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-2.5">
                {selectedProducts.map((prod, index) => {
                  return (
                    <div
                      key={prod.id}
                      className="flex items-center gap-3 p-3 rounded-xl border border-border bg-surface/60 hover:bg-surface transition-all duration-200 shadow-sm relative group"
                    >
                      {/* Image Thumbnail */}
                      <div className="h-12 w-12 shrink-0 rounded-lg bg-surface border border-border flex items-center justify-center text-primary overflow-hidden">
                        {prod.image_url ? (
                          <img
                            src={prod.image_url}
                            alt={prod.name}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <Layers className="h-5 w-5 opacity-40" />
                        )}
                      </div>

                      {/* Details */}
                      <div className="flex-1 min-w-0 pr-16">
                        <div className="text-xs font-bold leading-snug text-foreground truncate">
                          {prod.name}
                        </div>
                        <div className="text-[10px] text-muted-foreground mt-0.5 font-medium uppercase tracking-wide">
                          {prod.product_categories?.name || "Containment Solution"}
                        </div>
                      </div>

                      {/* Admin Actions */}
                      <div className="flex items-center gap-1.5 shrink-0">
                        {/* Move Up */}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 rounded-lg border border-border bg-card/65 text-muted-foreground hover:text-foreground"
                          disabled={index === 0}
                          onClick={() => handleMoveProduct(index, "up")}
                          title="Move Up"
                        >
                          <ArrowUp className="h-3.5 w-3.5" />
                        </Button>

                        {/* Move Down */}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 rounded-lg border border-border bg-card/65 text-muted-foreground hover:text-foreground"
                          disabled={index === selectedProducts.length - 1}
                          onClick={() => handleMoveProduct(index, "down")}
                          title="Move Down"
                        >
                          <ArrowDown className="h-3.5 w-3.5" />
                        </Button>

                        {/* Remove */}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 rounded-lg text-destructive hover:bg-destructive/10 hover:text-destructive transition duration-200"
                          onClick={() => handleRemoveProduct(prod.id)}
                          title="Remove Alternative"
                        >
                          <X className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Footer actions */}
        <DialogFooter className="shrink-0 pt-4 border-t border-border/60">
          <Button
            variant="outline"
            className="text-xs font-bold uppercase tracking-wider"
            onClick={() => onOpenChange(false)}
            disabled={saving}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={saving || loading}
            className="bg-primary hover:bg-primary-hover text-white text-xs font-bold uppercase tracking-wider min-w-[120px]"
          >
            {saving ? (
              <>
                <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" /> Saving...
              </>
            ) : (
              <>
                <Save className="mr-1.5 h-3.5 w-3.5" /> Save Changes
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
