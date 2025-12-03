"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Check, Sparkles, Shield, Zap } from "lucide-react";
import Link from "next/link";
import { getProductSchema } from "@/lib/seo/structured-data";
import { fadeInUp, scaleIn, staggerContainer, staggerItem } from "@/lib/motion";

/**
 * Pricing Section - SEO Optimized with Product Schema
 * Target Keywords: nursing test prep pricing, affordable nursing exam prep, nursing study subscription
 */
export function Pricing() {
  const features = [
    { text: "Upload PowerPoints & PDFs", icon: Zap },
    { text: "Unlimited 100-question tests", icon: Sparkles },
    { text: "AI rationales from your content", icon: Sparkles },
    { text: "Performance tracking dashboard", icon: Check },
    { text: "Mobile access anywhere", icon: Check },
    { text: "Cancel anytime", icon: Shield },
  ];

  const productSchema = getProductSchema();

  return (
    <section
      id="pricing"
      className="section-padding bg-gradient-to-b from-gray-50 to-white"
      aria-labelledby="pricing-heading"
    >
      {/* Product Schema for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />

      <div className="container-wide">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={staggerContainer}
          className="text-center mb-12"
        >
          <motion.div variants={staggerItem} className="mb-4">
            <span className="badge-success">
              <Check className="w-4 h-4" />
              Simple Pricing
            </span>
          </motion.div>

          <motion.h2
            id="pricing-heading"
            variants={staggerItem}
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4"
          >
            One Plan. Everything You Need.
          </motion.h2>

          <motion.p
            variants={staggerItem}
            className="text-lg text-gray-600 max-w-2xl mx-auto"
          >
            No hidden fees. No complicated tiers. Just powerful nursing test prep
            from your own materials.
          </motion.p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={scaleIn}
          className="max-w-lg mx-auto"
        >
          <Card className="relative border-2 border-nursing-blue-500 shadow-strong hover:shadow-glow-blue transition-all duration-300 overflow-hidden">
            {/* Popular badge */}
            <div className="absolute top-0 right-0 bg-gradient-ai text-white text-xs font-bold px-4 py-1 rounded-bl-lg">
              MOST POPULAR
            </div>

            <CardHeader className="text-center pt-10 pb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-nursing-blue-100 rounded-2xl mb-4 mx-auto">
                <Sparkles className="w-8 h-8 text-nursing-blue-600" />
              </div>

              <h3 className="text-2xl font-bold text-gray-900">Pro Access</h3>

              <div className="mt-4 flex items-baseline justify-center gap-1">
                <span className="text-5xl md:text-6xl font-extrabold text-nursing-blue-600">
                  $35
                </span>
                <span className="text-gray-500 text-lg">/month</span>
              </div>

              <p className="text-gray-600 mt-2">
                Everything you need to ace your nursing exams
              </p>
            </CardHeader>

            <CardContent className="px-8">
              <ul className="space-y-4">
                {features.map((feature) => (
                  <li key={feature.text} className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-nursing-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="w-4 h-4 text-nursing-green-600" />
                    </div>
                    <span className="text-gray-700 font-medium">{feature.text}</span>
                  </li>
                ))}
              </ul>

              {/* Free tier callout */}
              <div className="mt-6 p-4 bg-nursing-blue-50 rounded-xl border border-nursing-blue-100">
                <p className="text-sm text-nursing-blue-700 font-medium text-center">
                  <span className="font-bold">Start free</span> with 5 uploads.
                  No credit card required.
                </p>
              </div>
            </CardContent>

            <CardFooter className="flex flex-col gap-4 px-8 pb-8">
              <Link href="/sign-up" className="w-full">
                <Button size="xl" variant="premium" className="w-full cta-glow">
                  Start Preparing Today
                </Button>
              </Link>

              <div className="flex items-center justify-center gap-4 text-sm text-gray-500">
                <div className="flex items-center gap-1">
                  <Shield className="w-4 h-4 text-nursing-green-500" />
                  <span>7-day money-back guarantee</span>
                </div>
              </div>
            </CardFooter>
          </Card>
        </motion.div>

        {/* Trust indicators */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          className="text-center mt-12"
        >
          <p className="text-gray-500 text-sm">
            Trusted by nursing students at top programs nationwide
          </p>
        </motion.div>
      </div>
    </section>
  );
}
