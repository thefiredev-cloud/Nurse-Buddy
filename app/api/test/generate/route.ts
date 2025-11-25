import { NextResponse } from "next/server";
import { generateNCLEXTest } from "@/lib/ai/claude";
import { createTest, createUser, getUserById, canUserCreateTest } from "@/lib/database/queries";
import { auth, currentUser } from "@clerk/nextjs/server";
import { mockUser } from "@/lib/auth-mock";

async function ensureUserExists() {
  try {
    const user = await currentUser();
    const { userId } = auth();
    
    if (!user || !userId) {
      // Fallback to mock user in development
      if (process.env.NODE_ENV === "development" && !process.env.CLERK_SECRET_KEY) {
        return mockUser.id;
      }
      return null;
    }

    // Check if user exists in database
    const existingUser = await getUserById(userId);
    
    if (!existingUser) {
      // Create user in database (webhook might not have fired)
      console.log("Creating user in database:", userId);
      const newUser = await createUser({
        id: userId,
        email: user.primaryEmailAddress?.emailAddress || "",
        name: user.fullName || `${user.firstName || ""} ${user.lastName || ""}`.trim() || "User",
        stripe_customer_id: null,
        subscription_status: "inactive",
      });
      
      if (!newUser) {
        console.error("Failed to create user in database:", userId);
        return null;
      }
    }

    return userId;
  } catch (error) {
    console.error("Error ensuring user exists:", error);
  
  // Fallback to mock user in development
  if (process.env.NODE_ENV === "development" && !process.env.CLERK_SECRET_KEY) {
    return mockUser.id;
  }
  return null;
  }
}

export async function POST(req: Request) {
  try {
    const userId = await ensureUserExists();
    
    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Check if user can create a test (subscription or free tier limit)
    const testAccess = await canUserCreateTest(userId);
    
    if (!testAccess.allowed) {
      return NextResponse.json(
        { 
          error: "Free tier limit reached",
          message: testAccess.reason,
          testsUsed: testAccess.testsUsed,
          testsLimit: testAccess.testsLimit,
          requiresUpgrade: true,
        },
        { status: 403 }
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

