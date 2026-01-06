"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { AlertCircle, Lock } from "lucide-react";
import { UploadDropzone } from "@/components/upload/upload-dropzone";
import { UploadList } from "@/components/upload/upload-list";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UploadFile } from "@/lib/upload/types";

export const dynamic = 'force-dynamic';

export default function UploadsPage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [uploads, setUploads] = useState<UploadFile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [freeUploadsUsed, setFreeUploadsUsed] = useState(0);

  useEffect(() => {
    if (!isLoaded) return;

    if (!user) {
      router.push("/sign-in");
      return;
    }

    fetchUploads();
    checkSubscriptionStatus();
  }, [isLoaded, user, router]);

  const fetchUploads = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/uploads");
      if (!response.ok) throw new Error("Failed to fetch uploads");

      const data = await response.json();
      setUploads(data.uploads || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load uploads");
    } finally {
      setIsLoading(false);
    }
  };

  const checkSubscriptionStatus = async () => {
    try {
      const response = await fetch("/api/user/subscription");
      if (response.ok) {
        const data = await response.json();
        setIsSubscribed(data.isSubscribed);
        setFreeUploadsUsed(data.freeUploadsUsed || 0);
      }
    } catch (err) {
      console.error("Failed to check subscription:", err);
    }
  };

  const handleUploadSuccess = (uploadId: string, filename: string) => {
    fetchUploads();
    checkSubscriptionStatus();
  };

  const handleDelete = async (uploadId: string) => {
    if (!confirm("Are you sure you want to delete this upload?")) return;

    try {
      const response = await fetch(`/api/upload/${uploadId}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Delete failed");

      setUploads(uploads.filter((u) => u.id !== uploadId));
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to delete upload");
    }
  };

  const handleGenerate = async (uploadId: string) => {
    try {
      const response = await fetch(`/api/upload/${uploadId}/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ questionCount: 100 }),
      });

      if (!response.ok) throw new Error("Generation failed");

      const data = await response.json();
      // Redirect to test page
      router.push(`/dashboard/test/${data.test.id}`);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to generate test");
    }
  };

  if (!isLoaded || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Materials</h1>
          <p className="mt-2 text-gray-600">
            Upload PowerPoint or PDF files to generate personalized practice tests
          </p>
        </div>

        {/* Subscription Status Card */}
        {!isSubscribed && (
          <Card className="mb-6 border-blue-200 bg-blue-50 p-4">
            <div className="flex items-start gap-3">
              <Lock className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="font-medium text-blue-900">
                  Free Plan: {freeUploadsUsed}/5 uploads used
                </p>
                <p className="text-sm text-blue-700 mt-1">
                  Subscribe to get unlimited uploads
                </p>
                <Button
                  className="mt-3 bg-blue-600 hover:bg-blue-700"
                  onClick={() => router.push("/pricing")}
                >
                  View Pricing
                </Button>
              </div>
            </div>
          </Card>
        )}

        {/* Error Message */}
        {error && (
          <Card className="mb-6 border-red-200 bg-red-50 p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-red-900">Error</p>
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </Card>
        )}

        {/* Upload Section */}
        <div className="mb-8">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">
            Upload New Material
          </h2>
          <UploadDropzone
            onUploadSuccess={handleUploadSuccess}
            disabled={!isSubscribed && freeUploadsUsed >= 5}
          />
        </div>

        {/* Uploads List */}
        <div>
          <h2 className="mb-4 text-lg font-semibold text-gray-900">
            Your Uploads
          </h2>
          <UploadList
            uploads={uploads}
            onDelete={handleDelete}
            onGenerate={handleGenerate}
            isLoading={isLoading}
          />
        </div>
      </div>
    </div>
  );
}
