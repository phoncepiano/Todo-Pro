"use client";

import Link from "next/link";
import Logo from "@/components/ui/Logo";

export default function AuthShell ( { title, subtitle, children } )
{
  return (
    <div className="min-h-screen bg-apple-canvas-parchment text-apple-ink flex flex-col font-sans antialiased">
      <header className="sticky top-0 z-50 w-full flex flex-col">
        <div className="h-[52px] w-full bg-apple-canvas-parchment/80 backdrop-blur-md text-apple-ink border-b border-apple-hairline flex items-center justify-center px-4 md:px-8">
          <div className="w-full max-w-[1024px] flex items-center justify-between h-full">
            <Link
              href="/"
              className="flex items-center gap-2 typography-tagline font-semibold tracking-tight hover:opacity-80 transition-opacity text-apple-ink"
            >
              <Logo className="h-7 w-7 shrink-0" />
              Todo Pro
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center px-4 py-12 md:py-20">
        <div className="w-full max-w-[440px]">
          <div className="text-center mb-8">
            <h1 className="typography-display-md text-apple-ink mb-3">{ title }</h1>
            { subtitle ? (
              <p className="typography-lead-airy text-apple-ink-muted-80">{ subtitle }</p>
            ) : null }
          </div>

          <div className="bg-apple-canvas border border-apple-hairline rounded-[18px] p-6 md:p-8">
            { children }
          </div>
        </div>
      </main>

      <footer className="bg-apple-canvas-parchment text-apple-ink-muted-80 py-12 px-6 text-center">
        <p className="typography-fine-print text-apple-ink-muted-48">
          Copyright © 2026 { "Mr A's Org" }. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
