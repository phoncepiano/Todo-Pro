import { NextResponse } from "next/server";
import { getVerificationErrorMessage } from "@/lib/auth";
import { createRouteHandlerClient } from "@/lib/supabase/route-handler";

function redirectToVerifyEmail(origin, params) {
  const failureUrl = new URL("/verify-email", origin);

  for (const [key, value] of Object.entries(params)) {
    if (value) failureUrl.searchParams.set(key, value);
  }

  return NextResponse.redirect(failureUrl.toString());
}

function redirectToSuccess(origin, next) {
  const url = new URL(next, origin);
  url.searchParams.set("verified", "1");
  return NextResponse.redirect(url.toString());
}

export async function GET(request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const tokenHash = searchParams.get("token_hash");
  const type = searchParams.get("type");
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

  const successRedirect = redirectToSuccess(origin, next);

  if (tokenHash && type) {
    const { supabase, applyCookiesTo } = createRouteHandlerClient(request);

    const { error: verifyError } = await supabase.auth.verifyOtp({
      type,
      token_hash: tokenHash,
    });

    if (!verifyError) {
      return applyCookiesTo(successRedirect);
    }

    return redirectToVerifyEmail(origin, {
      error: verifyError.code ?? "confirmation_failed",
      error_description: getVerificationErrorMessage(
        verifyError.code,
        verifyError.message
      ),
    });
  }

  if (code) {
    const { supabase, applyCookiesTo } = createRouteHandlerClient(request);
    const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);

    if (!exchangeError) {
      return applyCookiesTo(successRedirect);
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
