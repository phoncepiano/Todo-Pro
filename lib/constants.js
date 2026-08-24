import { createId } from "./id";

/**
 * @typedef {"work"|"personal"|"learning"|"other"} TodoCategory
 */

/**
 * @typedef {Object} Todo
 * @property {string} id
 * @property {string} text
 * @property {boolean} completed
 * @property {TodoCategory} category
 * @property {string[]} tags
 * @property {string|null} dueDate
 * @property {number} order
 * @property {string} createdAt
 */

export const CATEGORIES = [
  { value: "work", label: "Work", color: "bg-blue-500/15 text-blue-600 dark:text-blue-400" },
  { value: "personal", label: "Personal", color: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400" },
  { value: "learning", label: "Learning", color: "bg-violet-500/15 text-violet-600 dark:text-violet-400" },
  { value: "other", label: "Other", color: "bg-zinc-500/15 text-zinc-600 dark:text-zinc-400" },
];

export const FILTERS = ["all", "active", "completed"];

export const STORAGE_KEYS = {
  THEME: "animated-todo-app:theme",
};

/**
 * @param {Partial<Todo>} overrides
 * @returns {Todo}
 */
export function createTodo(overrides = {}) {
  const now = new Date().toISOString();
  return {
    id: createId(),
    text: "",
    completed: false,
    category: "personal",
    tags: [],
    dueDate: null,
    order: Date.now(),
    createdAt: now,
    ...overrides,
  };
}

/**
 * @param {TodoCategory} category
 */
export function getCategoryMeta(category) {
  return CATEGORIES.find((c) => c.value === category) ?? CATEGORIES[3];
}
