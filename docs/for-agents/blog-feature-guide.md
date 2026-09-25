# Blog Post CMS & Technical Articles Architecture

This document provides a comprehensive guide for AI agents, developers, and platform stakeholders on the Technical Blog and CMS engine in the **Geosynthetics Africa** platform.

---

## 1. Overview & Business Purpose

The blog engine serves three primary functions:

1. **Search Engine Optimization (SEO)**: Drives organic traffic for high-intent keywords across African civil infrastructure, mining containment, and soil stabilization sectors.
2. **Technical Authority**: Publishes deep-dive engineering analyses on standards (e.g. GRI-GM13, ASTM D5397, SANS 12236), installation QA/QC, and product selection matrices.
3. **Product Upselling**: Links articles directly to relevant products and service channels via dynamic sidebar widgets.

---

## 2. Public & Admin Routes

| Route         | Component / File            | Description & Access                                                                                                                                                                        |
| :------------ | :-------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `/blog`       | `src/routes/blog.index.tsx` | **Public Blog Landing Page**. Displays hero featured post, category tabs (`Mining & Containment`, `Civil & Roads`, `Soil Reinforcement`), real-time search input, and responsive post grid. |
| `/blog/$slug` | `src/routes/blog.$slug.tsx` | **Public Article Detail Page**. Renders markdown article body, publication date, author details, dynamic product upsell sidebar, and technical CTA banner.                                  |
| `/admin/blog` | `src/routes/admin.blog.tsx` | **Admin CMS Panel**. Gated to `admin` and `staff` roles. Full CRUD table for managing posts, toggling status, managing cover images, and editing Markdown content.                          |

---

## 3. Database Schema (`public.blog_posts`)

The blog post system relies on a dedicated Postgres table managed via Supabase migration `supabase/migrations/20260723000000_create_blog_posts.sql`.

```sql
CREATE TABLE IF NOT EXISTS public.blog_posts (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  slug text NOT NULL UNIQUE,
  title text NOT NULL,
  content text NOT NULL,
  excerpt text,
  cover_image text,
  category text NOT NULL,
  tags text[] DEFAULT '{}'::text[],
  read_time integer,
  status text DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  featured boolean DEFAULT false,
  author_id uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  meta_title text,
  meta_description text,
  published_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
```

### Data Dictionary & Metadata Fields

- `id`: UUID (Primary Key)
- `slug`: String (Unique URL slug, e.g. `hdpe-geomembrane-selection-tailings-storage-africa`)
- `title`: String (Main article headline)
- `content`: String (Full body text formatted in Markdown or HTML)
- `excerpt`: String (Short summary snippet for preview cards)
- `cover_image`: String (URL or asset path, e.g. `/assets/blog/hdpe-geomembrane-tailings.jpg`)
- `category`: String (Main classification category, e.g. `Mining & Containment`)
- `tags`: String Array (`text[]` list of keyword tags)
- `read_time`: Integer (Reading duration in minutes)
- `status`: Enum (`'draft'`, `'published'`, `'archived'`)
- `featured`: Boolean (Toggles hero highlight placement on `/blog`)
- `author_id`: UUID (Foreign key referencing `public.profiles.id`)
- `meta_title`: String (Custom SEO title tag)
- `meta_description`: String (Custom SEO meta description tag)

---

## 4. Row-Level Security (RLS) & RBAC Rules

```sql
-- Enable RLS
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;

-- 1. Public Read Policy: Anyone can view published posts
CREATE POLICY "blog_posts_public_read" ON public.blog_posts
  FOR SELECT TO public USING (status = 'published');

-- 2. Staff/Admin Policy: Full CRUD access for authenticated staff/admin
CREATE POLICY "blog_posts_staff_write" ON public.blog_posts
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_roles.user_id = auth.uid()
      AND (user_roles.role = 'admin' OR user_roles.role = 'staff')
    )
  );
```

---

## 5. Agent & Developer Operations Guide

### A. How to Programmatically Query Published Posts

```typescript
import { supabase } from "@/integrations/supabase/client";

// Fetch all published posts ordered by published_at DESC
const { data: posts, error } = await supabase
  .from("blog_posts")
  .select(
    `
    *,
    author:author_id (
      full_name
    )
  `,
  )
  .eq("status", "published")
  .order("published_at", { ascending: false });
```

### B. How to Add a Blog Post via Supabase SQL

```sql
INSERT INTO public.blog_posts (
  slug,
  title,
  content,
  excerpt,
  cover_image,
  category,
  tags,
  read_time,
  status,
  featured,
  meta_title,
  meta_description
) VALUES (
  'sample-article-slug',
  'Sample Article Title',
  '# Sample Article Title\n\nFull markdown article content goes here.',
  'Short excerpt snippet.',
  '/assets/blog/cover-image.jpg',
  'Mining & Containment',
  ARRAY['HDPE', 'QA/QC'],
  5,
  'published',
  true,
  'Sample Article SEO Title',
  'Sample Article SEO Meta Description'
);
```

### C. How to Soft-Archive or Delete a Post

- **Soft Unpublish**: `UPDATE public.blog_posts SET status = 'draft' WHERE id = '<post_id>';`
- **Permanent Delete**: `DELETE FROM public.blog_posts WHERE id = '<post_id>';`
