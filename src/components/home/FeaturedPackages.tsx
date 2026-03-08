import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { ArrowRight, Clock, TestTubes, ChevronDown } from "lucide-react";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";

const FeaturedPackages = () => {
  const [packages, setPackages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase
        .from("health_packages")
        .select("id, name, slug, test_count, original_price, discounted_price, discount_percent, report_time_hours, is_popular, category")
        .eq("is_active", true)
        .order("is_popular", { ascending: false })
        .limit(8);
      setPackages(data || []);
      setLoading(false);
    };
    fetch();
  }, []);

  return (
    <section className="py-10">
      <div className="container">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-bold text-foreground">Full Body Health Checkups</h2>
          <Link to="/packages" className="flex items-center gap-1 text-sm font-semibold text-primary hover:underline">
            See all <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {loading ? (
          <div className="flex gap-4 overflow-hidden">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-52 w-72 shrink-0 rounded-xl" />
            ))}
          </div>
        ) : (
          <ScrollArea className="w-full">
            <div className="flex gap-4 pb-4">
              {packages.map((pkg) => (
                <div
                  key={pkg.id}
                  className="shrink-0 w-[280px] rounded-xl border bg-background shadow-sm transition-shadow hover:shadow-md"
                >
                  <div className="p-4">
                    <h3 className="text-sm font-bold text-foreground leading-tight line-clamp-2 min-h-[2.5rem]">
                      {pkg.name}
                    </h3>

                    <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <TestTubes className="h-3 w-3" /> Contains {pkg.test_count} tests
                      </span>
                      <ChevronDown className="h-3 w-3" />
                    </div>

                    <p className="mt-1 text-xs text-muted-foreground flex items-center gap-1">
                      <Clock className="h-3 w-3" /> Report within {pkg.report_time_hours} hours
                    </p>

                    <div className="mt-3 flex items-center gap-2">
                      <span className="text-lg font-bold text-foreground">₹{Number(pkg.discounted_price).toLocaleString()}</span>
                      <span className="text-sm text-muted-foreground line-through">₹{Number(pkg.original_price).toLocaleString()}</span>
                      <Badge className="bg-success/10 text-success border-0 text-xs font-semibold">
                        {Math.round(Number(pkg.discount_percent))}% off
                      </Badge>
                    </div>

                    <Link to={`/package/${pkg.slug}`}>
                      <Button variant="outline" className="mt-3 w-full text-primary border-primary hover:bg-primary hover:text-primary-foreground font-semibold">
                        BOOK
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
            <ScrollBar orientation="horizontal" className="h-1" />
          </ScrollArea>
        )}
      </div>
    </section>
  );
};

export default FeaturedPackages;
