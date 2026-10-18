#!/usr/bin/env node
/**
 * Submit every URL in the live sitemap to IndexNow (Bing, Yandex, Seznam, Naver…).
 * Bing's index feeds ChatGPT search and Microsoft Copilot, so this gets new and
 * changed pages in front of AI assistants within minutes instead of weeks.
 *
 *   node scripts/indexnow.mjs              # submit all sitemap URLs
 *   node scripts/indexnow.mjs --dry-run    # list what would be sent
 *
 * The key is public by design: IndexNow verifies ownership by fetching
 * https://<host>/<key>.txt, which is served from public/<key>.txt.
 * Override with SITE_URL / INDEXNOW_KEY environment variables.
 */

const SITE_URL = (process.env.SITE_URL || "https://www.geosyntheticsafrica.com").replace(
  /\/+$/,
  "",
);
const KEY = process.env.INDEXNOW_KEY || "e63baaabb9de7dc1e0330331981bd5fd";
const ENDPOINT = "https://api.indexnow.org/indexnow";
const BATCH_SIZE = 10000; // IndexNow limit per request
const dryRun = process.argv.includes("--dry-run");

async function fetchText(url) {
  const res = await fetch(url, { headers: { "User-Agent": "GeosyntheticsAfrica-IndexNow/1.0" } });
  if (!res.ok) throw new Error(`GET ${url} -> ${res.status}`);
  return res.text();
}

const locs = (xml) =>
  [...xml.matchAll(/<loc>\s*([^<\s]+)\s*<\/loc>/g)].map((m) => m[1].replace(/&amp;/g, "&"));

/** Reads sitemap.xml; follows a sitemap index one level down. */
async function collectUrls() {
  const root = await fetchText(`${SITE_URL}/sitemap.xml`);
  if (!root.includes("<sitemapindex")) return locs(root);
  const urls = [];
  for (const child of locs(root)) urls.push(...locs(await fetchText(child)));
  return urls;
}

async function main() {
  const host = new URL(SITE_URL).host;
  const keyFile = `${SITE_URL}/${KEY}.txt`;

  const served = (await fetchText(keyFile)).trim();
  if (served !== KEY) throw new Error(`Key file ${keyFile} does not contain the key`);

  const urls = [...new Set(await collectUrls())].filter((u) => new URL(u).host === host);
  console.log(`Found ${urls.length} URLs on ${host}`);
  if (dryRun) {
    urls.forEach((u) => console.log(`  ${u}`));
    return;
  }

  for (let i = 0; i < urls.length; i += BATCH_SIZE) {
    const urlList = urls.slice(i, i + BATCH_SIZE);
    const res = await fetch(ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify({ host, key: KEY, keyLocation: keyFile, urlList }),
    });
    // 200 = accepted, 202 = accepted (key validation pending)
    if (res.status !== 200 && res.status !== 202) {
      throw new Error(`IndexNow rejected batch: ${res.status} ${await res.text()}`);
    }
    console.log(`Submitted ${urlList.length} URLs (HTTP ${res.status})`);
  }
}

main().catch((err) => {
  console.error(err.message || err);
  process.exit(1);
});
