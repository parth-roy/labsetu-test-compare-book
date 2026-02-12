import { supabase } from "@/integrations/supabase/client";

export const trackEvent = async (
  eventType: string,
  options?: { labId?: string; testId?: string; planId?: string; metadata?: Record<string, any> }
) => {
  const { data: { user } } = await supabase.auth.getUser();
  await supabase.from("analytics_events").insert({
    user_id: user?.id || null,
    event_type: eventType,
    lab_id: options?.labId || null,
    test_id: options?.testId || null,
    plan_id: options?.planId || null,
    metadata: options?.metadata || {},
  });
};
