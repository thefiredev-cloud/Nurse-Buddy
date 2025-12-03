"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Upload, Sparkles, FileText } from "lucide-react";
import { fadeInUp, scaleIn, staggerContainer, staggerItem } from "@/lib/motion";

/**
 * Hero Section - SEO-Optimized Landing Page Header
 * Target Keywords: nursing school test prep, AI nursing practice test, upload PowerPoint nursing exam
 */
export function Hero() {
  return (
    <section
      className="relative pt-28 pb-16 md:pt-32 md:pb-20 lg:pt-36 lg:pb-24 px-4 gradient-hero overflow-hidden"
      aria-labelledby="hero-heading"
    >
      {/* Background decorations */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-nursing-blue-200/30 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-nursing-green-200/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
      <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-nursing-purple-200/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />

      <div className="container-wide relative">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Content - SEO-rich headline */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
          >
            {/* Eyebrow text with keyword */}
            <motion.div variants={staggerItem} className="mb-4">
              <span className="badge-info">
                <Sparkles className="w-4 h-4" />
                AI-Powered Nursing Test Prep
              </span>
            </motion.div>

            {/* H1 with primary keywords */}
            <motion.h1
              id="hero-heading"
              variants={staggerItem}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-gray-900 mb-6 leading-tight tracking-tight"
            >
              Turn Your Class Slides Into{" "}
              <span className="text-gradient-nursing">Practice Tests</span>
            </motion.h1>

            {/* Subheadline with secondary keywords */}
            <motion.p
              variants={staggerItem}
              className="text-lg sm:text-xl text-gray-600 mb-8 max-w-xl leading-relaxed"
            >
              Upload your nursing school PowerPoints and get AI-generated{" "}
              <strong>100-question exams</strong> with{" "}
              <strong>detailed rationales</strong> for every answer. Study smarter with
              content from your own courses.
            </motion.p>

            {/* CTA Section */}
            <motion.div variants={staggerItem} className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/sign-up">
                  <Button
                    size="xl"
                    variant="premium"
                    className="w-full sm:w-auto group cta-glow"
                  >
                    <Upload className="w-5 h-5 mr-2" />
                    Upload Your First PowerPoint Free
                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Link href="#how-it-works">
                  <Button
                    size="xl"
                    variant="outline"
                    className="w-full sm:w-auto"
                  >
                    See How It Works
                  </Button>
                </Link>
              </div>

              {/* Trust indicators */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-nursing-green-500 animate-pulse-soft" />
                  <span className="text-sm font-medium text-nursing-blue-600">
                    5 free uploads included
                  </span>
                </div>
                <div className="text-gray-400">•</div>
                <span className="text-sm text-gray-600">
                  $35/month for unlimited
                </span>
                <div className="text-gray-400">•</div>
                <span className="text-sm text-gray-600">
                  Cancel anytime
                </span>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Visual - Interactive Demo Card */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={scaleIn}
            className="relative"
          >
            {/* Floating decoration */}
            <div className="absolute -top-6 -right-6 w-24 h-24 bg-nursing-purple-100 rounded-2xl rotate-12 animate-float hidden lg:block" />
            <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-nursing-green-100 rounded-xl -rotate-6 animate-float hidden lg:block" style={{ animationDelay: "1s" }} />

            {/* Main card with glassmorphism */}
            <div className="glass-card rounded-2xl shadow-strong overflow-hidden border-2 border-white/40">
              {/* Upload Section */}
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-medium text-gray-500 flex items-center gap-2">
                    <Upload className="w-4 h-4" />
                    Upload Your Slides
                  </span>
                  <span className="badge-success text-xs">
                    <div className="w-1.5 h-1.5 rounded-full bg-nursing-green-500" />
                    Step 1 of 3
                  </span>
                </div>

                {/* Upload zone */}
                <div className="border-2 border-dashed border-nursing-blue-200 rounded-xl p-6 text-center bg-nursing-blue-50/50 hover:bg-nursing-blue-50 transition-colors cursor-pointer group">
                  <div className="w-14 h-14 bg-nursing-blue-100 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                    <FileText className="w-7 h-7 text-nursing-blue-600" />
                  </div>
                  <p className="font-semibold text-gray-800">MedSurg_Chapter12.pptx</p>
                  <p className="text-sm text-gray-500 mt-1">42 slides • 2.4 MB</p>
                </div>

                <div className="flex items-center justify-between mt-4 text-xs text-gray-500">
                  <span>Supports: PPT, PPTX, PDF</span>
                  <span className="text-nursing-green-600 font-medium flex items-center gap-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-nursing-green-500" />
                    Ready to generate
                  </span>
                </div>
              </div>

              {/* Generated Test Preview */}
              <div className="p-6 bg-gradient-to-br from-nursing-blue-50 to-nursing-purple-50">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 bg-gradient-ai rounded-lg flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-white" />
                  </div>
                  <span className="font-bold text-nursing-blue-700">
                    AI-Generated Test Ready
                  </span>
                </div>

                <p className="text-sm text-gray-700 mb-4">
                  <span className="font-semibold text-gray-900">100 questions</span>{" "}
                  created from your Med-Surg Chapter 12 slides
                </p>

                {/* Feature highlight */}
                <div className="bg-white p-4 rounded-xl shadow-soft border-l-4 border-nursing-green-500">
                  <p className="text-sm text-gray-700">
                    <span className="font-semibold text-nursing-green-700">Includes:</span>{" "}
                    Detailed rationales for every answer choice to help you understand the
                    concepts deeply
                  </p>
                </div>

                {/* Stats preview */}
                <div className="grid grid-cols-3 gap-3 mt-4">
                  {[
                    { label: "Questions", value: "100" },
                    { label: "Topics", value: "12" },
                    { label: "Rationales", value: "400" },
                  ].map((stat) => (
                    <div
                      key={stat.label}
                      className="bg-white/80 rounded-lg p-2 text-center"
                    >
                      <p className="text-lg font-bold text-nursing-blue-600">
                        {stat.value}
                      </p>
                      <p className="text-xs text-gray-500">{stat.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
