import * as React from "react";
import { ChevronsUpDown, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { supabase } from "@/integrations/supabase/client";

export interface ProductData {
  id: string;
  name: string;
  slug: string;
  image_url?: string | null;
  short_description?: string | null;
  thickness_mm?: number | null;
  roll_width_m?: number | null;
  roll_length_m?: number | null;
  product_categories?: { slug: string; name?: string } | null;
}

interface ProductSelectorProps {
  onSelect: (product: ProductData) => void;
  excludeIds?: string[];
}

export function ProductSelector({ onSelect, excludeIds }: ProductSelectorProps) {
  const [open, setOpen] = React.useState(false);
  const [products, setProducts] = React.useState<ProductData[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    async function loadProducts() {
      setLoading(true);
      const { data, error } = await supabase
        .from("products")
        .select(
          "id, name, slug, image_url, short_description, product_categories(slug, name)",
        )
        .order("name");

      if (!error && data) {
        // Map the data correctly to handle the relation
        const mapped: ProductData[] = data.map((d: any) => ({
          ...d,
          product_categories: Array.isArray(d.product_categories)
            ? d.product_categories[0]
            : d.product_categories,
        }));
        setProducts(mapped);
      }
      setLoading(false);
    }

    loadProducts();
  }, []);

  const filteredProducts = React.useMemo(() => {
    if (!excludeIds || excludeIds.length === 0) return products;
    return products.filter((p) => !excludeIds.includes(p.id) && !excludeIds.includes(p.slug));
  }, [products, excludeIds]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between h-8 text-sm bg-surface"
        >
          {loading ? "Loading products..." : "Select product from database..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0" align="start">
        <Command>
          <CommandInput placeholder="Search products..." />
          <CommandList>
            <CommandEmpty>No product found.</CommandEmpty>
            <CommandGroup>
              {filteredProducts.map((product) => (
                <CommandItem
                  key={product.id}
                  value={product.name}
                  onSelect={() => {
                    onSelect(product);
                    setOpen(false);
                  }}
                >
                  <Search className="mr-2 h-4 w-4 opacity-50" />
                  {product.name}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
