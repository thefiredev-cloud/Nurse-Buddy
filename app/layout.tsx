import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Nurse Buddy - AI-Powered Nursing School Test Prep | Upload PowerPoints, Ace Your Exams",
  description: "Turn your nursing school PowerPoints into practice tests. Upload slides, get 100-question exams with AI rationales. 5 free uploads. Start for $35/month.",
  keywords: "nursing school test prep, nursing exam study, PowerPoint to practice test, nursing student study tool, upload slides practice exam, nursing school practice questions",
  openGraph: {
    title: "Nurse Buddy - Upload Your Slides, Ace Your Nursing Exams",
    description: "Turn your nursing school PowerPoints into 100-question practice tests with AI-generated rationales",
    url: "https://nursebuddy.io",
    siteName: "Nurse Buddy",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Nurse Buddy - Upload Your Slides, Ace Your Nursing Exams",
    description: "Turn your nursing school PowerPoints into 100-question practice tests with AI-generated rationales",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const hasClerk = !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
  
  const content = (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );

  // Only wrap with ClerkProvider if Clerk is configured
  if (hasClerk) {
    return <ClerkProvider>{content}</ClerkProvider>;
  }

  return content;
}

