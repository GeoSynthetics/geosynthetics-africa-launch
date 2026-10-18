import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { compressImage } from "@/lib/image-utils";
import { SITE_URL } from "@/lib/site-url";
import { baseNameFromUrl, findExternalUrls, replaceExternalUrls } from "@/lib/external-images";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AlertTriangle, CheckCircle2, Loader2, RefreshCw, Search } from "lucide-react";
import { toast } from "sonner";

/** Content tables that can hold image URLs, with the column that identifies each row. */
const SOURCES: { table: string; key: string }[] = [
  { table: "site_config", key: "key" },
  { table: "products", key: "id" },
  { table: "product_categories", key: "id" },
  { table: "manufacturers", key: "id" },
  { table: "case_studies", key: "id" },
  { table: "blog_posts", key: "id" },
  { table: "resources", key: "id" },
];

type Hit = { table: string; key: string; id: string; row: Record<string, unknown>; urls: string[] };
type Result = { url: string; ok: boolean; newUrl?: string; error?: string };

async function scanAll(): Promise<{ hits: Hit[]; urls: string[]; errors: string[] }> {
  const hits: Hit[] = [];
  const all = new Set<string>();
  const errors: string[] = [];
  for (const { table, key } of SOURCES) {
    const { data, error } = await (supabase as any).from(table).select("*");
    if (error) {
      errors.push(`${table}: ${error.message}`);
      continue;
    }
    for (const row of (data || []) as Record<string, unknown>[]) {
      const urls = [...findExternalUrls(row)];
      if (urls.length === 0) continue;
      urls.forEach((u) => all.add(u));
      hits.push({ table, key, id: String(row[key]), row, urls });
    }
  }
  return { hits, urls: [...all], errors };
}

/** Downloads one old-site file through our server and stores it in the Media Center. */
async function copyToMediaCenter(url: string): Promise<string> {
  const response = await fetch(`/api/import-image?url=${encodeURIComponent(url)}`);
  if (!response.ok) throw new Error(`${response.status} ${await response.text()}`);
  const source = await response.blob();

  let blob: Blob = source;
  let ext = (new URL(url).pathname.split(".").pop() || "bin").toLowerCase();
  let contentType = source.type || "application/octet-stream";
  if (source.type.startsWith("image/") && !/svg|gif/.test(source.type)) {
    const comp = await compressImage(
      new File([source], `${baseNameFromUrl(url)}.${ext}`, { type: source.type }),
    );
    blob = comp.blob;
    ext = comp.ext;
    contentType = comp.contentType;
  }

  const fileName = `${baseNameFromUrl(url)}_${crypto.randomUUID().slice(0, 8)}.${ext}`;
  const upload = (bucket: string, path: string) =>
    supabase.storage.from(bucket).upload(path, blob, {
      cacheControl: "31536000",
      upsert: false,
      contentType,
    });

  let bucket = "media-center";
  let path = fileName;
  let { error } = await upload(bucket, path);
  if (error && /bucket/i.test(error.message)) {
    // Same fallback the Media Center uses when the media-center bucket is unavailable
    bucket = "product-images";
    path = `media-center/${fileName}`;
    ({ error } = await upload(bucket, path));
  }
  if (error) throw new Error(error.message);
  return `${SITE_URL}/api/storage/${bucket}/${path}`;
}

/**
 * Admin tool: finds images still loaded from geosynthetics.com, copies them into
 * the Media Center and rewrites every reference to the new copy.
 */
export function ExternalImageMigrator() {
  const [scanning, setScanning] = useState(false);
  const [running, setRunning] = useState(false);
  const [scan, setScan] = useState<Awaited<ReturnType<typeof scanAll>> | null>(null);
  const [progress, setProgress] = useState({ done: 0, total: 0 });
  const [results, setResults] = useState<Result[]>([]);
  const [updatedRows, setUpdatedRows] = useState(0);

  const runScan = async () => {
    setScanning(true);
    setResults([]);
    setUpdatedRows(0);
    try {
      setScan(await scanAll());
    } catch (e: any) {
      toast.error(`Scan failed: ${e?.message || e}`);
    } finally {
      setScanning(false);
    }
  };

  const runImport = async () => {
    if (!scan || scan.urls.length === 0) return;
    setRunning(true);
    setProgress({ done: 0, total: scan.urls.length });
    const replacements = new Map<string, string>();
    const out: Result[] = [];

    for (const url of scan.urls) {
      try {
        const newUrl = await copyToMediaCenter(url);
        replacements.set(url, newUrl);
        out.push({ url, ok: true, newUrl });
      } catch (e: any) {
        out.push({ url, ok: false, error: e?.message || String(e) });
      }
      setProgress((p) => ({ ...p, done: p.done + 1 }));
      setResults([...out]);
    }

    // Rewrite every row that referenced a successfully copied file
    let rows = 0;
    for (const hit of scan.hits) {
      if (!hit.urls.some((u) => replacements.has(u))) continue;
      const changes: Record<string, unknown> = {};
      for (const [column, value] of Object.entries(hit.row)) {
        if (column === hit.key) continue;
        const next = replaceExternalUrls(value, replacements);
        if (JSON.stringify(next) !== JSON.stringify(value)) changes[column] = next;
      }
      if (Object.keys(changes).length === 0) continue;
      const { error } = await (supabase as any)
        .from(hit.table)
        .update(changes)
        .eq(hit.key, hit.row[hit.key]);
      if (error) {
        toast.error(`Could not update ${hit.table} ${hit.id}: ${error.message}`);
      } else {
        rows++;
      }
    }
    setUpdatedRows(rows);
    setRunning(false);

    const failed = out.filter((r) => !r.ok).length;
    if (failed === 0) toast.success(`Moved ${out.length} files and updated ${rows} records.`);
    else
      toast.warning(
        `Moved ${out.length - failed} files; ${failed} failed. Updated ${rows} records.`,
      );
  };

  const failed = results.filter((r) => !r.ok);

  return (
    <Card className="mb-6 border-amber-300/60">
      <CardContent className="p-5 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div>
            <h3 className="font-display text-base font-bold uppercase tracking-wide">
              Move old-site images
            </h3>
            <p className="text-xs text-muted-foreground max-w-2xl">
              Finds images still loaded from geosynthetics.com, copies them into the Media Center
              and updates every product, page and project that uses them.
            </p>
          </div>
          <div className="flex gap-2 shrink-0">
            <Button variant="outline" size="sm" onClick={runScan} disabled={scanning || running}>
              {scanning ? (
                <Loader2 className="h-4 w-4 mr-1.5 animate-spin" />
              ) : (
                <Search className="h-4 w-4 mr-1.5" />
              )}
              Scan
            </Button>
            <Button
              size="sm"
              onClick={runImport}
              disabled={!scan || scan.urls.length === 0 || running || scanning}
            >
              {running ? (
                <Loader2 className="h-4 w-4 mr-1.5 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4 mr-1.5" />
              )}
              {running ? `Moving ${progress.done}/${progress.total}` : "Move all"}
            </Button>
          </div>
        </div>

        {scan && (
          <div className="text-xs space-y-1">
            <p>
              <strong>{scan.urls.length}</strong> old-site files used in{" "}
              <strong>{scan.hits.length}</strong> records
              {scan.hits.length > 0 &&
                ` (${[...new Set(scan.hits.map((h) => h.table))].join(", ")})`}
              .
            </p>
            {scan.errors.length > 0 && (
              <p className="text-amber-600">Could not read: {scan.errors.join("; ")}</p>
            )}
            {scan.urls.length === 0 && (
              <p className="flex items-center gap-1.5 text-emerald-600">
                <CheckCircle2 className="h-4 w-4" /> No images are loaded from the old site.
              </p>
            )}
          </div>
        )}

        {results.length > 0 && !running && (
          <div className="text-xs space-y-1">
            <p className="flex items-center gap-1.5 text-emerald-600">
              <CheckCircle2 className="h-4 w-4" /> {results.length - failed.length} files moved,{" "}
              {updatedRows} records updated.
            </p>
            {failed.length > 0 && (
              <div className="text-amber-700">
                <p className="flex items-center gap-1.5">
                  <AlertTriangle className="h-4 w-4" /> {failed.length} could not be moved:
                </p>
                <ul className="list-disc pl-5 break-all">
                  {failed.map((f) => (
                    <li key={f.url}>
                      {f.url} — {f.error}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
