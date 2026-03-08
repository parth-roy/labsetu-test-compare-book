import { Shield, Clock, Home } from "lucide-react";

const trustPoints = [
  { icon: Shield, title: "NABL Certified Labs", desc: "All partner labs verified for quality standards", color: "text-primary" },
  { icon: Clock, title: "Quick Turnaround", desc: "Reports within 24-48 hours", color: "text-warning" },
  { icon: Home, title: "Home Collection", desc: "Sample collection at your doorstep", color: "text-success" },
];

const TrustBadges = () => {
  return (
    <section className="border-y bg-muted/20 py-8">
      <div className="container">
        <div className="grid gap-6 sm:grid-cols-3">
          {trustPoints.map((p) => (
            <div key={p.title} className="flex items-start gap-3">
              <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-background border shadow-sm`}>
                <p.icon className={`h-5 w-5 ${p.color}`} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-foreground">{p.title}</h3>
                <p className="text-xs text-muted-foreground">{p.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustBadges;
