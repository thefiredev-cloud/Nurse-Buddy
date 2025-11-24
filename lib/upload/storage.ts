import { db } from "@/lib/supabase";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

// Check if Supabase is configured
const isSupabaseConfigured = !!(supabaseUrl && supabaseAnonKey);

/**
 * Upload file to Supabase Storage
 */
export async function uploadFileToStorage(
  userId: string,
  filename: string,
  fileBuffer: Buffer
): Promise<{ path: string; url: string }> {
  if (!isSupabaseConfigured) {
    // Return mock path for development
    return {
      path: `mock/${userId}/${filename}`,
      url: `https://mock.supabase.co/storage/v1/object/public/uploads/mock/${userId}/${filename}`,
    };
  }

  try {
    // Use Supabase Storage
    const { createClient } = await import("@supabase/supabase-js");
    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    const path = `${userId}/${Date.now()}-${filename}`;

    const { data, error } = await supabase.storage
      .from("uploads")
      .upload(path, fileBuffer, {
        cacheControl: "3600",
        upsert: false,
      });

    if (error) {
      throw new Error(`Storage upload failed: ${error.message}`);
    }

    // Generate public URL
    const {
      data: { publicUrl },
    } = supabase.storage.from("uploads").getPublicUrl(path);

    return {
      path: data.path,
      url: publicUrl,
    };
  } catch (error) {
    console.error("Error uploading to storage:", error);
    throw error;
  }
}

/**
 * Delete file from Supabase Storage
 */
export async function deleteFileFromStorage(filePath: string): Promise<void> {
  if (!isSupabaseConfigured) {
    // Mock deletion
    return;
  }

  try {
    const { createClient } = await import("@supabase/supabase-js");
    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    const { error } = await supabase.storage.from("uploads").remove([filePath]);

    if (error) {
      throw new Error(`Storage deletion failed: ${error.message}`);
    }
  } catch (error) {
    console.error("Error deleting from storage:", error);
    throw error;
  }
}

/**
 * Save upload record to database
 */
export async function saveUploadRecord(
  userId: string,
  filename: string,
  filePath: string,
  fileSize: number,
  extractedContent: string,
  expiresAt?: Date
) {
  try {
    const { data, error } = await db
      .from("uploads")
      .insert({
        user_id: userId,
        filename,
        file_path: filePath,
        file_size: fileSize,
        extracted_content: extractedContent,
        status: "ready",
        expires_at: expiresAt?.toISOString() || null,
      })
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to save upload record: ${error.message}`);
    }

    return data;
  } catch (error) {
    console.error("Error saving upload record:", error);
    throw error;
  }
}

/**
 * Get upload by ID
 */
export async function getUploadById(uploadId: string, userId: string) {
  try {
    const { data, error } = await db
      .from("uploads")
      .select("*")
      .eq("id", uploadId)
      .eq("user_id", userId)
      .single();

    if (error && error.code !== "PGRST116") {
      throw new Error(`Failed to fetch upload: ${error.message}`);
    }

    return data;
  } catch (error) {
    console.error("Error fetching upload:", error);
    throw error;
  }
}

/**
 * Get all uploads for a user
 */
export async function getUserUploads(userId: string, limit = 50, offset = 0) {
  try {
    const { data, error, count } = await db
      .from("uploads")
      .select("*", { count: "exact" })
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      throw new Error(`Failed to fetch user uploads: ${error.message}`);
    }

    return { data: data || [], count: count || 0 };
  } catch (error) {
    console.error("Error fetching user uploads:", error);
    throw error;
  }
}

/**
 * Delete upload record and file
 */
export async function deleteUpload(uploadId: string, userId: string) {
  try {
    // Get upload to find file path
    const upload = await getUploadById(uploadId, userId);
    if (!upload) {
      throw new Error("Upload not found");
    }

    // Delete from storage
    await deleteFileFromStorage(upload.file_path);

    // Delete database record
    const { error } = await db
      .from("uploads")
      .delete()
      .eq("id", uploadId)
      .eq("user_id", userId);

    if (error) {
      throw new Error(`Failed to delete upload: ${error.message}`);
    }
  } catch (error) {
    console.error("Error deleting upload:", error);
    throw error;
  }
}

/**
 * Update upload status
 */
export async function updateUploadStatus(
  uploadId: string,
  status: "processing" | "ready" | "error",
  errorMessage?: string
) {
  try {
    const updateData: any = { status };
    if (errorMessage) {
      updateData.error_message = errorMessage;
    }

    const { error } = await db
      .from("uploads")
      .update(updateData)
      .eq("id", uploadId);

    if (error) {
      throw new Error(`Failed to update upload status: ${error.message}`);
    }
  } catch (error) {
    console.error("Error updating upload status:", error);
    throw error;
  }
}

/**
 * Get or create user upload quota record
 */
export async function getUserUploadQuota(userId: string) {
  try {
    let { data, error } = await db
      .from("user_uploads")
      .select("*")
      .eq("user_id", userId)
      .single();

    if (error && error.code === "PGRST116") {
      // Record doesn't exist, create it
      const today = new Date().toISOString().split("T")[0];
      const { data: newRecord, error: insertError } = await db
        .from("user_uploads")
        .insert({
          user_id: userId,
          free_uploads_used: 0,
          last_reset_date: today,
        })
        .select()
        .single();

      if (insertError) {
        throw insertError;
      }

      return newRecord;
    }

    if (error) {
      throw new Error(`Failed to fetch user quota: ${error.message}`);
    }

    return data;
  } catch (error) {
    console.error("Error fetching user quota:", error);
    throw error;
  }
}

/**
 * Increment free uploads used counter
 */
export async function incrementFreeUploadsUsed(userId: string) {
  try {
    const quota = await getUserUploadQuota(userId);

    const { error } = await db
      .from("user_uploads")
      .update({ free_uploads_used: quota.free_uploads_used + 1 })
      .eq("user_id", userId);

    if (error) {
      throw new Error(`Failed to update quota: ${error.message}`);
    }
  } catch (error) {
    console.error("Error incrementing free uploads:", error);
    throw error;
  }
}
