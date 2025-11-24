"use client";

import { motion } from "framer-motion";
import { Award, CheckCircle, TrendingUp } from "lucide-react";

export function SocialProof() {
  const metrics = [
    { number: "92%", label: "Pass Rate", icon: TrendingUp },
    { number: "50,000+", label: "Questions Generated", icon: CheckCircle },
    { number: "5,000+", label: "Active Students", icon: Award },
  ];

  const badges = [
    "NCSBN Aligned Content",
    "Updated 2024 Test Plan",
    "Evidence-Based Rationales",
  ];

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Metrics */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {metrics.map((metric, index) => {
            const Icon = metric.icon;
            return (
              <motion.div
                key={metric.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="inline-flex items-center justify-center w-12 h-12 bg-nursing-light rounded-full mb-4">
                  <Icon className="w-6 h-6 text-nursing-blue" />
                </div>
                <div className="text-4xl font-bold text-nursing-blue mb-2">
                  {metric.number}
                </div>
                <div className="text-gray-600">{metric.label}</div>
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

