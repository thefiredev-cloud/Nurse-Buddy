"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Menu, X, Sparkles } from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

/**
 * Navbar Component - SEO-Optimized Navigation
 * Includes glassmorphism design, improved mobile experience, and accessibility
 */
export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Handle scroll for navbar background effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { href: "#features", label: "Features" },
    { href: "#how-it-works", label: "How It Works" },
    { href: "#pricing", label: "Pricing" },
    { href: "#faqs", label: "FAQs" },
  ];

  return (
    <nav
      className={cn(
        "fixed top-0 w-full z-50 transition-all duration-300",
        scrolled
          ? "glass border-b border-white/20 shadow-soft"
          : "bg-transparent"
      )}
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="container-wide">
        <div className="flex justify-between items-center h-16 md:h-18">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 group"
            aria-label="Nurse Buddy - Home"
          >
            <div className="w-9 h-9 bg-gradient-to-br from-nursing-blue-500 to-nursing-purple-500 rounded-lg flex items-center justify-center shadow-md group-hover:shadow-glow-blue transition-all duration-300">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-nursing-blue-600 group-hover:text-nursing-blue-700 transition-colors">
              Nurse Buddy
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-4 py-2 text-gray-700 hover:text-nursing-blue-600 font-medium rounded-lg hover:bg-nursing-blue-50 transition-all duration-200"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* CTA Buttons - Desktop */}
          <div className="hidden md:flex items-center gap-3">
            <Link href="/sign-in">
              <Button variant="ghost" size="default">
                Sign In
              </Button>
            </Link>
            <Link href="/sign-up">
              <Button variant="default" size="default" className="shadow-md">
                Start Learning
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-nursing-blue-50 transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-menu"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6 text-gray-700" />
            ) : (
              <Menu className="w-6 h-6 text-gray-700" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        <div
          id="mobile-menu"
          className={cn(
            "md:hidden absolute top-full left-0 right-0 glass-card border-t border-white/20 transition-all duration-300 ease-in-out",
            mobileMenuOpen
              ? "opacity-100 translate-y-0 visible"
              : "opacity-0 -translate-y-4 invisible"
          )}
        >
          <div className="container-wide py-4 space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block px-4 py-3 text-gray-700 hover:text-nursing-blue-600 hover:bg-nursing-blue-50 rounded-lg font-medium transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}

            <div className="pt-4 space-y-3 border-t border-gray-100">
              <Link href="/sign-in" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="outline" className="w-full" size="lg">
                  Sign In
                </Button>
              </Link>
              <Link href="/sign-up" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="default" className="w-full" size="lg">
                  Start Learning
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
