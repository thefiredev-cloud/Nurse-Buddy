"use client";

import { motion } from "framer-motion";
import { Upload, Brain, BookOpen, Zap, CheckCircle } from "lucide-react";

export function SocialProof() {
  const features = [
    { icon: Upload, label: "Upload Any Slides", description: "PPT, PPTX, or PDF" },
    { icon: Brain, label: "AI-Powered Questions", description: "From your content" },
    { icon: BookOpen, label: "Detailed Rationales", description: "For every answer" },
  ];

  const badges = [
    "Study Your Own Materials",
    "100-Question Practice Tests",
    "Instant AI Feedback",
  ];

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="inline-flex items-center justify-center w-12 h-12 bg-nursing-light rounded-full mb-4">
                  <Icon className="w-6 h-6 text-nursing-blue" />
                </div>
                <div className="text-xl font-bold text-nursing-blue mb-2">
                  {feature.label}
                </div>
                <div className="text-gray-600">{feature.description}</div>
              </motion.div>
            );
          })}
        </div>

        {/* Trust Badges */}
        <div className="flex flex-wrap justify-center gap-6">
          {badges.map((badge, index) => (
            <motion.div
              key={badge}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="flex items-center space-x-2 bg-nursing-light px-6 py-3 rounded-full"
            >
              <CheckCircle className="w-5 h-5 text-nursing-green" />
              <span className="text-sm font-medium text-gray-700">{badge}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

