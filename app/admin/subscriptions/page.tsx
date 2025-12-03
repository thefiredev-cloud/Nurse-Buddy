import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { db } from "@/lib/supabase";
import { stripe } from "@/lib/stripe";
import { DollarSign, TrendingUp, Users, Calendar } from "lucide-react";

interface SubscriptionData {
  activeSubscriptions: number;
  monthlyRevenue: number;
  cancelledThisMonth: number;
  recentSubscribers: Array<{
    email: string;
    name: string;
    created_at: string;
  }>;
}

async function getSubscriptionData(): Promise<SubscriptionData> {
  const data: SubscriptionData = {
    activeSubscriptions: 0,
    monthlyRevenue: 0,
    cancelledThisMonth: 0,
    recentSubscribers: [],
  };

  if (!db) return data;

  try {
    // Get active subscribers from database
    const { data: activeUsers } = await (db as any)
      .from("users")
      .select("email, name, created_at, subscription_status")
      .eq("subscription_status", "active")
      .order("created_at", { ascending: false });

    data.activeSubscriptions = activeUsers?.length || 0;
    data.monthlyRevenue = data.activeSubscriptions * 35;
    data.recentSubscribers = (activeUsers || []).slice(0, 5);

    // Get cancelled users this month
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const { data: cancelledUsers } = await (db as any)
      .from("users")
      .select("id")
      .eq("subscription_status", "cancelled");

    data.cancelledThisMonth = cancelledUsers?.length || 0;

    return data;
  } catch (error) {
    console.error("Error fetching subscription data:", error);
    return data;
  }
}

export default async function AdminSubscriptionsPage() {
  const data = await getSubscriptionData();

  const stats = [
    {
      label: "Active Subscriptions",
      value: data.activeSubscriptions.toString(),
      icon: Users,
      color: "text-green-400",
      bg: "bg-green-500/20",
    },
    {
      label: "Monthly Revenue",
      value: `$${data.monthlyRevenue}`,
      icon: DollarSign,
      color: "text-yellow-400",
      bg: "bg-yellow-500/20",
    },
    {
      label: "Annual Revenue (projected)",
      value: `$${data.monthlyRevenue * 12}`,
      icon: TrendingUp,
      color: "text-blue-400",
      bg: "bg-blue-500/20",
    },
    {
      label: "Cancelled (all time)",
      value: data.cancelledThisMonth.toString(),
      icon: Calendar,
      color: "text-red-400",
      bg: "bg-red-500/20",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">Subscriptions</h2>
        <p className="text-gray-400">
          Monitor subscription metrics and revenue
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label} className="bg-gray-800 border-gray-700">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-400 mb-1">
                      {stat.label}
                    </p>
                    <p className="text-2xl font-bold text-white">
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

      {/* Recent Subscribers */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Recent Pro Subscribers</CardTitle>
        </CardHeader>
        <CardContent>
          {data.recentSubscribers.length === 0 ? (
            <p className="text-gray-500 text-center py-8">
              No subscribers yet
            </p>
          ) : (
            <div className="space-y-4">
              {data.recentSubscribers.map((subscriber, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 bg-gray-700/50 rounded-lg"
                >
                  <div>
                    <p className="text-white font-medium">{subscriber.name}</p>
                    <p className="text-sm text-gray-400">{subscriber.email}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-green-400 font-medium">$35/mo</p>
                    <p className="text-xs text-gray-500">
                      {new Date(subscriber.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Stripe Dashboard Link */}
      <Card className="bg-gray-800 border-gray-700">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium text-white mb-1">
                Stripe Dashboard
              </h3>
              <p className="text-sm text-gray-400">
                View detailed payment analytics and manage subscriptions
              </p>
            </div>
            <a
              href="https://dashboard.stripe.com/test/subscriptions"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition"
            >
              Open Stripe
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}




