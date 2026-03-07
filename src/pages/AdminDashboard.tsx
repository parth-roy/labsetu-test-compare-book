import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from "recharts";
import { Users, FlaskConical, Calendar, CreditCard, TrendingUp, Download, CheckCircle, XCircle, Loader2 } from "lucide-react";

const COLORS = ["#1d6ce0", "#0d9668", "#e88c0a", "#dc3545", "#7c4dff", "#0891b2"];

const statusColors: Record<string, string> = {
  submitted: "bg-yellow-100 text-yellow-800",
  pending: "bg-orange-100 text-orange-800",
  approved: "bg-blue-100 text-blue-800",
  live: "bg-green-100 text-green-800",
};

const AdminDashboard = () => {
  const { user, role } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [stats, setStats] = useState({ totalBookings: 0, totalRevenue: 0, totalLabs: 0, totalEvents: 0 });
  const [bookingsByStatus, setBookingsByStatus] = useState<any[]>([]);
  const [revenueByLab, setRevenueByLab] = useState<any[]>([]);
  const [dailyBookings, setDailyBookings] = useState<any[]>([]);
  const [labs, setLabs] = useState<any[]>([]);
  const [pendingLabs, setPendingLabs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [priceFeedingLab, setPriceFeedingLab] = useState<any>(null);
  const [labTests, setLabTests] = useState<any[]>([]);
  const [allTests, setAllTests] = useState<any[]>([]);
  const [priceInputs, setPriceInputs] = useState<Record<string, { price: string; turnaround: string }>>({});
  const [savingPrices, setSavingPrices] = useState(false);

  useEffect(() => {
    if (!user || role !== "admin") { navigate("/"); return; }
    fetchDashboardData();
  }, [user, role]);

  const fetchDashboardData = async () => {
    const [{ data: bookings }, { data: allLabs }, { data: payments }, { data: events }, { data: tests }] = await Promise.all([
      supabase.from("bookings").select("id, status, created_at, lab_id, labs(name), lab_tests(price)"),
      supabase.from("labs").select("id, name, city, status, is_approved, company_type, certificates, phone, email, created_at"),
      supabase.from("payments").select("payment_status, total_amount"),
      supabase.from("analytics_events").select("event_type"),
      supabase.from("tests").select("id, name, category"),
    ]);

    setAllTests(tests || []);
    setLabs(allLabs || []);
    setPendingLabs((allLabs || []).filter(l => l.status === "submitted" || l.status === "pending"));

    const totalRevenue = (payments || []).filter(p => p.payment_status === "success").reduce((s, p) => s + Number(p.total_amount), 0);
    setStats({
      totalBookings: bookings?.length || 0,
      totalRevenue,
      totalLabs: allLabs?.length || 0,
      totalEvents: events?.length || 0,
    });

    const statusMap: Record<string, number> = {};
    (bookings || []).forEach(b => { statusMap[b.status] = (statusMap[b.status] || 0) + 1; });
    setBookingsByStatus(Object.entries(statusMap).map(([name, value]) => ({ name, value })));

    const labRevMap: Record<string, number> = {};
    (bookings || []).forEach(b => {
      const labName = (b.labs as any)?.name || "Unknown";
      labRevMap[labName] = (labRevMap[labName] || 0) + Number((b.lab_tests as any)?.price || 0);
    });
    setRevenueByLab(Object.entries(labRevMap).map(([name, revenue]) => ({ name, revenue })));

    const dailyMap: Record<string, number> = {};
    const now = new Date();
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now); d.setDate(d.getDate() - i);
      dailyMap[d.toISOString().split("T")[0]] = 0;
    }
    (bookings || []).forEach(b => {
      const date = b.created_at?.split("T")[0];
      if (date && dailyMap[date] !== undefined) dailyMap[date]++;
    });
    setDailyBookings(Object.entries(dailyMap).map(([date, count]) => ({ date: date.slice(5), count })));

    setLoading(false);
  };

  const updateLabStatus = async (labId: string, status: string, isApproved: boolean) => {
    const { error } = await supabase.from("labs").update({ status, is_approved: isApproved } as any).eq("id", labId);
    if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
    else { toast({ title: `Lab ${status}` }); fetchDashboardData(); }
  };

  const openPriceFeeding = async (lab: any) => {
    setPriceFeedingLab(lab);
    const { data } = await supabase.from("lab_tests").select("id, test_id, price, turnaround_hours, is_available").eq("lab_id", lab.id);
    setLabTests(data || []);
    const inputs: Record<string, { price: string; turnaround: string }> = {};
    (data || []).forEach(lt => { inputs[lt.test_id] = { price: String(lt.price), turnaround: String(lt.turnaround_hours || 24) }; });
    setPriceInputs(inputs);
  };

  const savePrices = async () => {
    if (!priceFeedingLab) return;
    setSavingPrices(true);
    for (const [testId, vals] of Object.entries(priceInputs)) {
      if (!vals.price || Number(vals.price) <= 0) continue;
      const existing = labTests.find(lt => lt.test_id === testId);
      if (existing) {
        await supabase.from("lab_tests").update({ price: Number(vals.price), turnaround_hours: Number(vals.turnaround) || 24 }).eq("id", existing.id);
      } else {
        await supabase.from("lab_tests").insert({ lab_id: priceFeedingLab.id, test_id: testId, price: Number(vals.price), turnaround_hours: Number(vals.turnaround) || 24 });
      }
    }
    // Mark lab as live
    await supabase.from("labs").update({ status: "live", is_approved: true } as any).eq("id", priceFeedingLab.id);
    toast({ title: "Prices saved & lab is now live! 🎉" });
    setPriceFeedingLab(null);
    setSavingPrices(false);
    fetchDashboardData();
  };

  const exportCSV = () => {
    const headers = "Date,Bookings\n";
    const rows = dailyBookings.map(d => `${d.date},${d.count}`).join("\n");
    const blob = new Blob([headers + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = "bookings-report.csv"; a.click();
  };

  if (loading) return <Layout><div className="container py-12 text-center">Loading dashboard...</div></Layout>;

  // Price feeding modal
  if (priceFeedingLab) {
    return (
      <Layout>
        <div className="container max-w-3xl py-8">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="font-display text-2xl font-bold">Price Feeding: {priceFeedingLab.name}</h1>
              <p className="text-sm text-muted-foreground">Set prices per test then confirm to go live</p>
            </div>
            <Button variant="ghost" onClick={() => setPriceFeedingLab(null)}>Cancel</Button>
          </div>
          <Card>
            <CardContent className="p-4">
              <div className="space-y-3">
                <div className="grid grid-cols-12 gap-2 text-xs font-medium text-muted-foreground border-b pb-2">
                  <div className="col-span-5">Test Name</div>
                  <div className="col-span-3">Price (₹)</div>
                  <div className="col-span-4">Turnaround (hrs)</div>
                </div>
                {allTests.map(test => (
                  <div key={test.id} className="grid grid-cols-12 gap-2 items-center">
                    <div className="col-span-5 text-sm">{test.name}</div>
                    <div className="col-span-3">
                      <Input
                        type="number"
                        placeholder="0"
                        className="h-8 text-sm"
                        value={priceInputs[test.id]?.price || ""}
                        onChange={(e) => setPriceInputs(prev => ({ ...prev, [test.id]: { ...prev[test.id], price: e.target.value, turnaround: prev[test.id]?.turnaround || "24" } }))}
                      />
                    </div>
                    <div className="col-span-4">
                      <Input
                        type="number"
                        placeholder="24"
                        className="h-8 text-sm"
                        value={priceInputs[test.id]?.turnaround || ""}
                        onChange={(e) => setPriceInputs(prev => ({ ...prev, [test.id]: { ...prev[test.id], turnaround: e.target.value, price: prev[test.id]?.price || "" } }))}
                      />
                    </div>
                  </div>
                ))}
              </div>
              <Button className="mt-6 w-full" onClick={savePrices} disabled={savingPrices}>
                {savingPrices ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</> : "Confirm & Go Live"}
              </Button>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container py-8">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="font-display text-3xl font-bold">Admin Dashboard</h1>
          <Button variant="outline" onClick={exportCSV}><Download className="mr-2 h-4 w-4" />Export CSV</Button>
        </div>

        <Tabs defaultValue="overview">
          <TabsList className="mb-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="labs">
              Labs {pendingLabs.length > 0 && <Badge className="ml-1.5 bg-destructive text-destructive-foreground">{pendingLabs.length}</Badge>}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            {/* KPI Cards */}
            <div className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-4">
              {[
                { label: "Total Bookings", value: stats.totalBookings, icon: Calendar, color: "text-primary", bg: "bg-primary/10" },
                { label: "Revenue", value: `₹${stats.totalRevenue.toLocaleString()}`, icon: CreditCard, color: "text-green-600", bg: "bg-green-50" },
                { label: "Labs", value: stats.totalLabs, icon: FlaskConical, color: "text-orange-600", bg: "bg-orange-50" },
                { label: "Events", value: stats.totalEvents, icon: TrendingUp, color: "text-blue-600", bg: "bg-blue-50" },
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
                <CardHeader><CardTitle>Daily Bookings (7 Days)</CardTitle></CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={250}>
                    <LineChart data={dailyBookings}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" /><YAxis /><Tooltip />
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
                      <XAxis dataKey="name" /><YAxis /><Tooltip />
                      <Bar dataKey="revenue" fill="hsl(152 69% 41%)" radius={[6, 6, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="labs">
            <div className="space-y-4">
              <h2 className="font-display text-xl font-bold">Lab Registrations</h2>
              {labs.length === 0 ? (
                <p className="text-muted-foreground">No labs registered yet</p>
              ) : (
                labs.map(lab => (
                  <Card key={lab.id}>
                    <CardContent className="flex flex-col gap-3 p-4 md:flex-row md:items-center md:justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold">{lab.name}</h3>
                          <Badge className={statusColors[lab.status] || ""}>{lab.status}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {lab.city} · {lab.company_type || "N/A"} · {lab.certificates || "No certs"} · {lab.phone || "No phone"}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        {lab.status === "submitted" && (
                          <>
                            <Button size="sm" onClick={() => updateLabStatus(lab.id, "approved", true)}>
                              <CheckCircle className="mr-1 h-3.5 w-3.5" /> Approve
                            </Button>
                            <Button size="sm" variant="destructive" onClick={() => updateLabStatus(lab.id, "pending", false)}>
                              <XCircle className="mr-1 h-3.5 w-3.5" /> Reject
                            </Button>
                          </>
                        )}
                        {lab.status === "approved" && (
                          <Button size="sm" onClick={() => openPriceFeeding(lab)}>
                            Feed Prices & Go Live
                          </Button>
                        )}
                        {lab.status === "live" && (
                          <Button size="sm" variant="outline" onClick={() => openPriceFeeding(lab)}>
                            Edit Prices
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default AdminDashboard;
