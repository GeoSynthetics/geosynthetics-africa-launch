import { Link, useNavigate } from "@tanstack/react-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { Search, SlidersHorizontal, Loader2, Package, X } from "lucide-react";
import { PageHero } from "@/components/site/PageHero";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BoqCtaBand } from "@/components/site/BoqCtaBand";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const PAGE_SIZE = 6;

export const SORT_OPTIONS = [
  { value: "relevant", label: "Relevant" },
  { value: "newest", label: "Newest" },
  { value: "oldest", label: "Oldest" },
  { value: "name_asc", label: "Name: A → Z" },
  { value: "name_desc", label: "Name: Z → A" },
  { value: "price_asc", label: "Price: Low → High" },
  { value: "price_desc", label: "Price: High → Low" },
] as const;

export type SortValue = (typeof SORT_OPTIONS)[number]["value"];

export interface CatalogueProduct {
  id: string;
  name: string;
  slug: string;
  sku: string | null;
  short_description: string | null;
  price: number | null;
  sale_price: number | null;
  stock_quantity: number | null;
  image_url: string | null;
  images: string[] | null;
  category_id: string | null;
  manufacturer_id: string | null;
  product_categories: { id: string; name: string; slug: string | null } | null;
  manufacturers: { id: string; name: string } | null;
}

export interface FilterOption {
  id: string;
  name: string;
  slug?: string | null;
}

export interface CataloguePageProps {
  search: {
    q: string;
    cats: string[];
    sort: SortValue;
  };
}

function formatZAR(n: number) {
  return new Intl.NumberFormat("en-ZA", {
    style: "currency",
    currency: "ZAR",
    maximumFractionDigits: 0,
  }).format(n);
}

export function CataloguePage({ search }: CataloguePageProps) {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const selectedCats = search.cats;
  const sort = search.sort;
  const q = search.q;

  const [products, setProducts] = useState<CatalogueProduct[]>([]);
  const [categories, setCategories] = useState<FilterOption[]>([]);
  const [searchInput, setSearchInput] = useState(q);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const requestIdRef = useRef(0);

  // Keep the input in sync if URL changes externally (back/forward)
  useEffect(() => {
    setSearchInput(q);
  }, [q]);

  // Load filter options once (only product categories)
  useEffect(() => {
    void (async () => {
      const { data } = await supabase
        .from("product_categories")
        .select("id, name, slug")
        .order("name");
      setCategories((data ?? []) as FilterOption[]);
    })();
  }, []);

  // Resolve category slugs in URL to UUIDs dynamically
  useEffect(() => {
    if (categories.length > 0 && selectedCats.length > 0) {
      const hasSlugs = selectedCats.some(
        (cat) =>
          !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(cat),
      );
      if (hasSlugs) {
        const resolvedCats = selectedCats
          .map((cat) => {
            if (
              /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(cat)
            ) {
              return cat;
            }
            const found = categories.find(
              (c) =>
                c.slug === cat ||
                c.name.toLowerCase().replace(/\s+/g, "-") === cat.toLowerCase(),
            );
            return found ? found.id : null;
          })
          .filter((x): x is string => x !== null);

        void navigate({
          to: ".",
          search: (prev: Record<string, unknown>) => ({
            ...prev,
            cats: resolvedCats,
          }),
          replace: true,
        });
      }
    }
  }, [categories, selectedCats, navigate]);

  // Debounce search input -> URL
  useEffect(() => {
    const t = setTimeout(() => {
      const trimmed = searchInput.trim();
      if (trimmed === q) return;
      void navigate({
        to: ".",
        search: (prev: Record<string, unknown>) =>
          ({
            ...prev,
            q: trimmed || undefined,
          }) as never,
        replace: true,
      });
    }, 300);
    return () => clearTimeout(t);
  }, [searchInput, q, navigate]);

  const updateSearch = useCallback(
    (patch: Partial<typeof search>) => {
      void navigate({
        to: ".",
        search: (prev: Record<string, unknown>) => {
          const next: Record<string, unknown> = { ...prev, ...patch };
          // Strip empties so URL stays clean
          if (!next.q) delete next.q;
          if (Array.isArray(next.cats) && next.cats.length === 0) delete next.cats;
          if (next.sort === "relevant") delete next.sort;
          return next as never;
        },
      });
    },
    [navigate],
  );

  const fetchPage = useCallback(
    async (pageIdx: number, reset: boolean) => {
      const reqId = ++requestIdRef.current;
      setLoading(true);
      const from = pageIdx * PAGE_SIZE;
      const to = from + PAGE_SIZE - 1;

      // Use the products_public view: price/sale_price are NULL for anon
      // users at the database layer, so prices never reach the browser.
      let query = supabase
        .from("products_public")
        .select(
          "id, name, slug, sku, short_description, price, sale_price, stock_quantity, image_url, images, category_id, manufacturer_id, product_categories(id, name, slug), manufacturers(id, name)",
          { count: "exact" },
        )
        .eq("is_active", true);

      switch (sort) {
        case "oldest":
          query = query.order("created_at", { ascending: true });
          break;
        case "name_asc":
          query = query.order("name", { ascending: true });
          break;
        case "name_desc":
          query = query.order("name", { ascending: false });
          break;
        case "price_asc":
          query = query.order("price", { ascending: true, nullsFirst: false });
          break;
        case "price_desc":
          query = query.order("price", { ascending: false, nullsFirst: false });
          break;
        case "newest":
          query = query.order("created_at", { ascending: false });
          break;
        case "relevant":
        default:
          // Relevance: in-stock first, then products with imagery, then newest
          query = query
            .order("stock_quantity", { ascending: false, nullsFirst: false })
            .order("image_url", { ascending: false, nullsFirst: false })
            .order("created_at", { ascending: false });
          break;
      }
      // Stable tiebreaker for consistent pagination
      query = query.order("id", { ascending: true }).range(from, to);

      if (q) {
        const escaped = q.replace(/[%,]/g, " ");
        query = query.or(
          `name.ilike.%${escaped}%,short_description.ilike.%${escaped}%,sku.ilike.%${escaped}%`,
        );
      }
      if (selectedCats.length > 0) {
        query = query.in("category_id", selectedCats);
      }

      const { data, error, count } = await query;
      if (reqId !== requestIdRef.current) return;
      if (error) {
        toast.error(error.message);
        setLoading(false);
        setInitialLoad(false);
        return;
      }
      const rows = (data ?? []) as unknown as CatalogueProduct[];
      setProducts((prev) => {
        const merged = reset ? rows : [...prev, ...rows];
        setHasMore(count !== null ? merged.length < count : rows.length === PAGE_SIZE);
        return merged;
      });
      setLoading(false);
      setInitialLoad(false);
    },
    [q, selectedCats, sort],
  );

  // Reset and reload when filters/sort change
  useEffect(() => {
    setPage(0);
    setHasMore(true);
    void fetchPage(0, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q, sort, selectedCats.join(",")]);

  // Infinite scroll observer
  useEffect(() => {
    const node = sentinelRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting && !loading && hasMore) {
          const next = page + 1;
          setPage(next);
          void fetchPage(next, false);
        }
      },
      { rootMargin: "400px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [loading, hasMore, page, fetchPage]);

  const toggleCat = (id: string) => {
    const next = selectedCats.includes(id)
      ? selectedCats.filter((x: string) => x !== id)
      : [...selectedCats, id];
    updateSearch({ cats: next });
  };

  const clearAll = () => {
    setSearchInput("");
    updateSearch({ q: "", cats: [] });
  };

  const activeFilterCount = selectedCats.length + (q ? 1 : 0);

  return (
    <>
      <PageHero
        eyebrow="Catalogue"
        title="Engineered Geosynthetic Materials"
        description="Search and filter our full catalogue of engineered geosynthetic products."
      />
      <section className="bg-background">
        <div className="container-page py-10">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              updateSearch({ q: searchInput.trim() });
            }}
            className="flex gap-2 max-w-3xl"
          >
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search products, SKU, descriptions…"
                className="pl-10 pr-10 h-12 w-full rounded-lg border-2 border-border focus:border-primary focus:ring-0 shadow-sm transition-all bg-card"
              />
              {searchInput && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchInput("");
                    updateSearch({ q: "" });
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-muted-foreground hover:text-foreground rounded-full hover:bg-muted transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
            <Button
              type="submit"
              size="lg"
              className="bg-primary hover:bg-primary-hover uppercase font-bold tracking-wide h-12"
            >
              Search
            </Button>
          </form>

          {!initialLoad && (q || activeFilterCount > 0) && (
            <div className="text-xs text-muted-foreground mt-3 font-medium flex items-center gap-1.5 animate-auth-fade-in">
              <span>Found</span>
              <span className="text-foreground font-bold px-1.5 py-0.5 rounded bg-muted/60">
                {products.length}
              </span>
              <span>material{products.length === 1 ? "" : "s"}</span>
              {q && (
                <>
                  <span>matching</span>
                  <span className="text-foreground font-bold italic">"{q}"</span>
                </>
              )}
            </div>
          )}
        </div>

        <div className="container-page pb-20 grid lg:grid-cols-12 gap-8">
          <aside className="lg:col-span-3">
            <div className="rounded-lg border border-border bg-card p-5 lg:sticky lg:top-24 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <SlidersHorizontal className="h-4 w-4 text-primary" />
                <h3 className="font-display text-sm font-bold uppercase tracking-wider">Filters</h3>
                {activeFilterCount > 0 && (
                  <button
                    type="button"
                    onClick={clearAll}
                    className="ml-auto text-xs text-muted-foreground hover:text-primary inline-flex items-center gap-1 font-semibold transition-colors"
                  >
                    <X className="h-3 w-3" /> Clear ({activeFilterCount})
                  </button>
                )}
              </div>

              <Accordion
                type="multiple"
                defaultValue={["category"]}
                className="w-full space-y-1"
              >
                {/* Category Filter */}
                <AccordionItem value="category" className="border-b-0">
                  <AccordionTrigger className="hover:no-underline py-3 text-xs font-bold uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors">
                    Category
                  </AccordionTrigger>
                  <AccordionContent className="pt-2">
                    <FilterGroup
                      options={categories}
                      selected={new Set(selectedCats)}
                      onToggle={toggleCat}
                      placeholder="Search categories..."
                    />
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </aside>

          <div className="lg:col-span-9">
            {/* Active Filters Bar */}
            {activeFilterCount > 0 && (
              <div className="flex flex-wrap items-center gap-2 mb-6 p-3 rounded-xl bg-surface/50 border border-border animate-auth-fade-in">
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground mr-1">
                  Active Filters:
                </span>

                {q && (
                  <Badge
                    variant="secondary"
                    className="gap-1 py-1 pl-2.5 pr-1.5 text-xs font-normal bg-card hover:bg-card border border-border"
                  >
                    Search: "{q}"
                    <button
                      type="button"
                      onClick={() => {
                        setSearchInput("");
                        updateSearch({ q: "" });
                      }}
                      className="ml-1 rounded-full p-0.5 hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                )}

                {selectedCats.map((catId) => {
                  const catName = categories.find((c) => c.id === catId)?.name || "Category";
                  return (
                    <Badge
                      key={catId}
                      variant="secondary"
                      className="gap-1 py-1 pl-2.5 pr-1.5 text-xs font-normal bg-card hover:bg-card border border-border"
                    >
                      {catName}
                      <button
                        type="button"
                        onClick={() => toggleCat(catId)}
                        className="ml-1 rounded-full p-0.5 hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  );
                })}

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearAll}
                  className="h-7 px-2.5 text-xs font-bold text-primary hover:text-primary-hover uppercase tracking-wider ml-auto bg-transparent hover:bg-muted/50 rounded-lg transition-all"
                >
                  Clear All
                </Button>
              </div>
            )}

            <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
              <div className="text-xs text-muted-foreground">
                {initialLoad
                  ? "Loading…"
                  : `Showing ${products.length} product${products.length === 1 ? "" : "s"}`}
              </div>
              <div className="flex items-center gap-2">
                <label className="text-xs uppercase tracking-wider text-muted-foreground">
                  Sort by
                </label>
                <Select value={sort} onValueChange={(v) => updateSearch({ sort: v as SortValue })}>
                  <SelectTrigger className="h-9 w-[200px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {SORT_OPTIONS.filter(
                      (o) =>
                        isAuthenticated || (o.value !== "price_asc" && o.value !== "price_desc"),
                    ).map((o) => (
                      <SelectItem key={o.value} value={o.value}>
                        {o.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {initialLoad ? (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {Array.from({ length: 6 }).map((_, i) => (
                  <Skeleton key={i} className="aspect-[4/5] rounded" />
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="rounded border border-dashed border-border bg-card p-12 text-center">
                <Package className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                <h3 className="font-display text-lg font-bold uppercase">No products found</h3>
                <p className="text-sm text-muted-foreground mt-2">
                  Try adjusting your search or filters.
                </p>
                {activeFilterCount > 0 && (
                  <Button variant="outline" className="mt-4" onClick={clearAll}>
                    Clear filters
                  </Button>
                )}
              </div>
            ) : (
              <>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {products.map((p) => (
                    <ProductCard key={p.id} p={p} isAuthenticated={isAuthenticated} />
                  ))}
                </div>

                <div ref={sentinelRef} className="h-12" />
                {loading && !initialLoad && (
                  <div className="flex items-center justify-center py-6 text-sm text-muted-foreground">
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" /> Loading more…
                  </div>
                )}
                {!hasMore && products.length > PAGE_SIZE && (
                  <div className="text-center text-xs text-muted-foreground py-6">
                    You've reached the end of the catalogue.
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </section>
      <BoqCtaBand />
    </>
  );
}

function FilterGroup({
  options,
  selected,
  onToggle,
  placeholder,
}: {
  options: FilterOption[];
  selected: Set<string>;
  onToggle: (id: string) => void;
  placeholder?: string;
}) {
  const [expanded, setExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredOptions = options.filter((o) =>
    o.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const visible = expanded ? filteredOptions : filteredOptions.slice(0, 8);

  return (
    <div className="flex flex-col">
      {options.length > 8 && (
        <div className="relative mb-3.5 mt-1">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <Input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={placeholder || "Filter list..."}
            className="pl-8.5 pr-8 h-8.5 text-xs rounded-lg border border-input bg-muted/20 focus:bg-card focus:border-primary focus:ring-0 shadow-none"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 text-muted-foreground hover:text-foreground hover:bg-muted rounded-full transition-colors"
            >
              <X className="h-3 w-3" />
            </button>
          )}
        </div>
      )}

      {filteredOptions.length === 0 ? (
        <div className="text-xs text-muted-foreground italic py-2">
          {searchQuery ? "No matching options" : "None available"}
        </div>
      ) : (
        <ul className="space-y-2 text-sm max-h-[300px] overflow-y-auto pr-1">
          {visible.map((o) => (
            <li key={o.id} className="flex items-center space-x-2.5 py-0.5">
              <Checkbox
                id={`filter-${o.id}`}
                checked={selected.has(o.id)}
                onCheckedChange={() => onToggle(o.id)}
                className="border-border hover:border-primary data-[state=checked]:border-primary transition-colors"
              />
              <label
                htmlFor={`filter-${o.id}`}
                className={cn(
                  "text-sm font-medium leading-none cursor-pointer select-none transition-colors hover:text-primary-hover flex-1",
                  selected.has(o.id) ? "text-foreground font-bold" : "text-muted-foreground",
                )}
              >
                {o.name}
              </label>
            </li>
          ))}
        </ul>
      )}

      {filteredOptions.length > 8 && (
        <button
          type="button"
          onClick={() => setExpanded((s) => !s)}
          className="mt-2 text-xs font-bold text-primary hover:text-primary-hover hover:underline inline-flex items-center w-fit transition-colors py-1"
        >
          {expanded ? "Show less" : `Show ${filteredOptions.length - 8} more`}
        </button>
      )}
    </div>
  );
}

function ProductCard({ p, isAuthenticated }: { p: CatalogueProduct; isAuthenticated: boolean }) {
  const img = p.image_url || p.images?.[0] || null;
  const onSale = p.sale_price !== null && p.price !== null && p.sale_price < p.price;
  const inStock = (p.stock_quantity ?? 0) > 0;
  return (
    <Link
      to="/catalogue/$slug"
      params={{ slug: p.slug }}
      className="group rounded-xl border border-border bg-card overflow-hidden hover:border-primary hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex flex-col"
      aria-label={p.name}
    >
      <div className="aspect-[4/3] overflow-hidden bg-surface relative">
        {img ? (
          <img
            src={img}
            alt={p.name}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="h-full w-full flex items-center justify-center text-muted-foreground">
            <Package className="h-10 w-10" />
          </div>
        )}
        {onSale && (
          <Badge className="absolute top-2.5 left-2.5 bg-primary text-primary-foreground font-bold uppercase tracking-wider text-[10px] shadow-sm">
            Sale
          </Badge>
        )}
        {!inStock && (
          <Badge
            variant="secondary"
            className="absolute top-2.5 right-2.5 font-bold uppercase tracking-wider text-[10px] shadow-sm"
          >
            Out of stock
          </Badge>
        )}
      </div>
      <div className="p-5 flex flex-col gap-2.5 flex-1">
        <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
          {p.product_categories?.name && <span>{p.product_categories.name}</span>}
          {p.manufacturers?.name && (
            <>
              <span className="text-muted-foreground/50">•</span>
              <span>{p.manufacturers.name}</span>
            </>
          )}
        </div>
        <h3 className="font-display text-base font-bold uppercase leading-tight line-clamp-2 group-hover:text-primary transition-colors">
          {p.name}
        </h3>
        {p.short_description && (
          <p className="text-xs text-muted-foreground/80 line-clamp-2 leading-relaxed">
            {p.short_description}
          </p>
        )}
        {p.sku && (
          <div className="text-[10px] text-muted-foreground/60 mt-auto font-mono">SKU: {p.sku}</div>
        )}
        {isAuthenticated ? (
          (p.price !== null || p.sale_price !== null) && (
            <div className="flex items-baseline gap-2 mt-1">
              {onSale ? (
                <>
                  <span className="font-bold text-primary text-base">
                    {formatZAR(p.sale_price!)}
                  </span>
                  <span className="text-xs text-muted-foreground/60 line-through">
                    {formatZAR(p.price!)}
                  </span>
                </>
              ) : (
                p.price !== null && (
                  <span className="font-bold text-foreground text-base">{formatZAR(p.price)}</span>
                )
              )}
            </div>
          )
        ) : (
          <div className="mt-1 text-[10px] font-bold uppercase tracking-wider text-muted-foreground/75">
            <Link to="/login" className="text-primary hover:text-primary-hover hover:underline">
              Sign in
            </Link>{" "}
            to view pricing
          </div>
        )}
      </div>
    </Link>
  );
}
