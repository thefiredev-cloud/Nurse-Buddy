import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { stripe } from "@/lib/stripe";
import { updateUserSubscription } from "@/lib/database/queries";
import { db } from "@/lib/supabase";
import type Stripe from "stripe";

/**
 * Maps Stripe subscription status to our internal status
 */
function mapSubscriptionStatus(
  stripeStatus: Stripe.Subscription.Status
): "active" | "inactive" | "cancelled" | "past_due" {
  switch (stripeStatus) {
    case "active":
    case "trialing":
      return "active";
    case "past_due":
      return "past_due";
    case "canceled":
    case "unpaid":
      return "cancelled";
    default:
      return "inactive";
  }
}

/**
 * Gets userId from Stripe customer ID by querying the database
 */
async function getUserIdByCustomerId(customerId: string): Promise<string | null> {
  if (!db) return null;
  
  const { data, error } = await (db as any)
    .from("users")
    .select("id")
    .eq("stripe_customer_id", customerId)
    .single();

  if (error || !data) {
    console.error("Error finding user by customer ID:", error);
    return null;
  }

  return data.id;
}

export async function POST(req: Request) {
  const body = await req.text();
  const signature = headers().get("stripe-signature");

  // Mock webhook for development
  if (!process.env.STRIPE_SECRET_KEY && process.env.NODE_ENV === "development") {
    console.log("Mock Stripe webhook received");
    return NextResponse.json({ received: true });
  }

  let event: Stripe.Event;

  try {
    if (!signature || !stripe) {
      throw new Error("Missing signature or Stripe not configured");
    }

    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET || ""
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json(
      { error: "Webhook signature verification failed" },
      { status: 400 }
    );
  }

  // Handle the event
  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        console.log("Checkout session completed:", session.id);

        const userId = session.metadata?.userId;
        const customerId = session.customer as string;

        if (userId && customerId) {
          // Update user with Stripe customer ID and active subscription
          const updated = await updateUserSubscription(userId, customerId, "active");
          if (updated) {
            console.log("Successfully activated subscription for user:", userId);
          } else {
            console.error("Failed to update subscription for user:", userId);
          }
        } else {
          console.error("Missing userId or customerId in checkout session");
        }
        break;
      }

      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;
        console.log("Subscription updated:", subscription.id);

        const customerId = subscription.customer as string;
        const userId = await getUserIdByCustomerId(customerId);

        if (userId) {
          const status = mapSubscriptionStatus(subscription.status);
          const updated = await updateUserSubscription(userId, customerId, status);
          if (updated) {
            console.log(`Subscription status updated to ${status} for user:`, userId);
          }
        }
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        console.log("Subscription deleted:", subscription.id);

        const customerId = subscription.customer as string;
        const userId = await getUserIdByCustomerId(customerId);

        if (userId) {
          const updated = await updateUserSubscription(userId, customerId, "cancelled");
          if (updated) {
            console.log("Subscription cancelled for user:", userId);
          }
        }
        break;
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice;
        console.log("Payment failed for invoice:", invoice.id);

        const customerId = invoice.customer as string;
        const userId = await getUserIdByCustomerId(customerId);

        if (userId) {
          // Mark subscription as past_due
          const updated = await updateUserSubscription(userId, customerId, "past_due");
          if (updated) {
            console.log("Marked subscription as past_due for user:", userId);
          }
          // Note: Email notifications should be handled by Stripe's built-in email system
          // or a separate notification service
        }
        break;
      }

      default:
        console.log("Unhandled event type:", event.type);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook handler error:", error);
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 500 }
    );
  }
}

