import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      const url = new URL(next, origin);
      url.searchParams.set("verified", "1");
      return NextResponse.redirect(url.toString());
    }
  }

  const failureUrl = new URL("/verify-email", origin);
  failureUrl.searchParams.set("error", "confirmation_failed");
  return NextResponse.redirect(failureUrl.toString());
}
