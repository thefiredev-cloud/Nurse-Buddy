import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, XCircle } from "lucide-react";

interface RationalePanelProps {
  selectedAnswer: "A" | "B" | "C" | "D";
  correctAnswer: "A" | "B" | "C" | "D";
  rationale: {
    A: string;
    B: string;
    C: string;
    D: string;
  };
  detailedExplanation?: string;
}

export function RationalePanel({
  selectedAnswer,
  correctAnswer,
  rationale,
  detailedExplanation,
}: RationalePanelProps) {
  const isCorrect = selectedAnswer === correctAnswer;

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          {isCorrect ? (
            <>
              <CheckCircle className="w-6 h-6 text-green-600" />
              <span className="text-green-600">Correct!</span>
            </>
          ) : (
            <>
              <XCircle className="w-6 h-6 text-red-600" />
              <span className="text-red-600">Incorrect</span>
            </>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Detailed Explanation */}
        {detailedExplanation && (
          <div className="bg-nursing-light p-4 rounded-lg">
            <p className="text-sm font-medium text-gray-900 mb-2">
              Detailed Explanation:
            </p>
            <p className="text-gray-700">{detailedExplanation}</p>
          </div>
        )}

        {/* Answer Rationales */}
        <div className="space-y-3">
          <p className="text-sm font-medium text-gray-900">
            Answer Rationales:
          </p>
          {(["A", "B", "C", "D"] as const).map((letter) => (
            <div
              key={letter}
              className={`p-3 rounded-lg border ${
                letter === correctAnswer
                  ? "bg-green-50 border-green-200"
                  : "bg-gray-50 border-gray-200"
              }`}
            >
              <div className="flex items-start space-x-2">
                <span className="font-semibold text-gray-900">{letter}.</span>
                <p className="text-sm text-gray-700">{rationale[letter]}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

