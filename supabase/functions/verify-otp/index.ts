import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { phone, otp, fullName, role } = await req.json();
    if (!phone || !otp) {
      return new Response(JSON.stringify({ error: "Phone and OTP required" }), { status: 400, headers: corsHeaders });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Check OTP
    const { data: otpRecord, error: otpError } = await supabase
      .from("otp_verifications")
      .select("*")
      .eq("phone", phone)
      .eq("otp_code", otp)
      .eq("verified", false)
      .gte("expires_at", new Date().toISOString())
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    if (otpError || !otpRecord) {
      // Increment attempts
      await supabase
        .from("otp_verifications")
        .update({ attempts: (otpRecord?.attempts || 0) + 1 })
        .eq("phone", phone);
      return new Response(JSON.stringify({ error: "Invalid or expired OTP" }), { status: 401, headers: corsHeaders });
    }

    if (otpRecord.attempts >= 5) {
      return new Response(JSON.stringify({ error: "Too many attempts. Request a new OTP." }), { status: 429, headers: corsHeaders });
    }

    // Mark OTP as verified
    await supabase.from("otp_verifications").update({ verified: true }).eq("id", otpRecord.id);

    // Create email from phone (for Supabase auth)
    const fakeEmail = `${phone}@labsetu.phone`;
    const password = `otp_${phone}_${Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!.slice(-8)}`;

    // Try to sign in first (existing user)
    const { data: signInData, error: signInError } = await supabase.auth.admin.listUsers();
    const existingUser = signInData?.users?.find(
      (u) => u.email === fakeEmail || u.phone === phone
    );

    let userId: string;

    if (existingUser) {
      userId = existingUser.id;
    } else {
      // Create new user
      const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
        email: fakeEmail,
        password,
        email_confirm: true,
        phone,
        phone_confirm: true,
        user_metadata: {
          full_name: fullName || `User ${phone.slice(-4)}`,
          role: role || "patient",
          phone,
        },
      });

      if (createError) throw createError;
      userId = newUser.user.id;
    }

    // Generate session token
    const { data: sessionData, error: sessionError } = await supabase.auth.admin.generateLink({
      type: "magiclink",
      email: fakeEmail,
    });

    // Use signInWithPassword for the session
    const anonClient = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!
    );

    const { data: session, error: loginError } = await anonClient.auth.signInWithPassword({
      email: fakeEmail,
      password,
    });

    if (loginError) {
      // Update password and retry
      await supabase.auth.admin.updateUserById(userId, { password });
      const { data: retrySession, error: retryError } = await anonClient.auth.signInWithPassword({
        email: fakeEmail,
        password,
      });
      if (retryError) throw retryError;
      return new Response(
        JSON.stringify({ success: true, session: retrySession.session, user: retrySession.user }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ success: true, session: session.session, user: session.user }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500, headers: corsHeaders });
  }
});
