"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface QuestionCardProps {
  questionNumber: number;
  totalQuestions: number;
  scenario: string;
  question: string;
  choices: {
    A: string;
    B: string;
    C: string;
    D: string;
  };
  selectedAnswer?: "A" | "B" | "C" | "D";
  correctAnswer?: "A" | "B" | "C" | "D";
  onSelectAnswer: (answer: "A" | "B" | "C" | "D") => void;
  showRationale: boolean;
}

export function QuestionCard({
  questionNumber,
  totalQuestions,
  scenario,
  question,
  choices,
  selectedAnswer,
  correctAnswer,
  onSelectAnswer,
  showRationale,
}: QuestionCardProps) {
  return (
    <Card>
      <CardContent className="p-4 sm:p-6 space-y-4 sm:space-y-6">
        {/* Question Header */}
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-500">
            Question {questionNumber} of {totalQuestions}
          </span>
          <span className="text-sm font-medium text-nursing-blue">
            {Math.round((questionNumber / totalQuestions) * 100)}% Complete
          </span>
        </div>

        {/* Scenario */}
        {scenario && (
          <div className="bg-nursing-light p-4 rounded-lg">
            <p className="text-gray-800">{scenario}</p>
          </div>
        )}

        {/* Question */}
        <div>
          <p className="text-lg font-semibold text-gray-900">{question}</p>
        </div>

        {/* Answer Choices */}
        <div className="space-y-3">
          {(["A", "B", "C", "D"] as const).map((letter) => {
            const isSelected = selectedAnswer === letter;
            const isCorrect = correctAnswer === letter;
            const isIncorrect =
              showRationale && selectedAnswer === letter && !isCorrect;
            const showCorrect = showRationale && isCorrect;

            return (
              <button
                key={letter}
                onClick={() => !showRationale && onSelectAnswer(letter)}
                disabled={showRationale}
                className={cn(
                  "w-full text-left p-3 sm:p-4 rounded-lg border-2 transition min-h-[56px]",
                  "hover:border-nursing-blue disabled:cursor-not-allowed",
                  isSelected && !showRationale && "border-nursing-blue bg-nursing-light",
                  showCorrect && "border-green-500 bg-green-50",
                  isIncorrect && "border-red-500 bg-red-50",
                  !isSelected && !showCorrect && !isIncorrect && "border-gray-200"
                )}
              >
                <div className="flex items-start space-x-3">
                  <span
                    className={cn(
                      "flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-semibold",
                      showCorrect && "bg-green-500 text-white",
                      isIncorrect && "bg-red-500 text-white",
                      !showCorrect && !isIncorrect && isSelected && "bg-nursing-blue text-white",
                      !showCorrect && !isIncorrect && !isSelected && "bg-gray-100 text-gray-700"
                    )}
                  >
                    {letter}
                  </span>
                  <span className="flex-1 text-gray-800">{choices[letter]}</span>
                </div>
              </button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

