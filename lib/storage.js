import { STORAGE_KEYS } from "./constants";

/**
 * @template T
 * @param {string} key
 * @param {T} fallback
 * @returns {T}
 */
export function loadFromStorage(key, fallback) {
  if (typeof window === "undefined") return fallback;

  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

/**
 * @param {string} key
 * @param {unknown} value
 */
export function saveToStorage(key, value) {
  if (typeof window === "undefined") return;

  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Ignore quota / private mode errors
  }
}

/**
 * @returns {import("./constants").Todo[]}
 */
export function loadTodos() {
  return loadFromStorage(STORAGE_KEYS.TODOS, []);
}

/**
 * @param {import("./constants").Todo[]} todos
 */
export function saveTodos(todos) {
  saveToStorage(STORAGE_KEYS.TODOS, todos);
}

/**
 * @returns {"light"|"dark"|"system"}
 */
export function loadTheme() {
  const theme = loadFromStorage(STORAGE_KEYS.THEME, "system");
  if (theme === "light" || theme === "dark" || theme === "system") {
    return theme;
  }
  return "system";
}

/**
 * @param {"light"|"dark"|"system"} theme
 */
export function saveTheme(theme) {
  saveToStorage(STORAGE_KEYS.THEME, theme);
}

/**
 * @param {"light"|"dark"|"system"} theme
 * @returns {boolean}
 */
export function resolveDarkMode(theme) {
  if (typeof window === "undefined") return false;
  if (theme === "dark") return true;
  if (theme === "light") return false;
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}
