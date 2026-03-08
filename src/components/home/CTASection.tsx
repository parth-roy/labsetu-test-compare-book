import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const CTASection = () => {
  return (
    <section className="py-10">
      <div className="container">
        <div className="rounded-2xl bg-gradient-to-r from-primary to-primary/80 p-8 sm:p-12">
          <div className="flex flex-col items-center gap-5 text-center sm:flex-row sm:text-left">
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-primary-foreground sm:text-3xl">
                Are you a Diagnostic Lab?
              </h2>
              <p className="mt-2 text-sm text-primary-foreground/80">
                Partner with LabSetu and reach thousands of patients looking for quality diagnostics.
              </p>
            </div>
            <Button size="lg" variant="secondary" className="font-bold" asChild>
              <Link to="/lab-registration">Partner With Us <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
