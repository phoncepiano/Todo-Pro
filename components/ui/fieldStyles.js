export const fieldActiveClass =
  "border-apple-primary bg-apple-canvas text-apple-ink shadow-[0_0_0_3px_rgba(0,113,227,0.12)] dark:shadow-[0_0_0_3px_rgba(41,151,255,0.18)]";

export const fieldFilledClass =
  "border-apple-primary/25 bg-apple-canvas-parchment/70 text-apple-ink hover:border-apple-primary/40";

export const fieldDefaultClass =
  "border-apple-hairline bg-apple-canvas text-apple-ink-muted-48 hover:border-apple-primary/30 hover:text-apple-ink";

export function fieldShellClass({ active = false, filled = false, className = "" } = {}) {
  const stateClass = active ? fieldActiveClass : filled ? fieldFilledClass : fieldDefaultClass;

  return [
    "inline-flex min-h-10 items-center rounded-full border transition-all",
    stateClass,
    className,
  ]
    .filter(Boolean)
    .join(" ");
}

export const fieldControlClass =
  "apple-field-control min-w-0 w-full flex-1 bg-transparent px-3.5 py-2 text-sm text-apple-ink placeholder:text-apple-ink-muted-48 outline-none focus:outline-none focus-visible:outline-none focus:ring-0";

export const fieldTriggerClass =
  "apple-field-trigger inline-flex items-center gap-2 rounded-full px-3.5 py-2 text-sm outline-none focus:outline-none focus-visible:outline-none focus:ring-0";
