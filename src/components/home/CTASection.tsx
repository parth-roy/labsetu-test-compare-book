import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const CTASection = () => {
  return (
    <section className="py-16">
      <div className="container">
        <Card className="overflow-hidden bg-gradient-to-r from-primary to-accent">
          <CardContent className="flex flex-col items-center gap-6 p-10 text-center text-primary-foreground sm:flex-row sm:text-left">
            <div className="flex-1">
              <h2 className="font-display text-2xl font-bold">Are you a diagnostic lab?</h2>
              <p className="mt-2 text-sm opacity-90">
                Partner with LabSetu and reach thousands of patients looking for quality diagnostics.
              </p>
            </div>
            <Button size="lg" variant="secondary" asChild>
              <Link to="/register">Partner With Us</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default CTASection;
