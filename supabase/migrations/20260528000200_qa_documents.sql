-- Migration: Create qa_documents table
-- Date: 2026-05-28

CREATE TABLE IF NOT EXISTS public.qa_documents (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  slug text NOT NULL UNIQUE,
  category_name text NOT NULL,
  short_description text,
  hero_image_url text,
  eyebrow text DEFAULT 'IAGI-Aligned',
  hero_title text,
  hero_body text,
  content_sections jsonb DEFAULT '[]'::jsonb,
  stats jsonb DEFAULT '[]'::jsonb,
  industries_served jsonb DEFAULT '[]'::jsonb,
  key_pillars jsonb DEFAULT '[]'::jsonb,
  cta_label text DEFAULT 'Request QA Documentation',
  sort_order integer DEFAULT 0,
  status text DEFAULT 'published' CHECK (status IN ('published', 'draft', 'archived')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- RLS
ALTER TABLE public.qa_documents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "qa_documents_public_read" ON public.qa_documents
  FOR SELECT TO public USING (status = 'published');

CREATE POLICY "qa_documents_staff_write" ON public.qa_documents
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_roles.user_id = auth.uid()
      AND (user_roles.role = 'admin' OR user_roles.role = 'staff')
    )
  );
