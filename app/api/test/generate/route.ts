import { NextResponse } from "next/server";
import { generateNCLEXTest } from "@/lib/ai/claude";
import { createTest } from "@/lib/database/queries";
import { auth, currentUser } from "@clerk/nextjs/server";
import { mockUser } from "@/lib/auth-mock";

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

    console.log("Generating test for user:", userId);

    // Generate 100 NCLEX questions
    const questions = await generateNCLEXTest();

    // Save test to database
    const test = await createTest({
      user_id: userId,
      questions: questions as any,
      answers: {},
      score: null,
      completed_at: null,
    });

    if (!test) {
      console.error("createTest returned null for user:", userId);
      console.error("Supabase admin client available:", !!process.env.SUPABASE_SERVICE_ROLE_KEY);
      return NextResponse.json(
        { 
          error: "Failed to create test record. Check server logs for details.",
          debug: {
            adminClientAvailable: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
            supabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
          }
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      testId: test.id,
      questions,
      startTime: test.created_at,
    });
  } catch (error) {
    console.error("Test generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate test" },
      { status: 500 }
    );
  }
}

