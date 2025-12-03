"use client";

import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { 
  Crown, 
  X, 
  CheckCircle, 
  Loader2,
  Zap,
  Upload,
  BarChart3,
  Infinity
} from "lucide-react";

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  testsUsed: number;
  testsLimit: number;
}

export function UpgradeModal({ 
  isOpen, 
  onClose, 
  testsUsed, 
  testsLimit 
}: UpgradeModalProps) {
  const { user } = useUser();
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleUpgrade = async () => {
    if (!user) return;

    setIsLoading(true);
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
      setIsLoading(false);
    }
  };

  const features = [
    { icon: Infinity, text: "Unlimited practice tests" },
    { icon: Upload, text: "Upload study materials" },
    { icon: Zap, text: "AI-generated tests from slides" },
    { icon: BarChart3, text: "Performance analytics" },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-md mx-4 bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 text-gray-400 hover:text-gray-600 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="bg-gradient-to-br from-blue-600 to-purple-600 px-6 py-8 text-center">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Crown className="w-8 h-8 text-yellow-300" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">
            Upgrade to Pro
          </h2>
          <p className="text-blue-100">
            You&apos;ve used {testsUsed} of {testsLimit} free tests
          </p>
        </div>

        {/* Content */}
        <div className="px-6 py-6">
          {/* Usage Bar */}
          <div className="mb-6">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Tests Used</span>
              <span>{testsUsed}/{testsLimit}</span>
            </div>
            <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                style={{ width: `${Math.min((testsUsed / testsLimit) * 100, 100)}%` }}
              />
            </div>
          </div>

          {/* Features */}
          <div className="space-y-3 mb-6">
            <p className="text-sm font-medium text-gray-900">
              Pro includes:
            </p>
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Icon className="w-4 h-4 text-green-600" />
                  </div>
                  <span className="text-gray-700">{feature.text}</span>
                </div>
              );
            })}
          </div>

          {/* Price */}
          <div className="text-center mb-6">
            <span className="text-4xl font-bold text-gray-900">$35</span>
            <span className="text-gray-500">/month</span>
          </div>

          {/* CTA Button */}
          <Button
            onClick={handleUpgrade}
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-6 text-lg"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Loading...
              </>
            ) : (
              <>
                <Crown className="w-5 h-5 mr-2" />
                Upgrade Now
              </>
            )}
          </Button>

          {/* Security Note */}
          <p className="text-xs text-gray-500 text-center mt-4">
            Secure checkout powered by Stripe. Cancel anytime.
          </p>
        </div>
      </div>
    </div>
  );
}




