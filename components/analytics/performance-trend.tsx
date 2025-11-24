"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Test } from "@/lib/database/schema";

interface PerformanceTrendProps {
  tests: Test[];
}

export function PerformanceTrend({ tests }: PerformanceTrendProps) {
  // Prepare data: sort by date asc, take last 10, format date
  const chartData = [...tests]
    .filter((t) => t.completed_at && t.score !== null)
    .sort((a, b) => new Date(a.completed_at!).getTime() - new Date(b.completed_at!).getTime())
    .slice(-10)
    .map((t) => ({
      date: new Date(t.completed_at!).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
      score: t.score,
    }));

  if (chartData.length === 0) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle>Score Trend</CardTitle>
          <CardDescription>Your progress over the last 10 tests</CardDescription>
        </CardHeader>
        <CardContent className="h-[300px] flex items-center justify-center text-gray-500">
          No completed tests yet
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Score Trend</CardTitle>
        <CardDescription>Your progress over the last 10 tests</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{
                top: 5,
                right: 10,
                left: 0,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
              <XAxis 
                dataKey="date" 
                tick={{ fill: "#6b7280", fontSize: 12 }} 
                tickLine={false}
                axisLine={false}
              />
              <YAxis 
                domain={[0, 100]} 
                tick={{ fill: "#6b7280", fontSize: 12 }}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `${value}%`}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: "#fff", 
                  borderRadius: "8px", 
                  border: "1px solid #e5e7eb",
                  boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)"
                }}
              />
              <Line
                type="monotone"
                dataKey="score"
                stroke="#2563eb"
                strokeWidth={2}
                activeDot={{ r: 6, fill: "#2563eb" }}
                dot={{ r: 4, fill: "#fff", stroke: "#2563eb", strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}



