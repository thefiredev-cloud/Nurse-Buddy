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
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          onClick={onPrevious}
          disabled={isFirst}
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          Previous
        </Button>

        <Button
          variant="outline"
          onClick={onFlag}
          className={isFlagged ? "bg-yellow-50 border-yellow-400" : ""}
        >
          <Flag
            className={`w-4 h-4 mr-1 ${isFlagged ? "fill-yellow-400 text-yellow-400" : ""}`}
          />
          {isFlagged ? "Flagged" : "Flag"}
        </Button>
      </div>

      <div className="flex items-center space-x-2">
        {hasAnswered && !showRationale && (
          <Button onClick={onSubmit}>
            <CheckCircle className="w-4 h-4 mr-1" />
            Submit Answer
          </Button>
        )}

        {showRationale && !isLast && (
          <Button onClick={onNext}>
            Next
            <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        )}

        {showRationale && isLast && (
          <Button onClick={handleComplete} disabled={isCompleting}>
            {isCompleting ? "Completing..." : "Finish Test"}
          </Button>
        )}
      </div>
    </div>
  );
}

