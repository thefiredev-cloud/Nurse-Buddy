import { NextResponse } from "next/server";
import { db } from "@/lib/supabase";
import { auth, currentUser } from "@clerk/nextjs/server";
import { mockUser } from "@/lib/auth-mock";
import { userSettingsSchema, validateBody } from "@/lib/validations";

async function getUserId() {
  try {
    const { userId } = auth();
    if (userId) return userId;
  } catch (error) {
    // Clerk might not be configured
  }
  
  // Fallback to mock user in development
  if (process.env.NODE_ENV === "development" && !process.env.CLERK_SECRET_KEY) {
    return mockUser.id;
  }
  
  return null;
}

export async function GET(req: Request) {
  try {
    const userId = await getUserId();
    
    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Get user from database
    const { data: user, error } = await (db as any)
      .from("users")
      .select("*")
      .eq("id", userId)
      .single();

    if (error || !user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Get Clerk user for name/email
    let clerkUser = null;
    try {
      clerkUser = await currentUser();
    } catch (error) {
      // Clerk might not be configured
    }

    return NextResponse.json({
      name: clerkUser?.fullName || user.name || "",
      email: clerkUser?.emailAddresses?.[0]?.emailAddress || user.email || "",
      preferences: user.preferences || {
        timer_enabled: true,
        show_rationales_immediately: true,
      },
    });
  } catch (error) {
    console.error("Error fetching settings:", error);
    return NextResponse.json(
      { error: "Failed to fetch settings" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const userId = await getUserId();
    
    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await req.json();

    // Validate request body
    const validation = validateBody(userSettingsSchema, body);
    if (!validation.success) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    const { name, email, preferences } = validation.data;

    // Update user preferences
    const updateData: any = {};

    if (preferences) {
      updateData.preferences = preferences;
    }

    if (name) {
      updateData.name = name;
    }

    // Note: Email updates should be handled through Clerk, not directly in database
    // But we can update the database record if needed

    const { error } = await (db as any)
      .from("users")
      .update(updateData)
      .eq("id", userId);

    if (error) {
      console.error("Error updating settings:", error);
      return NextResponse.json(
        { error: "Failed to update settings" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Settings updated successfully",
    });
  } catch (error) {
    console.error("Error updating settings:", error);
    return NextResponse.json(
      { error: "Failed to update settings" },
      { status: 500 }
    );
  }
}

