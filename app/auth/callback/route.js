import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getVerificationErrorMessage } from "@/lib/auth";

function redirectToVerifyEmail(origin, params) {
  const failureUrl = new URL("/verify-email", origin);

  for (const [key, value] of Object.entries(params)) {
    if (value) failureUrl.searchParams.set(key, value);
  }

  return NextResponse.redirect(failureUrl.toString());
}

export async function GET(request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/";
  const error = searchParams.get("error");
  const errorCode = searchParams.get("error_code");
  const errorDescription = searchParams.get("error_description");

  if (error || errorCode) {
    return redirectToVerifyEmail(origin, {
      error: errorCode ?? error ?? "confirmation_failed",
      error_description: errorDescription ?? "",
    });
  }

  if (code) {
    const supabase = await createClient();
    const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);

    if (!exchangeError) {
      const url = new URL(next, origin);
      url.searchParams.set("verified", "1");
      return NextResponse.redirect(url.toString());
    }

    return redirectToVerifyEmail(origin, {
      error: exchangeError.code ?? "confirmation_failed",
      error_description: getVerificationErrorMessage(
        exchangeError.code,
        exchangeError.message
      ),
    });
  }

  return redirectToVerifyEmail(origin, {
    error: "confirmation_failed",
  });
}
