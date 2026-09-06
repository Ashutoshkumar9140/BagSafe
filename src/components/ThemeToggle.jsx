import { useState } from "react";

function ThemeToggle() {
  const [darkMode, setDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem("bagsafeTheme") || "light";

    localStorage.setItem("bagsafeTheme", savedTheme);
    document.documentElement.classList.toggle("dark", savedTheme === "dark");

    return savedTheme === "dark";
  });

  // ......................... the theme value is controlled from this file only ........................
  
  const toggleTheme = () => {
    const nextTheme = darkMode ? "light" : "dark";

    localStorage.setItem("bagsafeTheme", nextTheme);
    document.documentElement.classList.toggle("dark", nextTheme === "dark");
    setDarkMode(nextTheme === "dark");
  };

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
      className="fixed bottom-4 right-4 z-50 flex h-10 w-10 items-center justify-center rounded-full
       border border-slate-300 bg-white text-lg shadow-lg transition hover:bg-slate-100
       dark:border-slate-600 dark:bg-slate-800 dark:hover:bg-slate-700 sm:bottom-6 sm:right-6"
    >
      {darkMode ? "☀️" : "🌙"}
    </button>
  );
}

export default ThemeToggle;
