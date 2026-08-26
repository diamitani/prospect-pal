# Supabase Migration Guide

## Overview

Prospect PAL has been migrated from AWS DynamoDB to Supabase PostgreSQL as the primary backend database. This provides:

- **Better Development Experience**: Built-in admin UI, SQL editor, and real-time subscriptions
- **Cost Efficiency**: Generous free tier with predictable pricing
- **Integrated Auth**: Supabase Auth for user management
- **Better Querying**: Full SQL capabilities vs DynamoDB's limited query model
- **Real-time**: Built-in real-time subscriptions for collaborative features

## What Changed

### Files Updated

1. **New Files Created**:
   - `/src/lib/supabase.ts` - Supabase client and database operations (replaces `dynamodb.ts`)
   - `/supabase-schema.sql` - Database schema for Supabase

2. **Files Modified**:
   - `/src/lib/workflow-orchestrator.ts` - Now uses Supabase for workflow persistence
   - `/src/app/api/projects/route.ts` - Updated imports
   - `/src/app/api/pal/generate/route.ts` - Updated imports
   - `/src/app/api/swarm/webhook/route.ts` - Updated imports
   - `/.env.example` - Updated environment variables

3. **Files Deprecated** (can be deleted):
   - `/src/lib/dynamodb.ts` - No longer used

### Database Schema

The following tables are created in Supabase:

1. **projects** - Stores user projects and campaigns
2. **chat_messages** - Stores chat history and PAL conversations
3. **artifacts** - Stores generated artifacts (n8n JSON, skill definitions, etc.)
4. **automation_workflows** - Stores automation workflow state and results

## Setup Instructions

### Step 1: Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign up/login
2. Click "New Project"
3. Enter:
   - Project name: `prospect-pal` (or your choice)
   - Database password: (save this securely)
   - Region: Choose closest to your users
4. Click "Create new project"
5. Wait for project to be provisioned (~2 minutes)

### Step 2: Run Database Migration

1. In your Supabase project, click **SQL Editor** in the left sidebar
2. Click **New Query**
3. Copy the contents of `/supabase-schema.sql` from this repo
4. Paste into the SQL editor
5. Click **Run** (bottom right)
6. Verify success - you should see "Success. No rows returned"

### Step 3: Get API Credentials

1. In your Supabase project, click **Project Settings** (gear icon)
2. Click **API** in the sidebar
3. Copy the following values:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### Step 4: Update Environment Variables

1. Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

2. Update the Supabase variables in `.env.local`:
   ```bash
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
   ```

3. Keep your AWS credentials (for Bedrock AI):
   ```bash
   AWS_REGION=us-east-1
   AWS_ACCESS_KEY_ID=your_key
   AWS_SECRET_ACCESS_KEY=your_secret
   ```

### Step 5: Update Vercel Environment Variables

If deploying to Vercel:

1. Go to your Vercel project dashboard
2. Click **Settings** → **Environment Variables**
3. **Remove** old DynamoDB variables:
   - `DYNAMODB_TABLE_PROJECTS`
   - `DYNAMODB_TABLE_SESSIONS`
   - `DYNAMODB_TABLE_ARTIFACTS`

4. **Add** new Supabase variables:
   - `NEXT_PUBLIC_SUPABASE_URL` = your Supabase project URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = your anon key

5. Click **Redeploy** to apply changes

### Step 6: Test Locally

```bash
# Install dependencies (if needed)
npm install

# Run development server
npm run dev

# Open http://localhost:3000
# Try creating a project to verify database connection
```

## Database Differences

### DynamoDB → Supabase Mapping

| DynamoDB Table | Supabase Table | Changes |
|----------------|----------------|---------|
| ProspectPALProjects | `projects` | Column names snake_case (`user_id` vs `userId`) |
| ProspectPALSessions | `chat_messages` | Renamed for clarity |
| ProspectPALArtifacts | `artifacts` | Added foreign key to projects |
| N/A | `automation_workflows` | New table for workflow state |

### Field Name Changes

All database fields now use `snake_case` instead of `camelCase`:

- `userId` → `user_id`
- `projectId` → `project_id`
- `icpConfig` → `icp_config`
- `toolStack` → `tool_stack`
- `createdAt` → `created_at`
- `updatedAt` → `updated_at`

The TypeScript interfaces in `/src/lib/supabase.ts` handle this mapping automatically.

## Row Level Security (RLS)

Supabase RLS policies are enabled to ensure users can only access their own data:

- Users can only view/edit/delete their own projects
- Users can only access chat messages for their projects
- Users can only access artifacts for their projects
- Users can only access their own workflows

This provides better security than DynamoDB's IAM-based access control.

## Migration from Existing DynamoDB Data

If you have existing data in DynamoDB that you want to migrate:

1. **Export DynamoDB data**:
   ```bash
   # Use AWS CLI or DynamoDB console to export tables
   aws dynamodb scan --table-name ProspectPALProjects > projects.json
   ```

2. **Transform to Supabase format**:
   ```javascript
   // Example script to transform data
   const projects = require('./projects.json').Items;
   const transformed = projects.map(p => ({
     id: p.id.S,
     user_id: p.userId.S,
     name: p.name.S,
     // ... map other fields
   }));
   ```

3. **Import to Supabase**:
   - Use Supabase SQL editor to insert data
   - Or use the Supabase JavaScript client to bulk insert

Contact the team if you need help with data migration.

## Troubleshooting

### Error: "Invalid API key"
- Check that `NEXT_PUBLIC_SUPABASE_ANON_KEY` is set correctly
- Verify the key is the **anon public** key, not the service_role key

### Error: "Failed to fetch"
- Check that `NEXT_PUBLIC_SUPABASE_URL` is set correctly
- Verify your Supabase project is active (not paused)

### Error: "new row violates row-level security policy"
- RLS policies require authenticated users
- For demo/development, you may need to adjust RLS policies
- Or use Supabase Auth to authenticate users

### Database schema errors
- Re-run the migration script from `/supabase-schema.sql`
- Check for typos in table/column names
- Verify all tables were created (4 tables total)

## Benefits of Supabase

1. **Development Speed**: Built-in admin UI to view/edit data
2. **Cost**: Free tier includes 500MB database, 2GB bandwidth
3. **Real-time**: Add live updates to your UI with minimal code
4. **Auth**: Integrated authentication (email, OAuth, magic links)
5. **Storage**: Built-in file storage for large artifacts
6. **Functions**: Serverless functions for complex logic
7. **SQL**: Full PostgreSQL capabilities for complex queries

## Next Steps

- Explore the Supabase dashboard to view your data
- Set up Supabase Auth for user authentication
- Enable real-time subscriptions for live updates
- Use Supabase Storage for large n8n workflow files
- Add database backups via Supabase UI

## Support

If you encounter issues:
1. Check Supabase logs in the project dashboard
2. Review the RLS policies in the SQL editor
3. Verify environment variables are set correctly
4. Check the browser console for detailed error messages

For Supabase-specific questions, see their excellent [documentation](https://supabase.com/docs).
