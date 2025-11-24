"use client";

import { motion } from "framer-motion";
import { DollarSign, FileX, HelpCircle } from "lucide-react";

export function PainPoints() {
  const painPoints = [
    {
      icon: DollarSign,
      title: "Expensive Test Prep",
      description: "Traditional NCLEX prep courses cost $300-500+",
    },
    {
      icon: FileX,
      title: "Outdated Question Banks",
      description: "Static questions that don't reflect current exam format",
    },
    {
      icon: HelpCircle,
      title: "No Detailed Rationales",
      description: "Limited explanations for understanding concepts",
    },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Traditional NCLEX Prep Falls Short
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Don&apos;t waste time and money on outdated preparation methods
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {painPoints.map((point, index) => {
            const Icon = point.icon;
            return (
              <motion.div
                key={point.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
                  <Icon className="w-8 h-8 text-red-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {point.title}
                </h3>
                <p className="text-gray-600">{point.description}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

