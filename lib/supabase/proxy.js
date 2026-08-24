import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";
import { isEmailVerified } from "@/lib/auth";

const authRoutes = ["/sign-in", "/sign-up"];
const verificationRoutes = ["/verify-email"];

export async function updateSession(request) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet, headers) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
          Object.entries(headers).forEach(([key, value]) =>
            supabaseResponse.headers.set(key, value)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;

  if (user && authRoutes.includes(pathname) && isEmailVerified(user)) {
    const url = request.nextUrl.clone();
    url.pathname = "/";
    return NextResponse.redirect(url);
  }

  if (user && !isEmailVerified(user) && !verificationRoutes.includes(pathname) && !pathname.startsWith("/auth/")) {
    const url = request.nextUrl.clone();
    url.pathname = "/verify-email";
    url.searchParams.set("email", user.email ?? "");
    return NextResponse.redirect(url);
  }

  if (user && isEmailVerified(user) && verificationRoutes.includes(pathname)) {
    const url = request.nextUrl.clone();
    url.pathname = "/";
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}
