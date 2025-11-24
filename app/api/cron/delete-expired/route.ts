import { NextRequest, NextResponse } from "next/server";
import { deleteExpiredUploads } from "@/lib/upload/auto-delete";

/**
 * Cron endpoint for auto-deleting expired uploads
 * Set up in netlify.toml with:
 * [[scheduled_functions]]
 * path = "/api/cron/delete-expired"
 * schedule = "0 2 * * *"  # Daily at 2 AM UTC
 */
export async function POST(req: NextRequest) {
  try {
    // Verify cron secret if configured
    const authHeader = req.headers.get("authorization");
    const cronSecret = process.env.CRON_SECRET;

    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    await deleteExpiredUploads();

    return NextResponse.json({
      success: true,
      message: "Auto-delete job completed",
    });
  } catch (error) {
    console.error("Cron job error:", error);
    return NextResponse.json(
      { error: "Cron job failed" },
      { status: 500 }
    );
  }
}
