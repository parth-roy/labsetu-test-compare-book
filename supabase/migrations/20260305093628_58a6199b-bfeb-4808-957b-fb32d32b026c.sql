
-- Health packages table
CREATE TABLE public.health_packages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  category TEXT NOT NULL DEFAULT 'General',
  included_test_names TEXT[] NOT NULL DEFAULT '{}',
  test_count INTEGER NOT NULL DEFAULT 0,
  original_price NUMERIC NOT NULL,
  discounted_price NUMERIC NOT NULL,
  discount_percent NUMERIC GENERATED ALWAYS AS (
    CASE WHEN original_price > 0 THEN ROUND(((original_price - discounted_price) / original_price) * 100) ELSE 0 END
  ) STORED,
  sample_type TEXT DEFAULT 'Blood',
  fasting_required BOOLEAN DEFAULT false,
  report_time_hours INTEGER DEFAULT 24,
  is_popular BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.health_packages ENABLE ROW LEVEL SECURITY;

-- Anyone can view active packages
CREATE POLICY "Anyone can view active packages"
  ON public.health_packages FOR SELECT
  USING (is_active = true);

-- Admins can manage packages
CREATE POLICY "Admins can manage packages"
  ON public.health_packages FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role));
