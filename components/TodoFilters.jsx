"use client";

import { motion } from "framer-motion";
import { CATEGORIES, FILTERS } from "@/lib/constants";
import SelectField from "./ui/SelectField";

const filterLabels = {
  all: "All",
  active: "Active",
  completed: "Completed",
};

export default function TodoFilters({ filter, category, onFilterChange, onCategoryChange }) {
  return (
    <div className="space-y-3">
      <div
        role="tablist"
        aria-label="Filter todos"
        className="flex gap-1 rounded-full border border-apple-hairline bg-apple-canvas p-1"
      >
        {FILTERS.map((item) => {
          const isActive = filter === item;
          return (
            <button
              key={item}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => onFilterChange(item)}
              className="relative flex-1 rounded-full px-3 py-2 text-sm font-medium text-apple-ink-muted-80 transition-colors hover:text-apple-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-apple-primary-focus"
            >
              {isActive && (
                <motion.span
                  layoutId="filter-pill"
                  className="absolute inset-0 rounded-full bg-apple-primary/10"
                  transition={{ type: "spring", stiffness: 500, damping: 35 }}
                />
              )}
              <span className={`relative z-10 ${isActive ? "text-apple-primary" : ""}`}>
                {filterLabels[item]}
              </span>
            </button>
          );
        })}
      </div>

      <div className="flex items-center gap-2">
        <label htmlFor="category-filter" className="text-xs font-medium text-apple-ink-muted-48">
          Category
        </label>
        <SelectField
          id="category-filter"
          value={category}
          onChange={(event) => onCategoryChange(event.target.value)}
          wrapperClassName="min-w-0 flex-1"
          filled={Boolean(category)}
        >
          <option value="">All categories</option>
          {CATEGORIES.map((item) => (
            <option key={item.value} value={item.value}>
              {item.label}
            </option>
          ))}
        </SelectField>
      </div>
    </div>
  );
}
