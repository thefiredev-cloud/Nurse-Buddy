-- Add preferences column to users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS preferences JSONB DEFAULT '{"timer_enabled": true, "show_rationales_immediately": true}'::jsonb;

-- Add comment
COMMENT ON COLUMN users.preferences IS 'User test preferences stored as JSONB';

