# AI SEO & AI Visibility — Agent Instructions

You are working on a web application. Besides the task you were given, check whether the project has the **AI SEO baseline** below. It makes the site findable and quotable by search engines and AI assistants (ChatGPT, Claude, Gemini, Perplexity, Copilot).

- If a feature is missing or broken, implement it, matching the project's existing framework, conventions and file structure.
- If it already exists, verify it works. Don't duplicate it.
- Never guess business facts (name, address, phone, founding year, memberships). Read them from the codebase, the CMS or the user. If they aren't available, ask, or leave a clearly marked TODO.

---

## 0. Audit first (do this before writing code)

Fetch the **production** URL, or a local production build, the way a crawler does. Don't trust what the browser shows.

```bash
# Can AI and search crawlers reach the page? (expect 200 for every bot)
for ua in GPTBot OAI-SearchBot ChatGPT-User ClaudeBot Claude-SearchBot PerplexityBot Google-Extended Googlebot Bingbot CCBot Applebot; do
  printf "%-18s " $ua; curl -s -o /dev/null -w "%{http_code}\n" -A "Mozilla/5.0 (compatible; $ua)" https://SITE/
done
curl -s https://SITE/robots.txt
curl -sI https://SITE/sitemap.xml   # expect 200 + application/xml
curl -s  https://SITE/llms.txt      # expect 200 text/plain
```

Then, for each main page type (home, about, product, service, location, article), save the raw HTML and check:

- **Real content is in the HTML.** Strip the tags and count the words: hundreds of words, not an empty app shell.
- `<title>`, meta description, exactly one `<h1>`, and a `<link rel="canonical">` pointing at **this** domain.
- `<meta name="robots">` is not `noindex` on public pages.
- JSON-LD blocks parse as valid JSON, with the expected `@type`s.
- **Read files as UTF-8 when checking.** Windows tools default to cp1252, and the false `â€”` mojibake they produce is not a site bug. Confirm any encoding problem from the raw bytes before "fixing" it.

Report the findings before and after the change.

---

## 1. Crawlability (highest impact)

- **robots.txt:** `Allow: /` for the production host, block only private routes (`/admin`, `/login`, `/api` and the like), and include `Sitemap: https://<canonical-host>/sitemap.xml`.
  - If preview or staging hosts get `Disallow: /`, make sure the "is production?" check matches the **real production domain**, with and without `www`. A wrong host check silently blocks the whole live site.
- **Don't block AI crawlers** (GPTBot, OAI-SearchBot, ClaudeBot, PerplexityBot, Google-Extended, Bingbot) in robots.txt, CDN or WAF rules, or bot-protection settings, unless the user explicitly wants that.
- **Server-side rendering:** public pages must ship their content in the initial HTML. Most AI crawlers **do not run JavaScript**.
- **Hidden-until-clicked content:** accordions, tabs and "read more" widgets often **don't render closed content at all**. Radix and shadcn Accordion, for example, unmount closed panels. Use native `<details>`/`<summary>`, or render the content in the DOM with the `hidden` attribute and toggle it.
- **One canonical host:** redirect the other host (`www` vs bare domain, `http` vs `https`) with a 301 or 308.

## 2. Single site-URL setting

- Create **one** module, such as `site-url.ts`, exporting `SITE_URL` (canonical origin, no trailing slash), an `absoluteUrl(path)` helper and `isProductionHost(host)`. It can optionally be overridden by an env var.
- Everything that prints an absolute URL reads from it: the sitemap, robots.txt, canonicals, `og:url`, JSON-LD, breadcrumbs, emails and `llms.txt`.
- **Grep for hardcoded domains**, especially an old or sister domain, and replace them.

## 3. Sitemap

- `/sitemap.xml` returns valid XML (`Content-Type: application/xml`), with absolute URLs on the canonical host only.
- Over roughly 100 URLs, or with several content types, use a **sitemap index** pointing to section sitemaps (pages, products, articles, locations, languages).
- **Build it from the same data the navigation uses** (CMS or DB hierarchies), so the sitemap never drifts from the real pages.
  - Include static pages, products, categories, services, locations, posts and localized pages.
  - Exclude redirects, `noindex` pages, admin pages and duplicates.
  - Deduplicate.
- Use real `<lastmod>` dates only. Never stamp every URL with "today".
- Add `hreflang` alternates if the site has translations.
- Remind the user to submit **only `sitemap.xml`** in Google Search Console and Bing Webmaster Tools. **Page URLs never go in the Sitemaps box**; that causes the "Sitemap is HTML" error.

## 4. Structured data (JSON-LD)

Use one reusable `<JsonLd data={...} />` component, and keep business facts in one module, such as `business-info.ts`.

- **Organization** (site-wide):
  - `@id: "<SITE_URL>/#organization"`
  - `name`, `legalName`, `url`, `logo`, `description`, `email`, `telephone`, `address`
  - `foundingDate`, `memberOf` (industry bodies), `areaServed`, `knowsAbout`
  - `sameAs` (real social and profile URLs only), plus `parentOrganization` / `subOrganization` for related companies or sister sites
- **WebSite** (site-wide): `@id: "<SITE_URL>/#website"`, `publisher: { "@id": ORGANIZATION_ID }`, `inLanguage`, and a `SearchAction` if the site has search.
- **Service** on service pages, and **Product** on product pages: `name`, `description`, `url`, `image`, and `provider` / `brand` / `offers.seller` pointing to `{ "@id": ORGANIZATION_ID }`.
- **BreadcrumbList** on nested pages. The URLs must match the **real live routes**.
- **FAQPage** wherever a visible FAQ list exists:
  - **exactly one per page**, with the same questions and answers that are visible;
  - answers as plain text, with the HTML stripped;
  - check that a parent route or layout doesn't already emit one.
- **LocalBusiness** on the contact page, if the business has a physical location; keep it consistent with the Google Business Profile.
- **BlogPosting / Article** for posts: `headline`, `datePublished`, `dateModified`, `author`, `publisher` → Organization `@id`.
- Validate with Google's Rich Results Test and the schema.org validator.

## 5. `/llms.txt`

Serve `/llms.txt` as `text/plain; charset=utf-8`, following https://llmstxt.org:

```
# <Business name>

> One-sentence description.

Short factual paragraph: what you sell or do, for whom, where.

- Website / Contact / Location / In business since / Memberships / Related companies / Area served / Languages

## <Section>            (e.g. Company, Products, Services, Locations, Articles)
- [Page title](https://absolute-url)

## Optional
- [Translated or secondary pages](https://...)
```

- **Generate it from the sitemap data source**, so it stays in sync automatically. Don't hand-maintain a list.
- Facts only, no marketing fluff. Use the same business data module as the JSON-LD.

## 6. IndexNow (fast discovery by Bing, which feeds ChatGPT search and Copilot)

- Generate a random 32-character hex key and serve it at `/<key>.txt`, containing the key. A file in `public/` works. The key is public by design.
- Add a script, such as `scripts/indexnow.mjs` (`npm run indexnow`, with a `--dry-run` option). It should:
  - read the live `sitemap.xml`, following sitemap indexes;
  - keep only URLs on the canonical host;
  - POST them to `https://api.indexnow.org/indexnow` as `{ host, key, keyLocation, urlList }`, in batches of 10,000 or fewer.
- Automate it after each **production** deploy, for example a GitHub Action on `deployment_status` (success + Production) or the hosting platform's deploy hook, with a manual trigger as well.

## 7. Content that AI can quote

- Each key page answers real buyer questions in plain, specific language: concrete numbers, specs, locations and timelines.
- Use visible FAQ sections on product, service and location pages, kept in the CMS so editors can maintain them.
- Use descriptive, unique titles and meta descriptions per page.
- Put case studies or project pages in the HTML with real data.

## 8. Renamed URLs and redirects

- When slugs change, add **301 redirects** from every old URL (with and without the trailing slash) **directly to the final URL**, with no chains.
- **Update the data, not just the code.** If pages come from a CMS or database, rename the slugs there too, with a backed-up, idempotent migration. Otherwise the new URLs 404 and menus keep linking to the old ones.
- Afterwards, update every internal link (menus, footer, CMS content), the sitemap and the canonicals, then verify with `curl` that old URLs return 301 → 200 and that no page links to the old URLs.

---

## Definition of done

- [ ] Every AI and search bot gets 200 on public pages, robots.txt allows crawling on the production host, and the sitemap is listed.
- [ ] Public pages ship their full content (including FAQ answers and tab content) in the server HTML.
- [ ] One `SITE_URL` source, with no hardcoded or legacy domains in canonicals, sitemap, schema or breadcrumbs.
- [ ] `sitemap.xml` (an index if large) is valid XML, uses only the canonical host, is generated from live data and has no duplicates.
- [ ] Organization (with `@id`), WebSite, and Service/Product, Breadcrumb, FAQPage (one per page) and Article JSON-LD all validate.
- [ ] `/llms.txt` is served, generated from the sitemap data.
- [ ] The IndexNow key file is served, and the submit script plus post-deploy automation are in place.
- [ ] Tests cover the generators (sitemap, llms.txt, FAQ schema), and the build passes.
- [ ] The before/after audit results are reported to the user.

**Remind the user** of the steps an agent can't do in code:
- verify the domain in Google Search Console and submit `sitemap.xml`;
- add the site to Bing Webmaster Tools (it can import from Search Console);
- keep the Google Business Profile, LinkedIn and directory listings pointing at the canonical domain;
- earn third-party mentions (industry directories, trade press, case studies). This is the biggest long-term factor in whether AI assistants recommend the brand.

Set expectations: indexing takes 1–4 weeks, and AI assistants usually start mentioning a site within 1–3 months.

## Guardrails

- Don't change the visible design beyond what's needed; match the existing styles.
- Don't modify uncommitted user work. Use a separate branch or worktree.
- Database or CMS changes go in a reviewed migration with a backup and a rollback, which the user runs or approves.
- Don't push, merge, deploy or run live data changes without the user's go-ahead.


## Credits
This Prompt is provided by Kavara Digital Global LTD