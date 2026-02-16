import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useCart } from "@/hooks/useCart";
import { useToast } from "@/hooks/use-toast";
import RazorpayModal from "@/components/checkout/RazorpayModal";
import { CheckCircle, ShoppingCart, CreditCard, Calendar } from "lucide-react";

const Checkout = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { items, totalPrice, clearCart } = useCart();
  const { toast } = useToast();

  const [step, setStep] = useState(1);
  const [patientName, setPatientName] = useState("");
  const [patientAge, setPatientAge] = useState("");
  const [patientGender, setPatientGender] = useState("male");
  const [bookingDate, setBookingDate] = useState("");
  const [timeSlot, setTimeSlot] = useState("09:00-10:00");
  const [isHomeCollection, setIsHomeCollection] = useState(false);
  const [address, setAddress] = useState("");
  const [discountCode, setDiscountCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [gstEnabled, setGstEnabled] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [paymentDone, setPaymentDone] = useState(false);
  const [razorpayOpen, setRazorpayOpen] = useState(false);

  if (!user) {
    return (
      <Layout>
        <div className="container py-12 text-center">
          <h2 className="mb-4 text-2xl font-bold">Please login to checkout</h2>
          <Button onClick={() => navigate("/login")}>Login</Button>
        </div>
      </Layout>
    );
  }

  if (items.length === 0 && !paymentDone) {
    return (
      <Layout>
        <div className="container py-12 text-center">
          <ShoppingCart className="mx-auto mb-4 h-12 w-12 text-muted-foreground opacity-40" />
          <h2 className="mb-2 text-xl font-bold">Your cart is empty</h2>
          <Button onClick={() => navigate("/search")}>Browse Tests</Button>
        </div>
      </Layout>
    );
  }

  const gstAmount = gstEnabled ? totalPrice * 0.18 : 0;
  const finalAmount = totalPrice - discount + gstAmount;

  const applyDiscount = async () => {
    if (!discountCode) return;
    const { data } = await supabase
      .from("discounts")
      .select("*")
      .eq("code", discountCode.toUpperCase())
      .eq("is_active", true)
      .single();
    if (data) {
      const disc = data.discount_percent ? (totalPrice * Number(data.discount_percent)) / 100 : Number(data.discount_flat) || 0;
      setDiscount(disc);
      toast({ title: "Discount applied!", description: `₹${disc} off` });
    } else {
      toast({ title: "Invalid code", variant: "destructive" });
    }
  };

  const handlePaymentSuccess = async (txnId: string) => {
    setRazorpayOpen(false);
    setSubmitting(true);
    try {
      for (const item of items) {
        const { data: booking, error: bookErr } = await supabase.from("bookings").insert({
          patient_id: user.id,
          lab_id: item.id,
          lab_test_id: item.labTestId,
          patient_name: patientName,
          patient_age: parseInt(patientAge),
          patient_gender: patientGender,
          booking_date: bookingDate,
          time_slot: timeSlot,
          is_home_collection: isHomeCollection,
          patient_address: isHomeCollection ? address : null,
          status: "confirmed",
        }).select().single();

        if (bookErr) {
          toast({ title: "Booking failed", description: bookErr.message, variant: "destructive" });
          setSubmitting(false);
          return;
        }

        await supabase.from("payments").insert({
          booking_id: booking.id,
          user_id: user.id,
          amount: item.price,
          gst_amount: gstEnabled ? item.price * 0.18 : 0,
          discount_amount: items.length > 0 ? discount / items.length : 0,
          total_amount: item.price - (discount / items.length) + (gstEnabled ? item.price * 0.18 : 0),
          payment_method: "razorpay",
          payment_status: "success",
          transaction_id: txnId,
        });
      }

      setPaymentDone(true);
      clearCart();
      toast({ title: "All bookings confirmed! 🎉" });
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
    setSubmitting(false);
  };

  const phone = user?.user_metadata?.phone || user?.phone || user?.email?.replace("@labsetu.phone", "") || "";

  if (paymentDone) {
    return (
      <Layout>
        <div className="container flex min-h-[50vh] items-center justify-center py-12">
          <Card className="w-full max-w-md text-center">
            <CardContent className="p-8">
              <CheckCircle className="mx-auto mb-4 h-16 w-16 text-green-500" />
              <h2 className="mb-2 font-display text-2xl font-bold">All Bookings Confirmed!</h2>
              <p className="mb-4 text-muted-foreground">Your tests have been booked successfully</p>
              <p className="mb-6 text-2xl font-bold text-primary">₹{finalAmount.toFixed(0)} paid</p>
              <div className="flex gap-2">
                <Button className="flex-1" onClick={() => navigate("/")}>Home</Button>
                <Button variant="outline" className="flex-1" onClick={() => navigate("/my-bookings")}>My Bookings</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container max-w-2xl py-8">
        <h1 className="mb-6 font-display text-2xl font-bold flex items-center gap-2">
          <ShoppingCart className="h-6 w-6" /> Checkout ({items.length} tests)
        </h1>

        {/* Progress */}
        <div className="mb-8 flex gap-2">
          {[1, 2].map((s) => (
            <div key={s} className={`h-2 flex-1 rounded-full ${s <= step ? "bg-primary" : "bg-muted"}`} />
          ))}
        </div>

        {/* Cart summary */}
        <Card className="mb-6">
          <CardContent className="p-4 space-y-2">
            {items.map((item) => (
              <div key={item.labTestId} className="flex justify-between text-sm">
                <span>{item.testName} <span className="text-muted-foreground">({item.labName})</span></span>
                <span className="font-semibold">₹{item.price}</span>
              </div>
            ))}
            <div className="border-t pt-2 flex justify-between font-bold">
              <span>Subtotal</span>
              <span className="text-primary">₹{totalPrice}</span>
            </div>
          </CardContent>
        </Card>

        {step === 1 && (
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><Calendar className="h-5 w-5" /> Patient Details</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Patient Name</Label>
                <Input value={patientName} onChange={(e) => setPatientName(e.target.value)} placeholder="Full name" required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Age</Label>
                  <Input type="number" value={patientAge} onChange={(e) => setPatientAge(e.target.value)} placeholder="Age" />
                </div>
                <div className="space-y-2">
                  <Label>Gender</Label>
                  <Select value={patientGender} onValueChange={setPatientGender}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Booking Date</Label>
                  <Input type="date" value={bookingDate} onChange={(e) => setBookingDate(e.target.value)} min={new Date().toISOString().split("T")[0]} />
                </div>
                <div className="space-y-2">
                  <Label>Time Slot</Label>
                  <Select value={timeSlot} onValueChange={setTimeSlot}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="07:00-08:00">7:00 - 8:00 AM</SelectItem>
                      <SelectItem value="08:00-09:00">8:00 - 9:00 AM</SelectItem>
                      <SelectItem value="09:00-10:00">9:00 - 10:00 AM</SelectItem>
                      <SelectItem value="10:00-11:00">10:00 - 11:00 AM</SelectItem>
                      <SelectItem value="11:00-12:00">11:00 - 12:00 PM</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex items-center justify-between rounded-lg border p-3">
                <Label>Home Collection</Label>
                <Switch checked={isHomeCollection} onCheckedChange={setIsHomeCollection} />
              </div>
              {isHomeCollection && (
                <div className="space-y-2">
                  <Label>Address</Label>
                  <Input value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Full address" />
                </div>
              )}
              <Button className="w-full" onClick={() => setStep(2)} disabled={!patientName || !bookingDate}>
                Continue to Payment
              </Button>
            </CardContent>
          </Card>
        )}

        {step === 2 && (
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><CreditCard className="h-5 w-5" /> Payment</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input placeholder="Discount code" value={discountCode} onChange={(e) => setDiscountCode(e.target.value)} />
                <Button variant="outline" onClick={applyDiscount}>Apply</Button>
              </div>
              <div className="flex items-center justify-between rounded-lg border p-3">
                <Label>Include GST (18%)</Label>
                <Switch checked={gstEnabled} onCheckedChange={setGstEnabled} />
              </div>
              <div className="space-y-2 rounded-lg bg-muted p-4">
                <div className="flex justify-between text-sm"><span>Subtotal ({items.length} tests)</span><span>₹{totalPrice}</span></div>
                {discount > 0 && <div className="flex justify-between text-sm text-green-600"><span>Discount</span><span>-₹{discount.toFixed(0)}</span></div>}
                {gstEnabled && <div className="flex justify-between text-sm"><span>GST (18%)</span><span>+₹{gstAmount.toFixed(0)}</span></div>}
                <div className="flex justify-between border-t pt-2 text-lg font-bold"><span>Total</span><span className="text-primary">₹{finalAmount.toFixed(0)}</span></div>
              </div>
              <Button className="w-full" onClick={() => setRazorpayOpen(true)} disabled={submitting}>
                {submitting ? "Processing..." : `Pay ₹${finalAmount.toFixed(0)}`}
              </Button>
              <Button variant="ghost" className="w-full" onClick={() => setStep(1)}>Back</Button>
            </CardContent>
          </Card>
        )}

        <RazorpayModal
          open={razorpayOpen}
          onClose={() => setRazorpayOpen(false)}
          onSuccess={handlePaymentSuccess}
          amount={finalAmount}
          customerName={patientName}
          customerPhone={phone}
        />
      </div>
    </Layout>
  );
};

export default Checkout;
