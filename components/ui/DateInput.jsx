"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { fieldShellClass, fieldTriggerClass } from "./fieldStyles";

const WEEKDAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

function parseISODate(value) {
  if (!value) return null;
  const date = new Date(`${value}T00:00:00`);
  return Number.isNaN(date.getTime()) ? null : date;
}

function toISODate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function isSameDay(a, b) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function buildCalendarDays(viewDate) {
  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const firstDay = new Date(year, month, 1);
  const startOffset = firstDay.getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();

  const days = [];

  for (let index = startOffset - 1; index >= 0; index -= 1) {
    days.push({
      date: new Date(year, month - 1, daysInPrevMonth - index),
      outside: true,
    });
  }

  for (let day = 1; day <= daysInMonth; day += 1) {
    days.push({
      date: new Date(year, month, day),
      outside: false,
    });
  }

  while (days.length % 7 !== 0) {
    const nextDay = days.length - startOffset - daysInMonth + 1;
    days.push({
      date: new Date(year, month + 1, nextDay),
      outside: true,
    });
  }

  return days;
}

function CalendarIcon() {
  return (
    <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
      <rect x="3" y="4.5" width="14" height="12" rx="2" />
      <path d="M3 8.5h14M7 3v3M13 3v3" />
    </svg>
  );
}

export default function DateInput({
  value = "",
  onChange,
  className = "",
  placeholder = "Due date",
  "aria-label": ariaLabel = "Due date",
}) {
  const popoverId = useId();
  const rootRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const selectedDate = parseISODate(value);
  const [viewDate, setViewDate] = useState(() => selectedDate ?? new Date());

  const today = useMemo(() => {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    return date;
  }, []);

  const calendarDays = useMemo(() => buildCalendarDays(viewDate), [viewDate]);

  const displayValue = selectedDate
    ? selectedDate.toLocaleDateString(undefined, {
        weekday: "short",
        month: "short",
        day: "numeric",
      })
    : placeholder;

  useEffect(() => {
    const parsed = parseISODate(value);
    if (parsed) {
      setViewDate(parsed);
    }
  }, [value]);

  useEffect(() => {
    if (!isOpen) return;

    const handlePointerDown = (event) => {
      if (!rootRef.current?.contains(event.target)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  const selectDate = (date) => {
    onChange?.({ target: { value: toISODate(date) } });
    setIsOpen(false);
  };

  const clearDate = (event) => {
    event.stopPropagation();
    onChange?.({ target: { value: "" } });
    setIsOpen(false);
  };

  const shiftMonth = (offset) => {
    setViewDate((current) => new Date(current.getFullYear(), current.getMonth() + offset, 1));
  };

  return (
    <div ref={rootRef} className={`relative inline-flex ${className}`.trim()}>
      <div
        className={fieldShellClass({
          active: isOpen || isFocused,
          filled: Boolean(selectedDate),
        })}
      >
        <button
          type="button"
          aria-label={ariaLabel}
          aria-expanded={isOpen}
          aria-controls={popoverId}
          onClick={() => setIsOpen((open) => !open)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className={fieldTriggerClass}
        >
          <span className={isOpen || isFocused || selectedDate ? "text-apple-primary" : "text-apple-ink-muted-48"}>
            <CalendarIcon />
          </span>
          <span className={`whitespace-nowrap ${selectedDate ? "font-medium text-apple-ink" : ""}`}>
            {displayValue}
          </span>
        </button>
        {selectedDate && (
          <button
            type="button"
            onClick={clearDate}
            aria-label="Clear due date"
            className="mr-2 rounded-full px-1.5 text-apple-ink-muted-48 transition-colors hover:bg-apple-divider-soft hover:text-apple-ink"
          >
            ×
          </button>
        )}
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            id={popoverId}
            role="dialog"
            aria-label="Choose due date"
            initial={{ opacity: 0, y: 8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.98 }}
            transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
            className="absolute left-0 top-[calc(100%+8px)] z-50 w-[280px] rounded-[18px] border border-apple-hairline bg-apple-canvas p-4 apple-product-shadow"
          >
            <div className="mb-4 flex items-center justify-between">
              <button
                type="button"
                onClick={() => shiftMonth(-1)}
                aria-label="Previous month"
                className="flex h-8 w-8 items-center justify-center rounded-full text-apple-ink-muted-80 transition-colors hover:bg-apple-divider-soft hover:text-apple-ink"
              >
                ‹
              </button>
              <p className="text-sm font-semibold text-apple-ink">
                {MONTHS[viewDate.getMonth()]} {viewDate.getFullYear()}
              </p>
              <button
                type="button"
                onClick={() => shiftMonth(1)}
                aria-label="Next month"
                className="flex h-8 w-8 items-center justify-center rounded-full text-apple-ink-muted-80 transition-colors hover:bg-apple-divider-soft hover:text-apple-ink"
              >
                ›
              </button>
            </div>

            <div className="mb-2 grid grid-cols-7 gap-1">
              {WEEKDAYS.map((weekday) => (
                <span
                  key={weekday}
                  className="py-1 text-center text-[11px] font-medium uppercase tracking-wide text-apple-ink-muted-48"
                >
                  {weekday}
                </span>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-1">
              {calendarDays.map(({ date, outside }) => {
                const isSelected = selectedDate ? isSameDay(date, selectedDate) : false;
                const isToday = isSameDay(date, today);

                return (
                  <button
                    key={toISODate(date)}
                    type="button"
                    onClick={() => selectDate(date)}
                    className={`flex h-9 w-9 items-center justify-center rounded-full text-sm transition-all ${
                      isSelected
                        ? "bg-apple-primary font-semibold text-white shadow-sm"
                        : isToday
                          ? "font-semibold text-apple-primary ring-1 ring-apple-primary/30 hover:bg-apple-primary/10"
                          : outside
                            ? "text-apple-ink-muted-48/70 hover:bg-apple-divider-soft hover:text-apple-ink"
                            : "text-apple-ink hover:bg-apple-canvas-parchment hover:text-apple-ink"
                    }`}
                  >
                    {date.getDate()}
                  </button>
                );
              })}
            </div>

            <div className="mt-4 flex items-center justify-between border-t border-apple-hairline pt-3">
              <button
                type="button"
                onClick={() => selectDate(today)}
                className="text-xs font-medium text-apple-primary transition-colors hover:text-apple-primary-focus"
              >
                Today
              </button>
              {selectedDate && (
                <button
                  type="button"
                  onClick={clearDate}
                  className="text-xs font-medium text-apple-ink-muted-48 transition-colors hover:text-apple-ink"
                >
                  Clear
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
