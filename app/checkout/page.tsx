"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Loader2 } from "lucide-react";
import Link from "next/link";

export default function CheckoutPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleCheckout = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: "user_mock_123",
          email: "student@example.com",
        }),
      });

      const data = await response.json();

      if (data.url) {
        window.location.href = data.url;
      } else if (data.sessionId) {
        router.push(`/checkout/success?session_id=${data.sessionId}`);
      } else {
        throw new Error("No checkout URL returned");
      }
    } catch (err) {
      console.error("Checkout error:", err);
      setError("Failed to start checkout. Please try again.");
      setLoading(false);
    }
  };

  useEffect(() => {
    // Auto-start checkout
    handleCheckout();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="max-w-md w-full">
        <CardHeader>
          <CardTitle>Complete Your Purchase</CardTitle>
          <CardDescription>
            Subscribe to Nurse Buddy Pro for $35/month
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-8">
              <Loader2 className="w-12 h-12 animate-spin text-nursing-blue mb-4" />
              <p className="text-gray-600">Redirecting to checkout...</p>
            </div>
          ) : error ? (
            <div>
              <p className="text-red-600 mb-4">{error}</p>
              <Button onClick={handleCheckout} className="w-full">
                Try Again
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 text-nursing-green mt-0.5" />
                <div>
                  <p className="font-medium">Unlimited Practice Tests</p>
                  <p className="text-sm text-gray-600">
                    Take as many 100-question tests as you need
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 text-nursing-green mt-0.5" />
                <div>
                  <p className="font-medium">Detailed Rationales</p>
                  <p className="text-sm text-gray-600">
                    Learn from every answer choice
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 text-nursing-green mt-0.5" />
                <div>
                  <p className="font-medium">Performance Tracking</p>
                  <p className="text-sm text-gray-600">
                    Monitor your progress across all categories
                  </p>
                </div>
              </div>
              <Button onClick={handleCheckout} className="w-full" size="lg">
                Continue to Checkout
              </Button>
              <Link href="/" className="block text-center text-sm text-gray-600 hover:text-gray-900">
                Cancel
              </Link>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

