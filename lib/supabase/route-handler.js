import { createServerClient } from "@supabase/ssr";
import { getSupabasePublishableKey, getSupabaseUrl } from "@/lib/env";

/**
 * Supabase client for route handlers. Collects auth cookie writes so they can be
 * applied to the final redirect response.
 *
 * @param {import("next/server").NextRequest} request
 */
export function createRouteHandlerClient(request) {
  /** @type {import("@supabase/ssr").CookieOptions[]} */
  let pendingCookies = [];
  /** @type {Record<string, string>} */
  let pendingHeaders = {};

  const supabase = createServerClient(
    getSupabaseUrl(),
    getSupabasePublishableKey(),
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet, headers) {
          pendingCookies = cookiesToSet;
          pendingHeaders = headers;
        },
      },
    }
  );

  return {
    supabase,
    /**
     * @param {import("next/server").NextResponse} response
     */
    applyCookiesTo(response) {
      pendingCookies.forEach(({ name, value, options }) => {
        response.cookies.set(name, value, options);
      });
      Object.entries(pendingHeaders).forEach(([key, value]) => {
        response.headers.set(key, value);
      });
      return response;
    },
  };
}
