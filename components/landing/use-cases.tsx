"use client";

import { motion } from "framer-motion";
import { GraduationCap, RefreshCw, Globe } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function UseCases() {
  const cases = [
    {
      icon: GraduationCap,
      title: "First-Year Students",
      description: "Foundations and fundamentals courses",
    },
    {
      icon: RefreshCw,
      title: "Med-Surg Students",
      description: "Complex clinical content and pathophysiology",
    },
    {
      icon: Globe,
      title: "Final-Year Students",
      description: "Comprehensive review across all nursing subjects",
    },
  ];

  return (
    <section id="features" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Who Uses Nurse Buddy?
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Nursing students at every level use Nurse Buddy to ace their exams
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {cases.map((useCase, index) => {
            const Icon = useCase.icon;
            return (
              <motion.div
                key={useCase.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full hover:shadow-lg transition">
                  <CardHeader>
                    <div className="w-12 h-12 bg-nursing-blue rounded-lg flex items-center justify-center mb-4">
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <CardTitle>{useCase.title}</CardTitle>
                    <CardDescription className="text-base">
                      {useCase.description}
                    </CardDescription>
                  </CardHeader>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

