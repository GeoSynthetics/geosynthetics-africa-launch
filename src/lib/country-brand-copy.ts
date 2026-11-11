/** Retire the legacy geotextile brand in country copy without changing existing URLs or identifiers. */
export function countryBrandCopy<T>(value: T): T {
  if (typeof value === "string")
    return value
      .replace(/\bBidim(?:®|™)?/gi, "MIRAFI®")
      .replace(
        "DRC Congo Geosynthetics — MIRAFI® HDPE Geomembranes Supplier",
        "DRC Geosynthetics — HDPE Liners & MIRAFI® Geotextiles",
      ) as T;
  if (Array.isArray(value)) return value.map(countryBrandCopy) as T;
  if (value && typeof value === "object")
    return Object.fromEntries(
      Object.entries(value).map(([key, item]) => [
        key,
        /(?:url|slug|image|icon|email|phone|telephone|id)/i.test(key)
          ? item
          : countryBrandCopy(item),
      ]),
    ) as T;
  return value;
}
