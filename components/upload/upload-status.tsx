"use client";

import { useEffect, useState } from "react";
import { AlertCircle, CheckCircle, Loader } from "lucide-react";
import { Card } from "@/components/ui/card";
import { UploadFile } from "@/lib/upload/types";

interface UploadStatusProps {
  uploadId: string;
  onStatusChange?: (status: UploadFile["status"]) => void;
}

export function UploadStatus({
  uploadId,
  onStatusChange,
}: UploadStatusProps) {
  const [upload, setUpload] = useState<UploadFile | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const response = await fetch(`/api/upload/${uploadId}`);
        if (!response.ok) throw new Error("Failed to fetch status");

        const { upload } = await response.json();
        setUpload(upload);
        onStatusChange?.(upload.status);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    fetchStatus();

    // Poll for status updates if still processing
    const interval = setInterval(() => {
      fetchStatus();
    }, 2000);

    return () => clearInterval(interval);
  }, [uploadId, onStatusChange]);

  if (loading) {
    return (
      <Card className="p-4">
        <div className="flex items-center gap-3">
          <Loader className="h-5 w-5 animate-spin text-blue-600" />
          <p className="text-sm text-gray-600">Fetching status...</p>
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="p-4 border-red-200 bg-red-50">
        <div className="flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-red-900">Error</p>
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      </Card>
    );
  }

  if (!upload) {
    return null;
  }

  return (
    <Card className="p-4">
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          {upload.status === "processing" && (
            <Loader className="h-5 w-5 animate-spin text-yellow-600" />
          )}
          {upload.status === "ready" && (
            <CheckCircle className="h-5 w-5 text-green-600" />
          )}
          {upload.status === "error" && (
            <AlertCircle className="h-5 w-5 text-red-600" />
          )}

          <div>
            <p className="text-sm font-medium text-gray-900">
              {upload.status === "processing"
                ? "Processing your file..."
                : upload.status === "ready"
                ? "Ready to generate tests"
                : "Processing failed"}
            </p>
            <p className="text-xs text-gray-500">
              {upload.filename}
            </p>
          </div>
        </div>

        {upload.error_message && (
          <p className="text-xs text-red-600 bg-red-50 p-2 rounded">
            {upload.error_message}
          </p>
        )}

        {upload.status === "processing" && (
          <p className="text-xs text-gray-500">
            This may take a minute or two...
          </p>
        )}
      </div>
    </Card>
  );
}
