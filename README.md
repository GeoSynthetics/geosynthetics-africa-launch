# Geosynthetics Africa — Platform

Africa's Integrated Geosynthetics Execution Platform. A high-performance B2B portal that replaces the legacy WordPress site with a headless architecture, serving civil engineers, contractors and global manufacturing partners (Solmax, Thrace, Tensar) across the continent.

---

## 1. Project Overview

Geosynthetics Africa is a technical authority + B2B commerce site for geosynthetic products (geotextiles, geomembranes, geogrids, etc.) used in mining, civil, environmental and water infrastructure projects.

Core capabilities:

- **Solution-first navigation** — browse by Application (Mining, Roads, Landfills…) or by Product, with relational links between them.
- **Project enquiry pipeline** — `/contacts` form posts into the `quote_requests` table and uploads BOQ files (PDF/XLS/DWG, ≤ 20 MB) to Supabase Storage.
- **Catalogue** — products, manufacturers, categories with full-text search (`search_products` Postgres FTS function).
- **Resources hub** — TDS, SDS, brochures and case studies served through gated signed URLs.
- **Auth + RBAC** — Supabase Auth with roles stored in a separate `user_roles` table (`admin`, `staff`, `contractor`, `customer`, `viewer`). Roles are checked via the `has_role()` security-definer function — never on the client.
- **Admin control panel** at `/admin` for managing quote requests, products, resources and user roles.

---

## 2. Tech Stack

| Layer | Choice |
|---|---|
| Framework | **TanStack Start v1** (React 19, SSR + server functions) |
| Build / dev | **Vite 7** |
| Runtime target | **Cloudflare Workers** (via `@cloudflare/vite-plugin`) |
| Styling | **Tailwind CSS v4** (tokens in `src/styles.css`, `oklch` colour space) |
| UI primitives | **shadcn/ui** + Radix UI |
| Forms | react-hook-form + zod |
| Backend | **Supabase** (Postgres, Auth, Storage, RLS) — self-managed project |
| Icons | lucide-react |
| Package manager | **bun** |

> Note: this project uses a self-managed Supabase instance (not Lovable Cloud). Schema changes are applied as SQL migrations directly in the Supabase dashboard.

---

## 3. Local Setup

### Prerequisites

- **Node.js ≥ 20**
- **Bun** ≥ 1.1 (`curl -fsSL https://bun.sh/install | bash`)
- A Supabase project (URL + publishable key + service role key)

### Install

```bash
git clone <your-repo-url>
cd <project-dir>
bun install
```

### Environment variables

Create a `.env` in the project root:

```env
VITE_SUPABASE_URL=https://<your-project>.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_xxx
SUPABASE_URL=https://<your-project>.supabase.co
SUPABASE_PUBLISHABLE_KEY=sb_publishable_xxx
```

The **service role key** must NOT live in `.env`. Add it as a runtime secret named `SB_SERVICE_ROLE_KEY` (or `SUPABASE_SERVICE_ROLE_KEY`). It is read server-side only by `src/integrations/supabase/client.server.ts`.

### Run

```bash
bun run dev        # http://localhost:5173
bun run build      # production build
bun run preview    # preview the production build
bun run lint
```

### Supabase dashboard checklist

- **Auth → Providers → Email**: enable; turn on Leaked Password Protection (HIBP).
- **Auth → URL Configuration**: set Site URL + Redirect URLs to your preview/production hosts.
- **Storage buckets**: `boq-uploads` (private), `technical-docs` (private, signed-URL access).

### Bootstrap the first admin

After signing up via `/signup`, run in the Supabase SQL editor:

```sql
insert into public.user_roles (user_id, role)
select id, 'admin'::app_role from auth.users where email = 'you@example.com'
on conflict do nothing;
```

---

## 4. Project Structure

```
src/
├── routes/                       # File-based routing (TanStack Router)
│   ├── __root.tsx                # Root shell: <html>, providers, Header/Footer
│   ├── index.tsx                 # Home
│   ├── applications.tsx          # + applications.$category.tsx (dynamic)
│   ├── products.tsx              # + products.$category.tsx
│   ├── catalogue.tsx
│   ├── services.tsx
│   ├── resources.tsx
│   ├── quality-assurance.tsx
│   ├── contacts.tsx              # Quote/BOQ enquiry form
│   ├── login.tsx  signup.tsx
│   └── admin.tsx                 # Admin layout (RBAC-gated)
│       ├── admin.index.tsx       # Dashboard with live counts
│       ├── admin.quotes.tsx      # Quote request inbox
│       ├── admin.products.tsx    # Product CRUD
│       ├── admin.resources.tsx   # Document management
│       └── admin.users.tsx       # Role management
│
├── components/
│   ├── site/                     # Header, Footer, MegaMenu, PageHero, …
│   ├── admin/                    # AdminNav, …
│   └── ui/                       # shadcn primitives
│
├── hooks/
│   └── use-auth.tsx              # AuthProvider + useAuth() (session + roles)
│
├── integrations/supabase/
│   ├── client.ts                 # Browser client (publishable key)
│   ├── client.server.ts          # Server-only admin client (service role)
│   └── auth-middleware.ts        # createServerFn auth middleware
│
├── server/                       # *.functions.ts (RPC) + *.server.ts (server-only)
├── lib/utils.ts                  # cn(), helpers
├── styles.css                    # Tailwind v4 + design tokens
├── router.tsx                    # Router bootstrap
└── routeTree.gen.ts              # AUTO-GENERATED — do not edit
```

### Routing conventions (TanStack Start)

- Flat dot-separated filenames: `admin.products.tsx` → `/admin/products`.
- Layout files render `<Outlet />` for their children.
- **Never edit `routeTree.gen.ts`** — the Vite plugin regenerates it.

### Server functions

- `*.server.ts(x)` — server-only modules (DB, secrets). Vite blocks them from client bundles.
- `*.functions.ts(x)` — `createServerFn(...)` wrappers. Safe to import from components.
- Public webhooks/cron live under `src/routes/api/public/*` (auth bypass) — always verify signatures.

---

## 5. Design System

- All colours are **semantic tokens** in `src/styles.css` using `oklch(...)`. Never hardcode `text-white`, `bg-black`, hex codes, etc. in components.
- Display font: Barlow Condensed. Body: Inter.
- shadcn variants are extended via `cva` — prefer adding a `variant` over inline classes.

---

## 6. Auth & RBAC Pattern (do not break)

1. Roles live in `public.user_roles` (separate table, `app_role` enum).
2. RLS policies use the `public.has_role(uid, role)` **security-definer** function to avoid recursion.
3. The client never trusts a role flag from local state for security decisions — it only uses them to render UI. All authoritative checks happen server-side via RLS or server functions.

---

## 7. Deployment

The app builds for **Cloudflare Workers** (see `wrangler.jsonc`, `@cloudflare/vite-plugin`). `bun run build` produces a Worker bundle. Server functions and SSR run in the Worker runtime — see in-repo notes on Node-incompatible APIs (no `child_process`, `sharp`, `fs.watch`, etc.).

Required Worker secrets:

- `SUPABASE_URL`
- `SUPABASE_PUBLISHABLE_KEY`
- `SB_SERVICE_ROLE_KEY` (or `SUPABASE_SERVICE_ROLE_KEY`)

---

## 8. Documentation

Major changes are logged in [`/docs/lovable-docs.md`](./docs/lovable-docs.md). That file is **append-only and human-approved** — the AI agent must ask before writing to it.

---

## 9. License

Proprietary — © Geosynthetics Africa. All rights reserved.
