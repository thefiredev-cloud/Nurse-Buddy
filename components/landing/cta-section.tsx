"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function CTASection() {
  return (
    <section className="py-20 bg-gradient-to-br from-nursing-blue to-blue-700 text-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Pass Your NCLEX?
          </h2>
          <p className="text-xl mb-8 text-blue-100">
            Join thousands of successful nursing students
          </p>
          <Link href="/sign-up">
            <Button
              size="lg"
              className="bg-white text-nursing-blue hover:bg-gray-100 text-lg px-8 py-6"
            >
              Get Started for $35/month
            </Button>
          </Link>
          <p className="mt-4 text-sm text-blue-100">
            7-day money-back guarantee
          </p>
        </motion.div>
      </div>
    </section>
  );
}

