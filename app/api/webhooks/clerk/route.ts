import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { Webhook } from "svix";
import { createUser } from "@/lib/database/queries";

export async function POST(req: Request) {
  try {
    // Mock webhook handling for development (when webhook secret not configured)
    if (
      !process.env.CLERK_WEBHOOK_SECRET &&
      process.env.NODE_ENV === "development"
    ) {
      const body = await req.json();
      console.log("Mock Clerk webhook received:", body.type);
      
      // Still process user creation in mock mode for development
      if (body.type === "user.created") {
        const { id, email_addresses, first_name, last_name } = body.data;
        const email = email_addresses?.[0]?.email_address || "";
        const name = [first_name, last_name].filter(Boolean).join(" ") || email.split("@")[0];
        
        await createUser({
          id,
          email,
          name,
          stripe_customer_id: null,
          subscription_status: "inactive",
        });
      }
      
      return NextResponse.json({ received: true });
    }

    // Verify webhook signature (production)
    const webhookSecret = process.env.CLERK_WEBHOOK_SECRET;
    
    if (!webhookSecret) {
      console.error("CLERK_WEBHOOK_SECRET not configured");
      return new NextResponse("Webhook secret not configured", { status: 500 });
    }

    // Get raw body as text for signature verification
    const body = await req.text();
    const headersList = headers();
    
    const svix_id = headersList.get("svix-id");
    const svix_timestamp = headersList.get("svix-timestamp");
    const svix_signature = headersList.get("svix-signature");

    if (!svix_id || !svix_timestamp || !svix_signature) {
      return new NextResponse("Missing webhook headers", { status: 400 });
    }

    // Verify webhook signature using svix
    let evt: any;
    try {
      const wh = new Webhook(webhookSecret);
      evt = wh.verify(body, {
        "svix-id": svix_id,
        "svix-timestamp": svix_timestamp,
        "svix-signature": svix_signature,
      }) as any;
    } catch (err) {
      console.error("Webhook signature verification failed:", err);
      return new NextResponse("Invalid signature", { status: 400 });
    }

    // Handle different event types
    const eventType = evt.type;

    if (eventType === "user.created") {
      const { id, email_addresses, first_name, last_name } = evt.data;
      const email = email_addresses?.[0]?.email_address || "";
      const name = [first_name, last_name].filter(Boolean).join(" ") || email.split("@")[0];

      // Create user in database
      const user = await createUser({
        id,
        email,
        name,
        stripe_customer_id: null,
        subscription_status: "inactive",
      });

      if (!user) {
        console.error("Failed to create user in database:", id);
        return new NextResponse("Failed to create user", { status: 500 });
      }

      console.log("User created successfully:", { id, email, name });
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Clerk webhook error:", error);
    return new NextResponse("Webhook error", { status: 400 });
  }
}

