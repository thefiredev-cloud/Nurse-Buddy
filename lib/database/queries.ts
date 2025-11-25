import { db } from "@/lib/supabase";
import type { User, Test, Performance, CategoryPerformance, UserStats } from "./schema";

// Constants
export const FREE_TIER_TEST_LIMIT = 2;

// User queries
export async function getUserById(userId: string): Promise<User | null> {
  if (!db) return null;

  const { data, error } = await (db as any)
    .from("users")
    .select("*")
    .eq("id", userId)
    .single();

  if (error) {
    console.error("Error fetching user:", error);
    return null;
  }

  return data;
}

export async function createUser(user: Omit<User, "created_at" | "updated_at">): Promise<User | null> {
  if (!db) return null;

  const { data, error } = await (db as any)
    .from("users")
    .insert(user)
    .select()
    .single();

  if (error) {
    console.error("Error creating user:", error);
    return null;
  }

  return data;
}

export async function updateUserSubscription(
  userId: string,
  customerId: string,
  status: User["subscription_status"]
): Promise<boolean> {
  if (!db) return false;

  const { error } = await (db as any)
    .from("users")
    .update({
      stripe_customer_id: customerId,
      subscription_status: status,
    })
    .eq("id", userId);

  if (error) {
    console.error("Error updating subscription:", error);
    return false;
  }

  return true;
}

// Test queries
export async function createTest(test: Omit<Test, "id" | "created_at">): Promise<Test | null> {
  if (!db) {
    console.error("Database client not available");
    return null;
  }

  try {
    const { data, error } = await (db as any)
      .from("tests")
      .insert(test)
      .select()
      .single();

    if (error) {
      console.error("Error creating test:", JSON.stringify(error, null, 2));
      console.error("Error details:", {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code,
      });
      console.error("Test data:", JSON.stringify(test, null, 2));
      console.error("Using admin client:", !!process.env.SUPABASE_SERVICE_ROLE_KEY);
      return null;
    }

    if (!data) {
      console.error("No data returned from insert");
      return null;
    }

    return data;
  } catch (err: any) {
    console.error("Exception creating test:", err);
    console.error("Exception details:", err?.message, err?.stack);
    return null;
  }
}

export async function getTestById(testId: string, userId?: string): Promise<Test | null> {
  if (!db) return null;

  const query = (db as any)
    .from("tests")
    .select("*")
    .eq("id", testId);

  // If userId provided, ensure user owns the test
  if (userId) {
    query.eq("user_id", userId);
  }

  const { data, error } = await query.single();

  if (error) {
    console.error("Error fetching test:", error);
    return null;
  }

  return data;
}

export async function getUserTests(userId: string, limit: number = 10): Promise<Test[]> {
  if (!db) return [];

  const { data, error } = await (db as any)
    .from("tests")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("Error fetching tests:", error);
    return [];
  }

  return data || [];
}

export async function updateTestAnswers(
  testId: string,
  answers: Record<string, string>
): Promise<boolean> {
  if (!db) return false;

  const { error } = await (db as any)
    .from("tests")
    .update({ answers })
    .eq("id", testId);

  if (error) {
    console.error("Error updating test answers:", error);
    return false;
  }

  return true;
}

export async function completeTest(
  testId: string,
  score: number
): Promise<boolean> {
  if (!db) return false;

  const { error } = await (db as any)
    .from("tests")
    .update({
      score,
      completed_at: new Date().toISOString(),
    })
    .eq("id", testId);

  if (error) {
    console.error("Error completing test:", error);
    return false;
  }

  return true;
}

// Performance queries
export async function recordPerformance(
  performance: Omit<Performance, "id">
): Promise<boolean> {
  if (!db) return false;

  const { error } = await (db as any)
    .from("performance")
    .insert(performance);

  if (error) {
    console.error("Error recording performance:", error);
    return false;
  }

  return true;
}

export async function getCategoryPerformance(
  userId: string
): Promise<CategoryPerformance[]> {
  if (!db) return [];

  const { data, error } = await (db as any)
    .from("performance")
    .select("*")
    .eq("user_id", userId);

  if (error) {
    console.error("Error fetching category performance:", error);
    return [];
  }

  // Aggregate by category
  const categoryMap = new Map<string, { correct: number; total: number }>();

  data.forEach((record: Performance) => {
    const existing = categoryMap.get(record.category) || { correct: 0, total: 0 };
    categoryMap.set(record.category, {
      correct: existing.correct + record.correct_answers,
      total: existing.total + record.total_questions,
    });
  });

  return Array.from(categoryMap.entries()).map(([category, stats]) => ({
    category: category as any,
    correct_answers: stats.correct,
    total_questions: stats.total,
    percentage: (stats.correct / stats.total) * 100,
  }));
}

export async function getUserStats(userId: string): Promise<UserStats> {
  if (!db) {
    return {
      total_tests: 0,
      average_score: 0,
      total_questions_answered: 0,
      study_streak_days: 0,
      total_study_hours: 0,
    };
  }

  const { data: tests, error } = await (db as any)
    .from("tests")
    .select("*")
    .eq("user_id", userId)
    .not("completed_at", "is", null);

  if (error) {
    console.error("Error fetching user stats:", error);
    return {
      total_tests: 0,
      average_score: 0,
      total_questions_answered: 0,
      study_streak_days: 0,
      total_study_hours: 0,
    };
  }

  const total_tests = tests?.length || 0;
  const average_score = total_tests > 0
    ? tests.reduce((sum: number, t: Test) => sum + (t.score || 0), 0) / total_tests
    : 0;
  const total_questions_answered = tests?.reduce(
    (sum: number, t: Test) => sum + (t.questions?.length || 0),
    0
  ) || 0;

  // Calculate study streak
  // Sort tests by completion date descending
  const sortedTests = [...tests].sort((a, b) => 
    new Date(b.completed_at!).getTime() - new Date(a.completed_at!).getTime()
  );

  const uniqueDates = new Set<string>();
  sortedTests.forEach(test => {
    if (test.completed_at) {
      uniqueDates.add(new Date(test.completed_at).toISOString().split('T')[0]);
    }
  });

  const sortedDates = Array.from(uniqueDates);
  
  // Check if streak is active (test today or yesterday)
  const today = new Date().toISOString().split('T')[0];
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
  
  let streak = 0;
  
  if (sortedDates.length > 0 && (sortedDates[0] === today || sortedDates[0] === yesterday)) {
    streak = 1;
    // Check for consecutive days
    for (let i = 0; i < sortedDates.length - 1; i++) {
      const curr = new Date(sortedDates[i]);
      const prev = new Date(sortedDates[i+1]);
      const diffTime = Math.abs(curr.getTime() - prev.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays === 1) {
        streak++;
      } else {
        break;
      }
    }
  }

  // Calculate total study hours
  const total_milliseconds = tests.reduce((sum: number, t: Test) => {
    if (!t.completed_at || !t.created_at) return sum;
    
    const start = new Date(t.created_at).getTime();
    const end = new Date(t.completed_at).getTime();
    const duration = end - start;
    
    // Sanity check: duration between 1 minute and 6 hours
    if (duration > 60000 && duration < 21600000) {
      return sum + duration;
    }
    
    // Fallback: 72 seconds per question (average reading speed)
    const questionCount = t.questions?.length || 0;
    // If questions is not array (it's JSONB), fallback to 0 or generic estimate
    return sum + (questionCount * 72000); 
  }, 0);

  const total_study_hours = Math.round((total_milliseconds / (1000 * 60 * 60)) * 10) / 10;

  return {
    total_tests,
    average_score,
    total_questions_answered,
    study_streak_days: streak,
    total_study_hours,
  };
}

// Subscription and test limit queries
export async function getUserTestCount(userId: string): Promise<number> {
  if (!db) return 0;

  const { data, error } = await (db as any)
    .from("tests")
    .select("id")
    .eq("user_id", userId);

  if (error) {
    console.error("Error fetching test count:", error);
    return 0;
  }

  return data?.length || 0;
}

export async function getUserSubscriptionStatus(
  userId: string
): Promise<{ isSubscribed: boolean; status: string; testCount: number }> {
  if (!db) {
    return { isSubscribed: false, status: "inactive", testCount: 0 };
  }

  const [user, testCount] = await Promise.all([
    getUserById(userId),
    getUserTestCount(userId),
  ]);

  const isSubscribed = user?.subscription_status === "active";

  return {
    isSubscribed,
    status: user?.subscription_status || "inactive",
    testCount,
  };
}

export async function canUserCreateTest(userId: string): Promise<{
  allowed: boolean;
  reason?: string;
  testsUsed: number;
  testsLimit: number;
  isSubscribed: boolean;
}> {
  const { isSubscribed, testCount } = await getUserSubscriptionStatus(userId);

  // Subscribed users have unlimited tests
  if (isSubscribed) {
    return {
      allowed: true,
      testsUsed: testCount,
      testsLimit: Infinity,
      isSubscribed: true,
    };
  }

  // Free users limited to FREE_TIER_TEST_LIMIT tests
  if (testCount >= FREE_TIER_TEST_LIMIT) {
    return {
      allowed: false,
      reason: `Free tier limit reached. You've used ${testCount}/${FREE_TIER_TEST_LIMIT} tests. Upgrade to Pro for unlimited tests.`,
      testsUsed: testCount,
      testsLimit: FREE_TIER_TEST_LIMIT,
      isSubscribed: false,
    };
  }

  return {
    allowed: true,
    testsUsed: testCount,
    testsLimit: FREE_TIER_TEST_LIMIT,
    isSubscribed: false,
  };
}

