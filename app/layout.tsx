import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { getLandingPageSchemas } from "@/lib/seo/structured-data";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
  preload: true,
});

/**
 * SEO-Optimized Metadata for Nurse Buddy
 * Target Keywords: nursing school test prep, nursing exam practice, AI nursing test prep
 * AEO-Optimized for AI search engines (ChatGPT, Gemini, Perplexity)
 */
export const metadata: Metadata = {
  // Primary title with brand and value proposition
  title: {
    default: "Nurse Buddy - AI-Powered Nursing School Test Prep | Upload PowerPoints, Ace Your Exams",
    template: "%s | Nurse Buddy - Nursing Test Prep",
  },

  // SEO-optimized description with primary keywords
  description:
    "Turn your nursing school PowerPoints into 100-question practice tests with AI-generated rationales. Upload Med-Surg, Pharmacology, Fundamentals slides. 5 free uploads. $35/month unlimited. Study smarter with Nurse Buddy.",

  // Expanded keyword targeting for search visibility
  keywords: [
    // Primary keywords
    "nursing school test prep",
    "nursing exam practice",
    "nursing practice test",
    "nursing study app",
    "AI nursing test prep",
    // Long-tail keywords
    "PowerPoint to practice test",
    "nursing student study tool",
    "upload slides practice exam",
    "nursing school practice questions",
    "nursing practice questions with rationales",
    "custom nursing practice test",
    // Course-specific keywords
    "med surg practice questions",
    "pharmacology nursing practice test",
    "fundamentals of nursing practice exam",
    "nursing exam rationales",
    // Brand keywords
    "Nurse Buddy",
    "NurseBuddy",
  ],

  // Author and publisher info
  authors: [{ name: "Nurse Buddy", url: "https://nursebuddy.io" }],
  creator: "Nurse Buddy",
  publisher: "Nurse Buddy",

  // Robots directives
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  // Canonical URL
  alternates: {
    canonical: "https://nursebuddy.io",
  },

  // Open Graph for social sharing
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://nursebuddy.io",
    siteName: "Nurse Buddy",
    title: "Nurse Buddy - Upload Your Slides, Ace Your Nursing Exams",
    description:
      "Turn your nursing school PowerPoints into 100-question practice tests with AI-generated rationales. Study smarter, not harder.",
    images: [
      {
        url: "https://nursebuddy.io/og-image.png",
        width: 1200,
        height: 630,
        alt: "Nurse Buddy - AI-Powered Nursing School Test Prep",
        type: "image/png",
      },
    ],
  },

  // Twitter Card for Twitter sharing
  twitter: {
    card: "summary_large_image",
    site: "@nursebuddy",
    creator: "@nursebuddy",
    title: "Nurse Buddy - Upload Your Slides, Ace Your Nursing Exams",
    description:
      "Turn your nursing school PowerPoints into 100-question practice tests with AI-generated rationales.",
    images: ["https://nursebuddy.io/twitter-image.png"],
  },

  // App-specific metadata
  applicationName: "Nurse Buddy",
  category: "Education",

  // Verification (add your verification codes)
  verification: {
    google: "your-google-verification-code",
    // yandex: "your-yandex-code",
    // bing: "your-bing-code",
  },

  // Additional metadata
  other: {
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "default",
    "apple-mobile-web-app-title": "Nurse Buddy",
  },
};

/**
 * Viewport configuration for mobile optimization
 * Includes viewport-fit=cover for iOS safe area support
 */
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#0089ED" },
    { media: "(prefers-color-scheme: dark)", color: "#003366" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const hasClerk = !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
  const schemas = getLandingPageSchemas();

  const content = (
    <html lang="en" className={inter.variable}>
      <head>
        {/* PWA Manifest */}
        <link rel="manifest" href="/manifest.json" />

        {/* Preconnect to external resources for performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

        {/* DNS prefetch for API endpoints */}
        <link rel="dns-prefetch" href="https://api.anthropic.com" />
        <link rel="dns-prefetch" href="https://api.stripe.com" />

        {/* JSON-LD Structured Data for SEO */}
        {schemas.map((schema, index) => (
          <script
            key={index}
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
          />
        ))}
      </head>
      <body className={`${inter.className} antialiased`}>
        {/* Skip link for accessibility */}
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        <div id="main-content">{children}</div>
      </body>
    </html>
  );

  // Only wrap with ClerkProvider if Clerk is configured
  if (hasClerk) {
    return <ClerkProvider>{content}</ClerkProvider>;
  }

  return content;
}
