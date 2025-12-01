"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export function Testimonials() {
  const testimonials = [
    {
      text: "I uploaded my Med-Surg slides and got a practice test in minutes. Scored 94% on my actual exam!",
      author: "Sarah M., BSN Student",
      rating: 5,
    },
    {
      text: "The AI-generated questions from my Pharmacology PowerPoints were exactly what I needed to study.",
      author: "Michael R., Nursing Student",
      rating: 5,
    },
    {
      text: "Game changer for nursing school. I upload my lecture slides and have practice tests ready the same day.",
      author: "Jennifer L., ADN Student",
      rating: 5,
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
            Trusted by Nursing Students
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            See what nursing students have to say about studying smarter
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.author}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="h-full hover:shadow-lg transition">
                <CardContent className="pt-6">
                  {/* Stars */}
                  <div className="flex space-x-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-5 h-5 fill-yellow-400 text-yellow-400"
                      />
                    ))}
                  </div>

                  {/* Quote */}
                  <p className="text-gray-700 mb-4 italic">
                    &quot;{testimonial.text}&quot;
                  </p>

                  {/* Author */}
                  <p className="text-sm font-semibold text-gray-900">
                    {testimonial.author}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

