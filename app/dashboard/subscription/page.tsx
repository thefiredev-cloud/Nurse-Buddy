"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  CreditCard, 
  Crown, 
  Loader2, 
  CheckCircle, 
  AlertCircle,
  Zap,
  FileText,
  Clock
} from "lucide-react";

export const dynamic = 'force-dynamic';

interface SubscriptionStatus {
  isSubscribed: boolean;
  status: string;
  plan: "free" | "pro";
  testsUsed: number;
  testsLimit: number | "unlimited";
  stripeCustomerId: string | null;
  currentPeriodEnd?: string;
  cancelAtPeriodEnd?: boolean;
}

export default function SubscriptionPage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [subscription, setSubscription] = useState<SubscriptionStatus | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpgrading, setIsUpgrading] = useState(false);
  const [isManaging, setIsManaging] = useState(false);

  useEffect(() => {
    if (!isLoaded) return;
    if (!user) {
      router.push("/sign-in");
      return;
    }
    fetchSubscription();
  }, [isLoaded, user, router]);

  const fetchSubscription = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/subscription/status");
      if (response.ok) {
        const data = await response.json();
        setSubscription(data);
      }
    } catch (error) {
      console.error("Failed to fetch subscription:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpgrade = async () => {
    if (!user) return;
    
    setIsUpgrading(true);
    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          email: user.primaryEmailAddress?.emailAddress,
        }),
      });

      const data = await response.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error("Checkout error:", error);
      alert("Failed to start checkout. Please try again.");
    } finally {
      setIsUpgrading(false);
    }
  };

  const handleManageSubscription = async () => {
    setIsManaging(true);
    try {
      const response = await fetch("/api/subscription/portal", {
        method: "POST",
      });

      const data = await response.json();
      if (data.url) {
        window.location.href = data.url;
      } else if (data.error) {
        alert(data.error);
      }
    } catch (error) {
      console.error("Portal error:", error);
      alert("Failed to open subscription management. Please try again.");
    } finally {
      setIsManaging(false);
    }
  };

  if (!isLoaded || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  const isPro = subscription?.plan === "pro";
  const testsRemaining = isPro 
    ? "Unlimited" 
    : `${(subscription?.testsLimit as number) - (subscription?.testsUsed || 0)} remaining`;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Subscription</h1>
        <p className="text-gray-600 mt-1">
          Manage your Nurse Buddy subscription
        </p>
      </div>

      {/* Current Plan Card */}
      <Card className={isPro ? "border-2 border-yellow-400" : ""}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {isPro ? (
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <Crown className="w-6 h-6 text-yellow-600" />
                </div>
              ) : (
                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                  <CreditCard className="w-6 h-6 text-gray-600" />
                </div>
              )}
              <div>
                <CardTitle className="text-xl">
                  {isPro ? "Pro Plan" : "Free Plan"}
                </CardTitle>
                <CardDescription>
                  {isPro ? "$35/month" : "Limited features"}
                </CardDescription>
              </div>
            </div>
            {isPro && (
              <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-sm font-medium rounded-full">
                Active
              </span>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Usage Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                <FileText className="w-4 h-4" />
                Tests Used
              </div>
              <p className="text-2xl font-bold text-gray-900">
                {subscription?.testsUsed || 0}
              </p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                <Zap className="w-4 h-4" />
                Tests Available
              </div>
              <p className="text-2xl font-bold text-gray-900">
                {testsRemaining}
              </p>
            </div>
          </div>

          {/* Renewal Info for Pro */}
          {isPro && subscription?.currentPeriodEnd && (
            <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg">
              <Clock className="w-4 h-4 text-blue-600" />
              <span className="text-sm text-blue-800">
                {subscription.cancelAtPeriodEnd 
                  ? `Subscription ends on ${new Date(subscription.currentPeriodEnd).toLocaleDateString()}`
                  : `Renews on ${new Date(subscription.currentPeriodEnd).toLocaleDateString()}`
                }
              </span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            {isPro ? (
              <Button 
                variant="outline" 
                onClick={handleManageSubscription}
                disabled={isManaging}
                className="flex-1"
              >
                {isManaging ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Loading...
                  </>
                ) : (
                  "Manage Subscription"
                )}
              </Button>
            ) : (
              <Button 
                onClick={handleUpgrade}
                disabled={isUpgrading}
                className="flex-1 bg-blue-600 hover:bg-blue-700"
              >
                {isUpgrading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Loading...
                  </>
                ) : (
                  <>
                    <Crown className="w-4 h-4 mr-2" />
                    Upgrade to Pro - $35/month
                  </>
                )}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Plan Comparison */}
      <Card>
        <CardHeader>
          <CardTitle>Plan Comparison</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            {/* Free Plan */}
            <div className={`p-6 rounded-lg border-2 ${!isPro ? "border-blue-500 bg-blue-50/30" : "border-gray-200"}`}>
              <h3 className="text-lg font-semibold mb-4">Free</h3>
              <p className="text-3xl font-bold mb-6">$0<span className="text-sm font-normal text-gray-600">/month</span></p>
              <ul className="space-y-3">
                <FeatureItem included>2 practice tests</FeatureItem>
                <FeatureItem included>100 questions per test</FeatureItem>
                <FeatureItem included>Detailed rationales</FeatureItem>
                <FeatureItem included={false}>Unlimited tests</FeatureItem>
                <FeatureItem included={false}>Upload study materials</FeatureItem>
                <FeatureItem included={false}>Performance analytics</FeatureItem>
              </ul>
            </div>

            {/* Pro Plan */}
            <div className={`p-6 rounded-lg border-2 ${isPro ? "border-yellow-500 bg-yellow-50/30" : "border-gray-200"}`}>
              <div className="flex items-center gap-2 mb-4">
                <h3 className="text-lg font-semibold">Pro</h3>
                <span className="px-2 py-0.5 bg-yellow-100 text-yellow-800 text-xs font-medium rounded">
                  POPULAR
                </span>
              </div>
              <p className="text-3xl font-bold mb-6">$35<span className="text-sm font-normal text-gray-600">/month</span></p>
              <ul className="space-y-3">
                <FeatureItem included>Unlimited practice tests</FeatureItem>
                <FeatureItem included>100 questions per test</FeatureItem>
                <FeatureItem included>Detailed rationales</FeatureItem>
                <FeatureItem included>Upload study materials</FeatureItem>
                <FeatureItem included>AI-generated tests from slides</FeatureItem>
                <FeatureItem included>Performance analytics</FeatureItem>
              </ul>
              {!isPro && (
                <Button 
                  onClick={handleUpgrade}
                  disabled={isUpgrading}
                  className="w-full mt-6 bg-yellow-500 hover:bg-yellow-600 text-yellow-950"
                >
                  {isUpgrading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Loading...
                    </>
                  ) : (
                    "Upgrade Now"
                  )}
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function FeatureItem({ children, included }: { children: React.ReactNode; included: boolean }) {
  return (
    <li className="flex items-center gap-2">
      {included ? (
        <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
      ) : (
        <AlertCircle className="w-5 h-5 text-gray-300 flex-shrink-0" />
      )}
      <span className={included ? "text-gray-900" : "text-gray-400"}>
        {children}
      </span>
    </li>
  );
}






