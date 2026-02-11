import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Droplets, HeartPulse, Activity, FlaskConical, Microscope, Brain } from "lucide-react";

const popularTests = [
  { name: "Complete Blood Count (CBC)", price: "₹299", icon: Droplets },
  { name: "Lipid Profile", price: "₹449", icon: HeartPulse },
  { name: "Thyroid Profile (T3, T4, TSH)", price: "₹549", icon: Activity },
  { name: "HbA1c (Diabetes)", price: "₹399", icon: FlaskConical },
  { name: "Liver Function Test", price: "₹499", icon: Microscope },
  { name: "Kidney Function Test", price: "₹599", icon: Brain },
];

const PopularTests = () => {
  return (
    <section className="bg-muted/30 py-16">
      <div className="container">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="font-display text-2xl font-bold text-foreground">Popular Tests</h2>
            <p className="mt-1 text-sm text-muted-foreground">Most booked diagnostic tests on LabSetu</p>
          </div>
          <Button variant="ghost" size="sm" className="hidden sm:flex" asChild>
            <Link to="/search">View all <ArrowRight className="ml-1 h-4 w-4" /></Link>
          </Button>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {popularTests.map((test) => (
            <Card key={test.name} className="group cursor-pointer transition-shadow hover:shadow-md">
              <CardContent className="flex items-center gap-4 p-5">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 transition-colors group-hover:bg-primary/20">
                  <test.icon className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-semibold text-foreground">{test.name}</h3>
                  <p className="text-xs text-muted-foreground">Starting from</p>
                </div>
                <span className="font-display text-lg font-bold text-primary">{test.price}</span>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PopularTests;
