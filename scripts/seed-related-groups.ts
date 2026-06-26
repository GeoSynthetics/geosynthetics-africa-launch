/**
 * scripts/seed-related-groups.ts
 *
 * One-off Bun script that back-fills `relatedProductGroups` for every existing
 * sub-family template stored in Supabase (site_config key = "template_product_categories").
 *
 * Logic:
 *  1. Build a sibling map from the mega-menu hierarchy (the single source of truth).
 *  2. Fetch the current JSON blob from Supabase.
 *  3. For each template whose `relatedProductGroups` is absent or empty,
 *     inject all siblings (excluding itself) as related links.
 *  4. Upsert the updated blob back — non-destructive, never overwrites a template
 *     that already has custom relatedProductGroups configured by James.
 *
 * Usage:
 *   bun run scripts/seed-related-groups.ts
 */

import { createClient } from "@supabase/supabase-js";

// ─── Load .env manually (Bun picks up .env automatically) ────────────────────
const SUPABASE_URL = process.env.VITE_SUPABASE_URL ?? process.env.SUPABASE_URL ?? "";
const SUPABASE_KEY =
  process.env.VITE_SUPABASE_PUBLISHABLE_KEY ?? process.env.SUPABASE_PUBLISHABLE_KEY ?? "";

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error("❌  Missing env vars: VITE_SUPABASE_URL / VITE_SUPABASE_PUBLISHABLE_KEY");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// ─── Mega-menu sibling map (single source of truth) ──────────────────────────
// Each key is a category slug → value is the ordered array of sub-family slugs
// with their display labels — derived directly from mega-menu-data.ts so the
// seeder stays in sync automatically if the menu ever changes.

type SiblingEntry = { name: string; slug: string };

const CATEGORY_SIBLINGS: Record<string, SiblingEntry[]> = {
  geomembranes: [
    { name: "HDPE Geomembranes", slug: "hdpe-geomembranes" },
    { name: "LLDPE Geomembranes", slug: "lldpe-geomembranes" },
    { name: "PVC Geomembranes", slug: "pvc-geomembranes" },
    { name: "EPDM Geomembranes", slug: "epdm-geomembranes" },
    { name: "PP Geomembranes", slug: "pp-geomembranes" },
    { name: "Textured Geomembranes", slug: "textured-geomembranes" },
    { name: "Speciality Geomembranes", slug: "speciality-geomembranes" },
    { name: "Floating Cover Geomembranes", slug: "floating-cover-geomembranes" },
  ],
  geotextiles: [
    { name: "Non-Woven Geotextiles", slug: "non-woven-geotextiles" },
    { name: "Woven Geotextiles", slug: "woven-geotextiles" },
    { name: "High-Strength Geotextiles", slug: "high-strength-geotextiles" },
    { name: "Geotextile Tubes", slug: "geotextile-tubes" },
    { name: "Paving Fabrics", slug: "paving-fabrics" },
    { name: "Filtration Geotextiles", slug: "filtration-geotextiles" },
  ],
  geogrids: [
    { name: "Biaxial Geogrids", slug: "biaxial-geogrids" },
    { name: "Uniaxial Geogrids", slug: "uniaxial-geogrids" },
    { name: "Triaxial Geogrids", slug: "triaxial-geogrids" },
    { name: "Fiberglass Geogrids", slug: "fiberglass-geogrids" },
    { name: "Polyester Geogrids", slug: "polyester-geogrids" },
    { name: "Geogrid Composites", slug: "geogrid-composites" },
  ],
  geocells: [
    { name: "Standard Geocells", slug: "standard-geocells" },
    { name: "Textured Geocells", slug: "textured-geocells" },
    { name: "Perforated Geocells", slug: "perforated-geocells" },
    { name: "High-Density Geocells", slug: "high-density-geocells" },
    { name: "Slope Protection Geocells", slug: "slope-protection-geocells" },
  ],
  gcls: [
    { name: "Standard GCLs", slug: "standard-gcls" },
    { name: "PE Coated GCLs", slug: "pe-coated-gcls" },
    { name: "Reinforced GCLs", slug: "reinforced-gcls" },
    { name: "Unreinforced GCLs", slug: "unreinforced-gcls" },
    { name: "Bentonite Powder/Granules", slug: "bentonite-powder" },
  ],
  "drainage-composites": [
    { name: "Geonets", slug: "geonets" },
    { name: "Geocomposite Drains", slug: "geocomposite-drains" },
    { name: "Strip Drains", slug: "strip-drains" },
    { name: "Prefabricated Vertical Drains", slug: "prefabricated-vertical-drains" },
    { name: "Drainage Boards", slug: "drainage-boards" },
  ],
  "erosion-control": [
    { name: "Erosion Control Blankets", slug: "erosion-control-blankets" },
    { name: "Turf Reinforcement Mats", slug: "turf-reinforcement-mats" },
    { name: "Coir Logs", slug: "coir-logs" },
    { name: "Silt Fences", slug: "silt-fences" },
    { name: "Gabions & Mattresses", slug: "gabions-and-mattresses" },
  ],
  accessories: [
    { name: "Welding Rods", slug: "welding-rods" },
    { name: "Bentonite Paste", slug: "bentonite-paste" },
    { name: "Fixing Pins & Pegs", slug: "fixing-pins" },
    { name: "Seaming Tapes", slug: "seaming-tapes" },
    { name: "Extrusion Welders", slug: "extrusion-welders" },
    { name: "Testing Equipment", slug: "testing-equipment" },
  ],
};

// ─── Alias map ───────────────────────────────────────────────────────────────
// If James stored templates with a different category value (e.g. "geomembrane-liners"
// instead of "geomembranes"), map it here so we can still derive the correct siblings
// and generate proper /products/{canonical-category}/{slug} links.

const CATEGORY_ALIASES: Record<string, string> = {
  "geomembrane-liners": "geomembranes",
  "geomembrane-liner": "geomembranes",
  "geotextile-fabrics": "geotextiles",
  "geotextile-fabric": "geotextiles",
  geogrid: "geogrids",
  geocell: "geocells",
  gcl: "gcls",
  "drainage-composite": "drainage-composites",
};

function canonicalCategory(raw: string): string {
  return CATEGORY_ALIASES[raw] ?? raw;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** Given a template's category and its own slug, return the sibling entries
 *  (excluding itself) formatted as relatedProductGroups link objects. */
function buildRelatedGroups(
  rawCategory: string,
  ownSlug: string,
): { name: string; link: string }[] {
  const category = canonicalCategory(rawCategory);
  const siblings = CATEGORY_SIBLINGS[category] ?? [];
  return siblings
    .filter((s) => s.slug !== ownSlug)
    .map((s) => ({
      name: s.name,
      link: `/products/${category}/${s.slug}`,
    }));
}

/** Returns true when a template needs its relatedProductGroups populated. */
function needsSeeding(template: Record<string, any>): boolean {
  const rg = template.relatedProductGroups;
  return !rg || !Array.isArray(rg) || rg.length === 0;
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log("🔍  Fetching current template data from Supabase…");

  const { data, error } = await supabase
    .from("site_config")
    .select("value")
    .eq("key", "template_product_categories")
    .maybeSingle();

  if (error) {
    console.error("❌  Supabase fetch error:", error.message);
    process.exit(1);
  }

  if (!data?.value) {
    console.log(
      "⚠️   No template_product_categories record found in site_config.\n" +
        "    Run the initial seed from the admin panel first, then re-run this script.",
    );
    process.exit(0);
  }

  const templates = data.value as Record<string, any>;
  const slugs = Object.keys(templates);

  console.log(`📦  Found ${slugs.length} template(s): ${slugs.join(", ")}\n`);

  let updatedCount = 0;
  let skippedCount = 0;

  for (const slug of slugs) {
    const tmpl = templates[slug];
    const category: string = tmpl.category ?? "";

    if (!category) {
      console.log(`  ⚠️  [${slug}] — no category set, skipping.`);
      skippedCount++;
      continue;
    }

    if (!needsSeeding(tmpl)) {
      const existing = tmpl.relatedProductGroups as any[];
      console.log(`  ✅  [${slug}] — already has ${existing.length} related group(s), preserving.`);
      skippedCount++;
      continue;
    }

    const related = buildRelatedGroups(category, slug);

    if (related.length === 0) {
      console.log(`  ⚠️  [${slug}] — category "${category}" not in sibling map, skipping.`);
      skippedCount++;
      continue;
    }

    templates[slug] = { ...tmpl, relatedProductGroups: related };
    console.log(
      `  🔗  [${slug}] — seeded ${related.length} related group(s):`,
      related.map((r) => r.name).join(", "),
    );
    updatedCount++;
  }

  if (updatedCount === 0) {
    console.log("\n✨  Nothing to update — all templates already populated.");
    return;
  }

  console.log(`\n💾  Upserting ${updatedCount} updated template(s)…`);

  // Retry with exponential back-off to handle transient socket closures
  const MAX_RETRIES = 3;
  let lastError: any = null;

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    if (attempt > 1) {
      const delay = 1000 * 2 ** (attempt - 2); // 1s, 2s
      console.log(`  ↩️  Retry ${attempt}/${MAX_RETRIES} in ${delay}ms…`);
      await new Promise((r) => setTimeout(r, delay));
    }

    const { error: upsertError } = await supabase
      .from("site_config")
      .upsert({ key: "template_product_categories", value: templates }, { onConflict: "key" });

    if (!upsertError) {
      console.log(
        `\n🎉  Done! ${updatedCount} template(s) updated, ${skippedCount} skipped (already had data).`,
      );
      return;
    }

    lastError = upsertError;
    console.warn(`  ⚠️  Attempt ${attempt} failed: ${upsertError.message}`);
  }

  console.error("❌  All retries exhausted. Last error:", lastError?.message);
  process.exit(1);
}

main().catch((err) => {
  console.error("❌  Unexpected error:", err);
  process.exit(1);
});
