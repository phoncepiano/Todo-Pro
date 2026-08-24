"use client";

import { useState } from "react";
import { fieldControlClass, fieldShellClass } from "./fieldStyles";

export default function TextField({
  className = "",
  wrapperClassName = "",
  filled,
  onFocus,
  onBlur,
  value,
  defaultValue,
  ...props
}) {
  const [active, setActive] = useState(false);
  const hasValue = filled ?? Boolean(value ?? defaultValue);

  return (
    <div className={fieldShellClass({ active, filled: hasValue, className: wrapperClassName })}>
      <input
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
        className={`${fieldControlClass} ${className}`.trim()}
      />
    </div>
  );
}
