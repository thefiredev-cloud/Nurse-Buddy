"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Crown, User, Search, ExternalLink } from "lucide-react";
import type { AdminUser } from "./page";

interface UserTableProps {
  users: AdminUser[];
}

export function UserTable({ users }: UserTableProps) {
  const [search, setSearch] = useState("");

  const filteredUsers = users.filter(
    (user) =>
      user.email.toLowerCase().includes(search.toLowerCase()) ||
      user.name.toLowerCase().includes(search.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return (
          <span className="px-2 py-1 text-xs font-medium bg-green-500/20 text-green-400 rounded">
            Pro
          </span>
        );
      case "cancelled":
        return (
          <span className="px-2 py-1 text-xs font-medium bg-red-500/20 text-red-400 rounded">
            Cancelled
          </span>
        );
      case "past_due":
        return (
          <span className="px-2 py-1 text-xs font-medium bg-yellow-500/20 text-yellow-400 rounded">
            Past Due
          </span>
        );
      default:
        return (
          <span className="px-2 py-1 text-xs font-medium bg-gray-500/20 text-gray-400 rounded">
            Free
          </span>
        );
    }
  };

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
        <input
          type="text"
          placeholder="Search by email or name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-700">
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">
                User
              </th>
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">
                Status
              </th>
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">
                Tests
              </th>
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">
                Joined
              </th>
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-8 text-center text-gray-500">
                  No users found
                </td>
              </tr>
            ) : (
              filteredUsers.map((user) => (
                <tr
                  key={user.id}
                  className="border-b border-gray-700/50 hover:bg-gray-700/30"
                >
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-600 rounded-full flex items-center justify-center">
                        {user.subscription_status === "active" ? (
                          <Crown className="w-5 h-5 text-yellow-400" />
                        ) : (
                          <User className="w-5 h-5 text-gray-400" />
                        )}
                      </div>
                      <div>
                        <p className="text-white font-medium">{user.name}</p>
                        <p className="text-sm text-gray-400">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    {getStatusBadge(user.subscription_status)}
                  </td>
                  <td className="py-4 px-4 text-white">
                    {user.test_count}
                  </td>
                  <td className="py-4 px-4 text-gray-400 text-sm">
                    {new Date(user.created_at).toLocaleDateString()}
                  </td>
                  <td className="py-4 px-4">
                    {user.stripe_customer_id && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-blue-400 hover:text-blue-300"
                        onClick={() => {
                          window.open(
                            `https://dashboard.stripe.com/test/customers/${user.stripe_customer_id}`,
                            "_blank"
                          );
                        }}
                      >
                        <ExternalLink className="w-4 h-4 mr-1" />
                        Stripe
                      </Button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Summary */}
      <div className="flex justify-between items-center pt-4 border-t border-gray-700">
        <span className="text-sm text-gray-400">
          Showing {filteredUsers.length} of {users.length} users
        </span>
      </div>
    </div>
  );
}

