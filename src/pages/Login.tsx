import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Shield, Phone, KeyRound, ArrowLeft, Loader2 } from "lucide-react";
import labsetuLogo from "@/assets/labsetu-logo.png";

const Login = () => {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [fullName, setFullName] = useState("");
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [loading, setLoading] = useState(false);
  const { sendOtp, verifyOtp } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.length < 10) {
      toast({ title: "Invalid phone", description: "Enter a valid 10-digit number", variant: "destructive" });
      return;
    }
    setLoading(true);
    const { error } = await sendOtp(phone);
    setLoading(false);
    if (error) {
      toast({ title: "Failed to send OTP", description: error.message || "Try again", variant: "destructive" });
    } else {
      toast({ title: "OTP Sent!", description: "Check your phone for the OTP" });
      setStep("otp");
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await verifyOtp(phone, otp, fullName || undefined, "patient");
    setLoading(false);
    if (error) {
      toast({ title: "Verification failed", description: error.message || "Invalid OTP", variant: "destructive" });
    } else {
      toast({ title: "Welcome to LabSetu! 🎉" });
      navigate("/");
    }
  };

  return (
    <Layout>
      <div className="flex min-h-[60vh] items-center justify-center px-4 py-12">
        <Card className="w-full max-w-sm shadow-lg border-0 bg-card">
          <CardHeader className="text-center pb-2">
            <img src={labsetuLogo} alt="LabSetu" className="mx-auto mb-2 h-10 w-auto" />
            <CardTitle className="font-display text-xl">
              {step === "phone" ? "Welcome to LabSetu" : "Verify OTP"}
            </CardTitle>
            <CardDescription className="text-xs">
              {step === "phone"
                ? "Enter your mobile number to login or create an account"
                : `We've sent a 6-digit code to +91 ${phone}`}
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-2">
            {step === "phone" ? (
              <form onSubmit={handleSendOtp} className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="phone" className="text-xs font-medium">Mobile Number</Label>
                  <div className="flex gap-2">
                    <div className="flex h-9 items-center rounded-md border bg-muted px-2.5 text-sm font-medium text-muted-foreground">+91</div>
                    <div className="relative flex-1">
                      <Phone className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="Enter 10-digit number"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                        required
                        maxLength={10}
                        className="h-9 pl-8 text-sm"
                        autoFocus
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="fullName" className="text-xs font-medium">
                    Your Name <span className="text-muted-foreground font-normal">(for new users)</span>
                  </Label>
                  <Input
                    id="fullName"
                    placeholder="Enter your full name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="h-9 text-sm"
                  />
                </div>

                <Button type="submit" className="w-full h-9 text-sm" disabled={loading || phone.length < 10}>
                  {loading ? (
                    <><Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" /> Sending OTP...</>
                  ) : (
                    "Get OTP"
                  )}
                </Button>

                <div className="flex items-center justify-center gap-1.5 rounded-md bg-muted/50 px-3 py-1.5 text-[10px] text-muted-foreground">
                  <Shield className="h-3 w-3" />
                  Secured with OTP verification
                </div>
              </form>
            ) : (
              <form onSubmit={handleVerifyOtp} className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="otp" className="text-xs font-medium">Enter OTP</Label>
                  <div className="relative">
                    <KeyRound className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="otp"
                      type="text"
                      inputMode="numeric"
                      placeholder="● ● ● ● ● ●"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                      required
                      maxLength={6}
                      className="h-11 pl-9 text-center text-xl tracking-[0.4em] font-mono"
                      autoFocus
                    />
                  </div>
                </div>

                <Button type="submit" className="w-full h-9 text-sm" disabled={loading || otp.length < 6}>
                  {loading ? (
                    <><Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" /> Verifying...</>
                  ) : (
                    "Verify & Continue"
                  )}
                </Button>

                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="w-full gap-1 text-xs"
                  onClick={() => { setStep("phone"); setOtp(""); }}
                >
                  <ArrowLeft className="h-3 w-3" /> Change Number
                </Button>

                <button
                  type="button"
                  className="w-full text-center text-xs text-primary hover:underline disabled:opacity-50"
                  onClick={handleSendOtp}
                  disabled={loading}
                >
                  Resend OTP
                </button>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Login;
