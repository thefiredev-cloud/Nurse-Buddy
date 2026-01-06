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
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card key={stat.label}>
            <CardContent className="p-3 sm:p-4 md:p-6">
              <div className="flex items-center justify-between">
                <div className="min-w-0 flex-1">
                  <p className="text-xs sm:text-sm font-medium text-gray-600 mb-1 truncate">
                    {stat.label}
                  </p>
                  <div className="flex items-baseline gap-2">
                    <p className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900">
                      {stat.value}
                    </p>
                  </div>
                  <p className="text-[10px] sm:text-xs text-gray-500 mt-1 truncate">
                    {stat.subtext}
                  </p>
                </div>
                <div className={`w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 ${stat.bg} rounded-lg flex items-center justify-center shrink-0 ml-2`}>
                  <Icon className={`w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}



