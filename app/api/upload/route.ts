import { NextRequest, NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import {
  uploadFileToStorage,
  saveUploadRecord,
  getUserUploadQuota,
  incrementFreeUploadsUsed,
} from "@/lib/upload/storage";
import { parseUploadedFile } from "@/lib/upload/parser";
import { ALLOWED_EXTENSIONS, ALLOWED_MIME_TYPES, MAX_FILE_SIZE, MAX_FREE_UPLOADS } from "@/lib/upload/types";
import { db } from "@/lib/supabase";
import { checkRateLimit, RATE_LIMITS, getRateLimitHeaders } from "@/lib/rate-limit";

export async function POST(req: NextRequest) {
  try {
    // Get authenticated user
    const user = await currentUser();
    if (!user || !user.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Apply rate limiting for authenticated users
    const rateLimit = checkRateLimit(`upload:${user.id}`, RATE_LIMITS.authenticated);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: "Rate limit exceeded. Please try again later." },
        { status: 429, headers: getRateLimitHeaders(rateLimit) }
      );
    }

    // Get user subscription status
    const { data: dbUser, error: userError } = await db
      .from("users")
      .select("subscription_status")
      .eq("id", user.id)
      .single();

    if (userError) {
      return NextResponse.json(
        { error: "Failed to fetch user data" },
        { status: 500 }
      );
    }

    // Check subscription status for upload limits
    const isSubscribed = dbUser?.subscription_status === "active";

    // Get upload quota
    const quota = await getUserUploadQuota(user.id);

    // Check free upload limit for non-subscribers
    if (!isSubscribed && quota.free_uploads_used >= MAX_FREE_UPLOADS) {
      return NextResponse.json(
        {
          error: "Free upload limit reached",
          message: `You have used ${quota.free_uploads_used} free uploads. Subscribe to upload more.`,
        },
        { status: 403 }
      );
    }

    // Parse form data
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        { error: "No file provided" },
        { status: 400 }
      );
    }

    // Validate file type
    const filename = file.name.toLowerCase();
    const extension = "." + filename.split(".").pop();

    if (!ALLOWED_EXTENSIONS.includes(extension)) {
      return NextResponse.json(
        {
          error: "Invalid file type",
          message: `Allowed types: ${ALLOWED_EXTENSIONS.join(", ")}`,
        },
        { status: 400 }
      );
    }

    // Validate MIME type
    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      return NextResponse.json(
        {
          error: "Invalid MIME type",
          message: `File type ${file.type} is not allowed`,
        },
        { status: 400 }
      );
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        {
          error: "File too large",
          message: `Maximum file size is ${MAX_FILE_SIZE / 1024 / 1024}MB`,
        },
        { status: 400 }
      );
    }

    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer();
    const fileBuffer = Buffer.from(arrayBuffer);

    // Parse file content
    let extractedContent: string;
    try {
      const parsed = await parseUploadedFile(fileBuffer, file.name);
      extractedContent = parsed.text;
    } catch (parseError) {
      console.error("File parsing error:", parseError);
      return NextResponse.json(
        {
          error: "Failed to parse file",
          message: "Unable to extract content from file. Please check the file format.",
        },
        { status: 400 }
      );
    }

    // Upload file to storage
    let filePath: string;
    try {
      const { path } = await uploadFileToStorage(user.id, file.name, fileBuffer);
      filePath = path;
    } catch (storageError) {
      console.error("Storage upload error:", storageError);
      return NextResponse.json(
        { error: "Storage upload failed" },
        { status: 500 }
      );
    }

    // Calculate expiration date (30 days from now)
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30);

    // Save upload record to database
    const uploadRecord = await saveUploadRecord(
      user.id,
      file.name,
      filePath,
      file.size,
      extractedContent,
      expiresAt
    );

    // Increment free uploads counter if not subscribed
    if (!isSubscribed) {
      await incrementFreeUploadsUsed(user.id);
    }

    return NextResponse.json({
      success: true,
      upload: {
        id: uploadRecord.id,
        filename: uploadRecord.filename,
        status: uploadRecord.status,
        created_at: uploadRecord.created_at,
        expires_at: uploadRecord.expires_at,
      },
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Upload failed" },
      { status: 500 }
    );
  }
}
