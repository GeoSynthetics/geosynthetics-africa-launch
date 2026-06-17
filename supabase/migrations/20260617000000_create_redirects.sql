-- Create redirects table
CREATE TABLE IF NOT EXISTS public.redirects (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  from_path text NOT NULL UNIQUE,
  to_path text NOT NULL,
  status_code integer NOT NULL DEFAULT 301,
  created_at timestamp with time zone DEFAULT now()
);

-- Enable RLS on redirects
ALTER TABLE public.redirects ENABLE ROW LEVEL SECURITY;

-- Enable RLS on site_config
ALTER TABLE public.site_config ENABLE ROW LEVEL SECURITY;

-- Create policies for redirects
DROP POLICY IF EXISTS "Allow public read access on redirects" ON public.redirects;
CREATE POLICY "Allow public read access on redirects"
  ON public.redirects
  FOR SELECT
  TO public
  USING (true);

DROP POLICY IF EXISTS "Allow authenticated staff to manage redirects" ON public.redirects;
CREATE POLICY "Allow authenticated staff to manage redirects"
  ON public.redirects
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_roles.user_id = auth.uid()
      AND (user_roles.role = 'admin' OR user_roles.role = 'staff')
    )
  );

-- Re-create or ensure policies for site_config
DROP POLICY IF EXISTS "Allow public read access on site_config" ON public.site_config;
CREATE POLICY "Allow public read access on site_config"
  ON public.site_config
  FOR SELECT
  TO public
  USING (true);

DROP POLICY IF EXISTS "Allow authenticated staff to update site_config" ON public.site_config;
CREATE POLICY "Allow authenticated staff to update site_config"
  ON public.site_config
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_roles.user_id = auth.uid()
      AND (user_roles.role = 'admin' OR user_roles.role = 'staff')
    )
  );
