import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";
import labsetuLogo from "@/assets/labsetu-logo.png";
import {
  Building2, FlaskConical, Stethoscope, Shield, Handshake, Users, Megaphone, MapPin,
  CheckCircle, ArrowRight, Phone, Mail, Globe
} from "lucide-react";

const solutions = [
  {
    id: "corporate",
    icon: Building2,
    title: "Corporate Wellness",
    desc: "Support your team's well-being and boost their overall productivity with our suite of services tailored to meet the unique needs of your employees.",
    features: ["Cashless diagnostics", "Health checkups", "Online doctor consultations"],
  },
  {
    id: "hospital",
    icon: Stethoscope,
    title: "Hospital Services",
    desc: "Streamline operations, boost profitability and enhance patient satisfaction with our end-to-end diagnostics management solutions.",
    features: ["One-stop procurement & supply chain", "Tech-enabled operations", "Patient lifecycle management"],
  },
  {
    id: "insurance",
    icon: Shield,
    title: "Insurance",
    desc: "Revolutionise insurance offerings with our comprehensive healthcare solutions, enhancing experiences for insurers and their clients.",
    features: ["Pan-India service capability", "Cashless diagnostics", "Health assessments & reports"],
  },
  {
    id: "strategic",
    icon: Handshake,
    title: "Strategic Partners",
    desc: "Optimise your healthcare ecosystem with our integrated solutions across eDiagnostics and healthcare services.",
    features: ["API Integration", "SSO Integration", "Done-in-One Ordering"],
  },
  {
    id: "associates",
    icon: Users,
    title: "Health Associates",
    desc: "Join the growing network of health partners and help millions stay healthier, while building a successful business.",
    features: ["Become an entrepreneur", "Earn on every order", "Bring quality healthcare to your community"],
  },
  {
    id: "advertise",
    icon: Megaphone,
    title: "Advertise with Us",
    desc: "Leverage the power of associating with a trusted brand with a wide customer reach and enhance your brand's visibility.",
    features: ["Advanced analytics & insights", "Scalable & customised solutions", "Engage with a large audience"],
  },
  {
    id: "collection",
    icon: MapPin,
    title: "Authorised Collection Centres",
    desc: "Become a LabSetu Authorised Collection Centre Partner and deliver high-quality diagnostics services in your city.",
    features: ["Start with nominal investment", "Dedicated sales team", "Comprehensive support system"],
  },
];

const Partnerships = () => {
  const [activeSolution, setActiveSolution] = useState("corporate");
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", org: "", strength: "", service: "", requirement: "" });
  const [submitted, setSubmitted] = useState(false);
  const { toast } = useToast();

  const active = solutions.find((s) => s.id === activeSolution)!;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    toast({ title: "Request submitted!", description: "We'll get in touch shortly." });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-6">
            <Link to="/"><img src={labsetuLogo} alt="LabSetu" className="h-8" /></Link>
            <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
              <Link to="/partnerships" className="text-primary">Home</Link>
              <span className="text-muted-foreground">Our Solutions</span>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/partnerships#about" className="text-sm font-medium hover:text-primary">About Us</Link>
            <a href="#contactUs">
              <Button size="sm">Contact Us</Button>
            </a>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-rose-50 via-background to-orange-50 py-24 md:py-32">
        <div className="container text-center relative z-10">
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
            Let's <span className="text-primary">Empower</span> Healthcare{" "}
            <span className="text-orange-500">Together</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
            Partner with India's trusted healthcare platform to deliver care, enhance efficiency and improve health outcomes
          </p>
          <a href="#about">
            <Button size="lg" className="mt-8">Know more about us</Button>
          </a>
        </div>
        {/* Decorative elements */}
        <div className="absolute left-0 bottom-0 h-64 w-64 opacity-10">
          <div className="h-full w-full rounded-full bg-gradient-to-tr from-primary to-orange-400" />
        </div>
        <div className="absolute right-0 top-0 h-48 w-48 opacity-10">
          <div className="h-full w-full rounded-full bg-gradient-to-bl from-pink-400 to-primary" />
        </div>
      </section>

      {/* Platform Stats */}
      <section id="about" className="py-16 bg-muted/30">
        <div className="container">
          <h2 className="text-center font-display text-3xl font-bold mb-4">India's Growing Integrated Diagnostics Platform</h2>
          <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: FlaskConical, title: "eDiagnostics", desc: "Online lab test booking with certified labs, convenient at-home sample collection and online reports." },
              { icon: Stethoscope, title: "eConsultations", desc: "Immediate access to qualified doctors for virtual consultations and health guidance." },
              { icon: Building2, title: "Lab Network", desc: "Partner labs across major cities ensuring quality diagnostics at affordable prices." },
            ].map((item) => (
              <Card key={item.title} className="text-center border-0 shadow-md">
                <CardContent className="p-8">
                  <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10">
                    <item.icon className="h-7 w-7 text-primary" />
                  </div>
                  <h3 className="text-lg font-bold mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Solutions Tabs */}
      <section className="py-16">
        <div className="container">
          <h2 className="text-center font-display text-3xl font-bold mb-10">Tailored solutions for every need</h2>
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {solutions.map((s) => (
              <button
                key={s.id}
                onClick={() => setActiveSolution(s.id)}
                className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${
                  activeSolution === s.id
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                {s.title}
              </button>
            ))}
          </div>
          <Card className="mx-auto max-w-3xl border-0 shadow-lg">
            <CardContent className="p-8 md:p-10">
              <div className="flex items-start gap-4 mb-6">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                  <active.icon className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">{active.title}</h3>
                  <p className="mt-2 text-muted-foreground">{active.desc}</p>
                </div>
              </div>
              <ul className="space-y-3 mb-6">
                {active.features.map((f) => (
                  <li key={f} className="flex items-center gap-3 text-sm">
                    <CheckCircle className="h-4 w-4 text-green-500 shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <Button variant="outline" className="group">
                Know more <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CEO Message */}
      <section className="py-16 bg-muted/30">
        <div className="container max-w-3xl text-center">
          <h2 className="font-display text-3xl font-bold mb-6">A message from Our Founder</h2>
          <div className="rounded-2xl bg-background p-8 shadow-lg">
            <p className="text-muted-foreground leading-relaxed mb-6">
              "We are driven by a singular mission to make high-quality healthcare understandable, accessible, and affordable for millions across India. As we continue to innovate and expand, our commitment to excellence and integrity remains steadfast. Together with our partners, we are transforming lives by delivering exceptional healthcare services."
            </p>
            <p className="font-bold">LabSetu Team</p>
            <p className="text-sm text-muted-foreground">LabSetu Diagnostics</p>
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section id="contactUs" className="py-16">
        <div className="container max-w-2xl">
          <h2 className="text-center font-display text-3xl font-bold mb-2">Let's Collaborate for Success</h2>
          <p className="text-center text-sm text-muted-foreground mb-8">Fields marked with * are mandatory</p>

          {submitted ? (
            <Card className="text-center border-0 shadow-lg">
              <CardContent className="p-10">
                <CheckCircle className="mx-auto mb-4 h-16 w-16 text-green-500" />
                <h3 className="text-xl font-bold mb-2">Thank you!</h3>
                <p className="text-muted-foreground">Your request has been registered. We will get in touch with you shortly.</p>
              </CardContent>
            </Card>
          ) : (
            <Card className="border-0 shadow-lg">
              <CardContent className="p-8">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label className="text-xs">Name *</Label>
                      <Input required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs">Work Email *</Label>
                      <Input type="email" required value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label className="text-xs">Contact Number *</Label>
                      <Input required value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} placeholder="+91" />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs">Organisation Name *</Label>
                      <Input required value={formData.org} onChange={(e) => setFormData({ ...formData, org: e.target.value })} />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label className="text-xs">Employee Strength *</Label>
                      <Select value={formData.strength} onValueChange={(v) => setFormData({ ...formData, strength: v })}>
                        <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="lt500">Less than 500</SelectItem>
                          <SelectItem value="500-2000">500 to 2000</SelectItem>
                          <SelectItem value="gt2000">More than 2000</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs">Service Interested In *</Label>
                      <Select value={formData.service} onValueChange={(v) => setFormData({ ...formData, service: v })}>
                        <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="health-checks">Health Checks</SelectItem>
                          <SelectItem value="diagnostics">Diagnostics</SelectItem>
                          <SelectItem value="consultations">Consultations</SelectItem>
                          <SelectItem value="insurance">Insurance Products</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs">Your Requirement</Label>
                    <Textarea value={formData.requirement} onChange={(e) => setFormData({ ...formData, requirement: e.target.value })} rows={3} />
                  </div>
                  <Button type="submit" className="w-full" size="lg">Get In Touch</Button>
                </form>
              </CardContent>
            </Card>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-muted/30 py-10">
        <div className="container">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <img src={labsetuLogo} alt="LabSetu" className="h-6" />
              <span className="text-sm text-muted-foreground">India's trusted diagnostics platform</span>
            </div>
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <span className="flex items-center gap-1"><Phone className="h-3.5 w-3.5" /> 1800-XXX-XXXX</span>
              <span className="flex items-center gap-1"><Mail className="h-3.5 w-3.5" /> partners@labsetu.com</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Partnerships;
