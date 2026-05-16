import * as React from "react"
import { Check, ChevronsUpDown, Search } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { supabase } from "@/integrations/supabase/client"

export interface ProductData {
  id: string
  name: string
  slug: string
  thickness_mm?: number | null
  roll_width_m?: number | null
  roll_length_m?: number | null
  product_categories?: { slug: string } | null
}

interface ProductSelectorProps {
  onSelect: (product: ProductData) => void
}

export function ProductSelector({ onSelect }: ProductSelectorProps) {
  const [open, setOpen] = React.useState(false)
  const [products, setProducts] = React.useState<ProductData[]>([])
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    async function loadProducts() {
      setLoading(true)
      const { data, error } = await supabase
        .from("products")
        .select("id, name, slug, thickness_mm, roll_width_m, roll_length_m, product_categories(slug)")
        .order("name")

      if (!error && data) {
        // Map the data correctly to handle the relation
        const mapped: ProductData[] = data.map((d: any) => ({
          ...d,
          product_categories: Array.isArray(d.product_categories) ? d.product_categories[0] : d.product_categories
        }))
        setProducts(mapped)
      }
      setLoading(false)
    }

    loadProducts()
  }, [])

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
              {products.map((product) => (
                <CommandItem
                  key={product.id}
                  value={product.name}
                  onSelect={() => {
                    onSelect(product)
                    setOpen(false)
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
  )
}
