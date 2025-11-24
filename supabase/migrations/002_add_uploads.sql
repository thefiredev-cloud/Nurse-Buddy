-- Create uploads table
CREATE TABLE IF NOT EXISTS uploads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  filename TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_size INTEGER NOT NULL,
  extracted_content TEXT,
  content_summary TEXT,
  status TEXT NOT NULL DEFAULT 'processing' CHECK (status IN ('processing', 'ready', 'error')),
  error_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE
);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_uploads_user_id ON uploads(user_id);
CREATE INDEX IF NOT EXISTS idx_uploads_status ON uploads(status);
CREATE INDEX IF NOT EXISTS idx_uploads_expires_at ON uploads(expires_at) WHERE status != 'error';

-- Add upload_id to tests table
ALTER TABLE IF EXISTS tests ADD COLUMN upload_id UUID REFERENCES uploads(id) ON DELETE SET NULL;
CREATE INDEX IF NOT EXISTS idx_tests_upload_id ON tests(upload_id);

-- Create user_uploads table for tracking free uploads
CREATE TABLE IF NOT EXISTS user_uploads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  free_uploads_used INTEGER NOT NULL DEFAULT 0,
  last_reset_date DATE NOT NULL DEFAULT CURRENT_DATE
);

-- Create index for user lookups
CREATE INDEX IF NOT EXISTS idx_user_uploads_user_id ON user_uploads(user_id);

-- Enable RLS on uploads table
ALTER TABLE uploads ENABLE ROW LEVEL SECURITY;

-- RLS Policies for uploads
-- Users can only see their own uploads
CREATE POLICY "Users can view own uploads" ON uploads
  FOR SELECT USING (auth.uid()::text = user_id);

CREATE POLICY "Users can insert own uploads" ON uploads
  FOR INSERT WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "Users can delete own uploads" ON uploads
  FOR DELETE USING (auth.uid()::text = user_id);

-- Enable RLS on user_uploads table
ALTER TABLE user_uploads ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_uploads
CREATE POLICY "Users can view own upload quota" ON user_uploads
  FOR SELECT USING (auth.uid()::text = user_id);

CREATE POLICY "Users can update own upload quota" ON user_uploads
  FOR UPDATE USING (auth.uid()::text = user_id);

