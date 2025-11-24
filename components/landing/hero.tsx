"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { motion } from "framer-motion";

export function Hero() {
  return (
    <section className="relative pt-32 pb-20 px-4 bg-gradient-to-br from-nursing-light via-white to-blue-50">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Pass Your NCLEX on the{" "}
              <span className="text-nursing-blue">First Try</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              AI-powered practice tests that adapt to your learning style with
              detailed rationales for every answer
            </p>

            {/* CTA */}
            <div className="space-y-4">
              <Link href="/sign-up">
                <Button size="lg" className="w-full sm:w-auto text-lg px-8 py-6">
                  Start Your 100-Question Test Now
                </Button>
              </Link>
              <p className="text-sm text-gray-500 sm:ml-4">
                <span className="font-semibold text-nursing-blue">$35/month</span> - Unlimited Practice
              </p>
            </div>
          </motion.div>

          {/* Right Visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border">
              {/* Question Section */}
              <div className="p-6 border-b">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-medium text-gray-500">Question 45 of 100</span>
                  <span className="text-sm font-medium text-nursing-green">75% Complete</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden mb-6">
                  <div className="h-full w-3/4 bg-nursing-green rounded-full" />
                </div>
                <p className="text-sm text-gray-700 mb-4 font-medium">
                  A nurse is caring for a client with heart failure. Which finding requires immediate intervention?
                </p>
                <div className="space-y-2">
                  <div className="border-2 border-green-500 rounded-lg p-3 bg-green-50">
                    <span className="font-semibold text-green-700">A.</span>{" "}
                    <span className="text-sm text-gray-700">Irregular heart rate with dyspnea</span>
                  </div>
                  <div className="border rounded-lg p-3 hover:border-nursing-blue transition">
                    <span className="font-medium text-gray-700">B.</span>{" "}
                    <span className="text-sm text-gray-600">Mild ankle swelling</span>
                  </div>
                  <div className="border rounded-lg p-3 hover:border-nursing-blue transition">
                    <span className="font-medium text-gray-700">C.</span>{" "}
                    <span className="text-sm text-gray-600">Decreased appetite</span>
                  </div>
                  <div className="border rounded-lg p-3 hover:border-nursing-blue transition">
                    <span className="font-medium text-gray-700">D.</span>{" "}
                    <span className="text-sm text-gray-600">Occasional fatigue</span>
                  </div>
                </div>
              </div>

              {/* Rationale Section */}
              <div className="p-6 bg-nursing-light">
                <div className="flex items-center space-x-2 mb-3">
                  <span className="text-lg text-green-600">✓</span>
                  <span className="font-semibold text-green-700">Correct!</span>
                </div>
                <p className="text-sm text-gray-700 mb-3">
                  <span className="font-medium">Why:</span> Irregular heart rate with dyspnea indicates acute decompensation requiring immediate assessment and intervention.
                </p>
                <div className="bg-white p-3 rounded border-l-4 border-nursing-blue">
                  <p className="text-xs text-gray-600">
                    <span className="font-medium">Key Concept:</span> Assess for signs of reduced cardiac output (tachycardia, dyspnea, arrhythmias) in heart failure clients.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

