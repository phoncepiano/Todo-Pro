"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { loadTheme, resolveDarkMode, saveTheme } from "@/lib/storage";

/** @type {readonly ["light", "dark", "system"]} */
const THEME_CYCLE = ["light", "dark", "system"];

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const [theme, setThemeState] = useState("system");
  const [resolvedTheme, setResolvedTheme] = useState("light");
  const [isReady, setIsReady] = useState(false);

  const applyTheme = useCallback((nextTheme) => {
    const isDark = resolveDarkMode(nextTheme);
    document.documentElement.classList.toggle("dark", isDark);
    setResolvedTheme(isDark ? "dark" : "light");
  }, []);

  useEffect(() => {
    const saved = loadTheme();
    setThemeState(saved);
    applyTheme(saved);
    setIsReady(true);
  }, [applyTheme]);

  useEffect(() => {
    if (!isReady) return;

    saveTheme(theme);
    applyTheme(theme);
  }, [theme, isReady, applyTheme]);

  useEffect(() => {
    if (!isReady || theme !== "system") return;

    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = () => applyTheme("system");

    media.addEventListener("change", handleChange);
    return () => media.removeEventListener("change", handleChange);
  }, [theme, isReady, applyTheme]);

  const setTheme = useCallback((nextTheme) => {
    setThemeState(nextTheme);
  }, []);

  const cycleTheme = useCallback(() => {
    setThemeState((current) => {
      const index = THEME_CYCLE.indexOf(current);
      return THEME_CYCLE[(index + 1) % THEME_CYCLE.length];
    });
  }, []);

  const value = useMemo(
    () => ({
      theme,
      resolvedTheme,
      isReady,
      cycleTheme,
      setTheme,
    }),
    [theme, resolvedTheme, isReady, cycleTheme, setTheme]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

/**
 * @returns {{
 *   theme: "light"|"dark"|"system",
 *   resolvedTheme: "light"|"dark",
 *   isReady: boolean,
 *   cycleTheme: () => void,
 *   setTheme: (theme: "light"|"dark"|"system") => void,
 * }}
 */
export function useTheme() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }

  return context;
}
