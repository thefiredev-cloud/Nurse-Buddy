import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Target, BookOpen, TrendingUp, Clock } from "lucide-react";

interface ScoreCardProps {
  averageScore: number;
  totalTests: number;
  streakDays: number;
  studyHours: number;
}

export function ScoreCard({ averageScore, totalTests, streakDays, studyHours }: ScoreCardProps) {
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

  const stats = [
    {
      label: "Average Score",
      value: `${Math.round(averageScore)}%`,
      icon: Target,
      color: getScoreColor(averageScore),
      bg: getScoreBg(averageScore),
      subtext: averageScore >= 60 ? "Passing Range" : "Needs Improvement"
    },
    {
      label: "Tests Taken",
      value: totalTests.toString(),
      icon: BookOpen,
      color: "text-blue-600",
      bg: "bg-blue-100",
      subtext: "Lifetime Total"
    },
    {
      label: "Study Streak",
      value: `${streakDays} Days`,
      icon: TrendingUp,
      color: "text-purple-600",
      bg: "bg-purple-100",
      subtext: "Keep it up!"
    },
    {
      label: "Study Time",
      value: `${studyHours}h`,
      icon: Clock,
      color: "text-orange-600",
      bg: "bg-orange-100",
      subtext: "Total Hours"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card key={stat.label}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">
                    {stat.label}
                  </p>
                  <div className="flex items-baseline gap-2">
                    <p className="text-2xl font-bold text-gray-900">
                      {stat.value}
                    </p>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {stat.subtext}
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
  );
}



