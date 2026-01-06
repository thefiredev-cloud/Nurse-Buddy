"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Home,
  FileText,
  Settings,
  BookOpen,
  Upload,
  BarChart2,
  CreditCard,
  Crown,
  Shield,
  Menu,
} from "lucide-react";
import { useUser } from "@clerk/nextjs";
import { isAdmin } from "@/lib/auth/admin";

// Navigation items shared with sidebar
const navigationItems = [
  { name: "Dashboard", href: "/dashboard", icon: Home },
  { name: "New Test", href: "/dashboard/test/new", icon: BookOpen },
  { name: "My Materials", href: "/dashboard/uploads", icon: Upload },
  { name: "Test History", href: "/dashboard/history", icon: FileText },
  { name: "Performance", href: "/dashboard/performance", icon: BarChart2 },
  { name: "Subscription", href: "/dashboard/subscription", icon: CreditCard },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
];

export function MobileNav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const { user } = useUser();
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [testsUsed, setTestsUsed] = useState(0);
  const [testsLimit, setTestsLimit] = useState(2);

  const userEmail = user?.primaryEmailAddress?.emailAddress;
  const userIsAdmin = isAdmin(userEmail);

  // Close sheet on navigation
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Fetch subscription status
  useEffect(() => {
    const fetchSubscription = async () => {
      try {
        const response = await fetch("/api/subscription/status");
        if (response.ok) {
          const data = await response.json();
          setIsSubscribed(data.isSubscribed);
          setTestsUsed(data.testsUsed);
          if (data.testsLimit !== "unlimited") {
            setTestsLimit(data.testsLimit);
          }
        }
      } catch {
        // Silent fail - will show free tier by default
      }
    };
    fetchSubscription();
  }, []);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <button
          className="md:hidden p-2 -ml-2 rounded-lg hover:bg-gray-100 transition-colors"
          aria-label="Open navigation menu"
        >
          <Menu className="h-6 w-6 text-gray-700" />
        </button>
      </SheetTrigger>
      <SheetContent side="left" className="w-72 p-0 flex flex-col">
        {/* Header with Logo */}
        <SheetHeader className="p-6 border-b">
          <SheetTitle className="flex items-center gap-2">
            <span className="text-xl font-bold text-nursing-blue">Nurse Buddy</span>
            {isSubscribed && (
              <span className="px-1.5 py-0.5 bg-yellow-100 text-yellow-800 text-xs font-medium rounded">
                PRO
              </span>
            )}
          </SheetTitle>
        </SheetHeader>

        {/* Navigation Links */}
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              pathname === item.href ||
              (item.href !== "/dashboard" && pathname.startsWith(item.href));

            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center space-x-3 px-4 py-3 rounded-lg transition",
                  isActive
                    ? "bg-nursing-blue text-white"
                    : "text-gray-700 hover:bg-gray-100"
                )}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.name}</span>
                {item.name === "Subscription" && isSubscribed && (
                  <Crown className="w-4 h-4 text-yellow-500 ml-auto" />
                )}
              </Link>
            );
          })}

          {/* Admin Link - Only visible to admin */}
          {userIsAdmin && (
            <Link
              href="/admin"
              className={cn(
                "flex items-center space-x-3 px-4 py-3 rounded-lg transition mt-4 border-t pt-6",
                pathname.startsWith("/admin")
                  ? "bg-red-600 text-white"
                  : "text-red-600 hover:bg-red-50"
              )}
            >
              <Shield className="w-5 h-5" />
              <span className="font-medium">Admin Panel</span>
            </Link>
          )}
        </nav>

        {/* Subscription Status Footer */}
        <div className="p-4 border-t mt-auto">
          {isSubscribed ? (
            <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-4 rounded-lg border border-yellow-200">
              <div className="flex items-center gap-2 mb-1">
                <Crown className="w-4 h-4 text-yellow-600" />
                <p className="text-sm font-medium text-gray-900">Pro Active</p>
              </div>
              <p className="text-xs text-gray-600">Unlimited practice tests</p>
            </div>
          ) : (
            <Link href="/dashboard/subscription" onClick={() => setOpen(false)}>
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg border border-blue-200 hover:border-blue-300 transition cursor-pointer">
                <p className="text-sm font-medium text-gray-900 mb-1">Free Plan</p>
                <p className="text-xs text-gray-600 mb-2">
                  {testsUsed}/{testsLimit} tests used
                </p>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                    style={{
                      width: `${Math.min((testsUsed / testsLimit) * 100, 100)}%`,
                    }}
                  />
                </div>
                <p className="text-xs text-blue-600 font-medium mt-2">
                  Upgrade to Pro &rarr;
                </p>
              </div>
            </Link>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
