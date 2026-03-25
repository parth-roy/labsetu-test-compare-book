import { Link } from "react-router-dom";
import {
  Stethoscope, HeartPulse, FlaskConical, Activity, Droplets,
  Baby, Bone, Brain, Pill, Microscope, Gift, Sparkles, Handshake, UserCheck,
} from "lucide-react";

const categories = [
  { name: "Packages", icon: Gift, href: "/packages", highlight: true },
  { name: "Consult Doctor", icon: UserCheck, href: "/doctor-consultation", highlight: true },
  { name: "Full Body Checkup", icon: Stethoscope, href: "/search?category=Full Body Checkup" },
  { name: "Heart Health", icon: HeartPulse, href: "/search?category=Heart Health" },
  { name: "Thyroid", icon: FlaskConical, href: "/search?category=Thyroid" },
  { name: "Diabetes", icon: Activity, href: "/search?category=Diabetes" },
  { name: "Blood Tests", icon: Droplets, href: "/search?category=Blood Tests" },
  { name: "Liver Function", icon: Microscope, href: "/search?category=Liver Function" },
  { name: "Kidney Function", icon: Brain, href: "/search?category=Kidney Function" },
  { name: "Women's Health", icon: Baby, href: "/search?category=Women's Health" },
  { name: "Vitamins", icon: Sparkles, href: "/search?category=Vitamins" },
  { name: "Allergy", icon: Pill, href: "/search?category=Allergy Tests" },
  { name: "Bone Health", icon: Bone, href: "/search?category=Bone Health" },
  { name: "Partnerships", icon: Handshake, href: "/partnerships" },
];

const CategoryNav = () => {
  return (
    <div className="sticky top-[calc(4rem+1px)] z-40 border-b bg-background">
      <div className="container">
        <div className="hide-scrollbar flex items-center gap-1 overflow-x-auto py-2.5">
          {categories.map((cat) => (
            <Link
              key={cat.name}
              to={cat.href}
              className={`flex shrink-0 items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors ${
                cat.highlight
                  ? "bg-primary text-primary-foreground hover:bg-primary/90"
                  : "border text-muted-foreground hover:border-primary/30 hover:bg-primary/5 hover:text-primary"
              }`}
            >
              <cat.icon className="h-3.5 w-3.5" />
              {cat.name}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoryNav;
