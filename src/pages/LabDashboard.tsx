import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Calendar, Upload, FileText, Clock, Building2, CheckCircle } from "lucide-react";

const statusColors: Record<string, string> = {
  submitted: "bg-yellow-100 text-yellow-800",
  pending: "bg-orange-100 text-orange-800",
  approved: "bg-blue-100 text-blue-800",
  live: "bg-green-100 text-green-800",
  booked: "bg-yellow-100 text-yellow-800",
  confirmed: "bg-blue-100 text-blue-800",
  accepted: "bg-indigo-100 text-indigo-800",
  "sample_collected": "bg-purple-100 text-purple-800",
  "report_uploaded": "bg-green-100 text-green-800",
  completed: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
};

const LabDashboard = () => {
  const { user, role } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [lab, setLab] = useState<any>(null);
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploadingId, setUploadingId] = useState<string | null>(null);

  useEffect(() => {
    if (!user) { navigate("/login"); return; }
    fetchData();
  }, [user]);

  const fetchData = async () => {
    // Fetch lab owned by this user
    const { data: labs } = await supabase
      .from("labs")
      .select("id, name, status, city, is_approved")
      .eq("owner_id", user!.id)
      .limit(1);

    const myLab = labs?.[0];
    setLab(myLab || null);

    if (myLab) {
      const { data: bks } = await supabase
        .from("bookings")
        .select("id, booking_number, patient_name, booking_date, time_slot, status, lab_test_id, created_at, lab_tests(price, tests(name))")
        .eq("lab_id", myLab.id)
        .order("created_at", { ascending: false });
      setBookings(bks || []);
    }
    setLoading(false);
  };

  const updateBookingStatus = async (bookingId: string, newStatus: string) => {
    const { error } = await supabase.from("bookings").update({ status: newStatus }).eq("id", bookingId);
    if (error) {
      toast({ title: "Update failed", description: error.message, variant: "destructive" });
    } else {
      toast({ title: `Status updated to ${newStatus}` });
      fetchData();
    }
  };

  const handleReportUpload = async (bookingId: string, file: File) => {
    if (!lab) return;
    setUploadingId(bookingId);
    try {
      const ext = file.name.split(".").pop();
      const path = `${lab.id}/${bookingId}/${Date.now()}.${ext}`;
      const { error: uploadErr } = await supabase.storage.from("reports").upload(path, file);
      if (uploadErr) throw uploadErr;

      // Find patient_id for this booking
      const booking = bookings.find(b => b.id === bookingId);
      const { error: reportErr } = await supabase.from("reports").insert({
        booking_id: bookingId,
        lab_id: lab.id,
        patient_id: booking?.patient_id || user!.id,
        file_url: path,
      } as any);

      // Update booking status
      await supabase.from("bookings").update({ status: "report_uploaded" }).eq("id", bookingId);

      toast({ title: "Report uploaded! 📄" });
      fetchData();
    } catch (err: any) {
      toast({ title: "Upload failed", description: err.message, variant: "destructive" });
    }
    setUploadingId(null);
  };

  if (loading) return <Layout><div className="container py-12 text-center">Loading...</div></Layout>;

  if (!lab) {
    return (
      <Layout>
        <div className="container py-12 text-center">
          <Building2 className="mx-auto mb-4 h-12 w-12 text-muted-foreground opacity-40" />
          <h2 className="mb-2 text-xl font-bold">No lab registered yet</h2>
          <p className="mb-4 text-muted-foreground">Complete your lab registration to get started</p>
          <Button onClick={() => navigate("/lab-registration")}>Register Your Lab</Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container py-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="font-display text-2xl font-bold">{lab.name}</h1>
            <p className="text-sm text-muted-foreground">{lab.city}</p>
          </div>
          <Badge className={statusColors[lab.status] || ""}>{lab.status}</Badge>
        </div>

        {lab.status !== "live" && (
          <Card className="mb-6 border-warning/30 bg-warning/5">
            <CardContent className="p-4 text-sm text-muted-foreground">
              {lab.status === "submitted" && "Your lab registration is pending admin approval. You'll be notified once reviewed."}
              {lab.status === "approved" && "Your lab is approved! Admin will set up test pricing before going live."}
              {lab.status === "pending" && "Your lab is under review."}
            </CardContent>
          </Card>
        )}

        {/* Stats */}
        <div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-4">
          {[
            { label: "Total Bookings", value: bookings.length, icon: Calendar },
            { label: "Pending", value: bookings.filter(b => ["booked", "confirmed"].includes(b.status)).length, icon: Clock },
            { label: "Completed", value: bookings.filter(b => b.status === "completed").length, icon: CheckCircle },
            { label: "Reports Pending", value: bookings.filter(b => b.status === "sample_collected").length, icon: FileText },
          ].map(stat => (
            <Card key={stat.label} className="border-none shadow-sm">
              <CardContent className="flex items-center gap-3 p-4">
                <stat.icon className="h-8 w-8 text-primary opacity-60" />
                <div>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Bookings */}
        <Card>
          <CardHeader><CardTitle>Bookings</CardTitle></CardHeader>
          <CardContent>
            {bookings.length === 0 ? (
              <p className="text-muted-foreground">No bookings yet</p>
            ) : (
              <div className="space-y-4">
                {bookings.map((b) => (
                  <div key={b.id} className="flex flex-col gap-3 rounded-lg border p-4 md:flex-row md:items-center md:justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">{b.lab_tests?.tests?.name || "Test"}</h3>
                        <Badge className={statusColors[b.status] || ""} variant="secondary">{b.status}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {b.patient_name} · #{b.booking_number} · {b.booking_date} {b.time_slot && `· ${b.time_slot}`}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {b.status === "confirmed" && (
                        <Button size="sm" variant="outline" onClick={() => updateBookingStatus(b.id, "accepted")}>Accept</Button>
                      )}
                      {b.status === "accepted" && (
                        <Button size="sm" variant="outline" onClick={() => updateBookingStatus(b.id, "sample_collected")}>
                          Mark Sample Collected
                        </Button>
                      )}
                      {b.status === "sample_collected" && (
                        <div className="flex items-center gap-2">
                          <Input
                            type="file"
                            accept=".pdf"
                            className="h-8 w-48 text-xs"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) handleReportUpload(b.id, file);
                            }}
                            disabled={uploadingId === b.id}
                          />
                          {uploadingId === b.id && <span className="text-xs text-muted-foreground">Uploading...</span>}
                        </div>
                      )}
                      {b.status === "report_uploaded" && (
                        <Button size="sm" variant="outline" onClick={() => updateBookingStatus(b.id, "completed")}>
                          Mark Completed
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default LabDashboard;
