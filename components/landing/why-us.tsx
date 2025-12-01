"use client";

import { motion } from "framer-motion";
import { Sparkles, BookOpen, ClipboardCheck } from "lucide-react";

export function WhyUs() {
  const reasons = [
    {
      icon: Sparkles,
      heading: "Your Slides, Custom Tests",
      text: "Upload your PowerPoints and get tests tailored to YOUR course material",
    },
    {
      icon: BookOpen,
      heading: "AI-Powered Rationales",
      text: "Detailed explanations for every answer choice from your content",
    },
    {
      icon: ClipboardCheck,
      heading: "100-Question Exams",
      text: "Comprehensive practice tests generated in seconds",
    },
  ];

  return (
    <section className="py-20 bg-nursing-blue text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold mb-4">Why Choose Nurse Buddy?</h2>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto">
            The smartest way to study for nursing school exams
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {reasons.map((reason, index) => {
            const Icon = reason.icon;
            return (
              <motion.div
                key={reason.heading}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-4">
                  <Icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-semibold mb-3">{reason.heading}</h3>
                <p className="text-blue-100">{reason.text}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

