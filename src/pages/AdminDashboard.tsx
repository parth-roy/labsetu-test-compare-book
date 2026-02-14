import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from "recharts";
import { Users, FlaskConical, Calendar, CreditCard, TrendingUp, Download } from "lucide-react";

const COLORS = ["#1d6ce0", "#0d9668", "#e88c0a", "#dc3545", "#7c4dff", "#0891b2"];

const AdminDashboard = () => {
  const { user, role } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({ totalBookings: 0, totalRevenue: 0, totalLabs: 0, totalUsers: 0 });
  const [bookingsByStatus, setBookingsByStatus] = useState<any[]>([]);
  const [revenueByLab, setRevenueByLab] = useState<any[]>([]);
  const [dailyBookings, setDailyBookings] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || role !== "admin") { navigate("/"); return; }
    fetchDashboardData();
  }, [user, role]);

  const fetchDashboardData = async () => {
    // Fetch bookings
    const { data: bookings } = await supabase.from("bookings").select("*, labs(name), lab_tests(price)");
    const { data: labs } = await supabase.from("labs").select("id, name");
    const { data: payments } = await supabase.from("payments").select("*");
    const { data: analyticsEvents } = await supabase.from("analytics_events").select("*");

    const totalRevenue = (payments || []).filter(p => p.payment_status === "success").reduce((sum, p) => sum + Number(p.total_amount), 0);

    setStats({
      totalBookings: bookings?.length || 0,
      totalRevenue,
      totalLabs: labs?.length || 0,
      totalUsers: 0,
    });

    // Bookings by status
    const statusMap: Record<string, number> = {};
    (bookings || []).forEach(b => { statusMap[b.status] = (statusMap[b.status] || 0) + 1; });
    setBookingsByStatus(Object.entries(statusMap).map(([name, value]) => ({ name, value })));

    // Revenue by lab
    const labRevMap: Record<string, number> = {};
    (bookings || []).forEach(b => {
      const labName = b.labs?.name || "Unknown";
      labRevMap[labName] = (labRevMap[labName] || 0) + Number(b.lab_tests?.price || 0);
    });
    setRevenueByLab(Object.entries(labRevMap).map(([name, revenue]) => ({ name, revenue })));

    // Daily bookings (last 7 days)
    const dailyMap: Record<string, number> = {};
    const now = new Date();
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      dailyMap[d.toISOString().split("T")[0]] = 0;
    }
    (bookings || []).forEach(b => {
      const date = b.created_at?.split("T")[0];
      if (date && dailyMap[date] !== undefined) dailyMap[date]++;
    });
    setDailyBookings(Object.entries(dailyMap).map(([date, count]) => ({ date: date.slice(5), count })));

    setEvents(analyticsEvents || []);
    setLoading(false);
  };

  const exportCSV = () => {
    const headers = "Date,Bookings\n";
    const rows = dailyBookings.map(d => `${d.date},${d.count}`).join("\n");
    const blob = new Blob([headers + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "bookings-report.csv";
    a.click();
  };

  if (loading) return <Layout><div className="container py-12 text-center">Loading dashboard...</div></Layout>;

  return (
    <Layout>
      <div className="container py-8">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="font-display text-3xl font-bold">Admin Dashboard</h1>
          <Button variant="outline" onClick={exportCSV}><Download className="mr-2 h-4 w-4" />Export CSV</Button>
        </div>

        {/* KPI Cards */}
        <div className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-4">
          {[
            { label: "Total Bookings", value: stats.totalBookings, icon: Calendar, color: "text-primary", bg: "bg-primary/10" },
            { label: "Revenue", value: `₹${stats.totalRevenue.toLocaleString()}`, icon: CreditCard, color: "text-success", bg: "bg-success/10" },
            { label: "Labs", value: stats.totalLabs, icon: FlaskConical, color: "text-warning", bg: "bg-warning/10" },
            { label: "Events Tracked", value: events.length, icon: TrendingUp, color: "text-accent", bg: "bg-accent/10" },
          ].map((kpi) => (
            <Card key={kpi.label} className="border-none shadow-sm">
              <CardContent className="flex items-center gap-3 p-4">
                <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${kpi.bg}`}>
                  <kpi.icon className={`h-6 w-6 ${kpi.color}`} />
                </div>
                <div>
                  <p className="text-xs font-medium text-muted-foreground">{kpi.label}</p>
                  <p className="text-2xl font-bold">{kpi.value}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Charts */}
        <div className="mb-8 grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader><CardTitle>Daily Bookings (Last 7 Days)</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={dailyBookings}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="count" stroke="hsl(213 94% 48%)" strokeWidth={2} dot={{ fill: "hsl(213 94% 48%)", r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Bookings by Status</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie data={bookingsByStatus} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({ name, value }) => `${name}: ${value}`}>
                    {bookingsByStatus.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="md:col-span-2">
            <CardHeader><CardTitle>Revenue by Lab</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={revenueByLab}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="revenue" fill="hsl(152 69% 41%)" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Event funnel */}
        <Card>
          <CardHeader><CardTitle>Event Tracking Summary</CardTitle></CardHeader>
          <CardContent>
            {events.length === 0 ? (
              <p className="text-muted-foreground">No events tracked yet</p>
            ) : (
              <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                {Object.entries(
                  events.reduce((acc: Record<string, number>, e) => {
                    acc[e.event_type] = (acc[e.event_type] || 0) + 1;
                    return acc;
                  }, {})
                ).map(([type, count]) => (
                  <div key={type} className="rounded-lg border p-3 text-center">
                    <p className="text-sm text-muted-foreground">{type}</p>
                    <p className="text-xl font-bold">{count as number}</p>
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

export default AdminDashboard;
