"use client";

import { motion } from "framer-motion";
import { GraduationCap, RefreshCw, Globe } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function UseCases() {
  const cases = [
    {
      icon: GraduationCap,
      title: "Pre-NCLEX Students",
      description: "Final year nursing students preparing for licensure",
    },
    {
      icon: RefreshCw,
      title: "NCLEX Retakers",
      description: "Students who need targeted practice after initial attempt",
    },
    {
      icon: Globe,
      title: "International Nurses",
      description: "Foreign-educated nurses preparing for US licensure",
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
            Trusted by nursing students at every stage of their NCLEX journey
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

