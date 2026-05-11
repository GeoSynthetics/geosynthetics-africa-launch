-- Create the site_config table for Site Builder
CREATE TABLE IF NOT EXISTS public.site_config (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  key text NOT NULL UNIQUE,
  value jsonb NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.site_config ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Allow public read access on site_config"
  ON public.site_config
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow authenticated staff to update site_config"
  ON public.site_config
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND (profiles.role = 'admin' OR profiles.role = 'staff')
    )
  );

-- Insert initial empty config if it doesn't exist
INSERT INTO public.site_config (key, value)
VALUES ('mega_menu', '{}'::jsonb)
ON CONFLICT (key) DO NOTHING;
