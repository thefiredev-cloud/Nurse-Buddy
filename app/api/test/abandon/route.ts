import { NextResponse } from "next/server";
import { getTestById, completeTest, recordPerformance } from "@/lib/database/queries";
import { auth } from "@clerk/nextjs/server";
import { mockUser } from "@/lib/auth-mock";
import type { NCLEXCategory } from "@/lib/database/schema";

async function getUserId() {
  try {
    const { userId } = auth();
    if (userId) return userId;
  } catch (error) {
    // Clerk might not be configured
  }
  
  // Fallback to mock user in development
  if (process.env.NODE_ENV === "development" && !process.env.CLERK_SECRET_KEY) {
    return mockUser.id;
  }
  
  return null;
}

export async function POST(req: Request) {
  try {
    const userId = await getUserId();
    
    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { testId } = body;

    if (!testId) {
      return NextResponse.json(
        { error: "Test ID is required" },
        { status: 400 }
      );
    }

    // Get test and verify ownership
    const test = await getTestById(testId, userId);
    if (!test) {
      return NextResponse.json(
        { error: "Test not found" },
        { status: 404 }
      );
    }

    // Check if already completed
    if (test.completed_at) {
      return NextResponse.json(
        { error: "Test already completed", score: test.score },
        { status: 400 }
      );
    }

    // Calculate score from answered questions
    const questions = test.questions || [];
    const answers = test.answers || {};
    let correctCount = 0;
    let totalAnswered = 0;

    questions.forEach((question: any) => {
      if (answers[question.id]) {
        totalAnswered++;
        if (answers[question.id] === question.correctAnswer) {
          correctCount++;
        }
      }
    });

    // Calculate percentage score based on answered questions only
    const score = totalAnswered > 0 
      ? Math.round((correctCount / totalAnswered) * 100) 
      : 0;

    // Mark test as completed (abandoned)
    const completed = await completeTest(testId, score);
    if (!completed) {
      return NextResponse.json(
        { error: "Failed to end test" },
        { status: 500 }
      );
    }

    // Record performance by category for answered questions
    const categoryStats = new Map<NCLEXCategory, { correct: number; total: number }>();
    
    questions.forEach((question: any) => {
      if (answers[question.id]) {
        const category = question.category as NCLEXCategory;
        const stats = categoryStats.get(category) || { correct: 0, total: 0 };
        stats.total++;
        if (answers[question.id] === question.correctAnswer) {
          stats.correct++;
        }
        categoryStats.set(category, stats);
      }
    });

    // Record performance for each category
    const today = new Date().toISOString().split('T')[0];
    for (const [category, stats] of categoryStats.entries()) {
      await recordPerformance({
        user_id: userId,
        category,
        correct_answers: stats.correct,
        total_questions: stats.total,
        date: today,
      });
    }

    return NextResponse.json({
      success: true,
      score,
      correctCount,
      totalAnswered,
      totalQuestions: questions.length,
      message: "Test ended successfully",
    });
  } catch (error) {
    console.error("Test abandon error:", error);
    return NextResponse.json(
      { error: "Failed to end test" },
      { status: 500 }
    );
  }
}

