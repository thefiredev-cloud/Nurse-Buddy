# PowerPoint/PDF Upload Feature Implementation Guide

## Overview

This guide documents the implementation of the PowerPoint/PDF upload feature for NurseBuddy, which allows paying members to upload nursing class materials and generate personalized NCLEX practice tests.

## Features Implemented

✅ File upload with drag-and-drop interface
✅ PowerPoint (.pptx, .ppt) and PDF parsing
✅ Content-based NCLEX question generation using Claude AI
✅ Subscription-based access with 5 free uploads
✅ Auto-delete of expired uploads after 30 days for unsubscribed users
✅ Full database schema with Row Level Security
✅ API routes with comprehensive error handling

## Architecture

### Database Schema

**uploads table**
- Stores uploaded files with metadata
- Tracks parsing status and extracted content
- Includes expiration date for auto-cleanup
- RLS policies restrict access to file owner

**user_uploads table**
- Tracks free upload count per user
- Reset daily for subscription tier management

**tests table (modified)**
- Added `upload_id` FK to link tests to source materials

### File Structure

```
lib/upload/
├── types.ts           # Type definitions and constants
├── parser.ts          # PowerPoint/PDF text extraction
├── storage.ts         # Supabase Storage operations
└── auto-delete.ts     # Cleanup job for expired uploads

app/api/
├── upload/
│   ├── route.ts       # POST: Upload file
│   └── [id]/
│       ├── route.ts   # GET/DELETE: Manage upload
│       └── generate/
│           └── route.ts  # POST: Generate test from upload
├── uploads/
│   └── route.ts       # GET: List user's uploads
├── user/
│   └── subscription/
│       └── route.ts   # GET: Check subscription & quota
└── cron/
    └── delete-expired/
        └── route.ts   # POST: Auto-delete expired uploads

components/upload/
├── upload-dropzone.tsx    # Drag-and-drop file input
├── upload-list.tsx        # Display uploaded files
└── upload-status.tsx      # Show processing status

app/dashboard/uploads/
└── page.tsx           # Main uploads management page
```

## Setup Instructions

### 1. Install Dependencies

```bash
npm install mammoth pdf-parse
```

- `mammoth`: Lightweight PowerPoint parsing
- `pdf-parse`: PDF text extraction
- Both are optional with mock fallbacks

### 2. Database Setup

**Option A: Supabase Dashboard**
1. Navigate to SQL Editor
2. Run the migration in `supabase/migrations/001_add_uploads.sql`
3. Verify tables are created

**Option B: Command Line**
```bash
supabase migration up
```

### 3. Environment Variables

Add to `.env.local`:

```bash
# Existing variables (already configured)
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
ANTHROPIC_API_KEY=

# New variables
CRON_SECRET=your-secret-key-for-cron-jobs  # Generate random string
```

### 4. Supabase Storage Setup

1. Go to Storage > Buckets in Supabase Dashboard
2. Create new bucket named `uploads`
3. Set bucket to **Private**
4. Optional: Set max file size to 25MB in bucket settings

### 5. Configure Cron Job (for auto-delete)

**For Netlify Deployment:**

Add to `netlify.toml`:

```toml
[[scheduled_functions]]
path = "/api/cron/delete-expired"
schedule = "0 2 * * *"  # Daily at 2 AM UTC
```

Environment variable in Netlify:
```
CRON_SECRET=your-secret-key-for-cron-jobs
```

**For Development:**
Trigger manually:
```bash
curl -X POST http://localhost:3000/api/cron/delete-expired \
  -H "Authorization: Bearer your-secret-key"
```

## API Reference

### Upload File

**POST /api/upload**

Request:
```bash
curl -X POST http://localhost:3000/api/upload \
  -F "file=@presentation.pptx"
```

Response:
```json
{
  "success": true,
  "upload": {
    "id": "uuid",
    "filename": "presentation.pptx",
    "status": "ready",
    "created_at": "2025-01-01T00:00:00Z",
    "expires_at": "2025-01-31T00:00:00Z"
  }
}
```

**Validation:**
- File types: .pptx, .ppt, .pdf only
- Max size: 25MB
- Subscription gating: 5 free uploads for non-subscribers
- Free uploads reset daily if unsubscribed

### Get Upload Details

**GET /api/upload/{id}**

Response:
```json
{
  "upload": {
    "id": "uuid",
    "filename": "presentation.pptx",
    "status": "ready",
    "extracted_content": "Full text content...",
    "created_at": "2025-01-01T00:00:00Z"
  }
}
```

### Generate Test from Upload

**POST /api/upload/{id}/generate**

Request body:
```json
{
  "questionCount": 100
}
```

Response:
```json
{
  "success": true,
  "test": {
    "id": "test-uuid",
    "questionCount": 100,
    "uploadId": "uuid",
    "createdAt": "2025-01-01T00:00:00Z"
  }
}
```

### List User's Uploads

**GET /api/uploads?limit=50&offset=0**

Response:
```json
{
  "uploads": [...],
  "total": 5,
  "limit": 50,
  "offset": 0
}
```

### Check Subscription & Quota

**GET /api/user/subscription**

Response:
```json
{
  "isSubscribed": true,
  "subscriptionStatus": "active",
  "freeUploadsUsed": 3,
  "freeUploadsLimit": 5
}
```

### Delete Upload

**DELETE /api/upload/{id}**

Response:
```json
{
  "success": true,
  "message": "Upload deleted successfully"
}
```

## Question Generation Logic

### Content Analysis
1. PowerPoint/PDF extracted to plain text
2. Claude analyzes content to identify nursing topics
3. Topics mapped to NCLEX categories

### Distribution (when using custom content)
- Safe and Effective Care Environment: ~25%
- Health Promotion and Maintenance: ~15%
- Psychosocial Integrity: ~10%
- Physiological Integrity: ~50%

### Question Quality
- Clinical scenarios based on uploaded content
- Application/Analysis cognitive levels
- Detailed rationales for each answer
- Mock questions for development without API key

## Subscription Logic

### Free Tier (5 uploads max)
- Can upload maximum 5 files
- Uploads auto-delete 30 days after upload
- Cannot access custom test generation

### Paid Tier (unlimited uploads)
- Unlimited file uploads
- Uploads retained indefinitely
- Full test generation features

### Gating Implementation
- `requireActiveSubscription()` middleware check
- Frontend conditional rendering based on subscription
- API validation before processing

## Development Notes

### Mock Mode
All features work without external APIs:
- File parsing returns mock content
- Claude question generation uses mock questions
- Supabase storage simulates file operations
- No credentials required for local development

### Testing Without API Keys
```bash
# Development mode (all mocks active)
npm run dev

# Test uploads work with any file
# Questions generate from mock content
# Storage operations simulate success
```

### Performance Considerations

**File Parsing:**
- Large PDFs (>20MB) may timeout
- Recommended max: 50-page documents
- Consider chunking for very large files

**Question Generation:**
- 100 questions = ~2-3 seconds with Claude API
- Mock mode: instant response
- Consider rate limiting for high volume

**Storage:**
- Files stored in private Supabase bucket
- Signed URLs generated on-demand
- Consider CDN for frequent access

## Auto-Delete Implementation

### Trigger Points
1. Scheduled cron job: Daily at 2 AM UTC
2. Manual trigger: Call `/api/cron/delete-expired`
3. User delete: Immediate deletion via `/api/upload/{id}` DELETE

### Cleanup Logic
- Queries uploads with `expires_at < now()`
- Filters for unsubscribed users only
- Deletes from storage first, then database
- Maintains referential integrity (tests remain, upload ref set to null)

### Failure Handling
- Individual file failures don't stop job
- Errors logged for manual review
- Retry-safe (idempotent operations)

## Troubleshooting

### Upload Fails with "Invalid MIME Type"
- Ensure file is actual .pptx/.pdf (not renamed)
- Browser validation may be strict
- Check file headers: `file -i presentation.pptx`

### Questions Generated from Mock Content
- No `ANTHROPIC_API_KEY` configured
- Claude API disabled in development
- Expected behavior; add API key to use real generation

### Auto-Delete Not Running
- Check Netlify cron logs
- Verify `CRON_SECRET` matches configuration
- Manually trigger endpoint to test

### Storage Upload Fails
- Verify Supabase `uploads` bucket exists and is private
- Check `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Ensure RLS policies allow authenticated users

## Future Enhancements

1. **Batch Processing**
   - Multiple file uploads in single request
   - Combine content from multiple files into one test

2. **Content Caching**
   - Cache frequently generated questions
   - Reduce API calls for common topics

3. **Advanced Parsing**
   - Extract slide images/diagrams
   - OCR for scanned documents
   - Table parsing for clinical data

4. **Analytics**
   - Track which topics from uploads test worst
   - Suggest focus areas based on test performance

5. **Sharing**
   - Allow instructors to share materials with classes
   - Collaborative study groups with shared uploads

## Security Considerations

### File Validation
- MIME type and extension validation
- File size limits (25MB default)
- Consider: macro scanning, virus checking

### Access Control
- RLS policies enforce user isolation
- Signed URLs for temporary file access
- No direct public access to uploads

### Data Privacy
- Files stored in private buckets
- Encryption at rest (Supabase default)
- Auto-delete prevents data retention

## Support & Issues

For issues or questions:
1. Check this guide for troubleshooting
2. Review API error messages and logs
3. Check Supabase dashboard for data validation
4. Review Netlify function logs for cron errors
