import { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Navbar } from "@/components/landing/navbar";
import { Footer } from "@/components/landing/footer";
import { ArrowRight, BookOpen, CheckCircle, FileText, Sparkles, Upload } from "lucide-react";
import { notFound } from "next/navigation";

// Define supported nursing specialties with SEO data
const specialties: Record<string, {
  title: string;
  h1: string;
  description: string;
  keywords: string[];
  topics: string[];
  sampleQuestions: { question: string; options: string[] }[];
  faqs: { q: string; a: string }[];
}> = {
  "med-surg": {
    title: "Med-Surg Practice Questions",
    h1: "Medical-Surgical Nursing Practice Test",
    description: "Free Med-Surg practice questions with detailed rationales. Upload your Med-Surg PowerPoints and get AI-generated NCLEX-style questions covering adult health, surgical care, and chronic disease management.",
    keywords: ["med surg practice test", "medical surgical nursing questions", "med surg nclex questions", "adult health nursing practice"],
    topics: ["Cardiac Disorders", "Respiratory Conditions", "Gastrointestinal Disorders", "Renal & Urinary", "Endocrine Disorders", "Neurological Conditions", "Musculoskeletal Disorders", "Oncology Nursing", "Post-operative Care", "Pain Management"],
    sampleQuestions: [
      {
        question: "A patient with heart failure is prescribed furosemide. Which assessment finding would indicate the medication is effective?",
        options: ["A. Decreased urine output", "B. Weight loss of 2 lbs overnight", "C. Increased peripheral edema", "D. Elevated BNP levels"]
      },
      {
        question: "Which intervention is the priority for a patient experiencing acute respiratory distress?",
        options: ["A. Obtain arterial blood gases", "B. Position the patient upright", "C. Administer prescribed bronchodilators", "D. Document the episode"]
      }
    ],
    faqs: [
      { q: "How many Med-Surg questions will Nurse Buddy generate?", a: "Nurse Buddy generates 100 NCLEX-style Med-Surg questions from your uploaded slides, with detailed rationales for every answer choice." },
      { q: "What Med-Surg topics are covered?", a: "All adult health topics including cardiac, respiratory, GI, renal, endocrine, neurological, musculoskeletal conditions, and surgical nursing care." }
    ]
  },
  "pharmacology": {
    title: "Pharmacology Practice Questions",
    h1: "Nursing Pharmacology Practice Test",
    description: "Master nursing pharmacology with AI-generated practice questions. Upload your Pharm slides and get NCLEX-style questions on drug classifications, mechanisms, nursing implications, and patient teaching.",
    keywords: ["pharmacology nursing practice test", "nursing drug questions", "nclex pharmacology questions", "medication nursing practice"],
    topics: ["Cardiovascular Drugs", "Antibiotics & Anti-infectives", "Pain Medications", "Psychiatric Medications", "Endocrine Drugs", "Respiratory Medications", "GI Medications", "Anticoagulants", "Immunosuppressants", "Chemotherapy Agents"],
    sampleQuestions: [
      {
        question: "A patient is prescribed warfarin. Which lab value should the nurse monitor?",
        options: ["A. PTT", "B. INR", "C. Platelet count", "D. Hemoglobin"]
      },
      {
        question: "Which teaching is most important for a patient taking metformin?",
        options: ["A. Take with food to reduce GI upset", "B. Monitor for signs of hypoglycemia", "C. Avoid alcohol consumption", "D. All of the above"]
      }
    ],
    faqs: [
      { q: "Does Nurse Buddy cover drug calculations?", a: "Yes! Our AI generates pharmacology questions including drug calculations, safe dosage ranges, and medication administration questions." },
      { q: "Are rationales included for pharmacology questions?", a: "Absolutely. Every question includes detailed rationales explaining the mechanism of action, nursing implications, and why each answer choice is correct or incorrect." }
    ]
  },
  "fundamentals": {
    title: "Nursing Fundamentals Practice Questions",
    h1: "Fundamentals of Nursing Practice Test",
    description: "Practice nursing fundamentals with NCLEX-style questions. Upload your Fundamentals slides and master vital signs, patient assessment, documentation, infection control, and basic nursing skills.",
    keywords: ["nursing fundamentals practice test", "basic nursing skills questions", "fundamentals of nursing nclex", "nursing assessment practice"],
    topics: ["Vital Signs Assessment", "Patient Safety", "Infection Control", "Documentation", "Communication", "Basic Care & Comfort", "Health Promotion", "Hygiene & Mobility", "Nutrition", "Elimination"],
    sampleQuestions: [
      {
        question: "Which action demonstrates proper hand hygiene technique?",
        options: ["A. Washing hands for 10 seconds", "B. Using friction while washing for 20 seconds", "C. Rinsing hands before applying soap", "D. Drying hands with a reusable towel"]
      },
      {
        question: "When assessing a patient's blood pressure, which finding requires immediate intervention?",
        options: ["A. 118/76 mmHg", "B. 138/88 mmHg", "C. 88/50 mmHg", "D. 128/82 mmHg"]
      }
    ],
    faqs: [
      { q: "Is Fundamentals content good for NCLEX prep?", a: "Yes! Fundamentals forms the foundation of nursing practice. Our questions follow NCLEX test plan categories and prepare you for both course exams and NCLEX." },
      { q: "What skills are covered in Fundamentals questions?", a: "Basic nursing skills including assessment, vital signs, safety, infection control, documentation, communication, and patient care procedures." }
    ]
  },
  "hesi": {
    title: "HESI Exit Exam Practice Questions",
    h1: "HESI Exit Exam Practice Test",
    description: "Prepare for your HESI Exit Exam with AI-generated practice questions. Upload your nursing school materials and get comprehensive HESI-style questions covering all nursing content areas.",
    keywords: ["hesi exit exam practice", "hesi practice questions", "hesi a2 practice test", "hesi nursing exam prep"],
    topics: ["Medical-Surgical", "Pharmacology", "Maternal-Newborn", "Pediatrics", "Mental Health", "Community Health", "Leadership", "Critical Care"],
    sampleQuestions: [
      {
        question: "A nurse is caring for a client with diabetes mellitus. Which finding indicates hypoglycemia?",
        options: ["A. Kussmaul respirations", "B. Fruity breath odor", "C. Diaphoresis and tremors", "D. Warm, flushed skin"]
      },
      {
        question: "Which client should the nurse assess first?",
        options: ["A. A client with stable angina requesting pain medication", "B. A client with pneumonia with O2 sat of 94%", "C. A post-operative client with sudden chest pain", "D. A client with COPD requesting respiratory treatment"]
      }
    ],
    faqs: [
      { q: "How does Nurse Buddy help with HESI prep?", a: "Upload your course materials and we generate HESI-style questions that mirror the format and difficulty of the actual exam, with detailed rationales." },
      { q: "What's the passing score for HESI?", a: "Most nursing programs require 850-900 or higher. Our practice questions help you identify weak areas before taking the actual exam." }
    ]
  },
  "ati": {
    title: "ATI Practice Questions",
    h1: "ATI TEAS & Proctored Exam Practice",
    description: "Ace your ATI exams with personalized practice questions. Upload your nursing materials and generate ATI-style questions for TEAS, proctored exams, and comprehensive predictors.",
    keywords: ["ati practice questions", "ati teas practice test", "ati proctored exam practice", "ati nursing exam prep"],
    topics: ["Reading Comprehension", "Math & Science", "English & Language", "Medical-Surgical", "Pharmacology", "Maternal-Newborn", "Pediatrics", "Mental Health"],
    sampleQuestions: [
      {
        question: "A nurse is planning care for a client who has a new prescription for lithium. Which laboratory value should the nurse plan to monitor?",
        options: ["A. Serum potassium", "B. Serum sodium", "C. Liver function tests", "D. Thyroid function tests"]
      },
      {
        question: "A nurse is teaching a client about taking ferrous sulfate. Which instruction should the nurse include?",
        options: ["A. Take with milk to prevent GI upset", "B. Take with orange juice to enhance absorption", "C. Expect stools to be lighter in color", "D. Take with antacids if GI upset occurs"]
      }
    ],
    faqs: [
      { q: "Does Nurse Buddy help with ATI TEAS?", a: "Yes! Upload study materials and we generate questions covering reading, math, science, and English sections of the TEAS exam." },
      { q: "Can I use Nurse Buddy for ATI proctored exams?", a: "Absolutely. Upload your course content and generate practice questions that mirror ATI proctored exam format and difficulty." }
    ]
  }
};

export async function generateStaticParams() {
  return Object.keys(specialties).map((specialty) => ({
    specialty,
  }));
}

export async function generateMetadata({ params }: { params: { specialty: string } }): Promise<Metadata> {
  const specialty = specialties[params.specialty];
  if (!specialty) return { title: "Page Not Found" };

  return {
    title: specialty.title,
    description: specialty.description,
    keywords: specialty.keywords,
    openGraph: {
      title: specialty.title + " | Nurse Buddy",
      description: specialty.description,
      url: "https://nursebuddy.io/nursing/" + params.specialty,
      type: "website",
    },
    alternates: {
      canonical: "https://nursebuddy.io/nursing/" + params.specialty,
    },
  };
}

export default function SpecialtyPage({ params }: { params: { specialty: string } }) {
  const spec = specialties[params.specialty];
  if (!spec) notFound();

  const courseSchema = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "Course",
    "name": spec.title,
    "description": spec.description,
    "provider": { "@type": "Organization", "name": "Nurse Buddy", "sameAs": "https://nursebuddy.io" },
    "hasCourseInstance": { "@type": "CourseInstance", "courseMode": "online" }
  });

  const faqSchema = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": spec.faqs.map(faq => ({
      "@type": "Question",
      "name": faq.q,
      "acceptedAnswer": { "@type": "Answer", "text": faq.a }
    }))
  });

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: courseSchema }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: faqSchema }} />
      <Navbar />
      <main className="min-h-screen bg-gradient-to-b from-nursing-blue-50 to-white">
        <section className="pt-24 pb-12 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-nursing-blue-100 rounded-full text-nursing-blue-700 text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4" />
              AI-Powered Practice Questions
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">{spec.h1}</h1>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">{spec.description}</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/sign-up">
                <Button size="lg" variant="premium" className="group">
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Your Slides Free
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href="/#how-it-works">
                <Button size="lg" variant="outline">See How It Works</Button>
              </Link>
            </div>
          </div>
        </section>

        <section className="py-12 px-4 bg-white">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Topics Covered</h2>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {spec.topics.map((topic) => (
                <div key={topic} className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                  <CheckCircle className="w-4 h-4 text-nursing-green-500 shrink-0" />
                  <span className="text-sm text-gray-700">{topic}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-12 px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Sample Practice Questions</h2>
            <div className="space-y-6">
              {spec.sampleQuestions.map((sq, idx) => (
                <Card key={idx}>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-start gap-3">
                      <span className="w-8 h-8 bg-nursing-blue-100 text-nursing-blue-700 rounded-full flex items-center justify-center text-sm font-bold shrink-0">{idx + 1}</span>
                      {sq.question}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 pl-11">
                      {sq.options.map((option, oidx) => (
                        <div key={oidx} className="p-3 bg-gray-50 rounded-lg text-gray-700 hover:bg-gray-100 cursor-pointer transition-colors">{option}</div>
                      ))}
                    </div>
                    <p className="text-sm text-gray-500 mt-4 pl-11">
                      <BookOpen className="w-4 h-4 inline mr-1" />
                      Detailed rationale available after signing up
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="py-12 px-4 bg-nursing-blue-50">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">How Nurse Buddy Works</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                { icon: Upload, title: "Upload Your Slides", desc: "Upload your PowerPoint or PDF lecture notes" },
                { icon: Sparkles, title: "AI Generates Questions", desc: "Get 100 NCLEX-style questions with rationales" },
                { icon: FileText, title: "Study & Improve", desc: "Review rationales and track your progress" },
              ].map((step, idx) => (
                <div key={idx} className="bg-white p-6 rounded-xl shadow-sm">
                  <div className="w-12 h-12 bg-nursing-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <step.icon className="w-6 h-6 text-nursing-blue-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">{step.title}</h3>
                  <p className="text-sm text-gray-600">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-12 px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Frequently Asked Questions</h2>
            <div className="space-y-4">
              {spec.faqs.map((faq, idx) => (
                <Card key={idx}>
                  <CardHeader><CardTitle className="text-base">{faq.q}</CardTitle></CardHeader>
                  <CardContent><p className="text-gray-600">{faq.a}</p></CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 px-4 bg-gradient-to-r from-nursing-blue-600 to-nursing-purple-600">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-white mb-4">Ready to Ace Your Exam?</h2>
            <p className="text-nursing-blue-100 mb-8">Upload your first PowerPoint free. No credit card required.</p>
            <Link href="/sign-up">
              <Button size="lg" variant="secondary" className="bg-white text-nursing-blue-600 hover:bg-gray-100">
                Get Started Free
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
