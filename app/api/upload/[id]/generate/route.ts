import { NextRequest, NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { getUploadById } from "@/lib/upload/storage";
import { generateQuestionsFromContent } from "@/lib/ai/claude";
import { db } from "@/lib/supabase";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await currentUser();
    if (!user || !user.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Get upload
    const upload = await getUploadById(params.id, user.id);
    if (!upload) {
      return NextResponse.json(
        { error: "Upload not found" },
        { status: 404 }
      );
    }

    if (upload.status !== "ready") {
      return NextResponse.json(
        { error: "Upload is not ready for test generation" },
        { status: 400 }
      );
    }

    if (!upload.extracted_content) {
      return NextResponse.json(
        { error: "No content available for test generation" },
        { status: 400 }
      );
    }

    // Parse request body
    const body = await req.json().catch(() => ({}));
    const questionCount = body.questionCount || 100;

    // Validate question count
    if (questionCount < 1 || questionCount > 100) {
      return NextResponse.json(
        { error: "Question count must be between 1 and 100" },
        { status: 400 }
      );
    }

    // Generate questions from uploaded content
    const questions = await generateQuestionsFromContent(
      upload.extracted_content,
      { questionCount }
    );

    // Create test record in database
    const { data: test, error: testError } = await db
      .from("tests")
      .insert({
        user_id: user.id,
        upload_id: params.id,
        questions: questions,
        answers: null,
        score: null,
        completed_at: null,
      })
      .select()
      .single();

    if (testError) {
      console.error("Error creating test:", testError);
      return NextResponse.json(
        { error: "Failed to create test" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      test: {
        id: test.id,
        questionCount: questions.length,
        uploadId: params.id,
        createdAt: test.created_at,
      },
    });
  } catch (error) {
    console.error("Error generating test from upload:", error);
    return NextResponse.json(
      { error: "Failed to generate test" },
      { status: 500 }
    );
  }
}
