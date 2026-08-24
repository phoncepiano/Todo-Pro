# Todo Pro

A todo app built with Next.js and Supabase, styled with an Apple-inspired design system. Todos live in Postgres and sync across devices in real time, so the list stays current in every open tab.

## Features

- **Email/password accounts** with mandatory email verification before the todo list unlocks
- **Per-user todos** isolated by Postgres row level security
- **Realtime sync** — inserts, updates, and deletes propagate to other open sessions
- **Rich todos** with a category, free-form tags, and an optional due date that flags overdue items
- **Drag to reorder**, filter by status or category, and clear completed in one action
- **Light, dark, and system themes** from the settings menu, remembered in `localStorage`
- **Animated UI** using Framer Motion for staggered lists and view transitions

## Tech stack

| Concern | Choice |
| --- | --- |
| Framework | Next.js 16 (App Router, Turbopack) |
| UI | React 19, Tailwind CSS 4, Framer Motion |
| Backend | Supabase (Postgres, Auth, Realtime) |
| Drag and drop | dnd kit |

## Getting started

Install dependencies:

```bash
npm install
```

Create `.env.local` with your Supabase project details:

```bash
SUPABASE_URL=https://<project-ref>.supabase.co
SUPABASE_PUBLISHABLE_KEY=<publishable-key>
SITE_URL=http://localhost:3000
```

`SITE_URL` must match the origin the dev server actually serves on, since PKCE and email links are built from it. If Next.js falls back to another port because 3000 is taken, update this value to match.

Apply the migrations in `supabase/migrations/` to your project, then add `{SITE_URL}/auth/callback` to **Authentication → URL Configuration → Redirect URLs** in the Supabase dashboard so email confirmation links resolve.

Run the dev server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000), create an account, and confirm the verification email to reach the todo list.

## Project layout

```text
app/              Routes: landing page, sign-in, sign-up, verify-email, auth callback
components/       Todo UI, auth screens, navigation, shared primitives in ui/
hooks/            useTodos (data + realtime), useTheme
lib/              Supabase clients, todo data access, auth helpers, constants
supabase/         SQL migrations
```

`schema.md` documents the database tables, RLS policies, and the auth flow in detail.

## Scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the dev server |
| `npm run build` | Production build |
| `npm start` | Serve the production build |
| `npm run lint` | Run ESLint |
