import { useState, useEffect } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { CheckCircle, CreditCard, Smartphone, Building2, Loader2, X } from "lucide-react";
import labsetuLogo from "@/assets/labsetu-logo.png";

interface RazorpayModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: (txnId: string) => void;
  amount: number;
  customerName: string;
  customerPhone: string;
}

const RazorpayModal = ({ open, onClose, onSuccess, amount, customerName, customerPhone }: RazorpayModalProps) => {
  const [method, setMethod] = useState("upi");
  const [upiId, setUpiId] = useState("");
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (open) {
      setProcessing(false);
      setSuccess(false);
      setUpiId("");
      setMethod("upi");
    }
  }, [open]);

  const handlePay = () => {
    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      setSuccess(true);
      const txnId = `RZP_${Date.now()}_${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
      setTimeout(() => onSuccess(txnId), 1500);
    }, 2500);
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && !processing && onClose()}>
      <DialogContent className="max-w-md p-0 overflow-hidden gap-0">
        {/* Razorpay-style header */}
        <div className="bg-[#1a3c6e] p-4 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img src={labsetuLogo} alt="LabSetu" className="h-8 w-auto brightness-0 invert" />
              <div>
                <p className="text-xs opacity-80">LabSetu Diagnostics</p>
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

            {method === "upi" && (
              <div className="space-y-2">
                <Label>UPI ID</Label>
                <Input placeholder="yourname@upi" value={upiId} onChange={(e) => setUpiId(e.target.value)} />
              </div>
            )}

            {method === "card" && (
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

            {method === "netbanking" && (
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
              Secured by Razorpay · Test Mode
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default RazorpayModal;
