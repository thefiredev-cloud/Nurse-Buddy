"use client";

import { motion } from "framer-motion";
import { FileUp, Brain, Target } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export function Testimonials() {
  const benefits = [
    {
      icon: FileUp,
      title: "Study Your Own Material",
      description: "Upload the exact PowerPoints and PDFs from your nursing classes. Practice tests are tailored to what your professor actually teaches.",
    },
    {
      icon: Brain,
      title: "Learn Through Practice",
      description: "Active recall through practice questions is proven to improve retention. Turn passive slide reading into active test preparation.",
    },
    {
      icon: Target,
      title: "Understand Your Mistakes",
      description: "Every answer includes detailed rationales explaining the clinical reasoning. Learn not just the what, but the why behind each concept.",
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
            Why Nurse Buddy Works
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Transform how you study for nursing exams with AI-powered practice
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;
            return (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full hover:shadow-lg transition">
                  <CardContent className="pt-6">
                    <div className="w-12 h-12 bg-nursing-blue/10 rounded-lg flex items-center justify-center mb-4">
                      <Icon className="w-6 h-6 text-nursing-blue" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">
                      {benefit.title}
                    </h3>
                    <p className="text-gray-600">
                      {benefit.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

