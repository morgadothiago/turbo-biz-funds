import Navbar from "@/components/landing/Navbar";
import Hero from "@/components/landing/Hero";
import WhatsAppConnect from "@/components/landing/WhatsAppConnect";
import Problem from "@/components/landing/Problem";
import HowItWorks from "@/components/landing/HowItWorks";
import Benefits from "@/components/landing/Benefits";
import Pricing from "@/components/landing/Pricing";
import Testimonials from "@/components/landing/Testimonials";
import FAQ from "@/components/landing/FAQ";
import CTA from "@/components/landing/CTA";
import Footer from "@/components/landing/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <Hero />
      <Problem />
      <WhatsAppConnect />
      <HowItWorks />
      <Benefits />
      <Pricing />
      <Testimonials />
      <FAQ />
      <CTA />
      <Footer />
    </div>
  );
};

export default Index;
