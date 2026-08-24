"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";
import { createClient } from "@/lib/supabase/client";
import { getAuthCallbackUrl } from "@/lib/auth";
import AuthField from "./AuthField";

export default function SignUpForm() {
  const router = useRouter();
  const { refreshProfile } = useAuth();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setLoading(true);

    const supabase = createClient();
    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
        emailRedirectTo: getAuthCallbackUrl(),
      },
    });

    setLoading(false);

    if (signUpError) {
      setError(signUpError.message);
      return;
    }

    if (data.session && data.user?.email_confirmed_at) {
      await refreshProfile();
      router.push("/");
      router.refresh();
      return;
    }

    router.push(`/verify-email?email=${encodeURIComponent(email)}`);
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <AuthField
        id="fullName"
        label="Full name"
        type="text"
        autoComplete="name"
        value={fullName}
        onChange={(event) => setFullName(event.target.value)}
        required
      />

      <AuthField
        id="email"
        label="Email"
        type="email"
        autoComplete="email"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        required
      />

      <AuthField
        id="password"
        label="Password"
        type="password"
        autoComplete="new-password"
        value={password}
        onChange={(event) => setPassword(event.target.value)}
        required
        minLength={6}
      />

      {error ? (
        <p className="typography-caption text-red-600" role="alert">
          {error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-apple-primary text-white typography-body rounded-full px-[22px] py-[11px] apple-active-scale transition-transform focus:outline-none focus:ring-2 focus:ring-apple-primary-focus disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {loading ? "Creating account…" : "Create Account"}
      </button>

      <p className="typography-body text-center text-apple-ink-muted-80">
        Already have an account?{" "}
        <Link href="/sign-in" className="text-apple-primary hover:underline">
          Sign in
        </Link>
      </p>

      <p className="typography-fine-print text-apple-ink-muted-48 text-center leading-relaxed">
        By creating an account, you agree to our Terms of Use and Privacy Policy.
      </p>
    </form>
  );
}
