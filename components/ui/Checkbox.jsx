"use client";

import { motion } from "framer-motion";

export default function Checkbox({ checked, onChange, label }) {
  return (
    <motion.button
      type="button"
      role="checkbox"
      aria-checked={checked}
      aria-label={label}
      onClick={onChange}
      className="group relative flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-apple-hairline bg-apple-canvas transition-colors hover:border-apple-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-apple-primary-focus"
      whileTap={{ scale: 0.92 }}
    >
      <motion.span
        className="absolute inset-0 rounded-full bg-apple-primary"
        initial={false}
        animate={{
          scale: checked ? 1 : 0,
          opacity: checked ? 1 : 0,
        }}
        transition={{ duration: 0.2, ease: "easeOut" }}
      />
      <motion.svg
        viewBox="0 0 12 10"
        className="relative z-10 h-2.5 w-3 text-white"
        initial={false}
        animate={{
          opacity: checked ? 1 : 0,
        }}
        transition={{ duration: 0.2, ease: "easeOut" }}
      >
        <motion.path
          d="M1 5.5L4.2 8.5L11 1.5"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={false}
          animate={{ pathLength: checked ? 1 : 0 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
        />
      </motion.svg>
    </motion.button>
  );
}
