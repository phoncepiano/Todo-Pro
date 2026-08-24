"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";
import { createClient } from "@/lib/supabase/client";
import AuthField from "./AuthField";

function isEmailNotConfirmedError ( message )
{
  return /email not confirmed/i.test( message );
}

export default function SignInForm ()
{
  const router = useRouter();
  const { refreshProfile } = useAuth();
  const [ email, setEmail ] = useState( "" );
  const [ password, setPassword ] = useState( "" );
  const [ error, setError ] = useState( "" );
  const [ loading, setLoading ] = useState( false );

  async function handleSubmit ( event )
  {
    event.preventDefault();
    setError( "" );
    setLoading( true );

    const supabase = createClient();
    const { data, error: signInError } = await supabase.auth.signInWithPassword( {
      email,
      password,
    } );

    setLoading( false );

    if ( signInError )
    {
      if ( isEmailNotConfirmedError( signInError.message ) )
      {
        router.push( `/verify-email?email=${ encodeURIComponent( email ) }` );
        return;
      }

      setError( signInError.message );
      return;
    }

    if ( !data.user?.email_confirmed_at )
    {
      await supabase.auth.signOut();
      router.push( `/verify-email?email=${ encodeURIComponent( email ) }` );
      return;
    }

    await refreshProfile();
    router.push( "/" );
    router.refresh();
  }

  return (
    <form onSubmit={ handleSubmit } className="flex flex-col gap-6">
      <AuthField
        id="email"
        label="Email"
        type="email"
        autoComplete="email"
        value={ email }
        onChange={ ( event ) => setEmail( event.target.value ) }
        required
      />

      <AuthField
        id="password"
        label="Password"
        type="password"
        autoComplete="current-password"
        value={ password }
        onChange={ ( event ) => setPassword( event.target.value ) }
        required
        minLength={ 6 }
      />

      { error ? (
        <p className="typography-caption text-red-600" role="alert">
          { error }
        </p>
      ) : null }

      <button
        type="submit"
        disabled={ loading }
        className="w-full bg-apple-primary text-white typography-body rounded-full px-5.5 py-2.75 apple-active-scale transition-transform focus:outline-none focus:ring-2 focus:ring-apple-primary-focus disabled:opacity-60 disabled:cursor-not-allowed"
      >
        { loading ? "Signing in…" : "Sign In" }
      </button>

      <p className="typography-body text-center text-apple-ink-muted-80">
        Don&apos;t have an account?{ " " }
        <Link href="/sign-up" className="text-apple-primary hover:underline">
          Create one
        </Link>
      </p>

      <p className="typography-fine-print text-apple-ink-muted-48 text-center leading-relaxed">
        Your account is protected with industry-standard encryption. By signing in, you agree to our Terms of Use and Privacy Policy.
      </p>
    </form>
  );
}
