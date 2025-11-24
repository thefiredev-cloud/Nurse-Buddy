import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getUserTests } from "@/lib/database/queries";
import { mockUser } from "@/lib/auth-mock";
import { auth } from "@clerk/nextjs/server";
import Link from "next/link";
import { Clock, Calendar, ArrowRight, BookOpen, CheckCircle2, PlayCircle } from "lucide-react";
import type { Test } from "@/lib/database/schema";

async function getUserId() {
  try {
    const { userId } = auth();
    if (userId) return userId;
  } catch (error) {
    // Clerk might not be configured
  }
  return mockUser.id;
}

export default async function HistoryPage() {
  const userId = await getUserId();
  const tests = await getUserTests(userId, 50); // Get more tests for history page

  const completedTests = tests.filter(t => t.completed_at);
  const inProgressTests = tests.filter(t => !t.completed_at);

  const getQuestionCount = (test: Test) => {
    if (Array.isArray(test.questions)) {
      return test.questions.length;
    }
    return 0;
  };

  const getAnsweredCount = (test: Test) => {
    if (test.answers && typeof test.answers === 'object') {
      return Object.keys(test.answers).length;
    }
    return 0;
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Test History</h2>
        <p className="text-gray-600">
          Review your past practice test attempts and results
        </p>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Total Tests</p>
                <p className="text-2xl font-bold text-gray-900">{tests.length}</p>
              </div>
              <BookOpen className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Completed</p>
                <p className="text-2xl font-bold text-gray-900">{completedTests.length}</p>
              </div>
              <CheckCircle2 className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">In Progress</p>
                <p className="text-2xl font-bold text-gray-900">{inProgressTests.length}</p>
              </div>
              <PlayCircle className="w-8 h-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Test List */}
      <Card>
        <CardHeader>
          <CardTitle>Your Test Attempts</CardTitle>
          <CardDescription>
            All your completed and in-progress tests (sorted by date, newest first)
          </CardDescription>
        </CardHeader>
        <CardContent>
          {tests.length > 0 ? (
            <div className="space-y-4">
              {tests.map((test) => {
                const isCompleted = !!test.completed_at;
                const questionCount = getQuestionCount(test);
                const answeredCount = getAnsweredCount(test);
                const progress = questionCount > 0 ? Math.round((answeredCount / questionCount) * 100) : 0;

                return (
                  <div 
                    key={test.id} 
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-100 hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center gap-4 flex-1">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                        isCompleted 
                          ? (test.score || 0) >= 75 ? 'bg-green-100 text-green-600' :
                            (test.score || 0) >= 60 ? 'bg-yellow-100 text-yellow-600' :
                            'bg-red-100 text-red-600'
                          : 'bg-blue-100 text-blue-600'
                      }`}>
                        {isCompleted ? (
                          <span className="font-bold text-sm">{test.score}%</span>
                        ) : (
                          <Clock className="w-6 h-6" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">
                          {isCompleted ? 'Completed Test' : 'In Progress'}
                        </p>
                        <div className="flex items-center text-xs text-gray-500 mt-1 gap-3">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {new Date(test.created_at).toLocaleDateString()}
                          </div>
                          <span>•</span>
                          <span>{questionCount} Questions</span>
                          {!isCompleted && (
                            <>
                              <span>•</span>
                              <span>{answeredCount} Answered ({progress}%)</span>
                            </>
                          )}
                        </div>
                        {!isCompleted && (
                          <div className="mt-2 w-full bg-gray-200 rounded-full h-1.5">
                            <div
                              className="bg-blue-600 h-1.5 rounded-full transition-all"
                              style={{ width: `${progress}%` }}
                            />
                          </div>
                        )}
                      </div>
                    </div>
                    <Link href={isCompleted ? `/dashboard/test/${test.id}/results` : `/dashboard/test/${test.id}`}>
                      <Button variant="ghost" size="sm">
                        {isCompleted ? 'View Results' : 'Resume'}
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </Link>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <BookOpen className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <p>No test history yet</p>
              <p className="text-sm mt-2">
                Complete tests to see your history here
              </p>
              <Link href="/dashboard/test/new" className="mt-4 inline-block">
                <Button>Start Your First Test</Button>
              </Link>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

