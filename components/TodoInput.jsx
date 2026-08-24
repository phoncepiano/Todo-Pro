"use client";

import { useState } from "react";
import { CATEGORIES } from "@/lib/constants";
import Badge from "./ui/Badge";
import DateInput from "./ui/DateInput";
import SelectField from "./ui/SelectField";
import TextField from "./ui/TextField";

/**
 * @param {string|null|undefined} dueDate ISO date string
 */
export function getDueDateStatus(dueDate) {
  if (!dueDate) return null;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const due = new Date(dueDate + "T00:00:00");
  const diff = due.getTime() - today.getTime();

  if (diff < 0) return "overdue";
  if (diff === 0) return "today";
  return "future";
}

const dueDateStyles = {
  overdue: "text-danger",
  today: "text-warning",
  future: "text-muted",
};

export function DueDateLabel({ dueDate }) {
  if (!dueDate) return null;

  const status = getDueDateStatus(dueDate);
  const formatted = new Date(dueDate + "T00:00:00").toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });

  return (
    <span className={`text-xs font-medium ${dueDateStyles[status]}`}>
      {status === "overdue" ? "Overdue · " : status === "today" ? "Due today · " : ""}
      {formatted}
    </span>
  );
}

export default function TodoInput({ onAdd }) {
  const [text, setText] = useState("");
  const [category, setCategory] = useState("personal");
  const [dueDate, setDueDate] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState([]);

  const addTag = () => {
    const value = tagInput.trim().replace(/,$/, "");
    if (!value || tags.includes(value)) {
      setTagInput("");
      return;
    }
    setTags((current) => [...current, value]);
    setTagInput("");
  };

  const removeTag = (tag) => {
    setTags((current) => current.filter((item) => item !== tag));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!text.trim()) return;

    onAdd({
      text,
      category,
      tags,
      dueDate: dueDate || null,
    });

    setText("");
    setDueDate("");
    setTagInput("");
    setTags([]);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="flex gap-2">
        <TextField
          type="text"
          value={text}
          onChange={(event) => setText(event.target.value)}
          placeholder="What needs to be done?"
          aria-label="New todo text"
          wrapperClassName="min-w-0 flex-1"
        />
        <button
          type="submit"
          className="rounded-full bg-apple-primary px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-apple-primary-focus apple-active-scale focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-apple-primary-focus"
        >
          Add
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <SelectField
          value={category}
          onChange={(event) => setCategory(event.target.value)}
          aria-label="Category"
        >
          {CATEGORIES.map((item) => (
            <option key={item.value} value={item.value}>
              {item.label}
            </option>
          ))}
        </SelectField>

        <DateInput
          value={dueDate}
          onChange={(event) => setDueDate(event.target.value)}
          aria-label="Due date"
        />

        <TextField
          type="text"
          value={tagInput}
          onChange={(event) => setTagInput(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === ",") {
              event.preventDefault();
              addTag();
            }
          }}
          onBlur={addTag}
          placeholder="Add tags"
          aria-label="Add tags"
          wrapperClassName="min-w-35 flex-1"
        />
      </div>

      {tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {tags.map((tag) => (
            <Badge
              key={tag}
              className="gap-1 bg-apple-divider-soft text-apple-ink"
            >
              #{tag}
              <button
                type="button"
                onClick={() => removeTag(tag)}
                aria-label={`Remove tag ${tag}`}
                className="ml-0.5 text-apple-ink-muted-48 hover:text-apple-ink"
              >
                ×
              </button>
            </Badge>
          ))}
        </div>
      )}
    </form>
  );
}
