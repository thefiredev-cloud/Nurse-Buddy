import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { stripe } from "@/lib/stripe";
import { getUserById } from "@/lib/database/queries";

export async function POST() {
  try {
    const user = await currentUser();
    if (!user || !user.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Get user from database to get Stripe customer ID
    const dbUser = await getUserById(user.id);
    
    if (!dbUser?.stripe_customer_id) {
      return NextResponse.json(
        { error: "No subscription found. Please subscribe first." },
        { status: 400 }
      );
    }

    // Mock portal for development without Stripe
    if (!stripe) {
      return NextResponse.json({
        url: "/dashboard/subscription?mock=true",
      });
    }

    // Create Stripe Customer Portal session
    const portalSession = await stripe.billingPortal.sessions.create({
      customer: dbUser.stripe_customer_id,
      return_url: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/dashboard/subscription`,
    });

    return NextResponse.json({
      url: portalSession.url,
    });
  } catch (error) {
    console.error("Error creating portal session:", error);
    return NextResponse.json(
      { error: "Failed to create portal session" },
      { status: 500 }
    );
  }
}

