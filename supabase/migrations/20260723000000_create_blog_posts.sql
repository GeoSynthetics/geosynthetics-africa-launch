-- Migration: Create blog_posts table
-- Date: 2026-07-23

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

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON public.blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_status ON public.blog_posts(status);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published_at ON public.blog_posts(published_at DESC);

-- Enable RLS
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;

-- Select policy: Anyone can view published posts
CREATE POLICY "blog_posts_public_read" ON public.blog_posts
  FOR SELECT TO public USING (status = 'published');

-- Staff/Admin policies: Full CRUD access
CREATE POLICY "blog_posts_staff_write" ON public.blog_posts
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_roles.user_id = auth.uid()
      AND (user_roles.role = 'admin' OR user_roles.role = 'staff')
    )
  );
