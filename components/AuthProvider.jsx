"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { isEmailVerified } from "@/lib/auth";

/**
 * @typedef {Object} UserProfile
 * @property {string} id
 * @property {string} email
 * @property {string} full_name
 * @property {string} created_at
 * @property {string} updated_at
 */

/**
 * @typedef {Object} AuthContextValue
 * @property {import("@supabase/supabase-js").User | null} user
 * @property {UserProfile | null} profile
 * @property {boolean} isLoading
 * @property {boolean} isAuthenticated
 * @property {boolean} isEmailVerified
 * @property {() => Promise<void>} signOut
 * @property {() => Promise<void>} refreshProfile
 */

const AuthContext = createContext(/** @type {AuthContextValue | null} */ (null));

async function fetchProfile(userId) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("users")
    .select("id, email, full_name, created_at, updated_at")
    .eq("id", userId)
    .maybeSingle();

  if (error) throw error;
  return data;
}

export function AuthProvider({ children }) {
  const router = useRouter();
  const [user, setUser] = useState(/** @type {import("@supabase/supabase-js").User | null} */ (null));
  const [profile, setProfile] = useState(/** @type {UserProfile | null} */ (null));
  const [isLoading, setIsLoading] = useState(true);

  const refreshProfile = useCallback(async () => {
    const supabase = createClient();
    const {
      data: { user: currentUser },
    } = await supabase.auth.getUser();

    setUser(currentUser);

    if (!currentUser) {
      setProfile(null);
      return;
    }

    const nextProfile = await fetchProfile(currentUser.id);
    setProfile(nextProfile);
  }, []);

  useEffect(() => {
    const supabase = createClient();
    let cancelled = false;

    async function loadSession() {
      try {
        const {
          data: { user: currentUser },
        } = await supabase.auth.getUser();

        if (cancelled) return;

        setUser(currentUser);

        if (currentUser) {
          const nextProfile = await fetchProfile(currentUser.id);
          if (!cancelled) setProfile(nextProfile);
        } else {
          setProfile(null);
        }
      } catch (error) {
        console.error("Failed to load auth session", error);
        if (!cancelled) {
          setUser(null);
          setProfile(null);
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    void loadSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      const nextUser = session?.user ?? null;
      setUser(nextUser);

      if (!nextUser) {
        setProfile(null);
        setIsLoading(false);
        return;
      }

      void fetchProfile(nextUser.id)
        .then((nextProfile) => {
          if (!cancelled) setProfile(nextProfile);
        })
        .catch((error) => {
          console.error("Failed to load user profile", error);
          if (!cancelled) setProfile(null);
        })
        .finally(() => {
          if (!cancelled) setIsLoading(false);
        });
    });

    return () => {
      cancelled = true;
      subscription.unsubscribe();
    };
  }, []);

  const signOut = useCallback(async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
    router.push("/sign-in");
    router.refresh();
  }, [router]);

  const value = useMemo(
    () => ({
      user,
      profile,
      isLoading,
      isAuthenticated: Boolean(user),
      isEmailVerified: isEmailVerified(user),
      signOut,
      refreshProfile,
    }),
    [user, profile, isLoading, signOut, refreshProfile]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
