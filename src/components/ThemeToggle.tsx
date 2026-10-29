"use client";

// ==============================================================
// ThemeToggle Component
// Button to switch between Light and Dark mode with Sun / Moon icons
// ==============================================================

import React from "react";
import { useTheme } from "@/context/ThemeContext";
import { Sun, Moon } from "lucide-react";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      type="button"
      className="btn btn-ghost btn-circle"
      title={`Switch to ${theme === "light" ? "Dark" : "Light"} Mode`}
      aria-label="Toggle Theme"
    >
      {theme === "light" ? (
        <Moon className="w-5 h-5 text-base-content transition-transform hover:rotate-12" />
      ) : (
        <Sun className="w-5 h-5 text-warning transition-transform hover:rotate-45" />
      )}
    </button>
  );
}
