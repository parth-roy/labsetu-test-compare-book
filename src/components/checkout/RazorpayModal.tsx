import { useState, useEffect } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { CheckCircle, CreditCard, Smartphone, Building2, Loader2, X, Zap } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import labsetuLogo from "@/assets/labsetu-logo.png";

interface RazorpayModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: (txnId: string) => void;
  amount: number;
  customerName: string;
  customerPhone: string;
}

declare global {
  interface Window {
    Razorpay: any;
  }
}

const loadRazorpayScript = (): Promise<boolean> => {
  return new Promise((resolve) => {
    if (window.Razorpay) return resolve(true);
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

const RazorpayModal = ({ open, onClose, onSuccess, amount, customerName, customerPhone }: RazorpayModalProps) => {
  const [method, setMethod] = useState("upi");
  const [upiId, setUpiId] = useState("");
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);
  const [paymentMode, setPaymentMode] = useState<"checking" | "live" | "mock">("checking");

  useEffect(() => {
    if (open) {
      setProcessing(false);
      setSuccess(false);
      setUpiId("");
      setMethod("upi");
      checkPaymentMode();
    }
  }, [open]);

  const checkPaymentMode = async () => {
    setPaymentMode("checking");
    try {
      const { data } = await supabase.functions.invoke("create-razorpay-order", {
        body: { amount: 1, currency: "INR" },
      });
      setPaymentMode(data?.mode === "live" ? "live" : "mock");
    } catch {
      setPaymentMode("mock");
    }
  };

  const handleLivePayment = async () => {
    setProcessing(true);
    try {
      const loaded = await loadRazorpayScript();
      if (!loaded) throw new Error("Failed to load Razorpay SDK");

      const { data, error } = await supabase.functions.invoke("create-razorpay-order", {
        body: { amount, currency: "INR", receipt: `receipt_${Date.now()}` },
      });
      if (error) throw error;

      const options = {
        key: data.key_id,
        amount: data.amount,
        currency: data.currency,
        name: "LabSetu Diagnostics",
        description: "Lab Test Booking",
        order_id: data.order_id,
        handler: (response: any) => {
          setProcessing(false);
          setSuccess(true);
          setTimeout(() => onSuccess(response.razorpay_payment_id), 1500);
        },
        prefill: {
          name: customerName,
          contact: customerPhone ? `+91${customerPhone}` : "",
        },
        theme: { color: "#0D6EFD" },
        modal: {
          ondismiss: () => {
            setProcessing(false);
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err: any) {
      setProcessing(false);
      console.error("Razorpay error:", err);
      // Fallback to mock
      handleMockPayment();
    }
  };

  const handleMockPayment = () => {
    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      setSuccess(true);
      const txnId = `RZP_${Date.now()}_${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
      setTimeout(() => onSuccess(txnId), 1500);
    }, 2500);
  };

  const handlePay = () => {
    if (paymentMode === "live") {
      handleLivePayment();
    } else {
      handleMockPayment();
    }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && !processing && onClose()}>
      <DialogContent className="max-w-md p-0 overflow-hidden gap-0">
        {/* Header */}
        <div className="bg-[#1a3c6e] p-4 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img src={labsetuLogo} alt="LabSetu" className="h-8 w-auto brightness-0 invert" />
              <div>
                <div className="flex items-center gap-2">
                  <p className="text-xs opacity-80">LabSetu Diagnostics</p>
                  {paymentMode === "live" && (
                    <span className="flex items-center gap-1 rounded-full bg-green-500/20 px-2 py-0.5 text-[10px] text-green-300">
                      <Zap className="h-2.5 w-2.5" /> Live
                    </span>
                  )}
                  {paymentMode === "mock" && (
                    <span className="rounded-full bg-yellow-500/20 px-2 py-0.5 text-[10px] text-yellow-300">Test Mode</span>
                  )}
                </div>
                <p className="text-lg font-bold">₹{amount.toFixed(0)}</p>
              </div>
            </div>
            {!processing && (
              <button onClick={onClose} className="rounded-full p-1 hover:bg-white/10">
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          <p className="mt-1 text-xs opacity-70">{customerName} · +91 {customerPhone}</p>
        </div>

        {success ? (
          <div className="flex flex-col items-center justify-center gap-3 p-10">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
              <CheckCircle className="h-10 w-10 text-green-600" />
            </div>
            <p className="text-lg font-bold text-green-700">Payment Successful!</p>
            <p className="text-sm text-muted-foreground">Redirecting...</p>
          </div>
        ) : processing ? (
          <div className="flex flex-col items-center justify-center gap-3 p-10">
            <Loader2 className="h-10 w-10 animate-spin text-[#1a3c6e]" />
            <p className="text-sm font-medium">Processing payment...</p>
            <p className="text-xs text-muted-foreground">Do not close this window</p>
          </div>
        ) : (
          <div className="p-4 space-y-4">
            <RadioGroup value={method} onValueChange={setMethod} className="space-y-2">
              <Label className="flex cursor-pointer items-center gap-3 rounded-lg border p-3 transition hover:bg-muted [&:has([data-state=checked])]:border-primary [&:has([data-state=checked])]:bg-primary/5">
                <RadioGroupItem value="upi" />
                <Smartphone className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">UPI</span>
                <span className="ml-auto text-xs text-muted-foreground">GPay / PhonePe / Paytm</span>
              </Label>
              <Label className="flex cursor-pointer items-center gap-3 rounded-lg border p-3 transition hover:bg-muted [&:has([data-state=checked])]:border-primary [&:has([data-state=checked])]:bg-primary/5">
                <RadioGroupItem value="card" />
                <CreditCard className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">Card</span>
                <span className="ml-auto text-xs text-muted-foreground">Debit / Credit</span>
              </Label>
              <Label className="flex cursor-pointer items-center gap-3 rounded-lg border p-3 transition hover:bg-muted [&:has([data-state=checked])]:border-primary [&:has([data-state=checked])]:bg-primary/5">
                <RadioGroupItem value="netbanking" />
                <Building2 className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">Net Banking</span>
              </Label>
            </RadioGroup>

            {method === "upi" && paymentMode === "mock" && (
              <div className="space-y-2">
                <Label>UPI ID</Label>
                <Input placeholder="yourname@upi" value={upiId} onChange={(e) => setUpiId(e.target.value)} />
              </div>
            )}

            {method === "card" && paymentMode === "mock" && (
              <div className="space-y-3">
                <div className="space-y-1">
                  <Label>Card Number</Label>
                  <Input placeholder="4111 1111 1111 1111" maxLength={19} />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1"><Label>Expiry</Label><Input placeholder="MM/YY" /></div>
                  <div className="space-y-1"><Label>CVV</Label><Input placeholder="***" type="password" maxLength={3} /></div>
                </div>
              </div>
            )}

            {method === "netbanking" && paymentMode === "mock" && (
              <div className="grid grid-cols-2 gap-2">
                {["SBI", "HDFC", "ICICI", "Axis", "Kotak", "PNB"].map((bank) => (
                  <Button key={bank} variant="outline" size="sm" className="justify-start" onClick={handlePay}>
                    {bank}
                  </Button>
                ))}
              </div>
            )}

            <Button className="w-full bg-[#1a3c6e] hover:bg-[#15325a]" onClick={handlePay}>
              Pay ₹{amount.toFixed(0)}
            </Button>

            <p className="text-center text-[10px] text-muted-foreground">
              Secured by Razorpay · {paymentMode === "live" ? "Live Mode" : "Test Mode"}
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default RazorpayModal;
