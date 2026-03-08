import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Shield, Home, Building2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";

const FeaturedLabs = () => {
  const [labs, setLabs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLabs = async () => {
      const { data } = await supabase
        .from("labs")
        .select("id, name, city, rating, total_reviews, nabl_certified, home_collection, is_featured")
        .eq("is_approved", true)
        .eq("is_featured", true)
        .limit(4);
      setLabs(data || []);
      setLoading(false);
    };
    fetchLabs();
  }, []);

  // Fallback static labs if none in DB
  const displayLabs = labs.length > 0 ? labs : [
    { id: "1", name: "PathCare Diagnostics", city: "Kolkata", rating: 4.8, total_reviews: 120, nabl_certified: true, home_collection: true },
    { id: "2", name: "LifeLine Labs", city: "Kolkata", rating: 4.6, total_reviews: 95, nabl_certified: true, home_collection: true },
    { id: "3", name: "MediScan Centre", city: "Kolkata", rating: 4.5, total_reviews: 80, nabl_certified: false, home_collection: true },
    { id: "4", name: "HealthFirst Diagnostics", city: "Kolkata", rating: 4.7, total_reviews: 110, nabl_certified: true, home_collection: false },
  ];

  return (
    <section className="py-10">
      <div className="container">
        <h2 className="text-xl font-bold text-foreground mb-5">Featured Labs</h2>

        {loading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-40 rounded-xl" />
            ))}
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {displayLabs.map((lab) => (
              <Card key={lab.id} className="group cursor-pointer rounded-xl border shadow-sm transition-all hover:shadow-md hover:border-primary/30">
                <CardContent className="p-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                    <Building2 className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="mt-3 text-sm font-bold text-foreground">{lab.name}</h3>
                  <p className="text-xs text-muted-foreground">{lab.city}</p>
                  <div className="mt-2 flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      <Star className="h-3.5 w-3.5 fill-warning text-warning" />
                      <span className="text-sm font-semibold text-foreground">{lab.rating || "4.5"}</span>
                    </div>
                    <span className="text-xs text-muted-foreground">({lab.total_reviews || 0} reviews)</span>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {lab.nabl_certified && (
                      <Badge variant="secondary" className="text-[10px] gap-1">
                        <Shield className="h-2.5 w-2.5" /> NABL
                      </Badge>
                    )}
                    {lab.home_collection && (
                      <Badge variant="secondary" className="text-[10px] gap-1">
                        <Home className="h-2.5 w-2.5" /> Home Collection
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedLabs;
