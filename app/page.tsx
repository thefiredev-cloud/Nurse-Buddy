import { Navbar } from "@/components/landing/navbar";
import { Hero } from "@/components/landing/hero";
import { SocialProof } from "@/components/landing/social-proof";
import { UseCases } from "@/components/landing/use-cases";
import { PainPoints } from "@/components/landing/pain-points";
import { WhyUs } from "@/components/landing/why-us";
import { HowItWorks } from "@/components/landing/how-it-works";
import { Benefits } from "@/components/landing/benefits";
import { Pricing } from "@/components/landing/pricing";
import { Testimonials } from "@/components/landing/testimonials";
import { CTASection } from "@/components/landing/cta-section";
import { FAQs } from "@/components/landing/faqs";
import { Footer } from "@/components/landing/footer";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <Hero />
      <SocialProof />
      <UseCases />
      <PainPoints />
      <WhyUs />
      <HowItWorks />
      <Benefits />
      <Pricing />
      <Testimonials />
      <CTASection />
      <FAQs />
      <Footer />
    </main>
  );
}

