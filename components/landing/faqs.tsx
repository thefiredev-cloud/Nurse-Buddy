"use client";

import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export function FAQs() {
  const faqs = [
    {
      question: "What file types can I upload?",
      answer:
        "We support PowerPoint files (PPT, PPTX) and PDF documents. Upload your lecture slides, study guides, or any nursing course materials to generate practice tests.",
    },
    {
      question: "How many files can I upload for free?",
      answer:
        "You get 5 free uploads to try Nurse Buddy. Each upload generates a full 100-question practice test. Subscribe for unlimited uploads and tests.",
    },
    {
      question: "How are questions generated from my slides?",
      answer:
        "Our AI analyzes your uploaded content to understand key concepts, then generates clinically-relevant questions with detailed rationales for every answer choice.",
    },
    {
      question: "Can I use this for any nursing class?",
      answer:
        "Yes! Upload materials from any nursing course - Med-Surg, Pharmacology, Fundamentals, OB, Pediatrics, Mental Health, and more. The AI adapts to your content.",
    },
  ];

  return (
    <section id="faqs" className="py-20 bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-xl text-gray-600">
            Everything you need to know about Nurse Buddy
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left text-lg font-semibold">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-gray-600 text-base">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
}

