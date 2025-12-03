import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

/**
 * Enhanced Button Component with SEO-optimized healthcare branding
 * Includes micro-interactions for improved UX and conversion
 */
const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-semibold ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-nursing-blue-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]",
  {
    variants: {
      variant: {
        // Primary action - main CTA buttons
        default:
          "bg-nursing-blue-500 text-white hover:bg-nursing-blue-600 shadow-md hover:shadow-lg hover:shadow-nursing-blue-500/25",

        // Destructive actions
        destructive:
          "bg-red-500 text-white hover:bg-red-600 shadow-md hover:shadow-lg",

        // Outlined buttons - secondary actions
        outline:
          "border-2 border-nursing-blue-500 bg-transparent text-nursing-blue-600 hover:bg-nursing-blue-50 hover:border-nursing-blue-600",

        // Secondary actions with subtle background
        secondary:
          "bg-nursing-blue-100 text-nursing-blue-700 hover:bg-nursing-blue-200",

        // Ghost buttons for navigation
        ghost: "hover:bg-nursing-blue-50 hover:text-nursing-blue-600",

        // Link style buttons
        link: "text-nursing-blue-600 underline-offset-4 hover:underline",

        // Success actions
        success:
          "bg-nursing-green-500 text-white hover:bg-nursing-green-600 shadow-md hover:shadow-lg hover:shadow-nursing-green-500/25",

        // Premium/AI gradient button - for main CTAs
        premium:
          "bg-gradient-to-r from-nursing-blue-500 via-nursing-purple-500 to-nursing-blue-600 text-white hover:from-nursing-blue-600 hover:via-nursing-purple-600 hover:to-nursing-blue-700 shadow-lg hover:shadow-xl hover:shadow-nursing-purple-500/30",

        // Glassmorphism button
        glass:
          "bg-white/80 backdrop-blur-md text-nursing-blue-700 border border-white/30 hover:bg-white/90 shadow-medium",

        // White button for dark backgrounds
        white:
          "bg-white text-nursing-blue-600 hover:bg-gray-50 shadow-md hover:shadow-lg",
      },
      size: {
        default: "h-11 px-6 py-2.5",
        sm: "h-9 rounded-md px-4 text-xs",
        lg: "h-12 rounded-lg px-8 text-base",
        xl: "h-14 rounded-xl px-10 text-lg",
        icon: "h-11 w-11",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
