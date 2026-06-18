import { createClient } from "@supabase/supabase-js";
import * as fs from "fs";

const SUPABASE_URL = process.env.VITE_SUPABASE_URL ?? "https://fsfwjwyzrtgayujmguvd.supabase.co";
const SUPABASE_KEY = process.env.VITE_SUPABASE_PUBLISHABLE_KEY ?? "";

if (!SUPABASE_KEY) {
  console.error("❌ SUPABASE_KEY is missing. Please set VITE_SUPABASE_PUBLISHABLE_KEY or SUPABASE_PUBLISHABLE_KEY");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

interface ScrappedUrl {
  url: string;
}

// Custom manual mappings for high priority URLs
const MANUAL_MAPPINGS: Record<string, string> = {
  "/": "/",
  "/contact/": "/contacts",
  "/contact": "/contacts",
  "/contacts": "/contacts",
  "/about-us/": "/about",
  "/about/": "/about",
  "/products-we-supply/": "/products",
  "/products-we-supply": "/products",
  "/products/": "/products",
  "/products": "/products",
  "/applications/": "/applications",
  "/applications": "/applications",
  "/quality-assurance/": "/quality-assurance",
  "/quality-assurance": "/quality-assurance",
  "/our-resources/": "/resources",
  "/our-resources": "/resources",
  "/literature-usage-guides-downloadable-pdfs/": "/resources",
  "/technical-data-sheets-downloadable-pdfs/": "/resources",
  "/brochures-downloadable-pdfs/": "/resources",
  "/elementor-6763/": "/",
  "/elementor-6763": "/",

  // Services
  "/geomembrane-installer-africa-liners/": "/services/installation",
  "/certified-hdpe-lining-installers-africa/": "/services/installation",
  "/quality-assurance/certified-hdpe-lining-installers-africa/": "/services/installation",
  "/gcl-liner-installation-contractors-africa/": "/services/installation",
  "/geocell-installations-africa/": "/services/installation",
  "/geosynthetics-installation-services/": "/services/installation",
  "/gse-hdpe-liner-installer-africa/": "/services/installation",
  "/mining-tsf-pcd-hdpe-geomembrane-lining-installer-africa/": "/services/installation",
  "/channel-lining-gccm-installation-africa/": "/services/installation",

  // QA documents
  "/quality-assurance/gse-quality-assurance/": "/quality-assurance/gse-solmax-geomembrane-installtion-quality-assurance",
  "/quality-assurance/tensar-quality-assurance/": "/quality-assurance/tensar-geogrids-quality-assurance",
  "/quality-assurance/eurobent-gcl-installation-quality-assurance/": "/quality-assurance/eurobent-gcl-quality-assurance",
  "/eurobent-gcl-installation-quality-assurance/": "/quality-assurance/eurobent-gcl-quality-assurance",

  // Specific products mapped manually
  "/potable-water-tank-lining-pvc-africa/": "/catalogue/720gsm-potable-water-pvc-liner-drinking-water-storage",
  "/pvc-dam-lining-africa/": "/catalogue/700gsm-pvc-dam-liner-general-purpose-waterproof-liner-for-dams-reservoirs",
  "/coconut-fibre-erosion-control-blankets/": "/catalogue/coir-soillock-350-coconut-fibre-erosion-control-blanket-2-45m-x-50-4m",
  "/straw-cellulose-fibre-erosion-control-blanket/": "/catalogue/straw-soillock-300-straw-cellulose-erosion-control-blanket-2-45m-x-50-4m",
  "/gse-hdpe-liner-smooth-geomembrane-supplier-south-africa/": "/catalogue/hdpe-smooth-geomembrane-liner-gri-gm13-1-5mm",
  "/root-and-mole-barrier-geotextile-supplier/": "/catalogue/polytape-rb340-pp-root-barrier",
  "/gse-polylock-t-supplier-africa/": "/catalogue/gse-polylock-t-hdpe-termination-strip-africa",
  "/zimbabwe-river-rehabilitation-jutesoillock-292-erosion-control/": "/catalogue/292gsm-jute-soillock-soil-erosion-blanket-supplier-africa",
  "/jute-erosion-control-blankets-soillock-africa/": "/catalogue/292gsm-jute-soillock-soil-erosion-blanket-supplier-africa",
  "/miragrid-gx-geogrids-supplier/": "/catalogue/miragrid-gx-80-30-uniaxial-geogrid-high-strength-soil-reinforcement-5-3m-x-100m",
  "/miragrid-pec-geogrids-supplier/": "/catalogue/miragrid-pec-55-55-biaxial-geocomposite-subgrade-stabilisation-basal-reinforcement-5-3m-x-100m",
  "/river-reno-mattresses-suppliers-africa/": "/catalogue/6-0m-x2-0m-x0-3m-galvanized-gabion-mattress",

  // Case studies mapped manually
  "/gse-hdpe-liners-supply-mcc-copper-mining-project-tanzania/": "/projects/kolwezi-liner-supply",
  "/west-wits-mining-rom-pad-hdpe-liner-case-study/": "/projects/west-wits-tsf-lining",
  "/gse-hdpe-geomembrane-mining-process-plant-botswana-lucara/": "/projects/kolwezi-liner-supply",
};

// Map categories to new custom slugs
const CATEGORY_MAP: Record<string, string> = {
  "geomembranes": "geomembrane-liners",
  "geomembrane-liners": "geomembrane-liners",
  "geotextiles": "geotextile-fabrics",
  "geotextile-fabrics": "geotextile-fabrics",
  "geogrids": "Geogrids",
  "Geogrids": "Geogrids",
  "geocells": "gravel-grass-stabilisation",
  "gravel-grass-stabilisation": "gravel-grass-stabilisation",
  "gcls": "geosynthetic-clay-liners",
  "geosynthetic-clay-liners": "geosynthetic-clay-liners",
  "drainage-composites": "pipes-drainage-ducting",
  "pipes-drainage-ducting": "pipes-drainage-ducting",
  "erosion-control": "erosion-control-systems",
  "erosion-control-systems": "erosion-control-systems",
  "accessories": "gabion-baskets",
  "gabion-baskets": "gabion-baskets",
};

async function main() {
  console.log("🔄 Fetching product catalogue from Supabase...");
  const { data: dbProducts } = await supabase.from("products_public").select("name, slug");
  const products = dbProducts || [];
  console.log(`📦 Loaded ${products.length} products from database.`);

  console.log("🔄 Fetching case study slugs...");
  const { data: dbCases } = await supabase.from("case_studies").select("title, slug");
  const cases = dbCases || [];
  console.log(`📂 Loaded ${cases.length} case studies.`);

  console.log("🔄 Fetching QA documents...");
  const { data: dbQAs } = await supabase.from("qa_documents").select("slug");
  const qas = dbQAs || [];
  console.log(`📄 Loaded ${qas.length} QA documents.`);

  // Load scrapped urls so that this code will validate the new paths against the old paths and create redirects for the paths that are not found in the new paths. and log it in the console.
  const fileContent = fs.readFileSync(".agents/references/scrapped-urls.json", "utf-8");
  const scrapped: ScrappedUrl[] = JSON.parse(fileContent);
  console.log(`🔍 Found ${scrapped.length} scrapped URLs.`);

  const redirects: Record<string, string> = {};

  for (const item of scrapped) {
    if (!item.url) continue;

    // Extract pathname
    let pathname = "";
    try {
      const urlObj = new URL(item.url);
      pathname = urlObj.pathname;
    } catch {
      // In case it's already a path
      pathname = item.url;
    }

    // Normalize path
    pathname = pathname.toLowerCase();
    if (!pathname.startsWith("/")) {
      pathname = "/" + pathname;
    }
    // Remove trailing slash for matching, but we'll store normalized with slash if needed
    // Actually we'll normalize both input path and legacy paths.
    // Let's keep a consistent format: starting with / and no trailing slash
    let cleanPath = pathname;
    if (cleanPath.endsWith("/") && cleanPath.length > 1) {
      cleanPath = cleanPath.slice(0, -1);
    }

    // Skip home
    if (cleanPath === "/" || cleanPath === "") {
      continue;
    }

    // Skip wp-content, feed, sitemap, elementor etc.
    if (
      cleanPath.includes("wp-content") ||
      cleanPath.includes("feed") ||
      cleanPath.includes("sitemap") ||
      cleanPath.includes("xmlrpc") ||
      cleanPath.includes("wp-json") ||
      cleanPath.includes("wp-includes") ||
      cleanPath.includes("elementor") ||
      cleanPath.includes("wp-admin") ||
      cleanPath.includes("/?") ||
      cleanPath.includes("page/")
    ) {
      continue;
    }

    // Check manual mappings first (try both with and without trailing slash)
    const normalizedKeyWithSlash = cleanPath + "/";
    let target = MANUAL_MAPPINGS[cleanPath] || MANUAL_MAPPINGS[normalizedKeyWithSlash];

    if (target) {
      redirects[cleanPath] = target;
      continue;
    }

    // Extract slug (last segment)
    const segments = cleanPath.split("/").filter(Boolean);
    const slug = segments[segments.length - 1] || "";

    // Check if the path indicates a product
    const isProductPath = cleanPath.includes("/product/") || cleanPath.includes("/products/");

    // Check if category
    let matchedCategory = "";
    for (const catKey of Object.keys(CATEGORY_MAP)) {
      if (cleanPath.includes(`/products/${catKey}`) || cleanPath.includes(`/${catKey}`)) {
        matchedCategory = CATEGORY_MAP[catKey];
        break;
      }
    }

    if (matchedCategory) {
      redirects[cleanPath] = `/products/${matchedCategory}`;
      continue;
    }

    // Check if it matches a DB product slug exactly
    const dbProductExact = products.find(p => p.slug === slug);
    if (dbProductExact) {
      redirects[cleanPath] = `/catalogue/${dbProductExact.slug}`;
      continue;
    }

    // Check if it matches a QA document
    const qaMatch = qas.find(q => q.slug === slug || slug.includes(q.slug));
    if (qaMatch) {
      redirects[cleanPath] = `/quality-assurance/${qaMatch.slug}`;
      continue;
    }

    // Check if it matches a Case Study exactly
    const caseMatch = cases.find(c => c.slug === slug || slug.includes(c.slug));
    if (caseMatch) {
      redirects[cleanPath] = `/projects/${caseMatch.slug}`;
      continue;
    }

    // Keyword matching for products
    let bestProductMatch = null;
    let maxIntersection = 0;

    const slugWords = slug.split("-").filter(w => w.length > 2);
    if (slugWords.length > 0) {
      for (const prod of products) {
        const prodWords = prod.slug.split("-");
        const intersection = slugWords.filter(w => prodWords.includes(w)).length;
        if (intersection > maxIntersection) {
          maxIntersection = intersection;
          bestProductMatch = prod;
        }
      }
    }

    // If we have a decent overlap (e.g. 2 or more words), map to that product!
    if (maxIntersection >= 2 && bestProductMatch) {
      redirects[cleanPath] = `/catalogue/${bestProductMatch.slug}`;
      continue;
    }

    // Fallback based on keywords in pathname
    if (cleanPath.includes("contact")) {
      redirects[cleanPath] = "/contacts";
    } else if (cleanPath.includes("about")) {
      redirects[cleanPath] = "/about";
    } else if (cleanPath.includes("project") || cleanPath.includes("case-study") || cleanPath.includes("mining-tsf") || cleanPath.includes("copper-mining")) {
      redirects[cleanPath] = "/projects";
    } else if (cleanPath.includes("quality") || cleanPath.includes("certif")) {
      redirects[cleanPath] = "/quality-assurance";
    } else if (cleanPath.includes("brochure") || cleanPath.includes("pdf") || cleanPath.includes("datasheet")) {
      redirects[cleanPath] = "/resources";
    } else if (cleanPath.includes("geomembrane")) {
      redirects[cleanPath] = "/products/geomembrane-liners";
    } else if (cleanPath.includes("geotextile")) {
      redirects[cleanPath] = "/products/geotextile-fabrics";
    } else if (cleanPath.includes("geogrid")) {
      redirects[cleanPath] = "/products/Geogrids";
    } else if (cleanPath.includes("geocell")) {
      redirects[cleanPath] = "/products/gravel-grass-stabilisation";
    } else if (cleanPath.includes("clay-liner") || cleanPath.includes("gcl")) {
      redirects[cleanPath] = "/products/geosynthetic-clay-liners";
    } else if (cleanPath.includes("drainage") || cleanPath.includes("pipe") || cleanPath.includes("duct")) {
      redirects[cleanPath] = "/products/pipes-drainage-ducting";
    } else if (cleanPath.includes("erosion")) {
      redirects[cleanPath] = "/products/erosion-control-systems";
    } else if (cleanPath.includes("gabion") || cleanPath.includes("mesh")) {
      redirects[cleanPath] = "/products/gabion-baskets";
    } else {
      // General fallback is catalogue or home
      redirects[cleanPath] = "/products";
    }
  }

  // Generate SQL insert statements
  const sqlStatements: string[] = [];
  sqlStatements.push("-- Seeding public.redirects table");
  sqlStatements.push("TRUNCATE TABLE public.redirects;"); // Clear existing if any to avoid uniqueness constraint violations

  const uniqueRedirects = Object.entries(redirects);
  console.log(`🚀 Mapped ${uniqueRedirects.length} unique paths.`);

  // Write in batches of 50 to keep inserts clean
  for (let i = 0; i < uniqueRedirects.length; i += 50) {
    const batch = uniqueRedirects.slice(i, i + 50);
    const values = batch
      .map(([fromPath, toPath]) => {
        // Double-quote escape in SQL values
        const escapedFrom = fromPath.replace(/'/g, "''");
        const escapedTo = toPath.replace(/'/g, "''");
        return `('${escapedFrom}', '${escapedTo}', 301)`;
      })
      .join(",\n  ");

    sqlStatements.push(`INSERT INTO public.redirects (from_path, to_path, status_code) VALUES\n  ${values}\nON CONFLICT (from_path) DO UPDATE SET to_path = EXCLUDED.to_path, status_code = EXCLUDED.status_code;`);
  }

  const sqlFileContent = sqlStatements.join("\n\n");
  fs.writeFileSync("supabase/migrations/seed_redirects.sql", sqlFileContent, "utf-8");
  console.log("✅ SQL migration file created at: supabase/migrations/seed_redirects.sql");
}

main().catch(err => {
  console.error("❌ Seeding generation failed:", err);
});
