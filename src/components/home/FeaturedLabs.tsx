import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Shield, Home } from "lucide-react";

const featuredLabs = [
  { name: "PathCare Diagnostics", rating: 4.8, tests: 120, nabl: true, homeCollection: true },
  { name: "LifeLine Labs", rating: 4.6, tests: 95, nabl: true, homeCollection: true },
  { name: "MediScan Centre", rating: 4.5, tests: 80, nabl: false, homeCollection: true },
  { name: "HealthFirst Diagnostics", rating: 4.7, tests: 110, nabl: true, homeCollection: false },
];

const FeaturedLabs = () => {
  return (
    <section className="py-16">
      <div className="container">
        <h2 className="font-display text-2xl font-bold text-foreground">Featured Labs</h2>
        <p className="mt-1 text-sm text-muted-foreground">Top-rated diagnostic labs in your city</p>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {featuredLabs.map((lab) => (
            <Card key={lab.name} className="group cursor-pointer transition-shadow hover:shadow-md">
              <CardContent className="p-5">
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 font-display text-xl font-bold text-primary">
                  {lab.name.charAt(0)}
                </div>
                <h3 className="mt-3 font-display text-sm font-semibold text-foreground">{lab.name}</h3>
                <div className="mt-2 flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    <Star className="h-3.5 w-3.5 fill-warning text-warning" />
                    <span className="text-sm font-medium text-foreground">{lab.rating}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">• {lab.tests} tests</span>
                </div>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {lab.nabl && (
                    <Badge variant="secondary" className="text-xs">
                      <Shield className="mr-1 h-3 w-3" /> NABL
                    </Badge>
                  )}
                  {lab.homeCollection && (
                    <Badge variant="secondary" className="text-xs">
                      <Home className="mr-1 h-3 w-3" /> Home Collection
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedLabs;
