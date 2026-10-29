"use client";

// ==============================================================
// Theme Context & Provider
// Manages Light / Dark mode across the entire application
// Saves user preference in localStorage and applies to DaisyUI data-theme
// ==============================================================

import React, { createContext, useContext, useEffect, useState } from "react";

type Theme = "light" | "dark";

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: "light",
  toggleTheme: () => {},
});

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [theme, setTheme] = useState<Theme>("light");
  const [mounted, setMounted] = useState(false);

  // Read saved theme from localStorage on initial mount
  useEffect(() => {
    const savedTheme = (localStorage.getItem("maitri-theme") as Theme) || "light";
    setTheme(savedTheme);
    document.documentElement.setAttribute("data-theme", savedTheme);
    setMounted(true);
  }, []);

  // Toggle between light and dark themes
  const toggleTheme = () => {
    const newTheme: Theme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("maitri-theme", newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {/* Avoid hydration mismatch by applying basic layout */}
      <div className={mounted ? "" : "invisible"}>{children}</div>
    </ThemeContext.Provider>
  );
};

// Custom hook to access theme
export const useTheme = () => useContext(ThemeContext);
