"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, CheckCircle2, XCircle, Flag, BookOpen, TrendingUp, ArrowRight } from "lucide-react";
import { NCLEXQuestion } from "@/lib/ai/claude";
import type { NCLEXCategory } from "@/lib/database/schema";

interface TestResult {
  id: string;
  questions: NCLEXQuestion[];
  answers: Record<string, string>;
  score: number;
  completed_at: string;
  created_at: string;
}

export default function TestResultsPage() {
  const params = useParams();
  const router = useRouter();
  const testId = params.testId as string;

  const [loading, setLoading] = useState(true);
  const [test, setTest] = useState<TestResult | null>(null);
  const [categoryBreakdown, setCategoryBreakdown] = useState<Record<NCLEXCategory, { correct: number; total: number }>>({
    "Safe and Effective Care Environment": { correct: 0, total: 0 },
    "Health Promotion and Maintenance": { correct: 0, total: 0 },
    "Psychosocial Integrity": { correct: 0, total: 0 },
    "Physiological Integrity": { correct: 0, total: 0 },
  });

  useEffect(() => {
    const loadResults = async () => {
      try {
        const response = await fetch(`/api/test/${testId}`);
        
        if (!response.ok) {
          throw new Error("Failed to load test results");
        }

        const data = await response.json();
        
        if (!data.completed_at) {
          // Test not completed, redirect to test page
          router.push(`/dashboard/test/${testId}`);
          return;
        }

        setTest(data);

        // Calculate category breakdown
        const breakdown: Record<NCLEXCategory, { correct: number; total: number }> = {
          "Safe and Effective Care Environment": { correct: 0, total: 0 },
          "Health Promotion and Maintenance": { correct: 0, total: 0 },
          "Psychosocial Integrity": { correct: 0, total: 0 },
          "Physiological Integrity": { correct: 0, total: 0 },
        };

        data.questions.forEach((question: NCLEXQuestion) => {
          const category = question.category;
          if (data.answers[question.id]) {
            breakdown[category].total++;
            if (data.answers[question.id] === question.correctAnswer) {
              breakdown[category].correct++;
            }
          }
        });

        setCategoryBreakdown(breakdown);
        setLoading(false);
      } catch (error) {
        console.error("Error loading results:", error);
        setLoading(false);
      }
    };

    loadResults();
  }, [testId, router]);

  if (loading || !test) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-12 h-12 animate-spin text-nursing-blue" />
      </div>
    );
  }

  const questions = test.questions || [];
  const answers = test.answers || {};
  const totalQuestions = questions.length;
  const answeredQuestions = Object.keys(answers).length;
  const correctAnswers = questions.filter((q: NCLEXQuestion) => 
    answers[q.id] === q.correctAnswer
  ).length;

  const getScoreColor = (score: number) => {
    if (score >= 75) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreBg = (score: number) => {
    if (score >= 75) return "bg-green-100";
    if (score >= 60) return "bg-yellow-100";
    return "bg-red-100";
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Test Results</h1>
        <p className="text-gray-600">
          Completed on {new Date(test.completed_at).toLocaleDateString()}
        </p>
      </div>

      {/* Score Card */}
      <Card className={`${getScoreBg(test.score)} border-2`}>
        <CardContent className="p-8">
          <div className="text-center">
            <p className="text-sm font-medium text-gray-600 mb-2">Your Score</p>
            <p className={`text-6xl font-bold ${getScoreColor(test.score)} mb-2`}>
              {test.score}%
            </p>
            <p className="text-gray-700">
              {correctAnswers} out of {answeredQuestions} questions correct
            </p>
            {test.score >= 75 && (
              <p className="text-green-700 font-semibold mt-2">
                Excellent! You&apos;re well prepared for your exam.
              </p>
            )}
            {test.score >= 60 && test.score < 75 && (
              <p className="text-yellow-700 font-semibold mt-2">
                Good progress! Keep practicing to improve your score.
              </p>
            )}
            {test.score < 60 && (
              <p className="text-red-700 font-semibold mt-2">
                Keep studying! Focus on your weak areas.
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Category Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Category Performance</CardTitle>
          <CardDescription>
            Your performance across nursing categories
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(categoryBreakdown).map(([category, stats]) => {
              const percentage = stats.total > 0 
                ? Math.round((stats.correct / stats.total) * 100) 
                : 0;
              
              return (
                <div key={category} className="p-4 border rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-2">{category}</h3>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">
                      {stats.correct} / {stats.total} correct
                    </span>
                    <span className={`font-bold ${getScoreColor(percentage)}`}>
                      {percentage}%
                    </span>
                  </div>
                  <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        percentage >= 75 ? "bg-green-600" :
                        percentage >= 60 ? "bg-yellow-600" :
                        "bg-red-600"
                      }`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Question Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Question Summary</CardTitle>
          <CardDescription>
            Overview of your answers
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-green-50 rounded-lg text-center">
              <CheckCircle2 className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-green-600">{correctAnswers}</p>
              <p className="text-sm text-gray-600">Correct</p>
            </div>
            <div className="p-4 bg-red-50 rounded-lg text-center">
              <XCircle className="w-8 h-8 text-red-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-red-600">
                {answeredQuestions - correctAnswers}
              </p>
              <p className="text-sm text-gray-600">Incorrect</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg text-center">
              <Flag className="w-8 h-8 text-gray-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-600">
                {totalQuestions - answeredQuestions}
              </p>
              <p className="text-sm text-gray-600">Unanswered</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button
          size="lg"
          onClick={() => router.push(`/dashboard/test/${testId}`)}
          variant="outline"
        >
          <BookOpen className="w-5 h-5 mr-2" />
          Review Test
        </Button>
        <Button
          size="lg"
          onClick={() => router.push("/dashboard/test/new")}
        >
          Start New Test
          <ArrowRight className="w-5 h-5 ml-2" />
        </Button>
        <Button
          size="lg"
          onClick={() => router.push("/dashboard/performance")}
          variant="outline"
        >
          <TrendingUp className="w-5 h-5 mr-2" />
          View Analytics
        </Button>
      </div>
    </div>
  );
}

