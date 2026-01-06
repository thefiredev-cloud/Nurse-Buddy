import { NextResponse } from "next/server";
import { generateRationaleWithClaude } from "@/lib/ai/claude";
import { getTestById, updateTestAnswers } from "@/lib/database/queries";
import { auth } from "@clerk/nextjs/server";
import { mockUser } from "@/lib/auth-mock";
import { submitAnswerSchema, validateBody } from "@/lib/validations";
import { checkRateLimit, RATE_LIMITS, getRateLimitHeaders } from "@/lib/rate-limit";

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

    // Apply rate limiting for AI endpoint
    const rateLimit = checkRateLimit(`submit:${userId}`, RATE_LIMITS.aiEndpoint);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: "Rate limit exceeded. Please try again later." },
        { status: 429, headers: getRateLimitHeaders(rateLimit) }
      );
    }

    const body = await req.json();

    // Validate request body
    const validation = validateBody(submitAnswerSchema, body);
    if (!validation.success) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    const { testId, questionId, selectedAnswer, question, correctAnswer, scenario, choices } = validation.data;

    // Verify test exists and belongs to user
    const test = await getTestById(testId, userId);
    if (!test) {
      return NextResponse.json(
        { error: "Test not found" },
        { status: 404 }
      );
    }

    // Check if test is already completed
    if (test.completed_at) {
      return NextResponse.json(
        { error: "Test already completed" },
        { status: 400 }
      );
    }

    console.log("Submitting answer:", {
      testId,
      questionId,
      selectedAnswer,
      correctAnswer,
    });

    // Update answers in database
    const currentAnswers = test.answers || {};
    const updatedAnswers = {
      ...currentAnswers,
      [questionId]: selectedAnswer,
    };

    const saved = await updateTestAnswers(testId, updatedAnswers);
    if (!saved) {
      console.error("Failed to save answer to database");
    }

    // Generate detailed rationale using Claude
    const rationale = await generateRationaleWithClaude(
      scenario,
      question,
      selectedAnswer,
      correctAnswer,
      choices
    );

    const isCorrect = selectedAnswer === correctAnswer;

    return NextResponse.json({
      isCorrect,
      correctAnswer,
      rationale,
    });
  } catch (error) {
    console.error("Answer submission error:", error);
    return NextResponse.json(
      { error: "Failed to submit answer" },
      { status: 500 }
    );
  }
}

