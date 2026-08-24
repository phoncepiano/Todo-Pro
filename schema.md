# Database schema

Source of truth: live Supabase project `qtjuvuyvsihltltqtrnv` (`https://qtjuvuyvsihltltqtrnv.supabase.co`).

The app stores todos in Postgres and reads/writes them through the Supabase Data API. User accounts are managed by Supabase Auth (`auth.users`) with profile rows in `public.users`. Theme preference stays in browser `localStorage` and is not part of this schema.

## Overview

| Schema | Table | RLS | Realtime | Purpose |
| --- | --- | --- | --- | --- |
| `public` | `users` | enabled | — | Profile row for each authenticated user |
| `public` | `todos` | enabled | published on `supabase_realtime` | Per-user todo list |

```text
auth.users
  └── public.users (1:1 profile)
        └── public.todos (1:many, user_id FK)
```

## Migrations

| Version | Name |
| --- | --- |
| `20260824125852` | `create_todos_table` |
| `20260824150000` | `create_users_and_auth_policies` |

## `public.users`

One row per Supabase Auth user. Created automatically by the `on_auth_user_created` trigger when a user signs up.

### Columns

| Column | Type | Nullable | Default | Description |
| --- | --- | --- | --- | --- |
| `id` | `uuid` | no | — | Primary key. References `auth.users(id)`. |
| `email` | `text` | no | — | User email from auth. |
| `full_name` | `text` | no | `''` | Display name from sign-up metadata. |
| `created_at` | `timestamptz` | no | `now()` | Profile creation time. |
| `updated_at` | `timestamptz` | no | `now()` | Last profile update time. |

### Row Level Security

| Policy | Command | Roles | Using / with check |
| --- | --- | --- | --- |
| `users can view own profile` | `SELECT` | `authenticated` | `auth.uid() = id` |
| `users can update own profile` | `UPDATE` | `authenticated` | `auth.uid() = id` |

## `public.todos`

One row is one todo owned by a single user.

### Columns

| Column | Type | Nullable | Default | Description |
| --- | --- | --- | --- | --- |
| `id` | `uuid` | no | `gen_random_uuid()` | Primary key. |
| `user_id` | `uuid` | no | — | Owner. References `public.users(id)`. |
| `text` | `text` | no | — | Todo title. |
| `completed` | `boolean` | no | `false` | Whether the todo is done. |
| `category` | `text` | no | `'personal'` | One of `work`, `personal`, `learning`, `other`. |
| `tags` | `text[]` | no | `'{}'` | Free-form labels. |
| `due_date` | `date` | yes | `null` | Optional due date (`YYYY-MM-DD`). |
| `sort_order` | `bigint` | no | `0` | List position. |
| `created_at` | `timestamptz` | no | `now()` | Creation time. |

### Row Level Security

Todos are private to the signed-in user who owns them. Anonymous clients cannot read or write todos.

| Policy | Command | Roles | Using / with check |
| --- | --- | --- | --- |
| `users can select own todos` | `SELECT` | `authenticated` | `auth.uid() = user_id` |
| `users can insert own todos` | `INSERT` | `authenticated` | `auth.uid() = user_id` |
| `users can update own todos` | `UPDATE` | `authenticated` | `auth.uid() = user_id` |
| `users can delete own todos` | `DELETE` | `authenticated` | `auth.uid() = user_id` |

## Auth trigger

`public.handle_new_user()` runs after insert on `auth.users` and upserts the matching `public.users` profile. Execute privileges are revoked from `anon` and `authenticated`; only the trigger invokes it.

## App auth flow

| Route | Behavior |
| --- | --- |
| `/sign-up` | Creates `auth.users` row; trigger creates `public.users` profile; redirects to `/verify-email` |
| `/verify-email` | Instructions + resend verification email |
| `/sign-in` | Email/password session; unverified users are sent to `/verify-email` |
| `/auth/callback` | Exchanges email-confirmation codes for a session, then redirects home with `?verified=1` |
| `/` (Todo tab) | Requires authentication and a verified email |

Email verification is enforced in the proxy (server) and in the client auth layer. Users cannot use the todo app until `auth.users.email_confirmed_at` is set.

## App field mapping

`lib/todos.js` maps snake_case columns to the camelCase todo object used in the UI.

| Database | App (`Todo`) |
| --- | --- |
| `id` | `id` |
| `text` | `text` |
| `completed` | `completed` |
| `category` | `category` |
| `tags` | `tags` |
| `due_date` | `dueDate` |
| `sort_order` | `order` |
| `created_at` | `createdAt` |

`user_id` is set server-side from the authenticated session on insert/upsert and is not exposed in the client todo model.
