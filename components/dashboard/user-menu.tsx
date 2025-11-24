"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { User, LogOut, Menu, X } from "lucide-react";

export function UserMenu() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="flex items-center space-x-4">
      {/* Mobile Menu Toggle */}
      <button
        className="md:hidden"
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
      >
        {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* User Info */}
      <div className="hidden sm:flex items-center space-x-3">
        <div className="text-right">
          <p className="text-sm font-medium text-gray-900">Jane Doe</p>
          <p className="text-xs text-gray-500">student@example.com</p>
        </div>
        <div className="w-10 h-10 bg-nursing-blue rounded-full flex items-center justify-center">
          <User className="w-5 h-5 text-white" />
        </div>
      </div>

      {/* Logout Button */}
      <Button variant="ghost" size="sm" asChild>
        <a href="/sign-in">
          <LogOut className="w-4 h-4 mr-2" />
          Logout
        </a>
      </Button>
    </div>
  );
}

