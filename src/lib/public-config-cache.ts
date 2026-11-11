/** Only content already used by public pages may enter the shared CDN cache. */
export const PUBLIC_CONFIG_KEYS = new Set([
  "hierarchy_products",
  "hierarchy_applications",
  "hierarchy_services",
  "hierarchy_industries",
  "template_product_categories",
  "template_applications",
  "template_services",
  "template_industries",
  "template_countries",
  "template_company_pages",
  "seo_pages",
  "homepage_content",
  "footer_content",
  "about_page_content",
  "contacts_page_content",
  "regional_coverage",
  "projects_landing_content",
  "qa_landing_content",
  "catalogue_page_content",
]);

/** Validate the small subset of PostgREST used to read public page configuration. */
export function publicConfigQuery(search: URLSearchParams): URLSearchParams | null {
  if ([...search.keys()].some((key) => !["select", "key", "_single"].includes(key))) return null;
  if (["select", "key", "_single"].some((key) => search.getAll(key).length > 1)) return null;
  const select = search.get("select");
  if (select !== "value" && select !== "key,value") return null;
  const filter = search.get("key") || "";
  const keys = filter.startsWith("eq.")
    ? [filter.slice(3)]
    : /^in\.\([a-z_,]+\)$/.test(filter)
      ? filter.slice(4, -1).split(",")
      : [];
  if (!keys.length || keys.length > 20 || keys.some((key) => !PUBLIC_CONFIG_KEYS.has(key)))
    return null;
  const single = search.get("_single");
  if (single && single !== "1") return null;
  const result = new URLSearchParams({ select, key: filter });
  if (single) result.set("_single", single);
  return result;
}

/** Authenticated requests, edits, and all non-configuration reads stay on their original path. */
export function publicConfigRequest(
  input: RequestInfo | URL,
  init: RequestInit | undefined,
  backendUrl: string,
  publicKey: string,
): string | null {
  const url = new URL(
    typeof input === "string" ? input : input instanceof URL ? input.href : input.url,
  );
  if (url.origin !== new URL(backendUrl).origin || url.pathname !== "/rest/v1/site_config")
    return null;
  const method = (init?.method || (input instanceof Request ? input.method : "GET")).toUpperCase();
  if (method !== "GET" || init?.signal?.aborted) return null;
  const headers = new Headers(input instanceof Request ? input.headers : undefined);
  new Headers(init?.headers).forEach((value, key) => headers.set(key, value));
  const auth = headers.get("authorization");
  if (auth && auth !== `Bearer ${publicKey}`) return null;
  if (headers.get("accept")?.includes("vnd.pgrst.object")) url.searchParams.set("_single", "1");
  const query = publicConfigQuery(url.searchParams);
  return query ? `/api/public-config?${query}` : null;
}

/** Reuse/deduplicate large template reads between routes, bounded to one minute. */
export function createPublicConfigCache(fetcher: typeof fetch, now = Date.now) {
  const entries = new Map<string, { expires: number; response: Promise<Response> }>();
  return async (url: string): Promise<Response> => {
    let entry = entries.get(url);
    if (!entry || entry.expires <= now()) {
      const response = fetcher(url, { credentials: "omit" });
      entry = { expires: now() + 60_000, response };
      entries.set(url, entry);
      // A failed read is never retained as public content.
      response.then(
        (result) => {
          if (!result.ok && entries.get(url)?.response === response) entries.delete(url);
        },
        () => {
          if (entries.get(url)?.response === response) entries.delete(url);
        },
      );
      if (entries.size > 30) entries.delete(entries.keys().next().value!);
    }
    return (await entry.response).clone();
  };
}
