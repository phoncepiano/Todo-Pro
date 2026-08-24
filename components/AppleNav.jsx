"use client";

import Link from "next/link";
import { useTheme } from "@/hooks/useTheme";
import Logo from "./ui/Logo";
import UserMenu from "./ui/UserMenu";
import ThemeToggle from "./ui/ThemeToggle";

export default function AppleNav({ activeTab, setActiveTab }) {
  const { theme, cycleTheme, isReady } = useTheme();
  const navLinks = [
    { id: "overview", label: "Overview" },
    { id: "todo", label: "Todo App" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full flex flex-col">
      <div className="h-[52px] w-full bg-apple-canvas-parchment/80 backdrop-blur-md text-apple-ink border-b border-apple-hairline flex items-center justify-center px-4 md:px-8">
        <div className="w-full max-w-[1024px] flex items-center justify-between h-full">
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
            <UserMenu />
            {isReady ? (
              <ThemeToggle theme={theme} onCycle={cycleTheme} />
            ) : (
              <div className="h-9 w-9 shrink-0" aria-hidden />
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
