"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, BookOpen, Crown, AlertTriangle } from "lucide-react";
import { UpgradeModal } from "@/components/subscription/upgrade-modal";

export const dynamic = 'force-dynamic';

interface SubscriptionStatus {
  isSubscribed: boolean;
  testsUsed: number;
  testsLimit: number | "unlimited";
}

export default function NewTestPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [checkingAccess, setCheckingAccess] = useState(true);
  const [subscription, setSubscription] = useState<SubscriptionStatus | null>(null);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  useEffect(() => {
    checkSubscription();
  }, []);

  const checkSubscription = async () => {
    try {
      const response = await fetch("/api/subscription/status");
      if (response.ok) {
        const data = await response.json();
        setSubscription({
          isSubscribed: data.isSubscribed,
          testsUsed: data.testsUsed,
          testsLimit: data.testsLimit,
        });
      }
    } catch (error) {
      console.error("Failed to check subscription:", error);
    } finally {
      setCheckingAccess(false);
    }
  };

  const canStartTest = subscription?.isSubscribed || 
    (subscription?.testsLimit !== "unlimited" && 
     (subscription?.testsUsed || 0) < (subscription?.testsLimit || 2));

  const startTest = async () => {
    // Check if user has access
    if (!canStartTest) {
      setShowUpgradeModal(true);
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/test/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      const data = await response.json();

      // Handle upgrade required response
      if (response.status === 403 && data.requiresUpgrade) {
        setShowUpgradeModal(true);
        setLoading(false);
        return;
      }

      if (data.error) {
        throw new Error(data.error);
      }

      if (data.testId) {
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

  const testsRemaining = subscription?.isSubscribed 
    ? "Unlimited" 
    : `${(subscription?.testsLimit as number || 2) - (subscription?.testsUsed || 0)} remaining`;

  return (
    <div className="max-w-3xl mx-auto">
      {/* Subscription Status Banner */}
      {!checkingAccess && subscription && !subscription.isSubscribed && (
        <div className={`mb-6 p-4 rounded-lg flex items-center gap-3 ${
          canStartTest 
            ? "bg-blue-50 border border-blue-200" 
            : "bg-yellow-50 border border-yellow-200"
        }`}>
          {canStartTest ? (
            <>
              <BookOpen className="w-5 h-5 text-blue-600 flex-shrink-0" />
              <div className="flex-1">
                <p className="font-medium text-blue-900">
                  Free Plan: {subscription.testsUsed}/{subscription.testsLimit} tests used
                </p>
                <p className="text-sm text-blue-700">
                  {testsRemaining} on free plan
                </p>
              </div>
            </>
          ) : (
            <>
              <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0" />
              <div className="flex-1">
                <p className="font-medium text-yellow-900">
                  Free trial limit reached
                </p>
                <p className="text-sm text-yellow-700">
                  Upgrade to Pro for unlimited tests
                </p>
              </div>
              <Button 
                size="sm" 
                onClick={() => setShowUpgradeModal(true)}
                className="bg-yellow-600 hover:bg-yellow-700"
              >
                <Crown className="w-4 h-4 mr-1" />
                Upgrade
              </Button>
            </>
          )}
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-3xl">Start New Practice Test</CardTitle>
          <CardDescription className="text-base">
            You&apos;re about to begin a 100-question practice exam
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
                <span>100 AI-generated questions from your content</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Questions distributed across nursing categories</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Detailed rationales provided for every answer</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Optional 6-hour timer for exam simulation</span>
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
            {checkingAccess ? (
              <Button size="lg" className="w-full" disabled>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Checking access...
              </Button>
            ) : canStartTest ? (
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
            ) : (
              <Button
                size="lg"
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                onClick={() => setShowUpgradeModal(true)}
              >
                <Crown className="w-5 h-5 mr-2" />
                Upgrade to Start More Tests
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Upgrade Modal */}
      <UpgradeModal
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        testsUsed={subscription?.testsUsed || 0}
        testsLimit={(subscription?.testsLimit as number) || 2}
      />
    </div>
  );
}
