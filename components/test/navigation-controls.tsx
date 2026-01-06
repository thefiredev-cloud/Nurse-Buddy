import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Flag, CheckCircle } from "lucide-react";

interface NavigationControlsProps {
  currentQuestion: number;
  totalQuestions: number;
  onPrevious: () => void;
  onNext: () => void;
  onFlag: () => void;
  onSubmit: () => void;
  onComplete?: () => void;
  isFlagged: boolean;
  hasAnswered: boolean;
  showRationale: boolean;
  isCompleting?: boolean;
}

export function NavigationControls({
  currentQuestion,
  totalQuestions,
  onPrevious,
  onNext,
  onFlag,
  onSubmit,
  onComplete,
  isFlagged,
  hasAnswered,
  showRationale,
  isCompleting = false,
}: NavigationControlsProps) {
  const isFirst = currentQuestion === 1;
  const isLast = currentQuestion === totalQuestions;

  const handleComplete = () => {
    if (onComplete) {
      onComplete();
    } else {
      // Fallback to redirect if handler not provided
      window.location.href = "/dashboard";
    }
  };

  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-0">
      {/* Left group - secondary actions */}
      <div className="flex items-center gap-2 order-2 sm:order-1">
        <Button
          variant="outline"
          onClick={onPrevious}
          disabled={isFirst}
          className="flex-1 sm:flex-initial min-h-[44px]"
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          <span className="hidden sm:inline">Previous</span>
          <span className="sm:hidden">Prev</span>
        </Button>

        <Button
          variant="outline"
          onClick={onFlag}
          className={`flex-1 sm:flex-initial min-h-[44px] ${isFlagged ? "bg-yellow-50 border-yellow-400" : ""}`}
        >
          <Flag
            className={`w-4 h-4 mr-1 ${isFlagged ? "fill-yellow-400 text-yellow-400" : ""}`}
          />
          {isFlagged ? "Flagged" : "Flag"}
        </Button>
      </div>

      {/* Right group - primary actions (shown first on mobile) */}
      <div className="flex items-center gap-2 order-1 sm:order-2">
        {hasAnswered && !showRationale && (
          <Button onClick={onSubmit} className="flex-1 sm:flex-initial min-h-[44px]">
            <CheckCircle className="w-4 h-4 mr-1" />
            <span className="hidden sm:inline">Submit Answer</span>
            <span className="sm:hidden">Submit</span>
          </Button>
        )}

        {showRationale && !isLast && (
          <Button onClick={onNext} className="flex-1 sm:flex-initial min-h-[44px]">
            Next
            <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        )}

        {showRationale && isLast && (
          <Button onClick={handleComplete} disabled={isCompleting} className="flex-1 sm:flex-initial min-h-[44px]">
            {isCompleting ? "Completing..." : "Finish Test"}
          </Button>
        )}
      </div>
    </div>
  );
}

