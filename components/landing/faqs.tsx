"use client";

import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { getFAQSchema } from "@/lib/seo/structured-data";
import { fadeInUp, staggerContainer, staggerItem } from "@/lib/motion";
import { HelpCircle } from "lucide-react";

/**
 * FAQ Section - SEO & AEO Optimized
 * Includes FAQ schema markup for Google featured snippets and AI search engines
 * Target Keywords: nursing test prep FAQ, nursing exam questions, nursing study app FAQ
 */

const faqs = [
  {
    question: "What file types can I upload to Nurse Buddy?",
    answer:
      "We support PowerPoint files (PPT, PPTX) and PDF documents. Upload your lecture slides, study guides, or any nursing course materials to generate personalized practice tests. Our AI works with content from any nursing class.",
  },
  {
    question: "How many files can I upload for free?",
    answer:
      "You get 5 free uploads to try Nurse Buddy with no credit card required. Each upload generates a full 100-question practice test with detailed rationales. Subscribe for $35/month for unlimited uploads and tests.",
  },
  {
    question: "How are questions generated from my slides?",
    answer:
      "Our AI analyzes your uploaded content to understand key concepts, clinical scenarios, and nursing principles. It then generates clinically-relevant questions that match the style of nursing school exams, complete with detailed rationales for every answer choice.",
  },
  {
    question: "Can I use Nurse Buddy for any nursing class?",
    answer:
      "Yes! Upload materials from any nursing course - Medical-Surgical (Med-Surg), Pharmacology, Fundamentals, OB/GYN, Pediatrics, Mental Health, Health Assessment, Pathophysiology, and more. The AI adapts to your specific content.",
  },
  {
    question: "What makes Nurse Buddy different from other nursing test prep?",
    answer:
      "Unlike generic test banks, Nurse Buddy creates practice tests from YOUR actual course materials. You're studying the exact content your professors teach, with AI-generated rationales that explain why each answer is correct or incorrect.",
  },
  {
    question: "How long does it take to generate a practice test?",
    answer:
      "Most practice tests are generated within 2-3 minutes after uploading your slides. You'll receive a full 100-question exam with rationales for all answer choices, ready to start practicing immediately.",
  },
];

export function FAQs() {
  // Generate FAQ schema for SEO
  const faqSchema = getFAQSchema(faqs);

  return (
    <section
      id="faqs"
      className="section-padding bg-gradient-to-b from-gray-50 to-white"
      aria-labelledby="faq-heading"
    >
      {/* FAQ Schema for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <div className="container-tight">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={staggerContainer}
          className="text-center mb-12"
        >
          <motion.div variants={staggerItem} className="mb-4">
            <span className="badge-info">
              <HelpCircle className="w-4 h-4" />
              Have Questions?
            </span>
          </motion.div>

          <motion.h2
            id="faq-heading"
            variants={staggerItem}
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4"
          >
            Frequently Asked Questions
          </motion.h2>

          <motion.p
            variants={staggerItem}
            className="text-lg text-gray-600 max-w-2xl mx-auto"
          >
            Everything you need to know about Nurse Buddy and how it helps you
            ace your nursing exams
          </motion.p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={fadeInUp}
          className="max-w-3xl mx-auto"
        >
          <Accordion type="single" collapsible className="w-full space-y-3">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="card-elevated border-none px-6"
              >
                <AccordionTrigger className="text-left text-base md:text-lg font-semibold text-gray-900 hover:text-nursing-blue-600 hover:no-underline py-5">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-gray-600 text-base pb-5 leading-relaxed">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>

        {/* Additional CTA */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          className="text-center mt-12"
        >
          <p className="text-gray-600">
            Still have questions?{" "}
            <a
              href="/contact"
              className="text-nursing-blue-600 font-semibold hover:text-nursing-blue-700 underline-offset-4 hover:underline"
            >
              Contact our support team
            </a>
          </p>
        </motion.div>
      </div>
    </section>
  );
}
