"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Check } from "lucide-react";
import Link from "next/link";

export function Pricing() {
  const features = [
    "Unlimited 100-question tests",
    "Detailed rationales for every answer",
    "Performance tracking dashboard",
    "All NCLEX content areas covered",
    "Mobile app access",
  ];

  return (
    <section id="pricing" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            One plan with everything you need. No hidden fees.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="max-w-lg mx-auto"
        >
          <Card className="border-2 border-nursing-blue shadow-xl">
            <CardHeader className="text-center pb-8">
              <CardTitle className="text-3xl">Pro Access</CardTitle>
              <div className="mt-4">
                <span className="text-5xl font-bold text-nursing-blue">$35</span>
                <span className="text-gray-600 ml-2">per month</span>
              </div>
              <CardDescription className="text-base mt-2">
                Everything you need to pass NCLEX
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-4">
                {features.map((feature) => (
                  <li key={feature} className="flex items-start">
                    <Check className="w-5 h-5 text-nursing-green mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <Link href="/sign-up" className="w-full">
                <Button size="lg" className="w-full">
                  Start Preparing Today
                </Button>
              </Link>
              <p className="text-sm text-gray-500 text-center">
                7-day money-back guarantee
              </p>
            </CardFooter>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}

