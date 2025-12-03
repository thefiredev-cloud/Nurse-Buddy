import dynamic from "next/dynamic";
import { Navbar } from "@/components/landing/navbar";
import { Hero } from "@/components/landing/hero";
import { Footer } from "@/components/landing/footer";

/**
 * Landing Page - SEO & Performance Optimized
 *
 * Performance Strategy:
 * - Hero and Navbar are statically imported (above the fold, critical)
 * - Below-the-fold components use dynamic imports with loading states
 * - This reduces initial bundle size and improves LCP
 *
 * SEO Strategy:
 * - Semantic HTML structure with proper heading hierarchy
 * - JSON-LD structured data injected via layout and individual sections
 * - All content is server-rendered for crawlability
 */

// Dynamic imports for below-the-fold components (performance optimization)
const SocialProof = dynamic(
  () => import("@/components/landing/social-proof").then((mod) => mod.SocialProof),
  { ssr: true }
);

const UseCases = dynamic(
  () => import("@/components/landing/use-cases").then((mod) => mod.UseCases),
  { ssr: true }
);

const PainPoints = dynamic(
  () => import("@/components/landing/pain-points").then((mod) => mod.PainPoints),
  { ssr: true }
);

const WhyUs = dynamic(
  () => import("@/components/landing/why-us").then((mod) => mod.WhyUs),
  { ssr: true }
);

const HowItWorks = dynamic(
  () => import("@/components/landing/how-it-works").then((mod) => mod.HowItWorks),
  { ssr: true }
);

const Benefits = dynamic(
  () => import("@/components/landing/benefits").then((mod) => mod.Benefits),
  { ssr: true }
);

const Pricing = dynamic(
  () => import("@/components/landing/pricing").then((mod) => mod.Pricing),
  { ssr: true }
);

const Testimonials = dynamic(
  () => import("@/components/landing/testimonials").then((mod) => mod.Testimonials),
  { ssr: true }
);

const CTASection = dynamic(
  () => import("@/components/landing/cta-section").then((mod) => mod.CTASection),
  { ssr: true }
);

const FAQs = dynamic(
  () => import("@/components/landing/faqs").then((mod) => mod.FAQs),
  { ssr: true }
);

export default function Home() {
  return (
    <main className="min-h-screen" role="main">
      {/* Critical above-the-fold content - statically imported */}
      <Navbar />
      <Hero />

      {/* Below-the-fold content - dynamically imported for performance */}
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

      {/* Footer - statically imported (lightweight) */}
      <Footer />
    </main>
  );
}
