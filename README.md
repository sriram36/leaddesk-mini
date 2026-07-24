# LeadDesk Mini

A lightweight, modern lead capture tool built for B2B teams. This project includes a public landing page with a lead capture form and a secured admin dashboard to triage and manage incoming leads.

## Architecture

- **Frontend & Framework**: TanStack Start (React, File-based routing, SSR)
- **Styling**: Tailwind CSS + Radix UI primitives
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth

## Data Model

The application uses a single primary table in Supabase called `leads`.

### `leads` table
- `id`: UUID (Primary Key)
- `name`: Text (Name of the lead)
- `email`: Text (Work email address)
- `budget`: Text (Selected budget range from the form)
- `message`: Text (Description of the project/goals)
- `status`: Text (Current status: `New`, `Contacted`, or `Closed`)
- `created_at`: Timestamp (When the lead submitted the form)

## Authentication Approach

The admin area (`/admin`) is secured using **Supabase Auth**.

1. **Login Flow**: Admins sign in at `/login` using `signInWithPassword`. The authentication state is maintained via Supabase session management.
2. **Route Protection**: The `/admin` route is protected server-side and client-side. The route definition in TanStack Start uses a `beforeLoad` check to validate the session (`supabase.auth.getSession()`). If no active session exists, the user is redirected or unauthorized, preventing unauthenticated access to the lead data.
3. **API Security**: Row Level Security (RLS) policies in Supabase can be configured to ensure only authenticated users can read or update the `leads` table, while allowing public inserts for the landing page form.

## Deployment

The application is configured to build with Nitro and can be deployed to edge platforms like Cloudflare Pages, Vercel, or Netlify on a free tier.

**Test Credentials:**
- **Email:** `admin@leaddesk.com`
- **Password:** *(Use the password configured in your Supabase Auth settings)*

## Project Structure & Cleanup

As part of preparing this repository for submission, all unused boilerplate, generator configurations (e.g., Lovable telemetry), and unreferenced UI components (such as the Shadcn `form.tsx`) were purged. The current structure contains **only** the necessary code to fulfill the requirements of LeadDesk Mini.

## Loom Walkthrough

*(Insert link to the Loom video recording here)*
