"use client";

import { useState } from "react";

export default function AuthField({
  id,
  label,
  type = "text",
  autoComplete,
  value,
  onChange,
  required = false,
  minLength,
}) {
  const [active, setActive] = useState(false);
  const filled = Boolean(value);

  const shellClass = [
    "flex h-11 w-full items-center rounded-full border transition-colors",
    active
      ? "border-apple-primary bg-apple-canvas text-apple-ink shadow-[0_0_0_3px_rgba(0,113,227,0.12)] dark:shadow-[0_0_0_3px_rgba(41,151,255,0.18)]"
      : filled
        ? "border-apple-hairline bg-apple-canvas text-apple-ink hover:border-apple-primary/40"
        : "border-apple-hairline bg-apple-canvas text-apple-ink hover:border-apple-primary/30",
  ].join(" ");

  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="typography-caption-strong text-apple-ink">
        {label}
      </label>
      <div className={shellClass}>
        <input
          id={id}
          name={id}
          type={type}
          autoComplete={autoComplete}
          required={required}
          minLength={minLength}
          value={value}
          onChange={onChange}
          onFocus={() => setActive(true)}
          onBlur={() => setActive(false)}
          className="apple-field-control typography-body h-full w-full rounded-full bg-transparent px-5 outline-none placeholder:text-apple-ink-muted-48"
        />
      </div>
    </div>
  );
}
