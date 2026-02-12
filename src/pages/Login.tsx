import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Phone, Shield } from "lucide-react";

const Login = () => {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [fullName, setFullName] = useState("");
  const [role, setRole] = useState("patient");
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [isNewUser, setIsNewUser] = useState(false);
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
      toast({ title: "OTP Sent!", description: "Test mode: Use 123456" });
      setStep("otp");
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await verifyOtp(phone, otp, fullName || undefined, role);
    setLoading(false);
    if (error) {
      toast({ title: "Verification failed", description: error.message || "Invalid OTP", variant: "destructive" });
    } else {
      toast({ title: "Welcome!" });
      navigate("/");
    }
  };

  return (
    <Layout>
      <div className="flex min-h-[60vh] items-center justify-center py-12">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-xl bg-primary">
              <Phone className="h-6 w-6 text-primary-foreground" />
            </div>
            <CardTitle className="font-display text-2xl">Login / Sign Up</CardTitle>
            <CardDescription>Enter your mobile number to continue</CardDescription>
            <div className="mt-2 flex items-center justify-center gap-1 rounded-md bg-accent/50 px-3 py-1.5 text-xs text-muted-foreground">
              <Shield className="h-3 w-3" />
              Test Mode: OTP is always 123456
            </div>
          </CardHeader>
          <CardContent>
            {step === "phone" ? (
              <form onSubmit={handleSendOtp} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Mobile Number</Label>
                  <div className="flex gap-2">
                    <div className="flex h-10 items-center rounded-md border bg-muted px-3 text-sm text-muted-foreground">+91</div>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="9330490777"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                      required
                      maxLength={10}
                    />
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="newUser"
                    checked={isNewUser}
                    onChange={(e) => setIsNewUser(e.target.checked)}
                    className="rounded"
                  />
                  <Label htmlFor="newUser" className="text-sm cursor-pointer">I'm a new user</Label>
                </div>
                {isNewUser && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="fullName">Full Name</Label>
                      <Input id="fullName" placeholder="Your name" value={fullName} onChange={(e) => setFullName(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label>I am a</Label>
                      <Select value={role} onValueChange={setRole}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="patient">Patient</SelectItem>
                          <SelectItem value="lab_partner">Lab Partner</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </>
                )}
                <Button type="submit" className="w-full" disabled={loading || phone.length < 10}>
                  {loading ? "Sending OTP..." : "Get OTP"}
                </Button>
              </form>
            ) : (
              <form onSubmit={handleVerifyOtp} className="space-y-4">
                <p className="text-sm text-muted-foreground">OTP sent to <strong>+91 {phone}</strong></p>
                <div className="space-y-2">
                  <Label htmlFor="otp">Enter OTP</Label>
                  <Input
                    id="otp"
                    type="text"
                    placeholder="123456"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                    required
                    maxLength={6}
                    className="text-center text-2xl tracking-[0.5em]"
                  />
                </div>
                <Button type="submit" className="w-full" disabled={loading || otp.length < 6}>
                  {loading ? "Verifying..." : "Verify & Continue"}
                </Button>
                <Button type="button" variant="ghost" className="w-full" onClick={() => { setStep("phone"); setOtp(""); }}>
                  Change Number
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Login;
