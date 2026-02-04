import Navbar from "@/components/landing/Navbar";
import Hero from "@/components/landing/Hero";
import Problem from "@/components/landing/Problem";
import HowItWorks from "@/components/landing/HowItWorks";
import Pricing from "@/components/landing/Pricing";
import Testimonials from "@/components/landing/Testimonials";
import FAQ from "@/components/landing/FAQ";
import Footer from "@/components/landing/Footer";
import BackgroundOrbs from "@/components/landing/BackgroundOrbs";

const Index = () => {
  return (
    <div className="min-h-screen bg-background relative">
      <BackgroundOrbs isGlobal={true} />
      <Navbar />
      <Hero />
      <Problem />
      <HowItWorks />
      <Testimonials />
      <Pricing />
      <FAQ />
      <Footer />
    </div>
  );
};

export default Index;
