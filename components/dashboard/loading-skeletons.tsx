import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export function StatCardSkeleton() {
  return (
    <Card>
      <CardContent className="p-3 sm:p-4 md:p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2 flex-1">
            <Skeleton className="h-3 sm:h-4 w-20" />
            <Skeleton className="h-6 sm:h-8 w-16" />
            <Skeleton className="h-2 sm:h-3 w-24" />
          </div>
          <Skeleton className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-lg shrink-0" />
        </div>
      </CardContent>
    </Card>
  );
}

export function ChartCardSkeleton() {
  return (
    <Card className="h-full">
      <CardHeader>
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-4 w-48 mt-1" />
      </CardHeader>
      <CardContent>
        <div className="h-48 sm:h-64 md:h-[300px] w-full flex items-end justify-around gap-2 px-4">
          {/* Fake bar chart skeleton */}
          {[40, 65, 45, 80, 55, 70, 50].map((h, i) => (
            <Skeleton key={i} className="w-6 sm:w-8 rounded-t" style={{ height: `${h}%` }} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export function RecentTestSkeleton() {
  return (
    <div className="flex items-center justify-between p-3 sm:p-4 bg-gray-50 rounded-lg">
      <div className="flex items-center gap-3 sm:gap-4">
        <Skeleton className="w-10 h-10 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-3 w-32" />
        </div>
      </div>
      <Skeleton className="h-9 w-20" />
    </div>
  );
}

export function QuickActionSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-4 w-48 mt-1" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-11 w-full" />
      </CardContent>
    </Card>
  );
}

export function DashboardLoadingSkeleton() {
  return (
    <div className="space-y-6">
      {/* Welcome skeleton */}
      <div>
        <Skeleton className="h-7 sm:h-8 w-48 mb-2" />
        <Skeleton className="h-4 sm:h-5 w-36" />
      </div>

      {/* Stats grid skeleton */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {[1, 2, 3, 4].map((i) => (
          <StatCardSkeleton key={i} />
        ))}
      </div>

      {/* Quick actions skeleton */}
      <div className="grid md:grid-cols-2 gap-4 sm:gap-6">
        {[1, 2].map((i) => (
          <QuickActionSkeleton key={i} />
        ))}
      </div>

      {/* Recent tests skeleton */}
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-28" />
          <Skeleton className="h-4 w-44 mt-1" />
        </CardHeader>
        <CardContent className="space-y-4">
          {[1, 2, 3].map((i) => (
            <RecentTestSkeleton key={i} />
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

export function PerformanceLoadingSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header skeleton */}
      <div>
        <Skeleton className="h-7 sm:h-8 w-48 mb-2" />
        <Skeleton className="h-4 sm:h-5 w-64" />
      </div>

      {/* Stats grid skeleton */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {[1, 2, 3, 4].map((i) => (
          <StatCardSkeleton key={i} />
        ))}
      </div>

      {/* Charts skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <ChartCardSkeleton />
        <ChartCardSkeleton />
      </div>
    </div>
  );
}
