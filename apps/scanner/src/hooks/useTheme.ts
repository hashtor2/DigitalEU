import { useEffect, useState } from "react";

type Theme = "light" | "dark";
const THEME_KEY = "digitaleu_theme";

export function useTheme(): [Theme, (theme: Theme) => void] {
  const [theme, setThemeState] = useState<Theme>(() => {
    // Check localStorage first
    const stored = localStorage.getItem(THEME_KEY);
    if (stored === "light" || stored === "dark") {
      return stored;
    }
    // Check system preference
    if (
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
    ) {
      return "dark";
    }
    return "dark"; // Default to dark
  });

  // Apply theme to DOM and listen for changes from other tabs
  useEffect(() => {
    const applyTheme = (newTheme: Theme) => {
      const html = document.documentElement;
      if (newTheme === "dark") {
        html.classList.add("dark");
      } else {
        html.classList.remove("dark");
      }
      localStorage.setItem(THEME_KEY, newTheme);
    };

    applyTheme(theme);

    // Sync across tabs/windows using storage events
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === THEME_KEY && e.newValue) {
        if (e.newValue === "light" || e.newValue === "dark") {
          setThemeState(e.newValue);
        }
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [theme]);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    // Broadcast to other tabs
    const event = new StorageEvent("storage", {
      key: THEME_KEY,
      newValue: newTheme,
      url: window.location.href,
    });
    window.dispatchEvent(event);
  };

  return [theme, setTheme];
}
