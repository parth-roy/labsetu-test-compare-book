import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Mail, Lock, User, Loader2, ArrowLeft, CheckCircle, Building2 } from "lucide-react";
import labsetuLogo from "@/assets/labsetu-logo.png";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [selectedRole, setSelectedRole] = useState<"patient" | "lab_partner">("patient");
  const [mode, setMode] = useState<"login" | "signup" | "forgot" | "verify">("login");
  const [loading, setLoading] = useState(false);
  const { signIn, signUp, resetPassword } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

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
          ) : (
            <form onSubmit={mode === "login" ? handleLogin : handleSignUp} className="space-y-4">
              {mode === "signup" && (
                <>
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
                </>
              )}

              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-xs">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                  <Input id="email" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required className="h-9 pl-8 text-sm" autoFocus />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-xs">Password</Label>
                  {mode === "login" && (
                    <button type="button" className="text-[10px] text-primary hover:underline" onClick={() => setMode("forgot")}>
                      Forgot password?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Lock className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                  <Input id="password" type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} className="h-9 pl-8 text-sm" />
                </div>
              </div>

              <Button type="submit" className="w-full h-9 text-sm" disabled={loading}>
                {loading ? (
                  <><Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" /> {mode === "login" ? "Signing in..." : "Creating account..."}</>
                ) : (
                  mode === "login" ? "Sign In" : "Create Account"
                )}
              </Button>

              <p className="text-center text-xs text-muted-foreground">
                {mode === "login" ? "Don't have an account? " : "Already have an account? "}
                <button type="button" className="text-primary hover:underline font-medium" onClick={() => { setMode(mode === "login" ? "signup" : "login"); setPassword(""); }}>
                  {mode === "login" ? "Sign up" : "Sign in"}
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
