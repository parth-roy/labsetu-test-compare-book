import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-accent/5 py-20 lg:py-28">
      <div className="container relative z-10">
        <div className="mx-auto max-w-2xl text-center">
          <Badge variant="secondary" className="mb-4 px-4 py-1.5 font-medium">
            🏥 Trusted by 10,000+ patients
          </Badge>
          <h1 className="font-display text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            Let's find you{" "}
            <span className="text-primary">the Best Lab</span>
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Compare diagnostic labs, book tests at lowest prices, and get reports — all from one platform.
          </p>

          <div className="mx-auto mt-8 flex max-w-lg gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Search tests, e.g. CBC, Thyroid..." className="h-12 pl-10 text-base" />
            </div>
            <Button size="lg" className="h-12 px-6">Search</Button>
          </div>

          <div className="mt-4 flex flex-wrap justify-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <span className="inline-block h-2 w-2 rounded-full bg-success" />
              50+ labs offering lowest prices
            </span>
            <span className="flex items-center gap-1.5">
              <span className="inline-block h-2 w-2 rounded-full bg-primary" />
              Quick, easy & hassle free
            </span>
          </div>
        </div>
      </div>

      <div className="pointer-events-none absolute -top-24 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-primary/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 right-0 h-72 w-72 rounded-full bg-accent/10 blur-3xl" />
    </section>
  );
};

export default HeroSection;
