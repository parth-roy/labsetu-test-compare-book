
-- OTP verifications for phone auth
CREATE TABLE public.otp_verifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  phone text NOT NULL,
  otp_code text NOT NULL,
  verified boolean DEFAULT false,
  attempts integer DEFAULT 0,
  expires_at timestamp with time zone NOT NULL,
  created_at timestamp with time zone DEFAULT now()
);
ALTER TABLE public.otp_verifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can insert OTP" ON public.otp_verifications FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can read OTP" ON public.otp_verifications FOR SELECT USING (true);
CREATE POLICY "Anyone can update OTP" ON public.otp_verifications FOR UPDATE USING (true);

-- Add phone to profiles if not exists
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS phone text;

-- Payments table
CREATE TABLE public.payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id uuid REFERENCES public.bookings(id),
  user_id uuid NOT NULL,
  amount numeric NOT NULL,
  gst_amount numeric DEFAULT 0,
  discount_amount numeric DEFAULT 0,
  total_amount numeric NOT NULL,
  payment_method text DEFAULT 'mock',
  payment_status text DEFAULT 'pending',
  transaction_id text,
  razorpay_order_id text,
  razorpay_payment_id text,
  razorpay_signature text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own payments" ON public.payments FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create payments" ON public.payments FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins can manage payments" ON public.payments FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- Analytics events tracking
CREATE TABLE public.analytics_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid,
  event_type text NOT NULL,
  lab_id uuid REFERENCES public.labs(id),
  test_id uuid REFERENCES public.tests(id),
  plan_id text,
  metadata jsonb DEFAULT '{}',
  created_at timestamp with time zone DEFAULT now()
);
ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can insert events" ON public.analytics_events FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can view all events" ON public.analytics_events FOR SELECT USING (has_role(auth.uid(), 'admin'::app_role));

-- Discounts table
CREATE TABLE public.discounts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text UNIQUE NOT NULL,
  discount_percent numeric DEFAULT 0,
  discount_flat numeric DEFAULT 0,
  min_amount numeric DEFAULT 0,
  max_uses integer DEFAULT 100,
  used_count integer DEFAULT 0,
  is_active boolean DEFAULT true,
  expires_at timestamp with time zone,
  created_at timestamp with time zone DEFAULT now()
);
ALTER TABLE public.discounts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view active discounts" ON public.discounts FOR SELECT USING (is_active = true);
CREATE POLICY "Admins can manage discounts" ON public.discounts FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- Update trigger for payments
CREATE TRIGGER update_payments_updated_at BEFORE UPDATE ON public.payments FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
