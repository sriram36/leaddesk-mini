# LeadDesk Mini - Setup Guide

This application uses **TanStack Start** with **Supabase** as the backend for authentication and data storage.

## Prerequisites

- Node.js 18+ and npm/pnpm
- A Supabase project (create one at https://supabase.com)

## Installation

1. **Clone and install dependencies:**
   ```bash
   npm install
   # or
   pnpm install
   ```

2. **Create `.env.local` in the project root:**
   ```bash
   cp .env.example .env.local
   ```

3. **Add your Supabase credentials to `.env.local`:**
   ```
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your_anon_key_here
   ```

## Supabase Setup

### Create the `leads` table

Run this SQL in your Supabase SQL editor:

```sql
-- Create leads table
CREATE TABLE leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  budget TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'New',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create index on email for faster lookups
CREATE INDEX leads_email_idx ON leads(email);

-- Create index on status for filtering
CREATE INDEX leads_status_idx ON leads(status);

-- Enable Row Level Security (optional but recommended)
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
```

### Set up Authentication

1. Go to your Supabase project's **Authentication** section
2. Enable **Email/Password** auth provider
3. Create a test user or use: `admin@leaddesk.com` with password `password123` (change this in production!)

## Environment Variables

- `VITE_SUPABASE_URL`: Your Supabase project URL
- `VITE_SUPABASE_ANON_KEY`: Your public anon key (safe to expose in frontend code)

## Running the App

```bash
# Development
npm run dev
# or
pnpm dev
```

Visit `http://localhost:5173` to see the app:

- **Landing page** (`/`): Submit leads
- **Admin login** (`/login`): Sign in with Supabase auth
- **Admin dashboard** (`/admin`): View and manage leads

## Features

✅ **Lead Capture**: Beautiful form on landing page
✅ **Real Database**: All leads stored in Supabase
✅ **Authentication**: Supabase Auth with email/password
✅ **Admin Dashboard**: View, search, and filter leads
✅ **Status Management**: Update lead status (New, Contacted, Closed)
✅ **Session Protection**: Admin routes require authentication
✅ **Server Validation**: Zod validation on lead submissions

## Project Structure

```
src/
├── routes/
│   ├── __root.tsx          # Root layout
│   ├── index.tsx           # Landing page (lead capture)
│   ├── login.tsx           # Admin login
│   └── admin.tsx           # Admin dashboard
├── lib/
│   └── supabase.ts         # Supabase client
├── server.ts               # Server functions & validation
└── styles.css
```

## Troubleshooting

**"Missing Supabase environment variables"**
- Ensure `.env.local` exists with correct URL and key

**"supabase.from is not a function"**
- Check that Supabase client is properly initialized
- Verify environment variables are loaded

**"Leads table not found"**
- Run the SQL setup script in Supabase SQL editor
- Verify table was created successfully

## Deployment

When deploying to Vercel:

1. Add environment variables in Vercel project settings:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`

2. Deploy via Git push or `vercel deploy`

## Support

For issues with Supabase, visit: https://supabase.com/docs
For issues with TanStack Start, visit: https://tanstack.com/start/latest
