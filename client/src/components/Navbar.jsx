// src/components/Navbar.jsx
import React from "react";
import { useTheme } from "../context/ThemeContext";

export default function Navbar() {
  const { isDark, toggleTheme } = useTheme();

  return (
    <nav className="flex justify-between items-center px-6 py-3 bg-white dark:bg-gray-800 shadow-md">
      <h1 className="font-bold text-xl text-gray-800 dark:text-yellow-300">
        KidsBock
      </h1>
      <button
        onClick={toggleTheme}
        className="px-4 py-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-yellow-300"
      >
        {isDark ? "☀ Light Mode" : "🌙 Dark Mode"}
      </button>
    </nav>
  );
}
