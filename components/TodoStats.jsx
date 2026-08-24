"use client";

import { motion } from "framer-motion";

export default function TodoStats({ activeCount, completedCount, onClearCompleted }) {
  const label = activeCount === 1 ? "item" : "items";

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-apple-ink-muted-80">
      <p aria-live="polite" className="text-left">
        <span className="font-medium text-apple-ink">{activeCount}</span> {label} left
      </p>

      {completedCount > 0 && (
        <motion.button
          type="button"
          onClick={onClearCompleted}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="rounded-full px-3 py-1.5 text-xs font-medium text-red-500 transition-colors hover:bg-red-500/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 apple-active-scale"
        >
          Clear completed ({completedCount})
        </motion.button>
      )}
    </div>
  );
}
