import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import {
  Stethoscope, HeartPulse, Activity, FlaskConical, Baby, Brain,
  Microscope, Pill, Sparkles, Clock, Droplets, TestTubes, Package, ChevronRight
} from "lucide-react";

const categoryIcons: Record<string, any> = {
  "Full Body": Stethoscope,
  "Heart": HeartPulse,
  "Diabetes": Activity,
  "Thyroid": FlaskConical,
  "Women's Health": Baby,
  "Kidney": Brain,
  "Liver": Microscope,
  "Nutrition": Sparkles,
  "Senior Care": Stethoscope,
  "Allergy": Pill,
};

const HealthPackages = () => {
  const [packages, setPackages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All");

  useEffect(() => {
    const fetchPackages = async () => {
      const { data } = await supabase
        .from("health_packages")
        .select("*")
        .eq("is_active", true)
        .order("is_popular", { ascending: false });
      setPackages(data || []);
      setLoading(false);
    };
    fetchPackages();
  }, []);

  const categories = ["All", ...new Set(packages.map((p) => p.category))];
  const filtered = selectedCategory === "All" ? packages : packages.filter((p) => p.category === selectedCategory);

  return (
    <Layout>
      <div className="container py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-1">
            <Package className="h-6 w-6 text-primary" />
            <h1 className="font-display text-3xl font-bold">Health Packages</h1>
          </div>
          <p className="text-muted-foreground">Save more with bundled test packages — trusted labs, discounted prices</p>
        </div>

        {/* Category filter pills */}
        <div className="mb-6 flex flex-wrap gap-2">
          {categories.map((cat) => (
            <Button
              key={cat}
              variant={selectedCategory === cat ? "default" : "outline"}
              size="sm"
              className="rounded-full text-xs"
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </Button>
          ))}
        </div>

        {loading ? (
          <div className="py-12 text-center text-muted-foreground">Loading packages...</div>
        ) : filtered.length === 0 ? (
          <div className="py-12 text-center text-muted-foreground">No packages found</div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {filtered.map((pkg) => {
              const Icon = categoryIcons[pkg.category] || TestTubes;
              return (
                <Card key={pkg.id} className="group relative overflow-hidden transition-all hover:shadow-lg hover:-translate-y-0.5">
                  {pkg.is_popular && (
                    <div className="absolute right-3 top-3 z-10">
                      <Badge className="bg-amber-500 text-white text-[10px] gap-1 border-0">
                        <Sparkles className="h-2.5 w-2.5" /> Popular
                      </Badge>
                    </div>
                  )}
                  <CardContent className="p-5">
                    {/* Icon + Category */}
                    <div className="mb-3 flex items-center gap-3">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 group-hover:bg-primary/15 transition-colors">
                        <Icon className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-sm leading-tight">{pkg.name}</h3>
                        <p className="text-[11px] text-muted-foreground">{pkg.category}</p>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="mb-3 text-xs text-muted-foreground line-clamp-2">{pkg.description}</p>

                    {/* Included tests */}
                    <div className="mb-3 flex flex-wrap gap-1">
                      {(pkg.included_test_names as string[]).slice(0, 4).map((t: string) => (
                        <Badge key={t} variant="secondary" className="text-[10px] font-normal">{t}</Badge>
                      ))}
                      {pkg.included_test_names.length > 4 && (
                        <Badge variant="outline" className="text-[10px] font-normal">
                          +{pkg.included_test_names.length - 4} more
                        </Badge>
                      )}
                    </div>

                    {/* Meta badges */}
                    <div className="mb-4 flex flex-wrap gap-2 text-[11px] text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <TestTubes className="h-3 w-3" /> {pkg.test_count} tests
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" /> {pkg.report_time_hours}h report
                      </span>
                      <span className="flex items-center gap-1">
                        <Droplets className="h-3 w-3" /> {pkg.sample_type}
                      </span>
                      {pkg.fasting_required && (
                        <Badge variant="outline" className="text-[10px] h-auto py-0 px-1.5">Fasting</Badge>
                      )}
                    </div>

                    {/* Price + CTA */}
                    <div className="flex items-end justify-between">
                      <div>
                        <span className="text-xs text-muted-foreground line-through">₹{Number(pkg.original_price).toLocaleString()}</span>
                        <div className="flex items-baseline gap-1.5">
                          <span className="font-display text-xl font-bold text-primary">₹{Number(pkg.discounted_price).toLocaleString()}</span>
                          <Badge variant="secondary" className="text-[10px] text-green-700 bg-green-100 border-0">
                            {Number(pkg.discount_percent)}% off
                          </Badge>
                        </div>
                      </div>
                      <Link to={`/package/${pkg.slug}`}>
                        <Button size="sm" className="gap-1 text-xs">
                          View <ChevronRight className="h-3 w-3" />
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default HealthPackages;
