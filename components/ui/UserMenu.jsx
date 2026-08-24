"use client";

import { useAuth } from "@/components/AuthProvider";
import NavSignInButton from "./NavSignInButton";

export default function UserMenu() {
  const { isAuthenticated, isLoading, profile, signOut } = useAuth();

  if (isLoading) {
    return <div className="h-9 w-24 shrink-0" aria-hidden />;
  }

  if (!isAuthenticated) {
    return <NavSignInButton variant="light" />;
  }

  const displayName = profile?.full_name?.trim() || profile?.email || "Account";

  return (
    <div className="flex items-center gap-3">
      <span className="hidden sm:inline typography-button-utility text-apple-ink-muted-80 max-w-[10rem] truncate">
        {displayName}
      </span>
      <button
        type="button"
        onClick={() => void signOut()}
        className="inline-flex h-9 items-center justify-center rounded-full border border-apple-hairline bg-apple-canvas px-[18px] typography-button-utility leading-none text-apple-ink transition-colors hover:border-apple-primary/30 hover:text-apple-primary apple-active-scale"
      >
        Sign Out
      </button>
    </div>
  );
}
