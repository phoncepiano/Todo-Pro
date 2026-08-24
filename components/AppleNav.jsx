"use client";

import { useAuth } from "@/components/AuthProvider";
import Logo from "./ui/Logo";
import SettingsMenu from "./ui/SettingsMenu";
import UserAvatar from "./ui/UserAvatar";

export default function AppleNav({ activeTab, setActiveTab }) {
  const { isAuthenticated, profile } = useAuth();
  const navLinks = [
    { id: "todo", label: "Todo-List" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full flex flex-col">
      <div className="h-13 w-full bg-apple-canvas-parchment/80 backdrop-blur-md text-apple-ink border-b border-apple-hairline flex items-center justify-center px-4 md:px-8">
        <div className="w-full max-w-5xl flex items-center justify-between h-full">
          <button
            onClick={() => setActiveTab("overview")}
            className="flex items-center gap-2 typography-tagline font-semibold tracking-tight hover:opacity-80 transition-opacity text-apple-ink"
          >
            <Logo className="h-8 w-8 shrink-0" />
            Todo Pro
          </button>

          <div className="flex items-center gap-5">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => setActiveTab(link.id)}
                className={`typography-button-utility transition-colors ${
                  activeTab === link.id
                    ? "text-apple-primary font-medium"
                    : "text-apple-ink-muted-80/70 hover:text-apple-ink"
                }`}
              >
                {link.label}
              </button>
            ))}
            {isAuthenticated && profile ? <UserAvatar profile={profile} /> : null}
            <SettingsMenu />
          </div>
        </div>
      </div>
    </header>
  );
}
