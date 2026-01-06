"use client";

import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { CategoryPerformance } from "@/lib/database/schema";

interface CategoryRadarProps {
  data: CategoryPerformance[];
}

export function CategoryRadar({ data }: CategoryRadarProps) {
  // Transform data for the chart
  const chartData = data.map((item) => ({
    category: item.category.split(" ")[0], // Shorten name for display
    fullCategory: item.category,
    score: Math.round(item.percentage),
    fullMark: 100,
  }));

  if (data.length === 0) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle>Category Performance</CardTitle>
          <CardDescription>Performance breakdown by nursing category</CardDescription>
        </CardHeader>
        <CardContent className="h-48 sm:h-64 md:h-[300px] flex items-center justify-center text-gray-500">
          Not enough data yet
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Category Performance</CardTitle>
        <CardDescription>Performance breakdown by nursing category</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-48 sm:h-64 md:h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData}>
              <PolarGrid stroke="#e5e7eb" />
              <PolarAngleAxis
                dataKey="category"
                tick={{ fill: "#4b5563", fontSize: 12 }}
              />
              <PolarRadiusAxis
                angle={30}
                domain={[0, 100]}
                tick={{ fill: "#9ca3af", fontSize: 10 }}
              />
              <Radar
                name="Score"
                dataKey="score"
                stroke="#2563eb"
                fill="#3b82f6"
                fillOpacity={0.6}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-white p-2 border rounded shadow-sm text-sm">
                        <p className="font-bold">{data.fullCategory}</p>
                        <p className="text-blue-600">Score: {data.score}%</p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}



