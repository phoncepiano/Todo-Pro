"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const variants = {
  dark:
    "inline-flex h-8 min-w-[4.5rem] items-center justify-center rounded-sm border border-white/20 bg-[#1d1d1f] px-[15px] typography-button-utility leading-none text-apple-body-on-dark shadow-[inset_0_1px_0_0_rgba(255,255,255,0.08)] transition-[background-color,border-color,box-shadow,transform] duration-150 hover:border-white/35 hover:bg-[#323234] apple-active-scale",
  light:
    "inline-flex h-9 items-center justify-center rounded-full bg-apple-primary px-[22px] typography-button-utility leading-none text-white shadow-none transition-[background-color,transform] duration-150 hover:bg-apple-primary-focus focus:outline-none focus:ring-2 focus:ring-apple-primary-focus focus:ring-offset-2 focus:ring-offset-apple-canvas-parchment apple-active-scale",
};

export default function NavSignInButton({ variant = "light", className = "" }) {
  const pathname = usePathname();

  const isSignIn = pathname === "/sign-in";
  const isSignUp = pathname === "/sign-up";

  const href = isSignIn ? "/sign-up" : "/sign-in";
  const label = isSignIn ? "Sign Up" : isSignUp ? "Sign In" : "Sign In";

  return (
    <Link
      href={href}
      className={`${variants[variant]} whitespace-nowrap ${className}`.trim()}
    >
      {label}
    </Link>
  );
}
