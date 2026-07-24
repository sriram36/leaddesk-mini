# LeadDesk Mini

A lightweight, modern lead capture tool built for B2B teams. This project includes a public landing page with a lead capture form and a secured admin dashboard to triage and manage incoming leads.

## Live URLs

- **Landing page:** `https://leaddesk-mini-sigma.vercel.app/`
- **Admin dashboard:** `https://leaddesk-mini-sigma.vercel.app/admin`

## Test Credentials

- **Email:** `kollisriram6@gmail.com`
- **Password:** *(123456)*

## Architecture

- **Frontend & Framework:** TanStack Start (React 19, file-based routing, SSR via Nitro)
- **Styling:** Tailwind CSS v4 + Radix UI primitives (shadcn/ui)
- **Database:** Supabase (PostgreSQL)
- **Authentication:** Supabase Auth (email/password)
- **Form Handling:** react-hook-form + zod (client-side and server-side validation)
- **Deployment:** Vercel (free tier)

## Data Model

The application uses a single primary table in Supabase called `leads`.

### `leads` table
| Column | Type | Description |
|---|---|---|
| `id` | UUID (PK) | Auto-generated lead identifier |
| `name` | Text | Full name of the lead |
| `email` | Text | Work email address |
| `budget` | Text | Selected budget range |
| `message` | Text | Project description / goals |
| `status` | Text | `New`, `Contacted`, or `Closed` |
| `created_at` | Timestamp | Submission timestamp |

### Row Level Security

RLS is enabled on the `leads` table. Run the policies in `sql/rls_policies.sql` in your Supabase SQL Editor:

- **Anonymous INSERT** — anyone can submit the form (public landing page)
- **Authenticated SELECT** — only logged-in admins can view leads
- **Authenticated UPDATE** — only logged-in admins can change lead status

## Authentication Approach

The admin area (`/admin`) is secured using **Supabase Auth**. 

1. **Login at `/admin`** — unauthenticated visitors see a login form directly on the admin route. No separate login page.
2. **Session check** — on mount, the admin page calls `supabase.auth.getSession()`. If a valid session exists (stored in localStorage by Supabase), the dashboard renders. If not, the login form is shown.
3. **Logout** — clears the session and returns to the login form on the same route.
4. **SSR safe** — the server-side render skips auth checks (localStorage is browser-only), showing a loading spinner until the client takes over.

## Project Structure

```
src/
  routes/
    index.tsx          # Public landing page with lead form
    admin.tsx          # Admin dashboard + login form
    login.tsx          # Redirects /login → /admin
    __root.tsx         # Root layout
  server.ts            # submitLeadFn — server function with validation + retry logic
  lib/
    supabase.ts        # Supabase client
    schemas.ts         # Zod validation schemas
    utils.ts           # cn() utility
  components/ui/       # shadcn/ui components
  hooks/
    useDebounce.ts     # Search debounce hook
sql/
  rls_policies.sql     # Supabase RLS policies
```

