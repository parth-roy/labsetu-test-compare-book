import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Calendar, Clock, Download } from "lucide-react";

const MyBookings = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) { navigate("/login"); return; }
    const fetchBookings = async () => {
      const { data } = await supabase
        .from("bookings")
        .select("id, booking_number, patient_name, booking_date, time_slot, status, created_at, lab_tests(price, tests(name, category)), labs(name, city)")
        .eq("patient_id", user.id)
        .order("created_at", { ascending: false });

      // Fetch reports for these bookings
      const bookingIds = (data || []).map(b => b.id);
      let reports: any[] = [];
      if (bookingIds.length > 0) {
        const { data: reps } = await supabase.from("reports").select("booking_id, file_url").in("booking_id", bookingIds);
        reports = reps || [];
      }

      const enriched = (data || []).map(b => ({
        ...b,
        report: reports.find(r => r.booking_id === b.id),
      }));
      setBookings(enriched);
      setLoading(false);
    };
    fetchBookings();
  }, [user]);

  const downloadReport = async (fileUrl: string) => {
    const { data } = await supabase.storage.from("reports").createSignedUrl(fileUrl, 300);
    if (data?.signedUrl) window.open(data.signedUrl, "_blank");
  };

  const statusColor: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-800",
    confirmed: "bg-blue-100 text-blue-800",
    accepted: "bg-indigo-100 text-indigo-800",
    sample_collected: "bg-purple-100 text-purple-800",
    report_uploaded: "bg-green-100 text-green-800",
    completed: "bg-green-100 text-green-800",
    cancelled: "bg-red-100 text-red-800",
  };

  return (
    <Layout>
      <div className="container max-w-2xl py-8">
        <h1 className="mb-6 font-display text-2xl font-bold">My Bookings</h1>
        {loading ? (
          <p className="text-center text-muted-foreground">Loading...</p>
        ) : bookings.length === 0 ? (
          <p className="py-12 text-center text-muted-foreground">No bookings yet</p>
        ) : (
          <div className="space-y-4">
            {bookings.map((b) => (
              <Card key={b.id}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold">{b.lab_tests?.tests?.name || "Test"}</h3>
                      <p className="text-sm text-muted-foreground">{b.labs?.name} · {b.labs?.city}</p>
                    </div>
                    <Badge className={statusColor[b.status] || ""}>{b.status.replace("_", " ")}</Badge>
                  </div>
                  <div className="mt-3 flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{b.booking_date}</span>
                    {b.time_slot && <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{b.time_slot}</span>}
                    <span className="font-semibold text-primary">₹{b.lab_tests?.price}</span>
                  </div>
                  <div className="mt-2 flex items-center justify-between">
                    <p className="text-xs text-muted-foreground">#{b.booking_number}</p>
                    {b.report && (
                      <Button size="sm" variant="outline" onClick={() => downloadReport(b.report.file_url)}>
                        <Download className="mr-1 h-3.5 w-3.5" /> Download Report
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default MyBookings;
