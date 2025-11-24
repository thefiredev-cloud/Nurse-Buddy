import { NextRequest, NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { db } from "@/lib/supabase";
import { getUserUploadQuota } from "@/lib/upload/storage";
import { createUser } from "@/lib/database/queries";

export async function GET(req: NextRequest) {
  try {
    const user = await currentUser();
    if (!user || !user.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Get user subscription status
    let { data: dbUser, error } = await db
      .from("users")
      .select("subscription_status")
      .eq("id", user.id)
      .single();

    // If user doesn't exist in database, create them (webhook might not have fired)
    if (error?.code === "PGRST116" || !dbUser) {
      console.log("User not found in database, creating:", user.id);
      
      const newUser = await createUser({
        id: user.id,
        email: user.primaryEmailAddress?.emailAddress || "",
        name: user.fullName || `${user.firstName || ""} ${user.lastName || ""}`.trim() || "User",
        stripe_customer_id: null,
        subscription_status: "inactive",
      });

      if (newUser) {
        dbUser = { subscription_status: "inactive" };
      } else {
        console.error("Failed to create user in database:", user.id);
        return NextResponse.json(
          { error: "Failed to create user" },
          { status: 500 }
        );
      }
    } else if (error) {
      console.error("Error fetching user:", error);
      return NextResponse.json(
        { error: "Failed to fetch subscription status" },
        { status: 500 }
      );
    }

    const isSubscribed = dbUser?.subscription_status === "active";

    // Get free upload quota
    const quota = await getUserUploadQuota(user.id);

    return NextResponse.json({
      isSubscribed,
      subscriptionStatus: dbUser?.subscription_status || "inactive",
      freeUploadsUsed: quota.free_uploads_used,
      freeUploadsLimit: 5,
    });
  } catch (error) {
    console.error("Error checking subscription:", error);
    return NextResponse.json(
      { error: "Failed to check subscription status" },
      { status: 500 }
    );
  }
}
