import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

// Create Supabase client with mock fallback (for client-side use)
export const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Create server-side admin client with service role key (bypasses RLS)
// This is used for server-side operations when using external auth (Clerk)
export const supabaseAdmin = supabaseUrl && supabaseServiceRoleKey
  ? createClient(supabaseUrl, supabaseServiceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    })
  : null;

// Debug logging (only in development)
if (process.env.NODE_ENV === "development") {
  if (supabaseUrl && !supabaseServiceRoleKey) {
    console.warn("⚠️  SUPABASE_SERVICE_ROLE_KEY not found. Server-side operations may fail due to RLS policies.");
    console.warn("   Add SUPABASE_SERVICE_ROLE_KEY to .env.local and restart the dev server.");
  } else if (supabaseAdmin) {
    console.log("✅ Supabase admin client initialized (bypasses RLS)");
  }
}

// Helper function to generate UUID-like IDs
function generateMockId(): string {
  return `mock_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// Helper function to get current ISO timestamp
function getCurrentTimestamp(): string {
  return new Date().toISOString();
}

// Mock query builder that supports chaining
function createMockQueryBuilder(table: string) {
  let insertData: any = null;
  let selectFields: string | undefined = undefined;
  let updateData: any = null;
  let whereConditions: Array<{ field: string; value: any }> = [];
  let orderByField: string | undefined = undefined;
  let orderByAscending: boolean = true;
  let limitValue: number | undefined = undefined;
  let singleMode: boolean = false;

  const execute = async () => {
    // Handle insert operations
    if (insertData) {
      const results = insertData.map((item: any) => {
        const result = {
          ...item,
          id: item.id || generateMockId(),
          created_at: item.created_at || getCurrentTimestamp(),
        };
        
        // Add table-specific fields
        if (table === "users") {
          result.updated_at = result.updated_at || getCurrentTimestamp();
        }
        
        return result;
      });

      if (singleMode) {
        return { data: results[0] || null, error: null };
      }
      return { data: results, error: null };
    }

    // Handle update operations
    if (updateData) {
      return { data: updateData, error: null };
    }

    // Handle select operations (return empty array for mock)
    if (singleMode) {
      return { data: null, error: null };
    }
    return { data: [], error: null };
  };

  const builder: any = {
    insert: (data: any) => {
      insertData = Array.isArray(data) ? data : [data];
      return builder;
    },
    select: (fields?: string) => {
      selectFields = fields;
      return builder;
    },
    update: (data: any) => {
      updateData = data;
      return builder;
    },
    delete: () => {
      return {
        eq: (field: string, value: any) => {
          whereConditions.push({ field, value });
          return Promise.resolve({ data: null, error: null });
        },
      };
    },
    eq: (field: string, value: any) => {
      whereConditions.push({ field, value });
      return builder;
    },
    not: (field: string, operator: string, value: any) => {
      whereConditions.push({ field, value });
      return builder;
    },
    order: (field: string, options?: { ascending?: boolean }) => {
      orderByField = field;
      orderByAscending = options?.ascending !== false;
      return builder;
    },
    limit: (count: number) => {
      limitValue = count;
      return builder;
    },
    single: () => {
      singleMode = true;
      return execute();
    },
  };

  // Make builder thenable for direct await
  builder.then = (onResolve: any, onReject?: any) => {
    return execute().then(onResolve, onReject);
  };
  builder.catch = (onReject: any) => {
    return execute().catch(onReject);
  };

  return builder;
}

// Mock Supabase client for development without credentials
export const mockSupabase = {
  from: (table: string) => createMockQueryBuilder(table),
  auth: {
    getUser: () => Promise.resolve({ data: { user: null }, error: null }),
  },
};

// Export appropriate client
// For server-side operations, prefer admin client (bypasses RLS)
// Falls back to regular client, then mock
export const db = supabaseAdmin || supabase || mockSupabase;

// Type definitions
export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          name: string;
          stripe_customer_id: string | null;
          subscription_status: string;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["users"]["Row"], "id" | "created_at">;
        Update: Partial<Database["public"]["Tables"]["users"]["Insert"]>;
      };
      tests: {
        Row: {
          id: string;
          user_id: string;
          upload_id: string | null;
          questions: any;
          answers: any;
          score: number | null;
          completed_at: string | null;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["tests"]["Row"], "id" | "created_at">;
        Update: Partial<Database["public"]["Tables"]["tests"]["Insert"]>;
      };
      performance: {
        Row: {
          id: string;
          user_id: string;
          category: string;
          correct_answers: number;
          total_questions: number;
          date: string;
        };
        Insert: Omit<Database["public"]["Tables"]["performance"]["Row"], "id">;
        Update: Partial<Database["public"]["Tables"]["performance"]["Insert"]>;
      };
      uploads: {
        Row: {
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
        };
        Insert: Omit<Database["public"]["Tables"]["uploads"]["Row"], "id" | "created_at">;
        Update: Partial<Database["public"]["Tables"]["uploads"]["Insert"]>;
      };
      user_uploads: {
        Row: {
          id: string;
          user_id: string;
          free_uploads_used: number;
          last_reset_date: string;
        };
        Insert: Omit<Database["public"]["Tables"]["user_uploads"]["Row"], "id">;
        Update: Partial<Database["public"]["Tables"]["user_uploads"]["Insert"]>;
      };
    };
  };
};

