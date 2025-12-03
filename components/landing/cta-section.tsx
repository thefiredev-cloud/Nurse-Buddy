"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, Shield, Sparkles } from "lucide-react";
import { fadeInUp, staggerContainer, staggerItem } from "@/lib/motion";

/**
 * CTA Section - Final conversion push
 * Target Keywords: nursing test prep, start nursing exam prep, nursing practice test
 */
export function CTASection() {
  return (
    <section
      className="relative py-20 md:py-24 overflow-hidden"
      aria-labelledby="cta-heading"
    >
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-nursing-blue-600 via-nursing-blue-700 to-nursing-purple-700" />

      {/* Background decorations */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-white/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-nursing-purple-400/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />

      {/* Grid pattern overlay */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
          backgroundSize: "40px 40px",
        }}
      />

      <div className="container-tight relative">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="text-center"
        >
          <motion.div variants={staggerItem} className="mb-6">
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-white/90 text-sm font-medium border border-white/20">
              <Sparkles className="w-4 h-4" />
              Join thousands of nursing students
            </span>
          </motion.div>

          <motion.h2
            id="cta-heading"
            variants={staggerItem}
            className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-extrabold text-white mb-6 leading-tight"
          >
            Ready to Ace Your
            <br />
            <span className="text-nursing-green-300">Nursing Exams?</span>
          </motion.h2>

          <motion.p
            variants={staggerItem}
            className="text-lg md:text-xl text-blue-100 mb-10 max-w-2xl mx-auto"
          >
            Upload your first PowerPoint free and see how AI-powered practice
            tests from your own materials can transform your studying.
          </motion.p>

          <motion.div
            variants={staggerItem}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link href="/sign-up">
              <Button
                size="xl"
                variant="white"
                className="group shadow-strong hover:shadow-xl"
              >
                Get Started for $35/month
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </motion.div>

          <motion.div
            variants={staggerItem}
            className="mt-8 flex flex-wrap items-center justify-center gap-6 text-sm text-blue-100"
          >
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-nursing-green-300" />
              <span>7-day money-back guarantee</span>
            </div>
            <div className="hidden sm:block w-1 h-1 bg-blue-300/50 rounded-full" />
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-nursing-green-400 rounded-full animate-pulse-soft" />
              <span>5 free uploads included</span>
            </div>
            <div className="hidden sm:block w-1 h-1 bg-blue-300/50 rounded-full" />
            <span>Cancel anytime</span>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
