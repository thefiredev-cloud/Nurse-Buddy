"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
import Link from "next/link";

export default function SuccessPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to dashboard after 5 seconds
    const timer = setTimeout(() => {
      router.push("/dashboard");
    }, 5000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
          </div>
          <CardTitle className="text-2xl">Welcome to Nurse Buddy!</CardTitle>
          <CardDescription>
            Your subscription is active. Let&apos;s start acing your nursing exams.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-nursing-light p-4 rounded-lg">
            <p className="text-sm font-medium text-gray-900 mb-2">
              What&apos;s Next?
            </p>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Take your first 100-question practice test</li>
              <li>• Review detailed rationales for every answer</li>
              <li>• Track your progress across nursing categories</li>
            </ul>
          </div>

          <Link href="/dashboard">
            <Button className="w-full" size="lg">
              Go to Dashboard
            </Button>
          </Link>

          <p className="text-xs text-center text-gray-500">
            Redirecting automatically in 5 seconds...
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

