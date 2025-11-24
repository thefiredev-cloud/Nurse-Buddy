"use client";

import { motion } from "framer-motion";
import { Infinity, BarChart3, Smartphone, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function Benefits() {
  const benefits = [
    {
      icon: Infinity,
      title: "Unlimited Practice Tests",
      description: "Take as many 100-question tests as you need",
    },
    {
      icon: BarChart3,
      title: "Performance Analytics",
      description: "Track your progress across all content areas",
    },
    {
      icon: Smartphone,
      title: "Mobile Responsive",
      description: "Study anywhere on any device",
    },
    {
      icon: Clock,
      title: "24/7 Access",
      description: "Practice whenever fits your schedule",
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
            Everything You Need to Succeed
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            All the tools and features to pass your NCLEX with confidence
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
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
                  <CardHeader>
                    <div className="w-12 h-12 bg-nursing-green/10 rounded-lg flex items-center justify-center mb-4">
                      <Icon className="w-6 h-6 text-nursing-green" />
                    </div>
                    <CardTitle className="text-lg">{benefit.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600">{benefit.description}</p>
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

