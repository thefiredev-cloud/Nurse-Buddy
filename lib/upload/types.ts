export interface ParsedContent {
  text: string;
  slideCount: number;
  metadata: {
    title?: string;
    subject?: string;
    author?: string;
  };
}

export interface UploadFile {
  id: string;
  user_id: string;
  filename: string;
  file_path: string;
  file_size: number;
  extracted_content: string | null;
  content_summary: string | null;
  status: "processing" | "ready" | "error";
  error_message: string | null;
  created_at: string;
  expires_at: string | null;
}

export interface UserUploadQuota {
  id: string;
  user_id: string;
  free_uploads_used: number;
  last_reset_date: string;
}

export const ALLOWED_MIME_TYPES = [
  "application/vnd.openxmlformats-officedocument.presentationml.presentation", // .pptx
  "application/vnd.ms-powerpoint", // .ppt
  "application/pdf", // .pdf
];

export const ALLOWED_EXTENSIONS = [".pptx", ".ppt", ".pdf"];
export const MAX_FILE_SIZE = 25 * 1024 * 1024; // 25MB
export const MAX_FREE_UPLOADS = 5;
export const UPLOAD_EXPIRY_DAYS = 30;
