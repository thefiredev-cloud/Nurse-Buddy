import { NextRequest, NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { db } from "@/lib/supabase";
import { getUserUploadQuota } from "@/lib/upload/storage";

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
    const { data: dbUser, error } = await db
      .from("users")
      .select("subscription_status")
      .eq("id", user.id)
      .single();

    if (error) {
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
      subscriptionStatus: dbUser?.subscription_status,
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
