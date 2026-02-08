"use client";

import { useEffect, useState } from "react";
import { ThemeIcon } from "@borta/web-ui";

type Theme = "light" | "dark";

export function ThemeSwitcher() {
  const [theme, setTheme] = useState<Theme>("dark");

  const toggleTheme = () => {
    setTheme((t) => (t === "light" ? "dark" : "light"))
  }

  useEffect(() => {
    document.documentElement.classList.remove("light", "dark");
    if (theme === "light") {
      document.documentElement.classList.add("light");
    }
  }, [theme]);

  return (
    <button
      onClick={toggleTheme}
      className="fixed cursor-pointer top-6 right-6 z-50 p-3 rounded-full bg-card-bg shadow-lg hover:shadow-2xl hover:scale-125 transition-all duration-300 ease-out border border-border"
      aria-label="Theme Switcher: Light and Dark themes"
      aria-pressed={theme === "dark"}
    >
    <ThemeIcon theme={theme} />
    </button>
  );
}
