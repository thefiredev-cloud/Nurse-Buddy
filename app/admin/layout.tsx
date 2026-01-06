import { redirect } from "next/navigation";
import { currentUser } from "@clerk/nextjs/server";
import { isAdmin } from "@/lib/auth/admin";
import Link from "next/link";
import { 
  LayoutDashboard, 
  Users, 
  CreditCard, 
  ArrowLeft,
  Shield
} from "lucide-react";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await currentUser();

  // Check if user is authenticated
  if (!user) {
    redirect("/sign-in");
  }

  // Check if user is admin
  const userEmail = user.primaryEmailAddress?.emailAddress;
  if (!isAdmin(userEmail)) {
    redirect("/dashboard");
  }

  const navigation = [
    { name: "Overview", href: "/admin", icon: LayoutDashboard },
    { name: "Users", href: "/admin/users", icon: Users },
    { name: "Subscriptions", href: "/admin/subscriptions", icon: CreditCard },
  ];

  return (
    <div className="flex h-screen bg-gray-900">
      {/* Admin Sidebar */}
      <div className="flex flex-col w-64 bg-gray-800 border-r border-gray-700">
        {/* Logo */}
        <div className="h-16 flex items-center px-6 border-b border-gray-700">
          <div className="flex items-center gap-2">
            <Shield className="w-6 h-6 text-red-500" />
            <span className="text-xl font-bold text-white">Admin Panel</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2">
          {navigation.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                className="flex items-center space-x-3 px-4 py-3 rounded-lg transition text-gray-300 hover:bg-gray-700 hover:text-white"
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Back to Dashboard */}
        <div className="p-4 border-t border-gray-700">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 text-gray-400 hover:text-white transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">Back to Dashboard</span>
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-gray-800 border-b border-gray-700 flex items-center justify-between px-6">
          <h1 className="text-xl font-semibold text-white">
            Nurse Buddy Admin
          </h1>
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-400">{userEmail}</span>
            <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-medium">
                {user.firstName?.charAt(0) || "A"}
              </span>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6 bg-gray-900">
          {children}
        </main>
      </div>
    </div>
  );
}






