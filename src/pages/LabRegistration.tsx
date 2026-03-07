import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Building2, Upload, CreditCard, Loader2, CheckCircle } from "lucide-react";

const LabRegistration = () => {
  const { user, role } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [companyName, setCompanyName] = useState("");
  const [companyType, setCompanyType] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [description, setDescription] = useState("");
  const [certificates, setCertificates] = useState("");
  const [tradeLicense, setTradeLicense] = useState<File | null>(null);
  const [bankAccount, setBankAccount] = useState("");
  const [ifscCode, setIfscCode] = useState("");
  const [cancelledCheque, setCancelledCheque] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  if (!user) {
    navigate("/login");
    return null;
  }

  const uploadFile = async (file: File, folder: string) => {
    const ext = file.name.split(".").pop();
    const path = `${user.id}/${folder}/${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from("lab-documents").upload(path, file);
    if (error) throw error;
    return path;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyName || !companyType || !address || !city) {
      toast({ title: "Fill required fields", variant: "destructive" });
      return;
    }
    setLoading(true);
    try {
      let tradeLicenseUrl = null;
      let cancelledChequeUrl = null;

      if (tradeLicense) {
        tradeLicenseUrl = await uploadFile(tradeLicense, "trade-license");
      }
      if (cancelledCheque) {
        cancelledChequeUrl = await uploadFile(cancelledCheque, "cancelled-cheque");
      }

      const { error } = await supabase.from("labs").insert({
        owner_id: user.id,
        name: companyName,
        company_type: companyType,
        address,
        city,
        phone,
        email,
        description,
        certificates,
        trade_license_url: tradeLicenseUrl,
        bank_account_number: bankAccount,
        ifsc_code: ifscCode,
        cancelled_cheque_url: cancelledChequeUrl,
        status: "submitted",
        is_approved: false,
      } as any);

      if (error) throw error;
      setSubmitted(true);
      toast({ title: "Registration submitted! 🎉" });
    } catch (err: any) {
      toast({ title: "Submission failed", description: err.message, variant: "destructive" });
    }
    setLoading(false);
  };

  if (submitted) {
    return (
      <Layout>
        <div className="flex min-h-[60vh] items-center justify-center px-4">
          <Card className="w-full max-w-md border-0 text-center shadow-lg">
            <CardContent className="p-8">
              <CheckCircle className="mx-auto mb-4 h-14 w-14 text-primary" />
              <h2 className="mb-2 font-display text-xl font-bold">Registration Submitted!</h2>
              <p className="mb-6 text-sm text-muted-foreground">
                Your lab registration is under review. You'll be notified once approved by admin.
              </p>
              <Button onClick={() => navigate("/")}>Go Home</Button>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container max-w-2xl py-8">
        <h1 className="mb-6 font-display text-2xl font-bold">Lab Partner Registration</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Company Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg"><Building2 className="h-5 w-5" /> Company Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1.5">
                <Label className="text-xs">Company / Lab Name *</Label>
                <Input value={companyName} onChange={(e) => setCompanyName(e.target.value)} placeholder="e.g. HealthFirst Diagnostics" required />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Type of Company *</Label>
                <Select value={companyType} onValueChange={setCompanyType} required>
                  <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="proprietor">Proprietor</SelectItem>
                    <SelectItem value="partnership">Partnership</SelectItem>
                    <SelectItem value="company">Company</SelectItem>
                    <SelectItem value="huf">HUF</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs">City *</Label>
                  <Input value={city} onChange={(e) => setCity(e.target.value)} placeholder="Kolkata" required />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Phone</Label>
                  <Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="9876543210" />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Address *</Label>
                <Textarea value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Full lab address" required />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Email</Label>
                <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="lab@example.com" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Description</Label>
                <Textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Brief about your lab" />
              </div>
            </CardContent>
          </Card>

          {/* Certificates */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg"><Upload className="h-5 w-5" /> Certificates & Documents</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1.5">
                <Label className="text-xs">Certificates Held (NABL, ISO, etc.)</Label>
                <Input value={certificates} onChange={(e) => setCertificates(e.target.value)} placeholder="NABL, ISO 15189" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Trade License Certificate (PDF/Image)</Label>
                <Input type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={(e) => setTradeLicense(e.target.files?.[0] || null)} />
              </div>
            </CardContent>
          </Card>

          {/* Bank Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg"><CreditCard className="h-5 w-5" /> Bank Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1.5">
                <Label className="text-xs">Bank Account Number</Label>
                <Input value={bankAccount} onChange={(e) => setBankAccount(e.target.value)} placeholder="Account number" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">IFSC Code</Label>
                <Input value={ifscCode} onChange={(e) => setIfscCode(e.target.value)} placeholder="e.g. SBIN0001234" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Cancelled Cheque (PDF/Image)</Label>
                <Input type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={(e) => setCancelledCheque(e.target.files?.[0] || null)} />
              </div>
            </CardContent>
          </Card>

          <Button type="submit" className="w-full" disabled={loading} size="lg">
            {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Submitting...</> : "Submit for Review"}
          </Button>
        </form>
      </div>
    </Layout>
  );
};

export default LabRegistration;
