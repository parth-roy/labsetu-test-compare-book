import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Phone, Zap, MessageCircle } from "lucide-react";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import heroLab from "@/assets/hero-lab.jpg";
import heroLabsetu from "@/assets/hero-labsetu.jpg";
import heroHomeCollection from "@/assets/hero-home-collection.jpg";
import heroReports from "@/assets/hero-reports.jpg";

const quickCategories = [
  { name: "Full Body Packages", emoji: "🧬", href: "/packages" },
  { name: "Fever Tests", emoji: "🤒", href: "/search?category=Fever" },
  { name: "Diabetes Tests", emoji: "💉", href: "/search?category=Diabetes" },
  { name: "Vitamins Tests", emoji: "💊", href: "/search?category=Vitamins" },
  { name: "Heart Health", emoji: "❤️", href: "/search?category=Heart Health" },
];

const heroCards = [
  { title: "Trusted NABL Certified Labs", subtitle: "Hygienic & safety assured testing", image: heroLab },
  { title: "LabSetu Labs", subtitle: "Wide coverage across India", image: heroLabsetu },
  { title: "Home Sample Collection", subtitle: "Safe pickup at your doorstep", image: heroHomeCollection },
  { title: "Fast, Accurate Reports", subtitle: "Doctor-verified, delivered on time", image: heroReports },
];

const HeroSection = () => {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = () => {
    navigate(`/search${query ? `?q=${encodeURIComponent(query)}` : ""}`);
  };

  return (
    <section className="bg-background py-10 lg:py-16">
      <div className="container">
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-12 items-center">
          {/* Left Side */}
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-[2.75rem] lg:leading-[1.15]">
              Book Lab Tests Online from{" "}
              <span className="text-primary">Trusted and Certified Labs</span>
            </h1>

            {/* Search Bar */}
            <div className="mt-6 flex rounded-xl border-2 border-border bg-background shadow-sm focus-within:border-primary transition-colors">
              <Input
                placeholder="Search tests or full body checkups"
                className="h-12 flex-1 border-0 bg-transparent pl-4 text-base shadow-none focus-visible:ring-0"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              />
              <Button
                size="lg"
                className="m-1 h-10 rounded-lg px-5"
                onClick={handleSearch}
              >
                <Search className="h-4 w-4" />
              </Button>
            </div>

            {/* Action Buttons */}
            <div className="mt-5 flex flex-wrap gap-3">
              <button className="flex items-center gap-2 rounded-xl border bg-background px-4 py-2.5 text-sm font-medium text-foreground shadow-sm transition-colors hover:bg-muted/50">
                <Phone className="h-4 w-4 text-primary" />
                Book via <strong>Phone Call</strong>
              </button>
              <button className="flex items-center gap-2 rounded-xl border bg-background px-4 py-2.5 text-sm font-medium text-foreground shadow-sm transition-colors hover:bg-muted/50">
                <Zap className="h-4 w-4 text-warning" />
                Quick <strong>Order</strong>
              </button>
              <button className="flex items-center gap-2 rounded-xl border bg-background px-4 py-2.5 text-sm font-medium text-foreground shadow-sm transition-colors hover:bg-muted/50">
                <MessageCircle className="h-4 w-4 text-success" />
                Book via <strong>WhatsApp</strong>
              </button>
            </div>

            {/* Category Quick Links */}
            <div className="mt-6">
              <p className="mb-3 text-sm font-semibold text-foreground">Find tests & packages for your needs</p>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                {quickCategories.map((cat) => (
                  <Link
                    key={cat.name}
                    to={cat.href}
                    className="flex items-center gap-2.5 rounded-xl border bg-background px-3 py-3 text-sm font-medium text-foreground shadow-sm transition-all hover:border-primary/30 hover:shadow-md"
                  >
                    <span className="text-lg">{cat.emoji}</span>
                    <span className="text-xs font-semibold leading-tight">{cat.name}</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Right Side — 2x2 Image Grid */}
          <div className="hidden lg:grid grid-cols-2 gap-3">
            {heroCards.map((card) => (
              <div key={card.title} className="group relative overflow-hidden rounded-2xl">
                <img
                  src={card.image}
                  alt={card.title}
                  className="aspect-[4/3] w-full object-cover transition-transform group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                <div className="absolute bottom-3 left-3 right-3">
                  <p className="text-sm font-bold text-white">{card.title}</p>
                  <p className="text-xs text-white/80">{card.subtitle}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
