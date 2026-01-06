import { getUserStats, getCategoryPerformance, getUserTests } from "@/lib/database/queries";
import { mockUser } from "@/lib/auth-mock";
import { ScoreCard } from "@/components/analytics/score-card";
import { CategoryRadar } from "@/components/analytics/category-radar";
import { PerformanceTrend } from "@/components/analytics/performance-trend";
import { WeakTopics } from "@/components/analytics/weak-topics";
import { auth } from "@clerk/nextjs/server";

export const dynamic = 'force-dynamic';

async function getUserId() {
  try {
    const { userId } = auth();
    if (userId) return userId;
  } catch (error) {
    // Clerk might not be configured or throw in dev
  }
  return mockUser.id;
}

export default async function PerformancePage() {
  const userId = await getUserId();
  
  const [stats, categoryPerformance, recentTests] = await Promise.all([
    getUserStats(userId),
    getCategoryPerformance(userId),
    getUserTests(userId, 10)
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-900">Performance Analytics</h2>
        <p className="text-gray-500 mt-1">
          Track your progress and identify areas for improvement
        </p>
      </div>

      {/* Key Metrics */}
      <ScoreCard
        averageScore={stats.average_score}
        totalTests={stats.total_tests}
        streakDays={stats.study_streak_days}
        studyHours={stats.total_study_hours}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[400px]">
        {/* Category Breakdown Radar */}
        <CategoryRadar data={categoryPerformance} />

        {/* Score Trend Line */}
        <PerformanceTrend tests={recentTests} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weak Areas */}
        <WeakTopics data={categoryPerformance} />
        
        {/* Placeholder for future component or detailed list */}
        {/* We can reuse PerformanceTrend for now or leave empty if not needed */}
      </div>
    </div>
  );
}



