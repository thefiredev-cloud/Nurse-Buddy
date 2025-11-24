"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useState } from "react";

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 w-full bg-white/95 backdrop-blur-sm z-50 border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="text-2xl font-bold text-nursing-blue">
              Nurse Buddy
            </div>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="#features" className="text-gray-700 hover:text-nursing-blue transition">
              Features
            </Link>
            <Link href="#how-it-works" className="text-gray-700 hover:text-nursing-blue transition">
              How It Works
            </Link>
            <Link href="#pricing" className="text-gray-700 hover:text-nursing-blue transition">
              Pricing
            </Link>
            <Link href="#faqs" className="text-gray-700 hover:text-nursing-blue transition">
              FAQs
            </Link>
          </div>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <Link href="/sign-in">
              <Button variant="ghost">Sign In</Button>
            </Link>
            <Link href="/sign-up">
              <Button>Start Learning</Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 space-y-4">
            <Link
              href="#features"
              className="block text-gray-700 hover:text-nursing-blue transition"
              onClick={() => setMobileMenuOpen(false)}
            >
              Features
            </Link>
            <Link
              href="#how-it-works"
              className="block text-gray-700 hover:text-nursing-blue transition"
              onClick={() => setMobileMenuOpen(false)}
            >
              How It Works
            </Link>
            <Link
              href="#pricing"
              className="block text-gray-700 hover:text-nursing-blue transition"
              onClick={() => setMobileMenuOpen(false)}
            >
              Pricing
            </Link>
            <Link
              href="#faqs"
              className="block text-gray-700 hover:text-nursing-blue transition"
              onClick={() => setMobileMenuOpen(false)}
            >
              FAQs
            </Link>
            <div className="space-y-2 pt-4">
              <Link href="/sign-in">
                <Button variant="outline" className="w-full">
                  Sign In
                </Button>
              </Link>
              <Link href="/sign-up">
                <Button className="w-full">Start Learning</Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

