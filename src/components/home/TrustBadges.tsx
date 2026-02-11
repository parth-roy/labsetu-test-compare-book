import { Shield, Clock, Home } from "lucide-react";

const trustPoints = [
  { icon: Shield, title: "NABL Certified Labs", description: "All partner labs are verified for quality standards" },
  { icon: Clock, title: "Quick Turnaround", description: "Get your reports within 24-48 hours" },
  { icon: Home, title: "Home Collection", description: "Sample collection at your doorstep" },
];

const TrustBadges = () => {
  return (
    <section className="border-b bg-card py-10">
      <div className="container">
        <div className="grid gap-6 sm:grid-cols-3">
          {trustPoints.map((point) => (
            <div key={point.title} className="flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                <point.icon className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-display text-sm font-semibold text-foreground">{point.title}</h3>
                <p className="mt-0.5 text-sm text-muted-foreground">{point.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustBadges;
