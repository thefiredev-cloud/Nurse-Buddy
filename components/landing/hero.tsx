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
              Turn Your Class Slides Into{" "}
              <span className="text-nursing-blue">Practice Tests</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Upload your nursing school PowerPoints and get AI-generated 100-question 
              exams with detailed rationales for every answer
            </p>

            {/* CTA */}
            <div className="space-y-4">
              <Link href="/sign-up">
                <Button size="lg" className="w-full sm:w-auto text-lg px-8 py-6">
                  Upload Your First PowerPoint Free
                </Button>
              </Link>
              <p className="text-sm text-gray-500 sm:ml-4">
                <span className="font-semibold text-nursing-blue">5 free uploads</span> • $35/month for unlimited
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
              {/* Upload Section */}
              <div className="p-6 border-b">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-medium text-gray-500">Upload Your Slides</span>
                  <span className="text-sm font-medium text-nursing-green">Step 1 of 3</span>
                </div>
                <div className="border-2 border-dashed border-nursing-blue/30 rounded-lg p-6 text-center mb-4 bg-nursing-light/30">
                  <div className="w-12 h-12 bg-nursing-blue/10 rounded-full flex items-center justify-center mx-auto mb-3">
                    <svg className="w-6 h-6 text-nursing-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                  </div>
                  <p className="text-sm font-medium text-gray-700">MedSurg_Chapter12.pptx</p>
                  <p className="text-xs text-gray-500 mt-1">42 slides • 2.4 MB</p>
                </div>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>Supported: PPT, PPTX, PDF</span>
                  <span className="text-nursing-green font-medium">Ready to generate</span>
                </div>
              </div>

              {/* Generated Test Preview */}
              <div className="p-6 bg-nursing-light">
                <div className="flex items-center space-x-2 mb-3">
                  <span className="text-lg text-nursing-blue">✨</span>
                  <span className="font-semibold text-nursing-blue">AI-Generated Test Ready</span>
                </div>
                <p className="text-sm text-gray-700 mb-3">
                  <span className="font-medium">100 questions</span> created from your Med-Surg Chapter 12 slides
                </p>
                <div className="bg-white p-3 rounded border-l-4 border-nursing-green">
                  <p className="text-xs text-gray-600">
                    <span className="font-medium">Includes:</span> Detailed rationales for every answer choice to help you understand the concepts
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

