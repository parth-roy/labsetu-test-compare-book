import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { phone } = await req.json();
    if (!phone || phone.length < 10) {
      return new Response(JSON.stringify({ error: "Invalid phone number" }), { status: 400, headers: corsHeaders });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Test mode: OTP is always 123456
    const otpCode = "123456";
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000).toISOString();

    // Delete old OTPs for this phone
    await supabase.from("otp_verifications").delete().eq("phone", phone);

    // Insert new OTP
    const { error } = await supabase.from("otp_verifications").insert({
      phone,
      otp_code: otpCode,
      expires_at: expiresAt,
    });

    if (error) throw error;

    return new Response(
      JSON.stringify({ success: true, message: "OTP sent (test mode: 123456)" }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500, headers: corsHeaders });
  }
});
