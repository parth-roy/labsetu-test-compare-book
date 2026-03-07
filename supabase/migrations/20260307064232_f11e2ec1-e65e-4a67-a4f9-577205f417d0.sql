
-- Add lab registration fields to labs table
ALTER TABLE public.labs ADD COLUMN IF NOT EXISTS status text NOT NULL DEFAULT 'submitted';
ALTER TABLE public.labs ADD COLUMN IF NOT EXISTS company_type text;
ALTER TABLE public.labs ADD COLUMN IF NOT EXISTS certificates text;
ALTER TABLE public.labs ADD COLUMN IF NOT EXISTS trade_license_url text;
ALTER TABLE public.labs ADD COLUMN IF NOT EXISTS bank_account_number text;
ALTER TABLE public.labs ADD COLUMN IF NOT EXISTS ifsc_code text;
ALTER TABLE public.labs ADD COLUMN IF NOT EXISTS cancelled_cheque_url text;

-- Create storage buckets for lab documents and reports
INSERT INTO storage.buckets (id, name, public) VALUES ('lab-documents', 'lab-documents', false) ON CONFLICT DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('reports', 'reports', false) ON CONFLICT DO NOTHING;

-- Storage policies for lab-documents bucket
CREATE POLICY "Authenticated users can upload lab documents"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'lab-documents');

CREATE POLICY "Users can view own lab documents"
ON storage.objects FOR SELECT TO authenticated
USING (bucket_id = 'lab-documents' AND (auth.uid()::text = (storage.foldername(name))[1]));

CREATE POLICY "Admins can view all lab documents"
ON storage.objects FOR SELECT TO authenticated
USING (bucket_id = 'lab-documents' AND public.has_role(auth.uid(), 'admin'));

-- Storage policies for reports bucket
CREATE POLICY "Lab owners can upload reports"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'reports');

CREATE POLICY "Users can view own reports"
ON storage.objects FOR SELECT TO authenticated
USING (bucket_id = 'reports');
