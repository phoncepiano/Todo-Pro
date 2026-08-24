import { getSiteUrl } from "@/lib/env";

const LOCAL_HOSTS = new Set(["localhost", "127.0.0.1"]);

/**
 * @param {import("@supabase/supabase-js").User | null | undefined} user
 */
export function isEmailVerified(user) {
  return Boolean(user?.email_confirmed_at);
}

/**
 * Canonical app origin for auth redirects. In development, LAN IPs are mapped to
 * localhost so email links and PKCE use a secure context.
 */
export function getSiteOrigin() {
  try {
    return getSiteUrl();
  } catch {
    // Fall through when SITE_URL is unset (e.g. during static analysis).
  }

  if (typeof window !== "undefined") {
    const { hostname, port, protocol } = window.location;

    if (process.env.NODE_ENV === "development" && !LOCAL_HOSTS.has(hostname)) {
      return `http://localhost:${port || "3000"}`;
    }

    return window.location.origin;
  }

  return "http://localhost:3000";
}

export function getAuthCallbackUrl() {
  return `${getSiteOrigin()}/auth/callback`;
}

export function isSecureAuthContext() {
  if (typeof window === "undefined") return true;

  return (
    window.isSecureContext &&
    typeof crypto !== "undefined" &&
    typeof crypto.subtle !== "undefined"
  );
}

/**
 * @param {string | null | undefined} errorCode
 * @param {string | null | undefined} errorDescription
 */
export function getVerificationErrorMessage(errorCode, errorDescription) {
  switch (errorCode) {
    case "otp_expired":
      return "That verification link has expired. Request a new one below.";
    case "access_denied":
      return errorDescription
        ? decodeURIComponent(errorDescription.replace(/\+/g, " "))
        : "Email verification was denied. Request a new link below.";
    case "confirmation_failed":
      return "That confirmation link is invalid or has expired. Request a new one below.";
    default:
      return errorDescription
        ? decodeURIComponent(errorDescription.replace(/\+/g, " "))
        : "Email verification failed. Request a new link below.";
  }
}
