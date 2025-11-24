import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { AlertTriangle, CheckCircle2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { CategoryPerformance } from "@/lib/database/schema";

interface WeakTopicsProps {
  data: CategoryPerformance[];
}

export function WeakTopics({ data }: WeakTopicsProps) {
  const weakAreas = data
    .filter((item) => item.percentage < 60)
    .sort((a, b) => a.percentage - b.percentage);

  const strongAreas = data
    .filter((item) => item.percentage >= 60)
    .sort((a, b) => b.percentage - a.percentage);

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle>Study Recommendations</CardTitle>
        <CardDescription>Focus areas based on your performance</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col gap-4">
        {weakAreas.length > 0 ? (
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-red-600 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              Needs Improvement
            </h4>
            {weakAreas.map((area) => (
              <div
                key={area.category}
                className="p-3 bg-red-50 border border-red-100 rounded-lg"
              >
                <div className="flex justify-between items-start mb-1">
                  <span className="font-medium text-red-900 text-sm">
                    {area.category}
                  </span>
                  <span className="text-xs font-bold text-red-700 bg-white px-2 py-0.5 rounded-full border border-red-200">
                    {Math.round(area.percentage)}%
                  </span>
                </div>
                <div className="w-full bg-red-200 h-1.5 rounded-full mt-2">
                  <div
                    className="bg-red-500 h-1.5 rounded-full"
                    style={{ width: `${area.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        ) : data.length > 0 ? (
          <div className="p-4 bg-green-50 border border-green-100 rounded-lg text-center">
            <CheckCircle2 className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <p className="text-green-900 font-medium">Great job!</p>
            <p className="text-sm text-green-700">
              You're performing well in all categories.
            </p>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            Complete more tests to identify weak areas.
          </div>
        )}

        <div className="mt-auto pt-4">
          <Link href="/dashboard/test/new">
            <Button className="w-full" variant="outline">
              Practice Specific Topics
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}



