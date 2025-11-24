"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { QuestionCard } from "@/components/test/question-card";
import { ProgressBar } from "@/components/test/progress-bar";
import { Timer } from "@/components/test/timer";
import { RationalePanel } from "@/components/test/rationale-panel";
import { NavigationControls } from "@/components/test/navigation-controls";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { NCLEXQuestion } from "@/lib/ai/claude";

export default function TestPage() {
  const params = useParams();
  const router = useRouter();
  const testId = params.testId as string;

  const [loading, setLoading] = useState(true);
  const [test, setTest] = useState<any>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<"A" | "B" | "C" | "D" | null>(null);
  const [showRationale, setShowRationale] = useState(false);
  const [rationale, setRationale] = useState("");
  const [flagged, setFlagged] = useState<Set<number>>(new Set());
  const [answers, setAnswers] = useState<Record<number, "A" | "B" | "C" | "D">>({});
  const [isCompleting, setIsCompleting] = useState(false);

  useEffect(() => {
    const loadTest = async () => {
      try {
        // Try to load from database first
        const response = await fetch(`/api/test/${testId}`);
        
        if (response.status === 404) {
          // Test not found, redirect to new test
          router.push("/dashboard/test/new");
          return;
        }

        if (response.status === 401) {
          // Unauthorized, redirect to sign in
          router.push("/sign-in");
          return;
        }
        
        if (response.ok) {
          const data = await response.json();
          
          // Check if test is already completed
          if (data.completed_at) {
            router.push(`/dashboard/test/${testId}/results`);
            return;
          }

          // Validate test has questions
          if (!data.questions || !Array.isArray(data.questions) || data.questions.length === 0) {
            console.error("Test has no questions");
            router.push("/dashboard/test/new");
            return;
          }
          
          setTest({
            id: data.id,
            questions: data.questions,
            startTime: data.created_at,
          });
          
          // Load existing answers
          if (data.answers && typeof data.answers === 'object' && Object.keys(data.answers).length > 0) {
            // Convert question ID-based answers to index-based for UI
            const indexAnswers: Record<number, "A" | "B" | "C" | "D"> = {};
            data.questions.forEach((q: NCLEXQuestion, index: number) => {
              if (data.answers[q.id]) {
                indexAnswers[index] = data.answers[q.id] as "A" | "B" | "C" | "D";
              }
            });
            setAnswers(indexAnswers);
            
            // Restore selected answer for current question if exists
            if (indexAnswers[0] !== undefined) {
              setSelectedAnswer(indexAnswers[0]);
            }
          }
          
          setLoading(false);
          return;
        }
        
        // Fallback to sessionStorage for backward compatibility
        const testData = sessionStorage.getItem("currentTest");
        if (testData) {
          try {
            const parsed = JSON.parse(testData);
            if (parsed.testId === testId && parsed.questions && Array.isArray(parsed.questions)) {
              setTest(parsed);
              setLoading(false);
              return;
            }
          } catch (parseError) {
            console.error("Error parsing sessionStorage data:", parseError);
          }
        }
        
        // No test found, redirect
        router.push("/dashboard/test/new");
      } catch (error) {
        console.error("Error loading test:", error);
        // Fallback to sessionStorage
        const testData = sessionStorage.getItem("currentTest");
        if (testData) {
          try {
            const parsed = JSON.parse(testData);
            if (parsed.testId === testId && parsed.questions && Array.isArray(parsed.questions)) {
              setTest(parsed);
              setLoading(false);
              return;
            }
          } catch (parseError) {
            console.error("Error parsing sessionStorage data:", parseError);
          }
        }
        router.push("/dashboard/test/new");
      }
    };

    if (testId) {
      loadTest();
    }
  }, [testId, router]);

  if (loading || !test) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-12 h-12 animate-spin text-nursing-blue" />
      </div>
    );
  }

  if (!test.questions || !Array.isArray(test.questions) || test.questions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <p className="text-gray-600 mb-4">Test has no questions</p>
        <Button onClick={() => router.push("/dashboard/test/new")}>
          Start New Test
        </Button>
      </div>
    );
  }

  const currentQuestion: NCLEXQuestion = test.questions[currentQuestionIndex];
  const totalQuestions = test.questions.length;

  if (currentQuestionIndex >= totalQuestions) {
    // Invalid question index, reset to first
    setCurrentQuestionIndex(0);
    return null;
  }

  const handleSelectAnswer = (answer: "A" | "B" | "C" | "D") => {
    setSelectedAnswer(answer);
  };

  const handleSubmit = async () => {
    if (!selectedAnswer) return;

    // Save answer locally
    const updatedAnswers = { ...answers, [currentQuestionIndex]: selectedAnswer };
    setAnswers(updatedAnswers);

    // Get rationale and persist to database
    try {
      const response = await fetch("/api/test/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          testId,
          questionId: currentQuestion.id,
          selectedAnswer,
          correctAnswer: currentQuestion.correctAnswer,
          question: currentQuestion.question,
          scenario: currentQuestion.scenario,
          choices: currentQuestion.choices,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to submit answer");
      }

      const data = await response.json();
      setRationale(data.rationale);
      setShowRationale(true);
    } catch (error) {
      console.error("Error submitting answer:", error);
      alert("Failed to submit answer. Please try again.");
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(answers[currentQuestionIndex + 1] || null);
      setShowRationale(false);
      setRationale("");
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      setSelectedAnswer(answers[currentQuestionIndex - 1] || null);
      setShowRationale(false);
      setRationale("");
    }
  };

  const handleFlag = () => {
    const newFlagged = new Set(flagged);
    if (newFlagged.has(currentQuestionIndex)) {
      newFlagged.delete(currentQuestionIndex);
    } else {
      newFlagged.add(currentQuestionIndex);
    }
    setFlagged(newFlagged);
  };

  const handleComplete = async () => {
    setIsCompleting(true);
    try {
      const response = await fetch("/api/test/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ testId }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to complete test");
      }

      // Redirect to results page
      router.push(`/dashboard/test/${testId}/results`);
    } catch (error) {
      console.error("Error completing test:", error);
      alert("Failed to complete test. Please try again.");
      setIsCompleting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Practice Test</h1>
        <Timer startTime={new Date(test.startTime)} />
      </div>

      {/* Progress */}
      <ProgressBar current={currentQuestionIndex + 1} total={totalQuestions} />

      {/* Question */}
      <QuestionCard
        questionNumber={currentQuestionIndex + 1}
        totalQuestions={totalQuestions}
        scenario={currentQuestion.scenario}
        question={currentQuestion.question}
        choices={currentQuestion.choices}
        selectedAnswer={selectedAnswer || undefined}
        correctAnswer={showRationale ? currentQuestion.correctAnswer : undefined}
        onSelectAnswer={handleSelectAnswer}
        showRationale={showRationale}
      />

      {/* Rationale */}
      {showRationale && selectedAnswer && (
        <RationalePanel
          selectedAnswer={selectedAnswer}
          correctAnswer={currentQuestion.correctAnswer}
          rationale={currentQuestion.rationale}
          detailedExplanation={rationale}
        />
      )}

      {/* Navigation */}
      <NavigationControls
        currentQuestion={currentQuestionIndex + 1}
        totalQuestions={totalQuestions}
        onPrevious={handlePrevious}
        onNext={handleNext}
        onFlag={handleFlag}
        onSubmit={handleSubmit}
        onComplete={handleComplete}
        isFlagged={flagged.has(currentQuestionIndex)}
        hasAnswered={!!selectedAnswer}
        showRationale={showRationale}
        isCompleting={isCompleting}
      />
    </div>
  );
}

