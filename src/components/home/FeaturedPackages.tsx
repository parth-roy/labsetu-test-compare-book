import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { ArrowRight, Sparkles, TestTubes, Clock, ChevronRight } from "lucide-react";

const FeaturedPackages = () => {
  const [packages, setPackages] = useState<any[]>([]);

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase
        .from("health_packages")
        .select("*")
        .eq("is_active", true)
        .eq("is_popular", true)
        .order("discounted_price", { ascending: true })
        .limit(4);
      setPackages(data || []);
    };
    fetch();
  }, []);

  if (packages.length === 0) return null;

  return (
    <section className="py-16">
      <div className="container">
        <div className="flex items-end justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Sparkles className="h-5 w-5 text-amber-500" />
              <h2 className="font-display text-2xl font-bold text-foreground">Health Packages</h2>
            </div>
            <p className="text-sm text-muted-foreground">Save big with bundled test packages</p>
          </div>
          <Button variant="ghost" size="sm" className="hidden sm:flex" asChild>
            <Link to="/packages">View all <ArrowRight className="ml-1 h-4 w-4" /></Link>
          </Button>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {packages.map((pkg) => (
            <Link key={pkg.id} to={`/package/${pkg.slug}`}>
              <Card className="group h-full cursor-pointer transition-all hover:shadow-md hover:-translate-y-0.5">
                <CardContent className="p-4">
                  <div className="mb-2 flex items-start justify-between">
                    <h3 className="font-semibold text-sm leading-tight pr-2">{pkg.name}</h3>
                    <Badge variant="secondary" className="text-[10px] text-green-700 bg-green-100 border-0 shrink-0">
                      {Number(pkg.discount_percent)}% off
                    </Badge>
                  </div>

                  <p className="mb-3 text-xs text-muted-foreground line-clamp-2">{pkg.description}</p>

                  <div className="mb-3 flex gap-3 text-[11px] text-muted-foreground">
                    <span className="flex items-center gap-1"><TestTubes className="h-3 w-3" /> {pkg.test_count} tests</span>
                    <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {pkg.report_time_hours}h</span>
                  </div>

                  <div className="flex items-end justify-between">
                    <div>
                      <span className="text-xs text-muted-foreground line-through">₹{Number(pkg.original_price).toLocaleString()}</span>
                      <p className="font-display text-lg font-bold text-primary">₹{Number(pkg.discounted_price).toLocaleString()}</p>
                    </div>
                    <span className="text-xs text-primary font-medium flex items-center gap-0.5 group-hover:underline">
                      Details <ChevronRight className="h-3 w-3" />
                    </span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        <div className="mt-4 text-center sm:hidden">
          <Button variant="outline" size="sm" asChild>
            <Link to="/packages">View All Packages <ArrowRight className="ml-1 h-4 w-4" /></Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedPackages;
