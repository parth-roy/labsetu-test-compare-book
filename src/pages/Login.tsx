import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Mail, Lock, User, Loader2, ArrowLeft, CheckCircle, Building2, Smartphone } from "lucide-react";
import labsetuLogo from "@/assets/labsetu-logo.png";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [selectedRole, setSelectedRole] = useState<"patient" | "lab_partner">("patient");
  const [mode, setMode] = useState<"login" | "signup" | "forgot" | "verify">("login");
  const [loginMethod, setLoginMethod] = useState<"email" | "phone">("email");
  const [loading, setLoading] = useState(false);
  const { signIn, signUp, resetPassword } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  // OTP state
  const [phone, setPhone] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpMode, setOtpMode] = useState<"test" | "live">("test");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await signIn(email, password);
    setLoading(false);
    if (error) {
      toast({ title: "Login failed", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Welcome back! 🎉" });
      navigate("/");
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) {
      toast({ title: "Password too short", description: "Use at least 6 characters", variant: "destructive" });
      return;
    }
    setLoading(true);
    const { error } = await signUp(email, password, fullName, selectedRole);
    setLoading(false);
    if (error) {
      toast({ title: "Signup failed", description: error.message, variant: "destructive" });
    } else {
      setMode("verify");
    }
  };

  const handleForgot = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await resetPassword(email);
    setLoading(false);
    if (error) {
      toast({ title: "Failed", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Reset email sent", description: "Check your inbox for the reset link" });
      setMode("login");
    }
  };

  const handleSendOtp = async () => {
    if (!phone || phone.length < 10) {
      toast({ title: "Enter a valid phone number", variant: "destructive" });
      return;
    }
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("send-otp", {
        body: { phone: phone.replace(/\D/g, "").slice(-10) },
      });
      if (error) throw error;
      setOtpSent(true);
      setOtpMode(data?.mode === "live" ? "live" : "test");
      toast({ title: "OTP Sent!", description: data?.mode === "test" ? "Test mode: use 123456" : "Check your phone for OTP" });
    } catch (err: any) {
      toast({ title: "Failed to send OTP", description: err.message, variant: "destructive" });
    }
    setLoading(false);
  };

  const handleVerifyOtp = async () => {
    if (otp.length < 6) return;
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("verify-otp", {
        body: { phone: phone.replace(/\D/g, "").slice(-10), otp },
      });
      if (error) throw error;
      if (data?.verified) {
        toast({ title: "Phone verified! 🎉" });
        // For OTP login, we sign in with a phone-email convention
        const phoneEmail = `${phone.replace(/\D/g, "").slice(-10)}@labsetu.phone`;
        const { error: signInErr } = await signIn(phoneEmail, `otp_${phone.replace(/\D/g, "").slice(-10)}`);
        if (signInErr) {
          // Try signup first if doesn't exist
          await signUp(phoneEmail, `otp_${phone.replace(/\D/g, "").slice(-10)}`, `User ${phone.slice(-4)}`, "patient");
          const { error: retryErr } = await signIn(phoneEmail, `otp_${phone.replace(/\D/g, "").slice(-10)}`);
          if (retryErr) {
            toast({ title: "Login failed", description: "Phone login error. Try email instead.", variant: "destructive" });
          } else {
            navigate("/");
          }
        } else {
          navigate("/");
        }
      } else {
        toast({ title: "Invalid OTP", description: data?.error || "Please try again", variant: "destructive" });
      }
    } catch (err: any) {
      toast({ title: "Verification failed", description: err.message, variant: "destructive" });
    }
    setLoading(false);
  };

  if (mode === "verify") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4">
        <Card className="w-full max-w-sm border-0 shadow-lg">
          <CardContent className="p-8 text-center">
            <CheckCircle className="mx-auto mb-4 h-14 w-14 text-primary" />
            <h2 className="mb-2 font-display text-xl font-bold">Check your email</h2>
            <p className="mb-6 text-sm text-muted-foreground">
              We've sent a verification link to <strong>{email}</strong>. Click the link to activate your account.
            </p>
            <Button variant="outline" className="w-full" onClick={() => setMode("login")}>
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Login
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <Card className="w-full max-w-sm border-0 shadow-lg">
        <CardHeader className="pb-2 text-center">
          <Link to="/">
            <img src={labsetuLogo} alt="LabSetu" className="mx-auto mb-2 h-10 w-auto" />
          </Link>
          <CardTitle className="font-display text-xl">
            {mode === "login" ? "Welcome back" : mode === "signup" ? "Create account" : "Reset password"}
          </CardTitle>
          <CardDescription className="text-xs">
            {mode === "login"
              ? "Sign in to your LabSetu account"
              : mode === "signup"
              ? "Join LabSetu as a customer or lab partner"
              : "Enter your email to receive a reset link"}
          </CardDescription>
        </CardHeader>

        <CardContent className="pt-2">
          {mode === "forgot" ? (
            <form onSubmit={handleForgot} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-xs">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                  <Input id="email" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required className="h-9 pl-8 text-sm" autoFocus />
                </div>
              </div>
              <Button type="submit" className="w-full h-9 text-sm" disabled={loading}>
                {loading ? <><Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" /> Sending...</> : "Send Reset Link"}
              </Button>
              <Button type="button" variant="ghost" size="sm" className="w-full text-xs" onClick={() => setMode("login")}>
                <ArrowLeft className="mr-1 h-3 w-3" /> Back to Login
              </Button>
            </form>
          ) : mode === "login" ? (
            <div className="space-y-4">
              <Tabs value={loginMethod} onValueChange={(v) => setLoginMethod(v as "email" | "phone")}>
                <TabsList className="grid w-full grid-cols-2 h-9">
                  <TabsTrigger value="email" className="text-xs gap-1.5"><Mail className="h-3.5 w-3.5" /> Email</TabsTrigger>
                  <TabsTrigger value="phone" className="text-xs gap-1.5"><Smartphone className="h-3.5 w-3.5" /> Phone OTP</TabsTrigger>
                </TabsList>

                <TabsContent value="email" className="mt-4">
                  <form onSubmit={handleLogin} className="space-y-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="loginEmail" className="text-xs">Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                        <Input id="loginEmail" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required className="h-9 pl-8 text-sm" />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="loginPassword" className="text-xs">Password</Label>
                        <button type="button" className="text-[10px] text-primary hover:underline" onClick={() => setMode("forgot")}>
                          Forgot password?
                        </button>
                      </div>
                      <div className="relative">
                        <Lock className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                        <Input id="loginPassword" type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} className="h-9 pl-8 text-sm" />
                      </div>
                    </div>
                    <Button type="submit" className="w-full h-9 text-sm" disabled={loading}>
                      {loading ? <><Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" /> Signing in...</> : "Sign In"}
                    </Button>
                  </form>
                </TabsContent>

                <TabsContent value="phone" className="mt-4 space-y-4">
                  {!otpSent ? (
                    <>
                      <div className="space-y-1.5">
                        <Label className="text-xs">Phone Number</Label>
                        <div className="relative">
                          <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">+91</span>
                          <Input placeholder="Enter 10-digit number" value={phone} onChange={(e) => setPhone(e.target.value)} className="h-9 pl-10 text-sm" maxLength={10} />
                        </div>
                      </div>
                      <Button className="w-full h-9 text-sm" onClick={handleSendOtp} disabled={loading}>
                        {loading ? <><Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" /> Sending...</> : "Send OTP"}
                      </Button>
                    </>
                  ) : (
                    <>
                      <p className="text-xs text-center text-muted-foreground">
                        OTP sent to +91 {phone} {otpMode === "test" && <span className="text-primary">(Test: 123456)</span>}
                      </p>
                      <div className="flex justify-center">
                        <InputOTP maxLength={6} value={otp} onChange={setOtp}>
                          <InputOTPGroup>
                            {[0, 1, 2, 3, 4, 5].map((i) => (
                              <InputOTPSlot key={i} index={i} />
                            ))}
                          </InputOTPGroup>
                        </InputOTP>
                      </div>
                      <Button className="w-full h-9 text-sm" onClick={handleVerifyOtp} disabled={loading || otp.length < 6}>
                        {loading ? <><Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" /> Verifying...</> : "Verify & Login"}
                      </Button>
                      <Button variant="ghost" size="sm" className="w-full text-xs" onClick={() => { setOtpSent(false); setOtp(""); }}>
                        Change Number
                      </Button>
                    </>
                  )}
                </TabsContent>
              </Tabs>

              <p className="text-center text-xs text-muted-foreground">
                Don't have an account?{" "}
                <button type="button" className="text-primary hover:underline font-medium" onClick={() => { setMode("signup"); setPassword(""); }}>
                  Sign up
                </button>
              </p>
            </div>
          ) : (
            <form onSubmit={handleSignUp} className="space-y-4">
              {/* Role selection */}
              <div className="space-y-1.5">
                <Label className="text-xs">I am a</Label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedRole("patient")}
                    className={`flex flex-col items-center gap-1 rounded-lg border-2 p-3 text-xs font-medium transition-all ${
                      selectedRole === "patient"
                        ? "border-primary bg-primary/5 text-primary"
                        : "border-border text-muted-foreground hover:border-primary/40"
                    }`}
                  >
                    <User className="h-5 w-5" />
                    Customer
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedRole("lab_partner")}
                    className={`flex flex-col items-center gap-1 rounded-lg border-2 p-3 text-xs font-medium transition-all ${
                      selectedRole === "lab_partner"
                        ? "border-primary bg-primary/5 text-primary"
                        : "border-border text-muted-foreground hover:border-primary/40"
                    }`}
                  >
                    <Building2 className="h-5 w-5" />
                    Lab Owner
                  </button>
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="fullName" className="text-xs">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                  <Input id="fullName" placeholder="Your full name" value={fullName} onChange={(e) => setFullName(e.target.value)} required className="h-9 pl-8 text-sm" />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="signupEmail" className="text-xs">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                  <Input id="signupEmail" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required className="h-9 pl-8 text-sm" />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="signupPassword" className="text-xs">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                  <Input id="signupPassword" type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} className="h-9 pl-8 text-sm" />
                </div>
              </div>

              <Button type="submit" className="w-full h-9 text-sm" disabled={loading}>
                {loading ? <><Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" /> Creating account...</> : "Create Account"}
              </Button>

              <p className="text-center text-xs text-muted-foreground">
                Already have an account?{" "}
                <button type="button" className="text-primary hover:underline font-medium" onClick={() => { setMode("login"); setPassword(""); }}>
                  Sign in
                </button>
              </p>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
