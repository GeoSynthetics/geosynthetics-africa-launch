/** Retire known warehouse stock photographs retained in older CMS records. */
export function productImage(url: string): string;
export function productImage(url: string | undefined): string | undefined;
export function productImage(url: string | undefined): string | undefined {
  return url && /images\.unsplash\.com\/photo-(1494412519320|1586528116311)/i.test(url)
    ? "/images/geotextile-product-supply.webp"
    : url;
}
