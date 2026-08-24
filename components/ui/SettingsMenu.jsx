"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useAuth } from "@/components/AuthProvider";
import { useTheme } from "@/hooks/useTheme";

const THEME_OPTIONS = [
  { value: "light", label: "Light" },
  { value: "dark", label: "Dark" },
  { value: "system", label: "System" },
];

const themeIcons = {
  light: (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
    </svg>
  ),
  dark: (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  ),
  system: (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
      <rect x="2" y="3" width="20" height="14" rx="2" />
      <path d="M8 21h8M12 17v4" />
    </svg>
  ),
};

function SettingsIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  );
}

export default function SettingsMenu() {
  const menuId = useId();
  const rootRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const { isAuthenticated, isLoading, profile, signOut } = useAuth();
  const { theme, setTheme, isReady } = useTheme();

  useEffect(() => {
    if (!isOpen) return undefined;

    const handlePointerDown = (event) => {
      if (!rootRef.current?.contains(event.target)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  if (isLoading || !isReady) {
    return <div className="h-9 w-9 shrink-0" aria-hidden />;
  }

  const displayName = profile?.full_name?.trim() || profile?.email || "Account";

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        aria-label="Settings"
        aria-expanded={isOpen}
        aria-controls={menuId}
        title="Settings"
        className="relative flex h-9 w-9 items-center justify-center rounded-full border border-apple-hairline bg-apple-canvas text-apple-ink-muted-80 transition-colors hover:border-apple-primary hover:text-apple-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-apple-primary-focus"
      >
        <SettingsIcon />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            id={menuId}
            role="menu"
            aria-label="Settings"
            initial={{ opacity: 0, y: 8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.98 }}
            transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
            className="absolute right-0 top-[calc(100%+8px)] z-50 w-56 rounded-[18px] border border-apple-hairline bg-apple-canvas p-2 apple-product-shadow"
          >
            {isAuthenticated && (
              <div className="border-b border-apple-hairline px-3 py-2.5">
                <p className="typography-button-utility font-medium text-apple-ink truncate">
                  {displayName}
                </p>
              </div>
            )}

            <div className="px-2 py-2">
              <p className="px-2 pb-2 typography-button-utility text-apple-ink-muted-48">
                Appearance
              </p>
              <div className="space-y-1" role="group" aria-label="Theme">
                {THEME_OPTIONS.map((option) => {
                  const isActive = theme === option.value;
                  return (
                    <button
                      key={option.value}
                      type="button"
                      role="menuitemradio"
                      aria-checked={isActive}
                      onClick={() => setTheme(option.value)}
                      className={`flex w-full items-center gap-2.5 rounded-xl px-2.5 py-2 typography-button-utility transition-colors ${
                        isActive
                          ? "bg-apple-primary/10 text-apple-primary"
                          : "text-apple-ink hover:bg-apple-divider-soft"
                      }`}
                    >
                      <span className={isActive ? "text-apple-primary" : "text-apple-ink-muted-80"}>
                        {themeIcons[option.value]}
                      </span>
                      {option.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="border-t border-apple-hairline px-2 py-2">
              {isAuthenticated ? (
                <button
                  type="button"
                  role="menuitem"
                  onClick={() => {
                    setIsOpen(false);
                    void signOut();
                  }}
                  className="flex w-full items-center justify-center rounded-xl px-2.5 py-2 typography-button-utility text-apple-ink transition-colors hover:bg-apple-divider-soft"
                >
                  Sign Out
                </button>
              ) : (
                <Link
                  href="/sign-in"
                  role="menuitem"
                  onClick={() => setIsOpen(false)}
                  className="flex w-full items-center justify-center rounded-xl bg-apple-primary px-2.5 py-2 typography-button-utility text-white transition-colors hover:bg-apple-primary-focus"
                >
                  Sign In
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
