import { useMemo } from "react";
import { CheckCircle2, AlertTriangle, XCircle, Globe } from "lucide-react";

export interface SeoInput {
  name?: string | null;
  slug?: string | null;
  metaTitle?: string | null;
  metaDescription?: string | null;
  keywords?: string | null;
  shortDescription?: string | null;
  imageUrl?: string | null;
  siteHost?: string;
}

type CheckStatus = "good" | "warn" | "bad";
interface Check {
  id: string;
  label: string;
  status: CheckStatus;
  weight: number; // contribution to score
  hint?: string;
}

const STOP = new Set([
  "the","a","an","and","or","of","for","to","in","on","with","by","is","are","at","from","as","be","this","that","it","its","your","you","our",
]);

function tokenize(s: string): string[] {
  return s.toLowerCase().replace(/[^a-z0-9\s-]/g, " ").split(/\s+/).filter((w) => w && !STOP.has(w));
}

function primaryKeyword(keywords: string | null | undefined): string {
  const first = (keywords ?? "").split(",").map((k) => k.trim()).filter(Boolean)[0] ?? "";
  return first.toLowerCase();
}

function containsKeyword(haystack: string, kw: string): boolean {
  if (!kw) return false;
  return haystack.toLowerCase().includes(kw);
}

export function analyzeSeo(input: SeoInput): { score: number; checks: Check[] } {
  const title = (input.metaTitle ?? "").trim();
  const desc = (input.metaDescription ?? "").trim();
  const slug = (input.slug ?? "").trim();
  const kw = primaryKeyword(input.keywords);
  const body = (input.shortDescription ?? "").trim();
  const name = (input.name ?? "").trim();

  const checks: Check[] = [];

  // Primary keyword set
  checks.push({
    id: "kw-set",
    label: "Primary focus keyword set",
    status: kw ? "good" : "bad",
    weight: 8,
    hint: "Add at least one phrase under SEO keywords (the first one is treated as primary).",
  });

  // Meta title length
  const tl = title.length;
  checks.push({
    id: "title-len",
    label: `Meta title length (${tl} chars)`,
    status: tl >= 40 && tl <= 60 ? "good" : tl > 0 && tl <= 70 ? "warn" : "bad",
    weight: 12,
    hint: "Aim for 40–60 characters. Hard limit ~60 before truncation in Google.",
  });

  // Meta description length
  const dl = desc.length;
  checks.push({
    id: "desc-len",
    label: `Meta description length (${dl} chars)`,
    status: dl >= 120 && dl <= 160 ? "good" : dl > 0 && dl < 200 ? "warn" : "bad",
    weight: 12,
    hint: "Aim for 120–160 characters.",
  });

  // Keyword in title
  checks.push({
    id: "kw-title",
    label: "Focus keyword in meta title",
    status: kw && containsKeyword(title, kw) ? "good" : kw ? "bad" : "warn",
    weight: 12,
    hint: "Include your focus keyword in the meta title, ideally near the start.",
  });

  // Keyword at start of title
  checks.push({
    id: "kw-title-start",
    label: "Focus keyword near start of title",
    status:
      kw && title.toLowerCase().indexOf(kw) >= 0 && title.toLowerCase().indexOf(kw) <= 20
        ? "good"
        : kw && containsKeyword(title, kw)
          ? "warn"
          : "bad",
    weight: 6,
  });

  // Keyword in description
  checks.push({
    id: "kw-desc",
    label: "Focus keyword in meta description",
    status: kw && containsKeyword(desc, kw) ? "good" : kw ? "bad" : "warn",
    weight: 10,
  });

  // Keyword in slug
  checks.push({
    id: "kw-slug",
    label: "Focus keyword in URL slug",
    status: kw && slug.includes(kw.replace(/\s+/g, "-")) ? "good" : kw ? "warn" : "bad",
    weight: 8,
  });

  // Slug length / shape
  checks.push({
    id: "slug-shape",
    label: "URL slug is short and clean",
    status:
      slug && slug.length <= 75 && /^[a-z0-9-]+$/.test(slug)
        ? "good"
        : slug
          ? "warn"
          : "bad",
    weight: 5,
    hint: "Use lowercase letters, numbers and dashes. Keep under 75 chars.",
  });

  // Keyword in product name
  checks.push({
    id: "kw-name",
    label: "Focus keyword appears in product name",
    status: kw && containsKeyword(name, kw) ? "good" : kw ? "warn" : "bad",
    weight: 5,
  });

  // Description body present and contains keyword
  checks.push({
    id: "body",
    label: "Short description is present",
    status: body.length >= 80 ? "good" : body.length > 0 ? "warn" : "bad",
    weight: 6,
    hint: "Write at least one informative sentence (80+ chars).",
  });
  checks.push({
    id: "kw-body",
    label: "Focus keyword in short description",
    status: kw && containsKeyword(body, kw) ? "good" : kw ? "warn" : "bad",
    weight: 6,
  });

  // Image
  checks.push({
    id: "image",
    label: "Product has a primary image",
    status: input.imageUrl ? "good" : "bad",
    weight: 6,
    hint: "Add at least one product image.",
  });

  // Title is unique vs name
  checks.push({
    id: "title-unique",
    label: "Meta title differs from product name",
    status:
      title && name && title.toLowerCase() !== name.toLowerCase()
        ? "good"
        : title
          ? "warn"
          : "bad",
    weight: 4,
    hint: "Craft a distinct, search-friendly title (technical name + benefit + brand).",
  });

  const totalWeight = checks.reduce((a, c) => a + c.weight, 0);
  const earned = checks.reduce((a, c) => {
    const f = c.status === "good" ? 1 : c.status === "warn" ? 0.5 : 0;
    return a + c.weight * f;
  }, 0);
  const score = Math.round((earned / totalWeight) * 100);

  return { score, checks };
}

function scoreColor(score: number): { ring: string; text: string; label: string } {
  if (score >= 80) return { ring: "stroke-emerald-500", text: "text-emerald-600", label: "Good" };
  if (score >= 50) return { ring: "stroke-amber-500", text: "text-amber-600", label: "Needs work" };
  return { ring: "stroke-red-500", text: "text-red-600", label: "Poor" };
}

function ScoreRing({ score }: { score: number }) {
  const c = scoreColor(score);
  const r = 28;
  const circ = 2 * Math.PI * r;
  const offset = circ - (Math.max(0, Math.min(100, score)) / 100) * circ;
  return (
    <div className="relative h-20 w-20 shrink-0">
      <svg viewBox="0 0 64 64" className="h-20 w-20 -rotate-90">
        <circle cx="32" cy="32" r={r} className="stroke-muted" strokeWidth="6" fill="none" />
        <circle
          cx="32"
          cy="32"
          r={r}
          className={c.ring}
          strokeWidth="6"
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={offset}
        />
      </svg>
      <div className={`absolute inset-0 flex flex-col items-center justify-center ${c.text}`}>
        <span className="text-lg font-bold tabular-nums leading-none">{score}</span>
        <span className="text-[9px] uppercase tracking-wider">/100</span>
      </div>
    </div>
  );
}

function StatusIcon({ s }: { s: CheckStatus }) {
  if (s === "good") return <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />;
  if (s === "warn") return <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />;
  return <XCircle className="h-4 w-4 text-red-600 shrink-0 mt-0.5" />;
}

export function SeoAnalyzer({ input }: { input: SeoInput }) {
  const { score, checks } = useMemo(() => analyzeSeo(input), [input]);
  const c = scoreColor(score);

  const previewTitle = (input.metaTitle?.trim() || input.name || "Untitled product").slice(0, 60);
  const previewDesc =
    (input.metaDescription?.trim() || input.shortDescription?.trim() || "—").slice(0, 160);
  const host = input.siteHost ?? "geosynthetics.co.za";
  const slug = input.slug?.trim() || "product-slug";
  const url = `https://${host}/catalogue/${slug}`;

  const passed = checks.filter((x) => x.status === "good").length;
  const warned = checks.filter((x) => x.status === "warn").length;
  const failed = checks.filter((x) => x.status === "bad").length;

  return (
    <div className="rounded border border-border bg-muted/30 p-4 space-y-4">
      <div className="flex items-center gap-4">
        <ScoreRing score={score} />
        <div className="min-w-0">
          <div className={`text-sm font-bold uppercase tracking-wide ${c.text}`}>SEO score: {c.label}</div>
          <div className="text-xs text-muted-foreground mt-0.5">
            {passed} passed · {warned} to improve · {failed} issues
          </div>
          <div className="text-[11px] text-muted-foreground mt-1">
            Live, rule-based analysis (Rank-Math style). Updates as you type.
          </div>
        </div>
      </div>

      <div>
        <div className="text-[11px] font-bold uppercase tracking-wide text-muted-foreground mb-2 flex items-center gap-1.5">
          <Globe className="h-3.5 w-3.5" /> Google search preview
        </div>
        <div className="rounded border border-border bg-background p-3">
          <div className="text-xs text-muted-foreground truncate">{url}</div>
          <div className="text-[18px] leading-snug text-blue-700 dark:text-blue-400 font-medium truncate mt-0.5">
            {previewTitle}
          </div>
          <div className="text-sm text-muted-foreground mt-1 line-clamp-2">{previewDesc}</div>
        </div>
      </div>

      <div>
        <div className="text-[11px] font-bold uppercase tracking-wide text-muted-foreground mb-2">Checks</div>
        <ul className="space-y-1.5">
          {checks.map((chk) => (
            <li key={chk.id} className="flex items-start gap-2 text-sm">
              <StatusIcon s={chk.status} />
              <div className="min-w-0">
                <div className="leading-tight">{chk.label}</div>
                {chk.status !== "good" && chk.hint && (
                  <div className="text-[11px] text-muted-foreground leading-snug">{chk.hint}</div>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
