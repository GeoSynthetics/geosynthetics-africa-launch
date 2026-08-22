-- Create the technical-docs bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('technical-docs', 'technical-docs', false)
ON CONFLICT (id) DO NOTHING;

-- Policies for technical-docs bucket
CREATE POLICY "technical-docs_public_read"
ON storage.objects FOR SELECT
TO public
USING ( bucket_id = 'technical-docs' );

CREATE POLICY "technical-docs_admin_insert"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'technical-docs' AND
  EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_roles.user_id = auth.uid()
    AND (user_roles.role = 'admin' OR user_roles.role = 'staff')
  )
);

CREATE POLICY "technical-docs_admin_update"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'technical-docs' AND
  EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_roles.user_id = auth.uid()
    AND (user_roles.role = 'admin' OR user_roles.role = 'staff')
  )
);

CREATE POLICY "technical-docs_admin_delete"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'technical-docs' AND
  EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_roles.user_id = auth.uid()
    AND (user_roles.role = 'admin' OR user_roles.role = 'staff')
  )
);
