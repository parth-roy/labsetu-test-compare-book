import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import {
  Clock, MessageSquare, FileText, ShieldCheck, Stethoscope, Heart, Brain,
  Baby, Bone, Eye, Smile, Flower2, Users, ArrowRight, Star, CheckCircle
} from "lucide-react";

const specialities = [
  { icon: Stethoscope, name: "General Physician", price: 199, color: "bg-blue-50 text-blue-600" },
  { icon: Heart, name: "Cardiologist", price: 499, color: "bg-red-50 text-red-600" },
  { icon: Brain, name: "Neurologist", price: 599, color: "bg-purple-50 text-purple-600" },
  { icon: Baby, name: "Pediatrician", price: 349, color: "bg-pink-50 text-pink-600" },
  { icon: Bone, name: "Orthopedist", price: 449, color: "bg-amber-50 text-amber-600" },
  { icon: Eye, name: "Ophthalmologist", price: 399, color: "bg-cyan-50 text-cyan-600" },
  { icon: Smile, name: "Dermatologist", price: 499, color: "bg-green-50 text-green-600" },
  { icon: Flower2, name: "Gynecologist", price: 449, color: "bg-rose-50 text-rose-600" },
];

const testimonials = [
  { name: "Aarohi", text: "I went for a free consultation with a dietician. The advice given was simply great. He shared a detailed diet chart and exercises which was easy to incorporate into my hectic schedule." },
  { name: "Ronak", text: "Best app for consultation and the most effective way to connect with the doctor from anywhere. The doctor replies with great detail and is extremely polite." },
  { name: "Aarzoo", text: "Initially, I was a little skeptical of consulting a doctor online. But the consultation turned out to be honest and cool, the doctor's behavior was friendly." },
  { name: "Yash", text: "The doctor always takes the time to understand the problem and on the basis of that takes the decision and explains it very well." },
  { name: "Rahul", text: "Amazingly easy and convenient. Great service for the same price as a clinic visit, without the hassle of having to drive to the doctor's clinic." },
];

const faqs = [
  { q: "When will I get an answer to my query?", a: "For free consultations, doctors reply within 24-48 hours. For paid consultations, you'll receive a reply within 2-4 business hours. If no response is received in time, we will refund your money." },
  { q: "Who are the consulting doctors?", a: "All doctors are registered medical practitioners. Experience, research, and track-record of practice are verified before a doctor is credentialed with LabSetu." },
  { q: "Will the doctor be able to resolve my issue?", a: "Our doctors provide expert advice and help identify next steps which may include further tests, medicine recommendations or lifestyle tips. Some cases may require in-person examination." },
  { q: "Is my consultation private?", a: "Privacy is a fundamental right. All your medical history and consultations are completely private and confidential. We comply with industry standards for secure data storage." },
  { q: "For how long is the consultation valid?", a: "For paid consultations, you can follow up with your doctor for up to 3 days. Free consultations allow follow-ups for one day only." },
];

const DoctorConsultation = () => {
  return (
    <Layout>
      {/* Hero */}
      <section className="bg-gradient-to-r from-background to-orange-50/50 py-12 md:py-20">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight">
                Online doctor consultation with qualified doctors
              </h1>
              <p className="mt-3 text-xl text-muted-foreground">Starting at ₹199</p>
              <div className="mt-8 flex flex-wrap gap-6">
                {[
                  { icon: Clock, text: "Talk within 30 min" },
                  { icon: MessageSquare, text: "Free follow up for 3 days" },
                  { icon: FileText, text: "Get a valid prescription" },
                ].map((item) => (
                  <div key={item.text} className="flex items-center gap-2 text-sm">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-orange-50">
                      <item.icon className="h-4 w-4 text-orange-500" />
                    </div>
                    <span className="font-medium">{item.text}</span>
                  </div>
                ))}
              </div>
              <Button size="lg" className="mt-8 bg-orange-500 hover:bg-orange-600">
                Consult now
              </Button>
            </div>
            <div className="hidden md:flex justify-center">
              <div className="relative h-72 w-72">
                <div className="absolute inset-0 rounded-full bg-amber-100/60" />
                <div className="absolute inset-4 flex items-center justify-center">
                  <Stethoscope className="h-32 w-32 text-primary/20" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-10">
        <div className="container">
          <Card className="border-0 shadow-md">
            <CardContent className="p-8">
              <div className="grid grid-cols-3 divide-x text-center">
                {[
                  { value: "30L+", label: "Total Consultations" },
                  { value: "3k+", label: "Daily Consultations" },
                  { value: "22+", label: "Specialities" },
                ].map((stat) => (
                  <div key={stat.label}>
                    <p className="text-3xl md:text-4xl font-bold text-orange-500">{stat.value}</p>
                    <p className="mt-1 text-sm text-muted-foreground">{stat.label}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Specialities */}
      <section className="py-12">
        <div className="container">
          <h2 className="font-display text-2xl md:text-3xl font-bold text-center mb-8">Consult Top Specialists</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {specialities.map((s) => (
              <Card key={s.name} className="cursor-pointer border-0 shadow-sm hover:shadow-md transition-shadow group">
                <CardContent className="p-5 text-center">
                  <div className={`mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-xl ${s.color}`}>
                    <s.icon className="h-7 w-7" />
                  </div>
                  <h3 className="text-sm font-semibold">{s.name}</h3>
                  <p className="mt-1 text-xs text-muted-foreground">Starting ₹{s.price}</p>
                  <Button variant="ghost" size="sm" className="mt-2 h-7 text-xs text-primary group-hover:bg-primary/5">
                    Consult <ArrowRight className="ml-1 h-3 w-3" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-12 bg-muted/30">
        <div className="container">
          <h2 className="font-display text-2xl md:text-3xl font-bold text-center mb-8">Our Happy Customers</h2>
          <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
            {testimonials.map((t) => (
              <Card key={t.name} className="shrink-0 w-80 border-0 shadow-sm">
                <CardContent className="p-6">
                  <div className="flex gap-1 mb-3">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed line-clamp-4">{t.text}</p>
                  <p className="mt-4 text-sm font-semibold">{t.name}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Why Consult */}
      <section className="py-12">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: ShieldCheck, title: "100% Confidential", desc: "All consultations are completely confidential." },
              { icon: CheckCircle, title: "Certified Doctors", desc: "Quality healthcare through certified and experienced doctors." },
              { icon: Clock, title: "Convenience", desc: "Seek expert opinion anytime, anywhere." },
              { icon: Users, title: "Cost Effective", desc: "Free consultations available. Paid starts at ₹50." },
            ].map((item) => (
              <div key={item.title} className="text-center">
                <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-primary/5">
                  <item.icon className="h-7 w-7 text-primary" />
                </div>
                <h3 className="text-sm font-bold mb-1">{item.title}</h3>
                <p className="text-xs text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Are you a doctor */}
      <section className="py-10">
        <div className="container">
          <Card className="border-0 shadow-md bg-gradient-to-r from-primary/5 to-orange-50">
            <CardContent className="flex flex-col md:flex-row items-center justify-between gap-6 p-8">
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                  <Stethoscope className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-bold">Are you a doctor?</h3>
                  <p className="text-sm text-muted-foreground">Be a part of our panel of specialists and connect with your patients from anywhere.</p>
                </div>
              </div>
              <Button>Join Now</Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-12 bg-muted/30">
        <div className="container max-w-3xl">
          <h2 className="font-display text-2xl md:text-3xl font-bold text-center mb-8">Frequently Asked Questions</h2>
          <Accordion type="single" collapsible className="space-y-2">
            {faqs.map((faq, i) => (
              <AccordionItem key={i} value={`faq-${i}`} className="rounded-lg border bg-background px-4">
                <AccordionTrigger className="text-sm font-medium hover:no-underline">{faq.q}</AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground">{faq.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>
    </Layout>
  );
};

export default DoctorConsultation;
