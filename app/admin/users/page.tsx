import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { db } from "@/lib/supabase";
import { UserTable } from "./user-table";

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  subscription_status: string;
  stripe_customer_id: string | null;
  created_at: string;
  test_count: number;
}

async function getUsers(): Promise<AdminUser[]> {
  if (!db) {
    return [];
  }

  try {
    // Get all users
    const { data: users, error } = await (db as any)
      .from("users")
      .select("*")
      .order("created_at", { ascending: false });

    if (error || !users) {
      console.error("Error fetching users:", error);
      return [];
    }

    // Get test counts for each user
    const userIds = users.map((u: any) => u.id);
    const { data: tests } = await (db as any)
      .from("tests")
      .select("user_id");

    // Count tests per user
    const testCounts = new Map<string, number>();
    tests?.forEach((t: any) => {
      testCounts.set(t.user_id, (testCounts.get(t.user_id) || 0) + 1);
    });

    return users.map((user: any) => ({
      id: user.id,
      email: user.email,
      name: user.name,
      subscription_status: user.subscription_status || "inactive",
      stripe_customer_id: user.stripe_customer_id,
      created_at: user.created_at,
      test_count: testCounts.get(user.id) || 0,
    }));
  } catch (error) {
    console.error("Error fetching users:", error);
    return [];
  }
}

export default async function AdminUsersPage() {
  const users = await getUsers();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">User Management</h2>
        <p className="text-gray-400">
          View and manage all registered users
        </p>
      </div>

      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">
            All Users ({users.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <UserTable users={users} />
        </CardContent>
      </Card>
    </div>
  );
}




