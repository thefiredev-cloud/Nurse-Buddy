import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { stripe } from "@/lib/stripe";
import { 
  getUserById, 
  getUserTestCount, 
  FREE_TIER_TEST_LIMIT 
} from "@/lib/database/queries";

interface SubscriptionDetails {
  isSubscribed: boolean;
  status: string;
  plan: "free" | "pro";
  testsUsed: number;
  testsLimit: number | "unlimited";
  stripeCustomerId: string | null;
  currentPeriodEnd?: string;
  cancelAtPeriodEnd?: boolean;
}

export async function GET() {
  try {
    const user = await currentUser();
    if (!user || !user.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Get user from database
    const dbUser = await getUserById(user.id);
    const testCount = await getUserTestCount(user.id);
    
    const isSubscribed = dbUser?.subscription_status === "active";

    const subscriptionDetails: SubscriptionDetails = {
      isSubscribed,
      status: dbUser?.subscription_status || "inactive",
      plan: isSubscribed ? "pro" : "free",
      testsUsed: testCount,
      testsLimit: isSubscribed ? "unlimited" : FREE_TIER_TEST_LIMIT,
      stripeCustomerId: dbUser?.stripe_customer_id || null,
    };

    // If user has Stripe customer ID and is subscribed, get subscription details
    if (stripe && dbUser?.stripe_customer_id && isSubscribed) {
      try {
        const subscriptions = await stripe.subscriptions.list({
          customer: dbUser.stripe_customer_id,
          status: "active",
          limit: 1,
        });

        if (subscriptions.data.length > 0) {
          const subscription = subscriptions.data[0];
          subscriptionDetails.currentPeriodEnd = new Date(
            subscription.current_period_end * 1000
          ).toISOString();
          subscriptionDetails.cancelAtPeriodEnd = subscription.cancel_at_period_end;
        }
      } catch (stripeError) {
        console.error("Error fetching Stripe subscription:", stripeError);
        // Continue without Stripe details
      }
    }

    return NextResponse.json(subscriptionDetails);
  } catch (error) {
    console.error("Error fetching subscription status:", error);
    return NextResponse.json(
      { error: "Failed to fetch subscription status" },
      { status: 500 }
    );
  }
}

