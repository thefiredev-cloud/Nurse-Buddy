"use client";

import { useState, useEffect } from "react";
import { Trash2, FileText, Download, Loader } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { UploadFile } from "@/lib/upload/types";

interface UploadListProps {
  uploads: UploadFile[];
  onDelete?: (uploadId: string) => void;
  onGenerate?: (uploadId: string) => void;
  isLoading?: boolean;
}

export function UploadList({
  uploads,
  onDelete,
  onGenerate,
  isLoading = false,
}: UploadListProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader className="h-6 w-6 animate-spin text-blue-600" />
      </div>
    );
  }

  if (uploads.length === 0) {
    return (
      <Card className="py-8 text-center">
        <FileText className="mx-auto h-12 w-12 text-gray-400 mb-3" />
        <p className="text-gray-600">No uploads yet</p>
        <p className="text-sm text-gray-500 mt-1">
          Upload a PowerPoint or PDF to get started
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {uploads.map((upload) => (
        <Card key={upload.id} className="p-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <FileText className="h-5 w-5 text-blue-600 flex-shrink-0" />
                <h3 className="font-medium text-gray-900 truncate">
                  {upload.filename}
                </h3>
                <span
                  className={`inline-block px-2 py-1 text-xs font-medium rounded-full flex-shrink-0 ${
                    upload.status === "ready"
                      ? "bg-green-100 text-green-800"
                      : upload.status === "processing"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {upload.status === "ready"
                    ? "Ready"
                    : upload.status === "processing"
                    ? "Processing"
                    : "Error"}
                </span>
              </div>

              <p className="text-xs text-gray-500">
                {(upload.file_size / 1024).toFixed(1)} KB •{" "}
                {new Date(upload.created_at).toLocaleDateString()}
              </p>

              {upload.error_message && (
                <p className="text-xs text-red-600 mt-1">{upload.error_message}</p>
              )}

              {upload.expires_at && (
                <p className="text-xs text-gray-500 mt-1">
                  Expires: {new Date(upload.expires_at).toLocaleDateString()}
                </p>
              )}
            </div>

            <div className="flex items-center gap-2 flex-shrink-0">
              {upload.status === "ready" && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onGenerate?.(upload.id)}
                  className="gap-1"
                >
                  <Download className="h-4 w-4" />
                  Generate Test
                </Button>
              )}

              <Button
                size="sm"
                variant="ghost"
                onClick={() => onDelete?.(upload.id)}
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
