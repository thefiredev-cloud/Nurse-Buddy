import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { BookOpen, TrendingUp, Clock, Target, ArrowRight, Calendar, Crown, Zap } from "lucide-react";
import { getUserStats, getUserTests, getUserSubscriptionStatus, FREE_TIER_TEST_LIMIT } from "@/lib/database/queries";
import { mockUser } from "@/lib/auth-mock";
import { auth, currentUser } from "@clerk/nextjs/server";

async function getUserData() {
  try {
    const user = await currentUser();
    const { userId } = auth();
    if (user && userId) {
      return {
        id: userId,
        firstName: user.firstName || "Nurse",
      };
    }
  } catch (error) {
    // Fallback to mock
  }
  return {
    id: mockUser.id,
    firstName: mockUser.firstName,
  };
}

export default async function DashboardPage() {
  const user = await getUserData();
  
  const [stats, recentTests, subscriptionStatus] = await Promise.all([
    getUserStats(user.id),
    getUserTests(user.id, 5),
    getUserSubscriptionStatus(user.id),
  ]);

  const statCards = [
    {
      label: "Tests Taken",
      value: stats.total_tests.toString(),
      icon: BookOpen,
      color: "text-blue-600",
      bg: "bg-blue-100",
    },
    {
      label: "Average Score",
      value: `${Math.round(stats.average_score)}%`,
      icon: Target,
      color: stats.average_score >= 60 ? "text-green-600" : "text-yellow-600",
      bg: stats.average_score >= 60 ? "bg-green-100" : "bg-yellow-100",
    },
    {
      label: "Study Streak",
      value: `${stats.study_streak_days} days`,
      icon: TrendingUp,
      color: "text-purple-600",
      bg: "bg-purple-100",
    },
    {
      label: "Study Time",
      value: `${stats.total_study_hours}h`,
      icon: Clock,
      color: "text-orange-600",
      bg: "bg-orange-100",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          Welcome Back, {user.firstName}!
        </h2>
        <p className="text-gray-600">
          Ready to continue your NCLEX preparation?
        </p>
      </div>

      {/* Subscription Status Card */}
      {!subscriptionStatus.isSubscribed && (
        <Card className="border-blue-200 bg-gradient-to-r from-blue-50 to-purple-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Zap className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">
                    Free Plan: {subscriptionStatus.testCount}/{FREE_TIER_TEST_LIMIT} tests used
                  </p>
                  <p className="text-sm text-gray-600">
                    {subscriptionStatus.testCount < FREE_TIER_TEST_LIMIT 
                      ? `${FREE_TIER_TEST_LIMIT - subscriptionStatus.testCount} free tests remaining`
                      : "Upgrade for unlimited tests"
                    }
                  </p>
                </div>
              </div>
              <Link href="/dashboard/subscription">
                <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                  <Crown className="w-4 h-4 mr-2" />
                  Upgrade to Pro
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      )}

      {subscriptionStatus.isSubscribed && (
        <Card className="border-yellow-200 bg-gradient-to-r from-yellow-50 to-orange-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <Crown className="w-6 h-6 text-yellow-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Pro Plan Active</p>
                  <p className="text-sm text-gray-600">
                    Unlimited tests • {subscriptionStatus.testCount} tests taken
                  </p>
                </div>
              </div>
              <Link href="/dashboard/subscription">
                <Button variant="outline">
                  Manage Subscription
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">
                      {stat.label}
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {stat.value}
                    </p>
                  </div>
                  <div className={`w-12 h-12 ${stat.bg} rounded-lg flex items-center justify-center`}>
                    <Icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Start New Test</CardTitle>
            <CardDescription>
              Take a 100-question NCLEX-style practice exam
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/dashboard/test/new">
              <Button size="lg" className="w-full">
                Begin Practice Test
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Review Performance</CardTitle>
            <CardDescription>
              Analyze your progress and identify weak areas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/dashboard/performance">
              <Button variant="outline" size="lg" className="w-full">
                View Analytics
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Tests</CardTitle>
          <CardDescription>
            Your latest practice test attempts
          </CardDescription>
        </CardHeader>
        <CardContent>
          {recentTests.length > 0 ? (
            <div className="space-y-4">
              {recentTests.map((test) => (
                <div 
                  key={test.id} 
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-100"
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      test.completed_at 
                        ? (test.score || 0) >= 60 ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                        : 'bg-blue-100 text-blue-600'
                    }`}>
                      {test.completed_at ? (
                        <span className="font-bold text-sm">{test.score}%</span>
                      ) : (
                        <Clock className="w-5 h-5" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        {test.completed_at ? 'Completed Test' : 'In Progress'}
                      </p>
                      <div className="flex items-center text-xs text-gray-500 mt-1 gap-2">
                        <Calendar className="w-3 h-3" />
                        {new Date(test.created_at).toLocaleDateString()}
                        <span>•</span>
                        <span>
                          {Array.isArray(test.questions) 
                            ? test.questions.length 
                            : (test.questions && typeof test.questions === 'object' 
                              ? Object.keys(test.questions).length 
                              : 0)} Questions
                        </span>
                        {!test.completed_at && test.answers && typeof test.answers === 'object' && (
                          <>
                            <span>•</span>
                            <span>{Object.keys(test.answers).length} Answered</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  <Link href={test.completed_at ? `/dashboard/test/${test.id}/results` : `/dashboard/test/${test.id}`}>
                    <Button variant="ghost" size="sm">
                      {test.completed_at ? 'View Results' : 'Resume'}
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <BookOpen className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <p>No tests taken yet</p>
              <p className="text-sm mt-2">
                Start your first practice test to see results here
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
