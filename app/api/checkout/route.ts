import { NextResponse } from "next/server";
import { stripeClient, stripeConfig } from "@/lib/stripe";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userId, email } = body;

    // Mock checkout for development without Stripe
    if (!process.env.STRIPE_SECRET_KEY && process.env.NODE_ENV === "development") {
      const mockSessionId = "cs_mock_" + Date.now();
      return NextResponse.json({
        sessionId: mockSessionId,
        url: `/checkout/success?session_id=${mockSessionId}`,
      });
    }

    // Create Stripe checkout session
    const session = await stripeClient.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price: stripeConfig.priceId,
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/checkout/cancel`,
      customer_email: email,
      metadata: {
        userId,
      },
    });

    return NextResponse.json({
      sessionId: session.id,
      url: session.url,
    });
  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}

