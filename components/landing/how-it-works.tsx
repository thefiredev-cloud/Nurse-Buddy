"use client";

import { motion } from "framer-motion";
import { Upload, Sparkles, BookOpen, ArrowRight } from "lucide-react";
import { fadeInUp, staggerContainer, staggerItem } from "@/lib/motion";

/**
 * How It Works Section - SEO Optimized Process Explanation
 * Target Keywords: how to study for nursing exams, nursing test prep steps, AI nursing practice test
 */
export function HowItWorks() {
  const steps = [
    {
      number: 1,
      title: "Upload Your Slides",
      description:
        "PowerPoint or PDF from any nursing class - Med-Surg, Pharmacology, Fundamentals, and more",
      icon: Upload,
      color: "nursing-blue",
    },
    {
      number: 2,
      title: "AI Generates Your Test",
      description:
        "100 clinically-relevant questions tailored specifically to your course material",
      icon: Sparkles,
      color: "nursing-purple",
    },
    {
      number: 3,
      title: "Learn from Rationales",
      description:
        "Understand every answer with detailed AI explanations for all choices",
      icon: BookOpen,
      color: "nursing-green",
    },
  ];

  const colorClasses = {
    "nursing-blue": {
      bg: "bg-nursing-blue-100",
      text: "text-nursing-blue-600",
      border: "border-nursing-blue-200",
      gradient: "from-nursing-blue-500 to-nursing-blue-600",
    },
    "nursing-purple": {
      bg: "bg-nursing-purple-100",
      text: "text-nursing-purple-600",
      border: "border-nursing-purple-200",
      gradient: "from-nursing-purple-500 to-nursing-purple-600",
    },
    "nursing-green": {
      bg: "bg-nursing-green-100",
      text: "text-nursing-green-600",
      border: "border-nursing-green-200",
      gradient: "from-nursing-green-500 to-nursing-green-600",
    },
  };

  return (
    <section
      id="how-it-works"
      className="section-padding bg-gradient-to-b from-white to-gray-50"
      aria-labelledby="how-it-works-heading"
    >
      <div className="container-wide">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={staggerContainer}
          className="text-center mb-16"
        >
          <motion.div variants={staggerItem} className="mb-4">
            <span className="badge-premium">
              <Sparkles className="w-4 h-4" />
              Simple Process
            </span>
          </motion.div>

          <motion.h2
            id="how-it-works-heading"
            variants={staggerItem}
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4"
          >
            How Nurse Buddy Works
          </motion.h2>

          <motion.p
            variants={staggerItem}
            className="text-lg text-gray-600 max-w-2xl mx-auto"
          >
            Get custom practice tests from your own nursing materials in three
            simple steps
          </motion.p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 lg:gap-12 relative">
          {/* Connector line - desktop only */}
          <div className="hidden md:block absolute top-24 left-1/6 right-1/6 h-0.5 bg-gradient-to-r from-nursing-blue-200 via-nursing-purple-200 to-nursing-green-200" />

          {steps.map((step, index) => {
            const colors = colorClasses[step.color as keyof typeof colorClasses];
            const IconComponent = step.icon;

            return (
              <motion.div
                key={step.number}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                variants={fadeInUp}
                transition={{ delay: index * 0.15 }}
                className="relative"
              >
                {/* Arrow connector - mobile */}
                {index < steps.length - 1 && (
                  <div className="md:hidden flex justify-center py-4">
                    <ArrowRight className="w-6 h-6 text-gray-300 rotate-90" />
                  </div>
                )}

                {/* Step content */}
                <div className="card-interactive text-center">
                  {/* Step number badge */}
                  <div
                    className={`absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 bg-gradient-to-br ${colors.gradient} text-white rounded-full flex items-center justify-center text-sm font-bold shadow-md`}
                  >
                    {step.number}
                  </div>

                  {/* Icon */}
                  <div
                    className={`w-20 h-20 ${colors.bg} rounded-2xl flex items-center justify-center mx-auto mb-6 mt-4`}
                  >
                    <IconComponent className={`w-10 h-10 ${colors.text}`} />
                  </div>

                  {/* Content */}
                  <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-3">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom stats */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          className="mt-16 grid grid-cols-3 gap-4 max-w-2xl mx-auto"
        >
          {[
            { value: "< 3 min", label: "To generate" },
            { value: "100", label: "Questions per test" },
            { value: "400+", label: "Rationales included" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-2xl md:text-3xl font-bold text-nursing-blue-600">
                {stat.value}
              </p>
              <p className="text-sm text-gray-500">{stat.label}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
