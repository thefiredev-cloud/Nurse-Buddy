import { db } from "@/lib/supabase";
import { deleteFileFromStorage } from "./storage";

/**
 * Delete expired uploads for users who unsubscribed
 * Should be called periodically (e.g., via cron job)
 */
export async function deleteExpiredUploads() {
  if (!db) {
    console.log("Supabase not configured, skipping auto-delete");
    return;
  }

  try {
    // Get all expired uploads where user is not subscribed
    const { data: expiredUploads, error: queryError } = await db
      .from("uploads")
      .select("uploads.id, uploads.file_path, uploads.user_id")
      .lt("expires_at", new Date().toISOString())
      .then(async (result: { data: any[] | null; error: any }) => {
        if (result.error) return result;

        // Filter by unsubscribed users
        const uploadIds = result.data?.map((u: any) => u.user_id) || [];
        if (uploadIds.length === 0) return result;

        const { data: users } = await db
          .from("users")
          .select("id, subscription_status")
          .in("id", uploadIds);

        const unsubscribedIds = users
          ?.filter((u: any) => u.subscription_status !== "active")
          .map((u: any) => u.id) || [];

        const expiredForUnsubscribed =
          result.data?.filter((u: any) =>
            unsubscribedIds.includes(u.user_id)
          ) || [];

        return { data: expiredForUnsubscribed, error: null };
      });

    if (queryError) {
      console.error("Error querying expired uploads:", queryError);
      return;
    }

    if (!expiredUploads || expiredUploads.length === 0) {
      console.log("No expired uploads to delete");
      return;
    }

    console.log(
      `Found ${expiredUploads.length} expired uploads to delete`
    );

    // Delete files and database records
    for (const upload of expiredUploads) {
      try {
        // Delete from storage
        await deleteFileFromStorage(upload.file_path);

        // Delete from database
        const { error: deleteError } = await db
          .from("uploads")
          .delete()
          .eq("id", upload.id);

        if (deleteError) {
          console.error(
            `Failed to delete upload ${upload.id}:`,
            deleteError
          );
        } else {
          console.log(`Deleted upload ${upload.id}`);
        }
      } catch (error) {
        console.error(`Error deleting upload ${upload.id}:`, error);
      }
    }

    console.log("Auto-delete job completed");
  } catch (error) {
    console.error("Error in auto-delete job:", error);
  }
}

/**
 * Netlify Cron Job Handler
 * Can be triggered via: POST /api/cron/delete-expired
 */
export async function handleAutoDeleteCronJob(
  req: Request
): Promise<Response> {
  // Verify the request is from Netlify
  const authHeader = req.headers.get("authorization");
  const expectedToken = process.env.CRON_SECRET;

  if (!expectedToken || authHeader !== `Bearer ${expectedToken}`) {
    return new Response("Unauthorized", { status: 401 });
  }

  try {
    await deleteExpiredUploads();
    return new Response(
      JSON.stringify({ success: true, message: "Auto-delete completed" }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Cron job error:", error);
    return new Response(
      JSON.stringify({ error: "Cron job failed" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
