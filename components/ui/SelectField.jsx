"use client";

import { useState } from "react";
import { fieldControlClass, fieldShellClass } from "./fieldStyles";

function ChevronIcon({ active }) {
  return (
    <svg
      viewBox="0 0 20 20"
      className={`pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 transition-colors ${
        active ? "text-apple-primary" : "text-apple-ink-muted-48"
      }`}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      aria-hidden
    >
      <path d="M5.5 8l4.5 4.5L14.5 8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function SelectField({
  className = "",
  wrapperClassName = "",
  filled = false,
  children,
  onFocus,
  onBlur,
  value,
  defaultValue,
  ...props
}) {
  const [active, setActive] = useState(false);
  const hasValue = Boolean(value ?? defaultValue);

  return (
    <div
      className={`relative ${fieldShellClass({
        active,
        filled,
        className: wrapperClassName,
      })}`.trim()}
    >
      <select
        {...props}
        value={value}
        defaultValue={defaultValue}
        onFocus={(event) => {
          setActive(true);
          onFocus?.(event);
        }}
        onBlur={(event) => {
          setActive(false);
          onBlur?.(event);
        }}
        className={`${fieldControlClass} h-full min-h-10 w-full cursor-pointer appearance-none pr-9 ${
          active || hasValue ? "text-apple-ink" : "text-apple-ink-muted-48"
        } ${className}`.trim()}
      >
        {children}
      </select>
      <ChevronIcon active={active} />
    </div>
  );
}
