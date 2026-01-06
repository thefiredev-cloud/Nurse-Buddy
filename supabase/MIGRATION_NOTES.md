# Database Migration Notes

## Pending Live Database Issues

### RLS Type Mismatch Fix
**Issue**: Row Level Security (RLS) policies may have type mismatches that require correction on the live database.

**Action Required**: This fix requires a live database migration and cannot be applied to existing migration files that have already been applied to production.

**Resolution**: When the live database is accessible, run the appropriate ALTER POLICY or CREATE POLICY commands to fix any type mismatches in the RLS policies.

**Status**: Documented but not implemented (requires live database access)

---

## Completed Migrations

### Migration 003: User Preferences (2024-11-24)
- Fixed numbering conflict (was incorrectly numbered as 002)
- Adds JSONB preferences column to users table
- Default: `{"timer_enabled": true, "show_rationales_immediately": true}`

### Migration 004: Performance Indexes (2026-01-06)
- Adds descending index on `tests.completed_at` column
- Improves query performance for test history and analytics
- Index: `idx_tests_completed_at`
