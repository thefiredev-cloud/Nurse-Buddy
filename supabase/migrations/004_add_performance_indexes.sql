-- Add performance index for tests table
-- This index improves query performance when filtering/sorting tests by completion date
CREATE INDEX IF NOT EXISTS idx_tests_completed_at ON tests(completed_at DESC);

-- Comment
COMMENT ON INDEX idx_tests_completed_at IS 'Performance index for sorting tests by completion date';
