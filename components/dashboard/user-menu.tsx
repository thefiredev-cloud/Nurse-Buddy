"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { User, LogOut, Menu, X } from "lucide-react";
import { useUser, SignOutButton } from "@clerk/nextjs";
import { mockUser } from "@/lib/auth-mock";

export function UserMenu() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Try to get Clerk user, fallback to mock
  let userName = mockUser.fullName;
  let userEmail = mockUser.email;
  let userImage: string | null = null;
  let isClerkLoaded = false;

  try {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const { user, isLoaded } = useUser();
    isClerkLoaded = isLoaded;
    if (user) {
      userName = user.fullName || `${user.firstName || ''} ${user.lastName || ''}`.trim() || "User";
      userEmail = user.primaryEmailAddress?.emailAddress || "";
      userImage = user.imageUrl || null;
    }
  } catch {
    // Clerk not configured, use mock
  }

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
          <p className="text-sm font-medium text-gray-900">{userName}</p>
          <p className="text-xs text-gray-500">{userEmail}</p>
        </div>
        {userImage ? (
          <Image 
            src={userImage} 
            alt={userName}
            width={40}
            height={40}
            className="rounded-full object-cover"
          />
        ) : (
        <div className="w-10 h-10 bg-nursing-blue rounded-full flex items-center justify-center">
          <User className="w-5 h-5 text-white" />
        </div>
        )}
      </div>

      {/* Logout Button */}
      {isClerkLoaded ? (
        <SignOutButton redirectUrl="/sign-in">
          <Button variant="ghost" size="sm">
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </SignOutButton>
      ) : (
      <Button variant="ghost" size="sm" asChild>
        <a href="/sign-in">
          <LogOut className="w-4 h-4 mr-2" />
          Logout
        </a>
      </Button>
      )}
    </div>
  );
}

