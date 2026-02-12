import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Calendar, Clock } from "lucide-react";

const MyBookings = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) { navigate("/login"); return; }
    const fetch = async () => {
      const { data } = await supabase
        .from("bookings")
        .select("*, lab_tests(price, tests(name, category)), labs(name, city)")
        .eq("patient_id", user.id)
        .order("created_at", { ascending: false });
      setBookings(data || []);
      setLoading(false);
    };
    fetch();
  }, [user]);

  const statusColor: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-800",
    confirmed: "bg-green-100 text-green-800",
    completed: "bg-blue-100 text-blue-800",
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
                    <Badge className={statusColor[b.status] || ""}>{b.status}</Badge>
                  </div>
                  <div className="mt-3 flex gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{b.booking_date}</span>
                    {b.time_slot && <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{b.time_slot}</span>}
                    <span className="font-semibold text-primary">₹{b.lab_tests?.price}</span>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">Booking #{b.booking_number}</p>
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
