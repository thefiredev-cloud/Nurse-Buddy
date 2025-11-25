import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, CreditCard, FileText, DollarSign } from "lucide-react";
import { db } from "@/lib/supabase";

async function getAdminStats() {
  if (!db) {
    return {
      totalUsers: 0,
      activeSubscribers: 0,
      totalTests: 0,
      monthlyRevenue: 0,
    };
  }

  try {
    // Get total users
    const { data: users } = await (db as any)
      .from("users")
      .select("id, subscription_status");

    const totalUsers = users?.length || 0;
    const activeSubscribers = users?.filter(
      (u: any) => u.subscription_status === "active"
    ).length || 0;

    // Get total tests
    const { data: tests } = await (db as any)
      .from("tests")
      .select("id");

    const totalTests = tests?.length || 0;

    // Calculate monthly revenue (active subscribers * $35)
    const monthlyRevenue = activeSubscribers * 35;

    return {
      totalUsers,
      activeSubscribers,
      totalTests,
      monthlyRevenue,
    };
  } catch (error) {
    console.error("Error fetching admin stats:", error);
    return {
      totalUsers: 0,
      activeSubscribers: 0,
      totalTests: 0,
      monthlyRevenue: 0,
    };
  }
}

export default async function AdminDashboard() {
  const stats = await getAdminStats();

  const statCards = [
    {
      label: "Total Users",
      value: stats.totalUsers.toString(),
      icon: Users,
      color: "text-blue-400",
      bg: "bg-blue-500/20",
    },
    {
      label: "Active Subscribers",
      value: stats.activeSubscribers.toString(),
      icon: CreditCard,
      color: "text-green-400",
      bg: "bg-green-500/20",
    },
    {
      label: "Total Tests",
      value: stats.totalTests.toString(),
      icon: FileText,
      color: "text-purple-400",
      bg: "bg-purple-500/20",
    },
    {
      label: "Monthly Revenue",
      value: `$${stats.monthlyRevenue}`,
      icon: DollarSign,
      color: "text-yellow-400",
      bg: "bg-yellow-500/20",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">Dashboard Overview</h2>
        <p className="text-gray-400">
          Monitor your platform metrics and manage users
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label} className="bg-gray-800 border-gray-700">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-400 mb-1">
                      {stat.label}
                    </p>
                    <p className="text-3xl font-bold text-white">
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

      {/* Quick Stats */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Subscription Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Free Users</span>
                <span className="text-white font-medium">
                  {stats.totalUsers - stats.activeSubscribers}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Pro Users</span>
                <span className="text-green-400 font-medium">
                  {stats.activeSubscribers}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Conversion Rate</span>
                <span className="text-yellow-400 font-medium">
                  {stats.totalUsers > 0 
                    ? `${Math.round((stats.activeSubscribers / stats.totalUsers) * 100)}%`
                    : "0%"
                  }
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Platform Usage</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Tests Created</span>
                <span className="text-white font-medium">{stats.totalTests}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Avg Tests/User</span>
                <span className="text-white font-medium">
                  {stats.totalUsers > 0 
                    ? (stats.totalTests / stats.totalUsers).toFixed(1)
                    : "0"
                  }
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Questions Generated</span>
                <span className="text-purple-400 font-medium">
                  {stats.totalTests * 100}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

