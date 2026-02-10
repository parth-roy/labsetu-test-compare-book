import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import {
  Search,
  Shield,
  Clock,
  Home,
  Star,
  ArrowRight,
  FlaskConical,
  HeartPulse,
  Droplets,
  Brain,
  Microscope,
  Activity,
} from "lucide-react";

const popularTests = [
  { name: "Complete Blood Count (CBC)", price: "₹299", icon: Droplets },
  { name: "Lipid Profile", price: "₹449", icon: HeartPulse },
  { name: "Thyroid Profile (T3, T4, TSH)", price: "₹549", icon: Activity },
  { name: "HbA1c (Diabetes)", price: "₹399", icon: FlaskConical },
  { name: "Liver Function Test", price: "₹499", icon: Microscope },
  { name: "Kidney Function Test", price: "₹599", icon: Brain },
];

const featuredLabs = [
  { name: "PathCare Diagnostics", rating: 4.8, tests: 120, nabl: true, homeCollection: true },
  { name: "LifeLine Labs", rating: 4.6, tests: 95, nabl: true, homeCollection: true },
  { name: "MediScan Centre", rating: 4.5, tests: 80, nabl: false, homeCollection: true },
  { name: "HealthFirst Diagnostics", rating: 4.7, tests: 110, nabl: true, homeCollection: false },
];

const trustPoints = [
  { icon: Shield, title: "NABL Certified Labs", description: "All partner labs are verified for quality standards" },
  { icon: Clock, title: "Quick Turnaround", description: "Get your reports within 24-48 hours" },
  { icon: Home, title: "Home Collection", description: "Sample collection at your doorstep" },
];

const Index = () => {
  return (
    <Layout>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-accent/5 py-20 lg:py-28">
        <div className="container relative z-10">
          <div className="mx-auto max-w-2xl text-center">
            <Badge variant="secondary" className="mb-4 px-4 py-1.5 font-medium">
              🏥 Trusted by 10,000+ patients
            </Badge>
            <h1 className="font-display text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              Compare Labs.{" "}
              <span className="text-primary">Book Tests.</span>{" "}
              Save More.
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
              Find the best diagnostic labs near you, compare prices, and book your tests in minutes — all from one platform.
            </p>

            {/* Search bar */}
            <div className="mx-auto mt-8 flex max-w-lg gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search tests, e.g. CBC, Thyroid..."
                  className="h-12 pl-10 text-base"
                />
              </div>
              <Button size="lg" className="h-12 px-6">
                Search
              </Button>
            </div>

            <p className="mt-3 text-xs text-muted-foreground">
              Popular: CBC • Lipid Profile • Full Body Checkup • Thyroid
            </p>
          </div>
        </div>

        {/* Decorative blobs */}
        <div className="pointer-events-none absolute -top-24 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-primary/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 right-0 h-72 w-72 rounded-full bg-accent/10 blur-3xl" />
      </section>

      {/* Trust badges */}
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

      {/* Popular Tests */}
      <section className="py-16">
        <div className="container">
          <div className="flex items-end justify-between">
            <div>
              <h2 className="font-display text-2xl font-bold text-foreground">Popular Tests</h2>
              <p className="mt-1 text-sm text-muted-foreground">Most booked diagnostic tests on LabSetu</p>
            </div>
            <Button variant="ghost" size="sm" className="hidden sm:flex" asChild>
              <Link to="/search">
                View all <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {popularTests.map((test) => (
              <Card key={test.name} className="group cursor-pointer transition-shadow hover:shadow-md">
                <CardContent className="flex items-center gap-4 p-5">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 transition-colors group-hover:bg-primary/20">
                    <test.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm font-semibold text-foreground">{test.name}</h3>
                    <p className="text-xs text-muted-foreground">Starting from</p>
                  </div>
                  <span className="font-display text-lg font-bold text-primary">{test.price}</span>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-6 text-center sm:hidden">
            <Button variant="outline" size="sm" asChild>
              <Link to="/search">View all tests</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Labs */}
      <section className="bg-muted/50 py-16">
        <div className="container">
          <div className="flex items-end justify-between">
            <div>
              <h2 className="font-display text-2xl font-bold text-foreground">Featured Labs</h2>
              <p className="mt-1 text-sm text-muted-foreground">Top-rated diagnostic labs in your city</p>
            </div>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {featuredLabs.map((lab) => (
              <Card key={lab.name} className="group cursor-pointer transition-shadow hover:shadow-md">
                <CardContent className="p-5">
                  <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 font-display text-xl font-bold text-primary">
                    {lab.name.charAt(0)}
                  </div>
                  <h3 className="mt-3 font-display text-sm font-semibold text-foreground">{lab.name}</h3>
                  <div className="mt-2 flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      <Star className="h-3.5 w-3.5 fill-warning text-warning" />
                      <span className="text-sm font-medium text-foreground">{lab.rating}</span>
                    </div>
                    <span className="text-xs text-muted-foreground">• {lab.tests} tests</span>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {lab.nabl && (
                      <Badge variant="secondary" className="text-xs">
                        <Shield className="mr-1 h-3 w-3" /> NABL
                      </Badge>
                    )}
                    {lab.homeCollection && (
                      <Badge variant="secondary" className="text-xs">
                        <Home className="mr-1 h-3 w-3" /> Home Collection
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
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
    </Layout>
  );
};

export default Index;
