import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
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

    const MSG91_AUTH_KEY = Deno.env.get("MSG91_AUTH_KEY");
    const MSG91_TEMPLATE_ID = Deno.env.get("MSG91_TEMPLATE_ID");

    // Generate random 6-digit OTP
    const otpCode = MSG91_AUTH_KEY
      ? String(Math.floor(100000 + Math.random() * 900000))
      : "123456"; // fallback test mode

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

    // Send via MSG91 if configured
    if (MSG91_AUTH_KEY && MSG91_TEMPLATE_ID) {
      const phoneWithCode = phone.startsWith("91") ? phone : `91${phone}`;
      const msg91Res = await fetch("https://control.msg91.com/api/v5/otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "authkey": MSG91_AUTH_KEY,
        },
        body: JSON.stringify({
          template_id: MSG91_TEMPLATE_ID,
          mobile: phoneWithCode,
          otp: otpCode,
        }),
      });

      const msg91Data = await msg91Res.json();
      console.log("MSG91 response:", JSON.stringify(msg91Data));

      if (msg91Data.type === "error") {
        return new Response(
          JSON.stringify({ success: true, message: "OTP sent (fallback mode)", mode: "test" }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      return new Response(
        JSON.stringify({ success: true, message: "OTP sent to your phone", mode: "live" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ success: true, message: "OTP sent (test mode: 123456)", mode: "test" }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500, headers: corsHeaders });
  }
});
