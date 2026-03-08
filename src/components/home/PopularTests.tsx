import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Droplets, HeartPulse, Activity, FlaskConical, Microscope, Brain, Sparkles, Beaker } from "lucide-react";

const popularTests = [
  { name: "Complete Blood Count (CBC)", price: "₹299", icon: Droplets, color: "bg-red-50 text-red-500" },
  { name: "Lipid Profile", price: "₹449", icon: HeartPulse, color: "bg-pink-50 text-pink-500" },
  { name: "Thyroid Profile (T3, T4, TSH)", price: "₹549", icon: Activity, color: "bg-purple-50 text-purple-500" },
  { name: "HbA1c (Diabetes)", price: "₹399", icon: FlaskConical, color: "bg-orange-50 text-orange-500" },
  { name: "Liver Function Test", price: "₹499", icon: Microscope, color: "bg-green-50 text-green-500" },
  { name: "Kidney Function Test", price: "₹599", icon: Brain, color: "bg-blue-50 text-blue-500" },
  { name: "Vitamin D", price: "₹699", icon: Sparkles, color: "bg-amber-50 text-amber-500" },
  { name: "Urine Routine", price: "₹199", icon: Beaker, color: "bg-teal-50 text-teal-500" },
];

const PopularTests = () => {
  return (
    <section className="py-10 bg-muted/30">
      <div className="container">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-bold text-foreground">Popular Individual Tests</h2>
          <Link to="/search" className="flex items-center gap-1 text-sm font-semibold text-primary hover:underline">
            View all <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {popularTests.map((test) => (
            <Link
              key={test.name}
              to={`/search?q=${encodeURIComponent(test.name)}`}
              className="group flex items-center gap-3 rounded-xl border bg-background p-4 shadow-sm transition-all hover:shadow-md hover:border-primary/30"
            >
              <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${test.color} transition-transform group-hover:scale-110`}>
                <test.icon className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-xs font-semibold text-foreground leading-tight line-clamp-2">{test.name}</h3>
                <p className="mt-0.5 text-xs text-muted-foreground">Starting from <span className="font-bold text-primary">{test.price}</span></p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PopularTests;
