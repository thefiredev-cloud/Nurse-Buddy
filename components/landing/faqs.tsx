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
      question: "How similar are the questions to the actual NCLEX?",
      answer:
        "Our AI generates questions following NCLEX test plan specifications and Bloom's taxonomy levels. The questions are designed to match the format, difficulty, and content distribution of the actual exam.",
    },
    {
      question: "Can I retake tests?",
      answer:
        "Yes! You get unlimited 100-question tests with your subscription. Each test features fresh, AI-generated questions so you never see the same question twice.",
    },
    {
      question: "Is there a free trial?",
      answer:
        "We offer a 7-day money-back guarantee instead of a free trial to ensure serious students. If you're not satisfied within the first week, we'll refund your payment in full.",
    },
    {
      question: "How are the questions generated?",
      answer:
        "We use Claude AI to create questions based on current NCLEX test plans and nursing curricula. Each question is generated fresh and includes detailed rationales for all answer choices.",
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

