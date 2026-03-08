import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import {
  Droplets, HeartPulse, Activity, FlaskConical, Microscope,
  Brain, Baby, Stethoscope, Pill, Bone, Sparkles, Dna,
} from "lucide-react";

const categories = [
  { name: "Blood Tests", icon: Droplets, discount: "Upto 30% Off", color: "bg-red-50 text-red-500 border-red-100" },
  { name: "Heart Health", icon: HeartPulse, discount: "Upto 25% Off", color: "bg-pink-50 text-pink-500 border-pink-100" },
  { name: "Diabetes", icon: Activity, discount: "Upto 20% Off", color: "bg-orange-50 text-orange-500 border-orange-100" },
  { name: "Thyroid", icon: FlaskConical, discount: "Upto 35% Off", color: "bg-purple-50 text-purple-500 border-purple-100" },
  { name: "Liver Function", icon: Microscope, discount: "Lowest Price", color: "bg-green-50 text-green-500 border-green-100" },
  { name: "Kidney Function", icon: Brain, discount: "Upto 25% Off", color: "bg-blue-50 text-blue-500 border-blue-100" },
  { name: "Women's Health", icon: Baby, discount: "Upto 20% Off", color: "bg-rose-50 text-rose-500 border-rose-100" },
  { name: "Full Body Checkup", icon: Stethoscope, discount: "Upto 40% Off", color: "bg-teal-50 text-teal-500 border-teal-100" },
  { name: "Allergy Tests", icon: Pill, discount: "Upto 15% Off", color: "bg-amber-50 text-amber-500 border-amber-100" },
  { name: "Bone Health", icon: Bone, discount: "Upto 30% Off", color: "bg-cyan-50 text-cyan-500 border-cyan-100" },
  { name: "Vitamins", icon: Sparkles, discount: "Upto 20% Off", color: "bg-indigo-50 text-indigo-500 border-indigo-100" },
  { name: "Genetic Tests", icon: Dna, discount: "Premium", color: "bg-violet-50 text-violet-500 border-violet-100" },
];

const TestCategories = () => {
  return (
    <section className="py-10">
      <div className="container">
        <h2 className="text-xl font-bold text-foreground">Browse Test Categories</h2>
        <p className="mt-1 text-sm text-muted-foreground">Find the right diagnostic test for your needs</p>

        <div className="mt-6 grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-6">
          {categories.map((cat) => (
            <Link
              key={cat.name}
              to={`/search?category=${encodeURIComponent(cat.name)}`}
              className="group flex flex-col items-center rounded-xl border bg-background p-4 text-center shadow-sm transition-all hover:shadow-md hover:border-primary/30"
            >
              <div className={`flex h-12 w-12 items-center justify-center rounded-xl border ${cat.color} transition-transform group-hover:scale-110`}>
                <cat.icon className="h-6 w-6" />
              </div>
              <span className="mt-2 text-[11px] font-semibold text-foreground leading-tight">{cat.name}</span>
              <Badge variant="secondary" className="mt-1.5 text-[9px] px-1.5 py-0">{cat.discount}</Badge>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestCategories;
