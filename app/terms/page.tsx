import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms of Service | Nurse Buddy",
  description: "Terms of Service for Nurse Buddy - AI-Powered Nursing School Test Prep",
};

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <Link href="/" className="text-2xl font-bold text-nursing-blue hover:opacity-80">
            Nurse Buddy
          </Link>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Terms of Service</h1>
        <p className="text-gray-600 mb-8">Last updated: December 2024</p>

        <div className="prose prose-gray max-w-none space-y-8">
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Acceptance of Terms</h2>
            <p className="text-gray-700 leading-relaxed">
              By accessing or using Nurse Buddy (&quot;Service&quot;), you agree to be bound by these Terms of 
              Service. If you do not agree to these terms, please do not use our Service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Description of Service</h2>
            <p className="text-gray-700 leading-relaxed">
              Nurse Buddy is an AI-powered nursing school test preparation platform that allows users to:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2 mt-4">
              <li>Upload PowerPoint and PDF study materials</li>
              <li>Generate personalized 100-question practice tests</li>
              <li>Receive AI-generated rationales for answers</li>
              <li>Track performance and study progress</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. User Accounts</h2>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>You must provide accurate and complete information when creating an account</li>
              <li>You are responsible for maintaining the security of your account credentials</li>
              <li>You must be at least 18 years old or have parental consent to use the Service</li>
              <li>One account per person; accounts are non-transferable</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Subscription and Payment</h2>
            <h3 className="text-xl font-medium text-gray-800 mb-3">Free Tier</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              Free users receive 5 file uploads and limited practice tests.
            </p>

            <h3 className="text-xl font-medium text-gray-800 mb-3">Pro Subscription ($35/month)</h3>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Unlimited file uploads</li>
              <li>Unlimited practice tests</li>
              <li>Full performance analytics</li>
              <li>Billed monthly through Stripe</li>
            </ul>

            <h3 className="text-xl font-medium text-gray-800 mb-3 mt-6">Refund Policy</h3>
            <p className="text-gray-700 leading-relaxed">
              We offer a 7-day money-back guarantee. If you&apos;re not satisfied within the first 7 days 
              of your subscription, contact us for a full refund.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Acceptable Use</h2>
            <p className="text-gray-700 leading-relaxed mb-4">You agree NOT to:</p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Upload copyrighted materials you don&apos;t have rights to use</li>
              <li>Share your account with others</li>
              <li>Attempt to reverse-engineer or copy our AI-generated content</li>
              <li>Use the Service for any illegal purpose</li>
              <li>Scrape, crawl, or automate access to the Service</li>
              <li>Upload malicious files or content</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Uploaded Content</h2>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>You retain ownership of materials you upload</li>
              <li>You grant us a license to process your materials for generating practice tests</li>
              <li>Uploaded materials are stored securely and used only for your personal test generation</li>
              <li>Materials may be automatically deleted after 30 days of inactivity</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Educational Disclaimer</h2>
            <p className="text-gray-700 leading-relaxed">
              Nurse Buddy is a supplementary study tool and does not guarantee exam success. Our 
              AI-generated questions and rationales are for educational purposes only and should not 
              replace official course materials, textbooks, or instructor guidance. We are not affiliated 
              with the NCSBN or any nursing licensing board.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Intellectual Property</h2>
            <p className="text-gray-700 leading-relaxed">
              The Nurse Buddy platform, including its design, features, and AI technology, is owned by us 
              and protected by intellectual property laws. You may not copy, modify, or distribute our 
              platform or generated content without permission.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Limitation of Liability</h2>
            <p className="text-gray-700 leading-relaxed">
              To the maximum extent permitted by law, Nurse Buddy shall not be liable for any indirect, 
              incidental, special, or consequential damages arising from your use of the Service. Our 
              total liability shall not exceed the amount you paid for the Service in the past 12 months.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">10. Service Availability</h2>
            <p className="text-gray-700 leading-relaxed">
              We strive for 99.9% uptime but do not guarantee uninterrupted access. We may perform 
              maintenance or updates that temporarily affect availability. We reserve the right to 
              modify or discontinue features with reasonable notice.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">11. Termination</h2>
            <p className="text-gray-700 leading-relaxed">
              We may suspend or terminate your account for violations of these terms. You may cancel 
              your subscription at any time through your account settings. Upon termination, your 
              access to the Service will end, and your data may be deleted.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">12. Changes to Terms</h2>
            <p className="text-gray-700 leading-relaxed">
              We may update these Terms of Service from time to time. Continued use of the Service 
              after changes constitutes acceptance of the new terms. We will notify users of 
              significant changes via email or platform notification.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">13. Governing Law</h2>
            <p className="text-gray-700 leading-relaxed">
              These terms shall be governed by the laws of the United States. Any disputes shall be 
              resolved through binding arbitration or in courts of competent jurisdiction.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">14. Contact</h2>
            <p className="text-gray-700 leading-relaxed">
              For questions about these Terms of Service, please contact us at{" "}
              <a href="mailto:support@nursebuddy.io" className="text-nursing-blue hover:underline">
                support@nursebuddy.io
              </a>
            </p>
          </section>
        </div>

        {/* Back Link */}
        <div className="mt-12 pt-8 border-t">
          <Link href="/" className="text-nursing-blue hover:underline">
            ← Back to Home
          </Link>
        </div>
      </main>
    </div>
  );
}

