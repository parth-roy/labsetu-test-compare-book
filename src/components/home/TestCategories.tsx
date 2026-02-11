import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import {
  Droplets,
  HeartPulse,
  Activity,
  FlaskConical,
  Microscope,
  Brain,
  Baby,
  Stethoscope,
  Pill,
  Bone,
  Eye,
  Dna,
} from "lucide-react";

const categories = [
  { name: "Blood Tests", icon: Droplets, discount: "Upto 30% Off", color: "bg-red-50 text-red-500" },
  { name: "Heart Health", icon: HeartPulse, discount: "Upto 25% Off", color: "bg-pink-50 text-pink-500" },
  { name: "Diabetes", icon: Activity, discount: "Upto 20% Off", color: "bg-orange-50 text-orange-500" },
  { name: "Thyroid", icon: FlaskConical, discount: "Upto 35% Off", color: "bg-purple-50 text-purple-500" },
  { name: "Liver Function", icon: Microscope, discount: "Lowest Price", color: "bg-green-50 text-green-500" },
  { name: "Kidney Function", icon: Brain, discount: "Upto 25% Off", color: "bg-blue-50 text-blue-500" },
  { name: "Women's Health", icon: Baby, discount: "Upto 20% Off", color: "bg-rose-50 text-rose-500" },
  { name: "Full Body Checkup", icon: Stethoscope, discount: "Upto 40% Off", color: "bg-teal-50 text-teal-500" },
  { name: "Allergy Tests", icon: Pill, discount: "Upto 15% Off", color: "bg-amber-50 text-amber-500" },
  { name: "Bone Health", icon: Bone, discount: "Upto 30% Off", color: "bg-cyan-50 text-cyan-500" },
  { name: "Eye Tests", icon: Eye, discount: "Upto 20% Off", color: "bg-indigo-50 text-indigo-500" },
  { name: "Genetic Tests", icon: Dna, discount: "Premium", color: "bg-violet-50 text-violet-500" },
];

const TestCategories = () => {
  return (
    <section className="py-16">
      <div className="container">
        <h2 className="font-display text-2xl font-bold text-foreground text-center">Browse Test Categories</h2>
        <p className="mt-1 text-sm text-muted-foreground text-center">Find the right diagnostic test for your needs</p>

        <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {categories.map((cat) => (
            <Link
              key={cat.name}
              to="/search"
              className="group flex flex-col items-center rounded-xl border bg-card p-5 text-center transition-shadow hover:shadow-md"
            >
              <Badge variant="secondary" className="mb-3 text-[10px] px-2 py-0.5">{cat.discount}</Badge>
              <div className={`flex h-14 w-14 items-center justify-center rounded-2xl ${cat.color} transition-transform group-hover:scale-110`}>
                <cat.icon className="h-7 w-7" />
              </div>
              <span className="mt-3 text-xs font-semibold text-foreground">{cat.name}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestCategories;
