import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import {
  CheckCircle, Clock, Droplets, TestTubes, Sparkles, ShieldCheck,
  ArrowLeft, ShoppingCart
} from "lucide-react";

const PackageDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [pkg, setPkg] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPkg = async () => {
      const { data } = await supabase
        .from("health_packages")
        .select("*")
        .eq("slug", slug)
        .eq("is_active", true)
        .single();
      setPkg(data);
      setLoading(false);
    };
    fetchPkg();
  }, [slug]);

  const handleBookNow = () => {
    if (!user) {
      toast({ title: "Please login first", variant: "destructive" });
      navigate("/login");
      return;
    }
    // Navigate to search with the package category to find labs offering these tests
    navigate(`/search?category=${encodeURIComponent(pkg.category)}`);
    toast({ title: `Browse labs for ${pkg.name}`, description: "Select individual tests from labs in your city" });
  };

  if (loading) return <Layout><div className="container py-12 text-center text-muted-foreground">Loading...</div></Layout>;
  if (!pkg) return <Layout><div className="container py-12 text-center">Package not found</div></Layout>;

  const savings = Number(pkg.original_price) - Number(pkg.discounted_price);

  return (
    <Layout>
      <div className="container max-w-3xl py-8">
        {/* Breadcrumb */}
        <Link to="/packages" className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary">
          <ArrowLeft className="h-3.5 w-3.5" /> Back to Packages
        </Link>

        {/* Hero card */}
        <Card className="mb-6 overflow-hidden">
          <div className="bg-gradient-to-r from-primary/10 to-primary/5 p-6">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h1 className="font-display text-2xl font-bold">{pkg.name}</h1>
                  {pkg.is_popular && (
                    <Badge className="bg-amber-500 text-white text-[10px] gap-1 border-0">
                      <Sparkles className="h-2.5 w-2.5" /> Popular
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground max-w-lg">{pkg.description}</p>

                <div className="mt-4 flex flex-wrap gap-3 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1"><TestTubes className="h-4 w-4 text-primary" /> {pkg.test_count} tests included</span>
                  <span className="flex items-center gap-1"><Clock className="h-4 w-4 text-primary" /> Report in {pkg.report_time_hours}h</span>
                  <span className="flex items-center gap-1"><Droplets className="h-4 w-4 text-primary" /> {pkg.sample_type}</span>
                  {pkg.fasting_required && (
                    <span className="flex items-center gap-1"><ShieldCheck className="h-4 w-4 text-amber-500" /> Fasting required</span>
                  )}
                </div>
              </div>

              <div className="text-right shrink-0">
                <p className="text-sm text-muted-foreground line-through">₹{Number(pkg.original_price).toLocaleString()}</p>
                <p className="font-display text-3xl font-bold text-primary">₹{Number(pkg.discounted_price).toLocaleString()}</p>
                <Badge variant="secondary" className="mt-1 text-xs text-green-700 bg-green-100 border-0">
                  Save ₹{savings.toLocaleString()} ({Number(pkg.discount_percent)}% off)
                </Badge>
              </div>
            </div>
          </div>
        </Card>

        {/* Included tests */}
        <Card className="mb-6">
          <CardContent className="p-5">
            <h2 className="mb-4 font-display text-lg font-semibold">Tests Included ({pkg.test_count})</h2>
            <div className="grid gap-2 sm:grid-cols-2">
              {(pkg.included_test_names as string[]).map((test: string, i: number) => (
                <div key={i} className="flex items-center gap-2 rounded-lg border p-2.5 text-sm">
                  <CheckCircle className="h-4 w-4 shrink-0 text-green-500" />
                  <span>{test}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* CTA */}
        <div className="sticky bottom-0 z-10 rounded-xl border bg-card/95 backdrop-blur-sm p-4 shadow-lg">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs text-muted-foreground">Package Price</p>
              <div className="flex items-baseline gap-2">
                <span className="font-display text-2xl font-bold text-primary">₹{Number(pkg.discounted_price).toLocaleString()}</span>
                <span className="text-sm text-muted-foreground line-through">₹{Number(pkg.original_price).toLocaleString()}</span>
              </div>
            </div>
            <Button size="lg" className="gap-2" onClick={handleBookNow}>
              <ShoppingCart className="h-4 w-4" /> Book Now
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default PackageDetail;
