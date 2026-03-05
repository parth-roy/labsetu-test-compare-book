import { Link } from "react-router-dom";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
  Stethoscope,
  HeartPulse,
  FlaskConical,
  Activity,
  Droplets,
  Baby,
  Bone,
  Brain,
  Eye,
  Pill,
  Microscope,
  Dna,
} from "lucide-react";

const categories = [
  { name: "Full Body Checkup", icon: Stethoscope },
  { name: "Heart Health", icon: HeartPulse },
  { name: "Thyroid", icon: FlaskConical },
  { name: "Diabetes", icon: Activity },
  { name: "Blood Tests", icon: Droplets },
  { name: "Liver Function", icon: Microscope },
  { name: "Kidney Function", icon: Brain },
  { name: "Women's Health", icon: Baby },
  { name: "Bone Health", icon: Bone },
  { name: "Eye Tests", icon: Eye },
  { name: "Allergy Tests", icon: Pill },
  { name: "Genetic Tests", icon: Dna },
];

const CategoryNav = () => {
  return (
    <div className="sticky top-16 z-40 border-b bg-card/95 backdrop-blur-sm">
      <div className="container">
        <ScrollArea className="w-full whitespace-nowrap">
          <div className="flex items-center gap-1 py-2">
            <Link
              to="/packages"
              className="flex shrink-0 items-center gap-1.5 rounded-full bg-primary/10 border border-primary/20 px-3 py-1.5 text-xs font-semibold text-primary transition-colors hover:bg-primary/20"
            >
              🎁 Packages
            </Link>
            {categories.map((cat) => (
              <Link
                key={cat.name}
                to={`/search?category=${encodeURIComponent(cat.name)}`}
                className="flex shrink-0 items-center gap-1.5 rounded-full border border-transparent px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:border-primary/20 hover:bg-primary/5 hover:text-primary"
              >
                <cat.icon className="h-3.5 w-3.5" />
                {cat.name}
              </Link>
            ))}
          </div>
          <ScrollBar orientation="horizontal" className="h-1" />
        </ScrollArea>
      </div>
    </div>
  );
};

export default CategoryNav;
