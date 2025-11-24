"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, BookOpen } from "lucide-react";

export default function NewTestPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const startTest = async () => {
    setLoading(true);

    try {
      const response = await fetch("/api/test/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      if (data.testId) {
        // Store test data in sessionStorage for backward compatibility
        sessionStorage.setItem("currentTest", JSON.stringify(data));
        router.push(`/dashboard/test/${data.testId}`);
      } else {
        throw new Error("Failed to generate test");
      }
    } catch (error) {
      console.error("Error starting test:", error);
      setLoading(false);
      alert("Failed to start test. Please try again.");
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl">Start New Practice Test</CardTitle>
          <CardDescription className="text-base">
            You&apos;re about to begin a 100-question NCLEX-style practice exam
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Test Details */}
          <div className="bg-nursing-light p-6 rounded-lg space-y-4">
            <h3 className="font-semibold text-lg text-gray-900">
              Test Information:
            </h3>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>100 AI-generated NCLEX-style questions</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Questions distributed across all NCLEX categories</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Detailed rationales provided for every answer</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Optional 6-hour timer (matches real NCLEX)</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Your progress is automatically saved</span>
              </li>
            </ul>
          </div>

          {/* Tips */}
          <div className="border-l-4 border-nursing-blue pl-4">
            <p className="font-semibold text-gray-900 mb-2">Tips for Success:</p>
            <ul className="space-y-1 text-sm text-gray-600">
              <li>• Read each scenario carefully before answering</li>
              <li>• Use the flag feature to mark questions for review</li>
              <li>• Review rationales even for correct answers</li>
              <li>• Take breaks as needed - your progress is saved</li>
            </ul>
          </div>

          {/* Start Button */}
          <div className="pt-4">
            <Button
              size="lg"
              className="w-full"
              onClick={startTest}
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Generating Test...
                </>
              ) : (
                <>
                  <BookOpen className="w-5 h-5 mr-2" />
                  Begin Practice Test
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

