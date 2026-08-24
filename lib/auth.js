/**
 * @param {import("@supabase/supabase-js").User | null | undefined} user
 */
export function isEmailVerified(user) {
  return Boolean(user?.email_confirmed_at);
}

export function getAuthCallbackUrl() {
  if (typeof window !== "undefined") {
    return `${window.location.origin}/auth/callback`;
  }

  return `${process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"}/auth/callback`;
}
