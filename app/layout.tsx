import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Nurse Buddy - AI-Powered NCLEX Test Prep | Pass Your NCLEX First Try",
  description: "Prepare for NCLEX with AI-generated practice tests. 100-question exams with detailed rationales. 92% pass rate. Start for $35/month.",
  keywords: "NCLEX prep, NCLEX-RN, NCLEX-PN, nursing test prep, NCLEX practice questions, nursing exam, NCLEX study guide",
  openGraph: {
    title: "Nurse Buddy - AI-Powered NCLEX Test Prep",
    description: "Pass Your NCLEX on the First Try with AI-powered practice tests",
    url: "https://nursebuddy.io",
    siteName: "Nurse Buddy",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Nurse Buddy - AI-Powered NCLEX Test Prep",
    description: "Pass Your NCLEX on the First Try with AI-powered practice tests",
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

