import { Link } from "react-router-dom";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
  Activity, HeartPulse, Stethoscope, Microscope, Bone, Brain,
  Droplets, FlaskConical, Sparkles, Pill,
} from "lucide-react";

const concerns = [
  { name: "Diabetes", icon: Activity, color: "bg-blue-50 text-blue-600 border-blue-100" },
  { name: "Heart Care", icon: HeartPulse, color: "bg-red-50 text-red-500 border-red-100" },
  { name: "Liver Care", icon: Microscope, color: "bg-green-50 text-green-600 border-green-100" },
  { name: "Kidney Care", icon: Brain, color: "bg-purple-50 text-purple-600 border-purple-100" },
  { name: "Thyroid", icon: FlaskConical, color: "bg-orange-50 text-orange-600 border-orange-100" },
  { name: "Bone & Joint", icon: Bone, color: "bg-amber-50 text-amber-600 border-amber-100" },
  { name: "Vitamins", icon: Sparkles, color: "bg-teal-50 text-teal-600 border-teal-100" },
  { name: "Allergy", icon: Pill, color: "bg-pink-50 text-pink-500 border-pink-100" },
  { name: "Blood Tests", icon: Droplets, color: "bg-rose-50 text-rose-600 border-rose-100" },
  { name: "Full Body", icon: Stethoscope, color: "bg-cyan-50 text-cyan-600 border-cyan-100" },
];

const HealthConcerns = () => {
  return (
    <section className="py-10">
      <div className="container">
        <h2 className="text-xl font-bold text-foreground">Shop by Health Concerns</h2>
        <ScrollArea className="mt-5 w-full">
          <div className="flex gap-4 pb-4">
            {concerns.map((item) => (
              <Link
                key={item.name}
                to={`/search?category=${encodeURIComponent(item.name)}`}
                className="group flex shrink-0 flex-col items-center gap-3"
              >
                <div className={`flex h-20 w-20 items-center justify-center rounded-2xl border ${item.color} transition-transform group-hover:scale-110`}>
                  <item.icon className="h-8 w-8" />
                </div>
                <span className="text-xs font-semibold text-foreground">{item.name}</span>
              </Link>
            ))}
          </div>
          <ScrollBar orientation="horizontal" className="h-1" />
        </ScrollArea>
      </div>
    </section>
  );
};

export default HealthConcerns;
