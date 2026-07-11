import { createFileRoute } from "@tanstack/react-router";
import { CataloguePage } from "@/pages/CataloguePage";

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
  sort: SortValue;
}

function parseList(v: unknown): string[] {
  if (Array.isArray(v)) return v.filter((x): x is string => typeof x === "string" && x.length > 0);
  if (typeof v === "string" && v.length > 0) return v.split(",").filter(Boolean);
  return [];
}

export const Route = createFileRoute("/catalogue/")({
  validateSearch: (raw: Record<string, unknown>): CatalogueSearch => {
    const sort =
      typeof raw.sort === "string" && VALID_SORTS.has(raw.sort)
        ? (raw.sort as SortValue)
        : "relevant";
    return {
      q: typeof raw.q === "string" ? raw.q : "",
      cats: parseList(raw.cats),
      sort,
    };
  },
  head: () => ({
    meta: [
      { title: "Catalogue — Geosynthetics Africa" },
      {
        name: "description",
        content:
          "Search and filter our full catalogue of engineered geosynthetic materials by category and technical specification.",
      },
      { property: "og:title", content: "Catalogue — Geosynthetics Africa" },
    ],
  }),
  component: () => {
    const search = Route.useSearch();
    return <CataloguePage search={search} />;
  },
});
