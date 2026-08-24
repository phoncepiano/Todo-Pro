"use client";

import { useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";
import { createClient } from "@/lib/supabase/client";
import { getAuthCallbackUrl } from "@/lib/auth";

export default function VerifyEmailPanel() {
  const searchParams = useSearchParams();
  const { signOut } = useAuth();
  const email = searchParams.get("email") ?? "";
  const verified = searchParams.get("verified") === "1";
  const confirmationError = searchParams.get("error") === "confirmation_failed";

  const [message, setMessage] = useState(
    verified
      ? "Your email is verified. You can sign in now."
      : confirmationError
        ? "That confirmation link is invalid or has expired. Request a new one below."
        : ""
  );
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleResend() {
    if (!email) {
      setError("Enter the email you used to sign up, then try again from the sign-up page.");
      return;
    }

    setError("");
    setMessage("");
    setLoading(true);

    const supabase = createClient();
    const { error: resendError } = await supabase.auth.resend({
      type: "signup",
      email,
      options: {
        emailRedirectTo: getAuthCallbackUrl(),
      },
    });

    setLoading(false);

    if (resendError) {
      setError(resendError.message);
      return;
    }

    setMessage("Verification email sent. Check your inbox and spam folder.");
  }

  return (
    <div className="flex flex-col gap-6">
      {email ? (
        <p className="typography-body text-apple-ink-muted-80 text-center">
          We sent a verification link to{" "}
          <span className="text-apple-ink font-semibold">{email}</span>. Open it to
          activate your account.
        </p>
      ) : (
        <p className="typography-body text-apple-ink-muted-80 text-center">
          Check your inbox for the verification link we sent when you signed up.
        </p>
      )}

      {error ? (
        <p className="typography-caption text-red-600 text-center" role="alert">
          {error}
        </p>
      ) : null}

      {message ? (
        <p className="typography-caption text-apple-primary text-center" role="status">
          {message}
        </p>
      ) : null}

      <button
        type="button"
        onClick={() => void handleResend()}
        disabled={loading || !email}
        className="w-full bg-apple-primary text-white typography-body rounded-full px-[22px] py-[11px] apple-active-scale transition-transform focus:outline-none focus:ring-2 focus:ring-apple-primary-focus disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {loading ? "Sending…" : "Resend verification email"}
      </button>

      <p className="typography-body text-center text-apple-ink-muted-80">
        Already verified?{" "}
        <Link href="/sign-in" className="text-apple-primary hover:underline">
          Sign in
        </Link>
        {" · "}
        <button
          type="button"
          onClick={() => void signOut()}
          className="text-apple-primary hover:underline"
        >
          Sign out
        </button>
      </p>

      <p className="typography-fine-print text-apple-ink-muted-48 text-center leading-relaxed">
        Links expire after 24 hours. If you did not receive an email, use resend or create a new account with a different address.
      </p>
    </div>
  );
}
