"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { StopCircle, Loader2 } from "lucide-react";

interface EndTestButtonProps {
  testId: string;
  variant?: "default" | "outline" | "ghost" | "destructive";
  size?: "default" | "sm" | "lg" | "icon";
  showIcon?: boolean;
  className?: string;
}

export function EndTestButton({ 
  testId, 
  variant = "outline", 
  size = "sm",
  showIcon = true,
  className = "",
}: EndTestButtonProps) {
  const router = useRouter();
  const [isEnding, setIsEnding] = useState(false);

  const handleEndTest = async () => {
    if (!confirm("Are you sure you want to end this test? Your current progress will be saved and scored.")) {
      return;
    }

    setIsEnding(true);
    try {
      const response = await fetch("/api/test/abandon", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ testId }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to end test");
      }

      // Refresh the page to show updated status
      router.refresh();
    } catch (error) {
      console.error("Error ending test:", error);
      alert(error instanceof Error ? error.message : "Failed to end test");
      setIsEnding(false);
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleEndTest}
      disabled={isEnding}
      className={`text-red-600 hover:text-red-700 hover:bg-red-50 ${className}`}
    >
      {isEnding ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <>
          {showIcon && <StopCircle className="w-4 h-4 mr-1" />}
          End Test
        </>
      )}
    </Button>
  );
}

