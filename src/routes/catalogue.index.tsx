import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { Search, SlidersHorizontal, Loader2, Package, X } from "lucide-react";
import { PageHero } from "@/components/site/PageHero";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
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

const SORT_OPTIONS = [
  { value: "relevant", label: "Relevant" },
  { value: "newest", label: "Newest" },
  { value: "oldest", label: "Oldest" },
  { value: "name_asc", label: "Name: A → Z" },
  { value: "name_desc", label: "Name: Z → A" },
  { value: "price_asc", label: "Price: Low → High" },
  { value: "price_desc", label: "Price: High → Low" },
] as const;

type SortValue = (typeof SORT_OPTIONS)[number]["value"];

const VALID_SORTS = new Set<string>(SORT_OPTIONS.map((s) => s.value));

interface CatalogueSearch {
  q: string;
  cats: string[];
  mans: string[];
  sort: SortValue;
}

function parseList(v: unknown): string[] {
  if (Array.isArray(v)) return v.filter((x): x is string => typeof x === "string" && x.length > 0);
  if (typeof v === "string" && v.length > 0) return v.split(",").filter(Boolean);
  return [];
}

export const Route = createFileRoute("/catalogue/")({
  validateSearch: (raw: Record<string, unknown>): CatalogueSearch => {
    const sort = typeof raw.sort === "string" && VALID_SORTS.has(raw.sort) ? (raw.sort as SortValue) : "relevant";
    return {
      q: typeof raw.q === "string" ? raw.q : "",
      cats: parseList(raw.cats),
      mans: parseList(raw.mans),
      sort,
    };
  },
  head: () => ({
    meta: [
      { title: "Catalogue — Geosynthetics Africa" },
      { name: "description", content: "Search and filter our full catalogue of engineered geosynthetic materials by category, manufacturer and technical specification." },
      { property: "og:title", content: "Catalogue — Geosynthetics Africa" },
    ],
  }),
  component: CataloguePage,
});

const PAGE_SIZE = 6;

interface CatalogueProduct {
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

interface FilterOption {
  id: string;
  name: string;
}

function formatZAR(n: number) {
  return new Intl.NumberFormat("en-ZA", { style: "currency", currency: "ZAR", maximumFractionDigits: 0 }).format(n);
}

function CataloguePage() {
  const search = Route.useSearch();
  const navigate = useNavigate({ from: Route.fullPath });
  const { isAuthenticated } = useAuth();

  const selectedCats = search.cats;
  const selectedMans = search.mans;
  const sort = search.sort;
  const q = search.q;

  const [products, setProducts] = useState<CatalogueProduct[]>([]);
  const [categories, setCategories] = useState<FilterOption[]>([]);
  const [manufacturers, setManufacturers] = useState<FilterOption[]>([]);
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

  // Load filter options once
  useEffect(() => {
    void (async () => {
      const [c, m] = await Promise.all([
        supabase.from("product_categories").select("id, name").order("name"),
        supabase.from("manufacturers").select("id, name").order("name"),
      ]);
      setCategories((c.data ?? []) as FilterOption[]);
      setManufacturers((m.data ?? []) as FilterOption[]);
    })();
  }, []);

  // Debounce search input -> URL
  useEffect(() => {
    const t = setTimeout(() => {
      const trimmed = searchInput.trim();
      if (trimmed === q) return;
      void navigate({
        search: (prev: Record<string, unknown>) => (({
          ...prev,
          q: trimmed || undefined
        }) as never),
        replace: true,
      });
    }, 300);
    return () => clearTimeout(t);
  }, [searchInput, q, navigate]);

  const updateSearch = useCallback(
    (patch: Partial<CatalogueSearch>) => {
      void navigate({
        search: (prev: Record<string, unknown>) => {
          const next: Record<string, unknown> = { ...prev, ...patch };
          // Strip empties so URL stays clean
          if (!next.q) delete next.q;
          if (Array.isArray(next.cats) && next.cats.length === 0) delete next.cats;
          if (Array.isArray(next.mans) && next.mans.length === 0) delete next.mans;
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
      // users at the database layer, so prices never reach the browser,
      // Google, or scrapers when no one is logged in.
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
      if (selectedCats.length > 0) query = query.in("category_id", selectedCats);
      if (selectedMans.length > 0) query = query.in("manufacturer_id", selectedMans);

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
    [q, selectedCats, selectedMans, sort],
  );

  // Reset and reload when filters/sort change
  useEffect(() => {
    setPage(0);
    setHasMore(true);
    void fetchPage(0, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q, sort, selectedCats.join(","), selectedMans.join(",")]);

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
  const toggleMan = (id: string) => {
    const next = selectedMans.includes(id)
      ? selectedMans.filter((x: string) => x !== id)
      : [...selectedMans, id];
    updateSearch({ mans: next });
  };

  const clearAll = () => {
    setSearchInput("");
    updateSearch({ q: "", cats: [], mans: [] });
  };

  const activeFilterCount = selectedCats.length + selectedMans.length + (q ? 1 : 0);

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
                className="pl-10 h-12"
              />
            </div>
            <Button type="submit" size="lg" className="bg-primary hover:bg-primary-hover uppercase font-bold tracking-wide">
              Search
            </Button>
          </form>
        </div>

        <div className="container-page pb-20 grid lg:grid-cols-12 gap-8">
          <aside className="lg:col-span-3">
            <div className="rounded border border-border bg-card p-5 lg:sticky lg:top-24">
              <div className="flex items-center gap-2 mb-4">
                <SlidersHorizontal className="h-4 w-4 text-primary" />
                <h3 className="font-display text-sm font-bold uppercase">Filters</h3>
                {activeFilterCount > 0 && (
                  <button
                    type="button"
                    onClick={clearAll}
                    className="ml-auto text-xs text-muted-foreground hover:text-primary inline-flex items-center gap-1"
                  >
                    <X className="h-3 w-3" /> Clear ({activeFilterCount})
                  </button>
                )}
              </div>

              <FilterGroup
                title="Category"
                options={categories}
                selected={new Set(selectedCats)}
                onToggle={toggleCat}
              />

              <div className="my-5 border-t border-border" />

              <FilterGroup
                title="Manufacturer"
                options={manufacturers}
                selected={new Set(selectedMans)}
                onToggle={toggleMan}
              />
            </div>
          </aside>

          <div className="lg:col-span-9">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
              <div className="text-xs text-muted-foreground">
                {initialLoad ? "Loading…" : `Showing ${products.length} product${products.length === 1 ? "" : "s"}`}
              </div>
              <div className="flex items-center gap-2">
                <label className="text-xs uppercase tracking-wider text-muted-foreground">
                  Sort by
                </label>
                <Select
                  value={sort}
                  onValueChange={(v) => updateSearch({ sort: v as SortValue })}
                >
                  <SelectTrigger className="h-9 w-[200px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {SORT_OPTIONS.filter(
                      (o) => isAuthenticated || (o.value !== "price_asc" && o.value !== "price_desc"),
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
  title,
  options,
  selected,
  onToggle,
}: {
  title: string;
  options: FilterOption[];
  selected: Set<string>;
  onToggle: (id: string) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const visible = expanded ? options : options.slice(0, 8);
  return (
    <div>
      <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
        {title}
      </div>
      {options.length === 0 ? (
        <div className="text-xs text-muted-foreground italic">None available</div>
      ) : (
        <ul className="space-y-1.5 text-sm">
          {visible.map((o) => (
            <li key={o.id}>
              <label className="flex items-center gap-2 cursor-pointer hover:text-primary">
                <input
                  type="checkbox"
                  className="rounded border-border"
                  checked={selected.has(o.id)}
                  onChange={() => onToggle(o.id)}
                />
                <span>{o.name}</span>
              </label>
            </li>
          ))}
        </ul>
      )}
      {options.length > 8 && (
        <button
          type="button"
          onClick={() => setExpanded((s) => !s)}
          className="mt-2 text-xs text-primary hover:underline"
        >
          {expanded ? "Show less" : `Show ${options.length - 8} more`}
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
      search={{ q: "", cats: [], mans: [], sort: "newest" }}
      className="group rounded border border-border bg-card overflow-hidden hover:border-primary transition flex flex-col"
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
          <Badge className="absolute top-2 left-2 bg-primary text-primary-foreground">Sale</Badge>
        )}
        {!inStock && (
          <Badge variant="secondary" className="absolute top-2 right-2">
            Out of stock
          </Badge>
        )}
      </div>
      <div className="p-4 flex flex-col gap-2 flex-1">
        <div className="flex items-center gap-2 text-[10px] uppercase tracking-wider text-muted-foreground">
          {p.product_categories?.name && <span>{p.product_categories.name}</span>}
          {p.manufacturers?.name && (
            <>
              <span>•</span>
              <span>{p.manufacturers.name}</span>
            </>
          )}
        </div>
        <h3 className="font-display text-sm font-bold uppercase leading-tight line-clamp-2">
          {p.name}
        </h3>
        {p.short_description && (
          <p className="text-xs text-muted-foreground line-clamp-2">{p.short_description}</p>
        )}
        {p.sku && <div className="text-[10px] text-muted-foreground mt-auto">SKU: {p.sku}</div>}
        {isAuthenticated ? (
          (p.price !== null || p.sale_price !== null) && (
            <div className="flex items-baseline gap-2 mt-1">
              {onSale ? (
                <>
                  <span className="font-bold text-primary">{formatZAR(p.sale_price!)}</span>
                  <span className="text-xs text-muted-foreground line-through">
                    {formatZAR(p.price!)}
                  </span>
                </>
              ) : (
                p.price !== null && (
                  <span className="font-bold text-foreground">{formatZAR(p.price)}</span>
                )
              )}
            </div>
          )
        ) : (
          <div className="mt-1 text-[11px] uppercase tracking-wider text-muted-foreground">
            <Link to="/login" className="text-primary font-bold hover:underline">Sign in</Link> to view pricing
          </div>
        )}
      </div>
    </Link>
  );
}
