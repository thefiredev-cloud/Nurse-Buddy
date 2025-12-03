/**
 * JSON-LD Structured Data for SEO and AEO (Answer Engine Optimization)
 * Optimized for Google Rich Snippets and AI search engines (ChatGPT, Gemini, Perplexity)
 */

export interface FAQItem {
  question: string;
  answer: string;
}

/**
 * Organization Schema - Establishes brand identity for search engines
 * Target keywords: Nurse Buddy, nursing test prep, AI nursing education
 */
export function getOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Nurse Buddy",
    alternateName: ["NurseBuddy", "Nurse Buddy AI"],
    url: "https://nursebuddy.io",
    logo: "https://nursebuddy.io/logo.png",
    description:
      "AI-powered nursing school test preparation platform. Upload your PowerPoint slides and get custom 100-question practice tests with detailed rationales.",
    foundingDate: "2024",
    sameAs: [
      "https://twitter.com/nursebuddy",
      "https://www.linkedin.com/company/nursebuddy",
      "https://www.instagram.com/nursebuddy",
    ],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer support",
      url: "https://nursebuddy.io/contact",
      availableLanguage: "English",
    },
    areaServed: {
      "@type": "Country",
      name: "United States",
    },
  };
}

/**
 * Educational Organization Schema - Positions as an educational platform
 * Target keywords: nursing education, nursing school, nursing courses
 */
export function getEducationalOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    name: "Nurse Buddy",
    url: "https://nursebuddy.io",
    description:
      "AI-powered nursing school test preparation platform that converts lecture slides into personalized practice exams",
    educationalCredentialAwarded: "Practice Test Completion Certificate",
    teaches: [
      "Nursing Fundamentals",
      "Medical-Surgical Nursing",
      "Pharmacology",
      "Pediatric Nursing",
      "Mental Health Nursing",
      "OB/GYN Nursing",
      "Health Assessment",
      "Pathophysiology",
    ],
  };
}

/**
 * Software Application Schema - For app store and search visibility
 * Target keywords: nursing study app, nursing practice test app, nursing exam app
 */
export function getSoftwareApplicationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Nurse Buddy",
    applicationCategory: "EducationalApplication",
    operatingSystem: "Web Browser",
    description:
      "Upload your nursing school PowerPoints and get AI-generated 100-question practice tests with detailed rationales for every answer.",
    offers: {
      "@type": "Offer",
      price: "35.00",
      priceCurrency: "USD",
      priceValidUntil: "2025-12-31",
      availability: "https://schema.org/InStock",
      url: "https://nursebuddy.io/#pricing",
    },
    featureList: [
      "AI-powered question generation from your slides",
      "100-question practice tests",
      "Detailed rationales for every answer",
      "Performance analytics and tracking",
      "Support for any nursing course",
      "Mobile-friendly interface",
    ],
    screenshot: "https://nursebuddy.io/screenshot.png",
  };
}

/**
 * Product Schema - For pricing section rich snippets
 * Target keywords: nursing test prep subscription, nursing exam prep pricing
 */
export function getProductSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: "Nurse Buddy Pro Access",
    description:
      "Unlimited nursing practice tests from your class materials with AI-generated rationales",
    brand: {
      "@type": "Brand",
      name: "Nurse Buddy",
    },
    offers: {
      "@type": "Offer",
      price: "35.00",
      priceCurrency: "USD",
      priceValidUntil: "2025-12-31",
      availability: "https://schema.org/InStock",
      url: "https://nursebuddy.io/#pricing",
      seller: {
        "@type": "Organization",
        name: "Nurse Buddy",
      },
    },
    category: "Educational Software",
  };
}

/**
 * FAQ Schema - Critical for featured snippets and AEO
 * Target keywords: nursing test prep FAQ, nursing exam questions
 */
export function getFAQSchema(faqs: FAQItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

/**
 * HowTo Schema - For "How It Works" section
 * Target keywords: how to study for nursing exams, nursing test prep steps
 */
export function getHowToSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: "How to Create Custom Nursing Practice Tests with Nurse Buddy",
    description:
      "Turn your nursing school PowerPoints into AI-generated practice tests in 3 simple steps",
    totalTime: "PT5M",
    step: [
      {
        "@type": "HowToStep",
        position: 1,
        name: "Upload Your Slides",
        text: "Upload your nursing school PowerPoint files (PPT, PPTX) or PDF documents. We support any nursing course materials.",
        image: "https://nursebuddy.io/step1.png",
      },
      {
        "@type": "HowToStep",
        position: 2,
        name: "AI Generates Questions",
        text: "Our AI analyzes your content and generates 100 clinically-relevant practice questions tailored to your specific course material.",
        image: "https://nursebuddy.io/step2.png",
      },
      {
        "@type": "HowToStep",
        position: 3,
        name: "Learn from Rationales",
        text: "Review detailed rationales for every answer choice to understand concepts deeply and improve your nursing knowledge.",
        image: "https://nursebuddy.io/step3.png",
      },
    ],
  };
}

/**
 * WebSite Schema with SearchAction - For sitelinks search box
 */
export function getWebSiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Nurse Buddy",
    url: "https://nursebuddy.io",
    description:
      "AI-powered nursing school test preparation platform. Upload your slides, get custom practice tests.",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: "https://nursebuddy.io/search?q={search_term_string}",
      },
      "query-input": "required name=search_term_string",
    },
  };
}

/**
 * BreadcrumbList Schema - For navigation rich snippets
 */
export function getBreadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

/**
 * Combined Landing Page Schema - All schemas for the homepage
 */
export function getLandingPageSchemas() {
  return [
    getOrganizationSchema(),
    getSoftwareApplicationSchema(),
    getHowToSchema(),
    getWebSiteSchema(),
  ];
}
