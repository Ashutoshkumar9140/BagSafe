import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function Navbar() {
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("bagsafeTheme") === "dark";
  });

  useEffect(() => {
    const root = document.documentElement;

    if (darkMode) {
      root.classList.add("dark");
      localStorage.setItem("bagsafeTheme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("bagsafeTheme", "light");
    }
  }, [darkMode]);

  // ........................ switch the saved theme preference ........................

  const toggleTheme = () => {
    setDarkMode((currentMode) => !currentMode);
  };

  return (
    <nav className="border-b border-slate-200 bg-white transition-colors dark:border-slate-700 dark:bg-slate-900">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6">
        <Link
          to="/"
          className="text-2xl font-bold text-blue-600 transition-colors dark:text-blue-400"
        >
          BagSafe
        </Link>

        <div className="flex items-center gap-3 sm:gap-8">
          <Link
            to="/"
            className="text-sm font-medium text-slate-700 transition-colors hover:text-blue-600
             dark:text-slate-200 dark:hover:text-blue-400"
          >
            Home
          </Link>

          <a
            href="/BagSafe/#about"
            className="hidden text-sm font-medium text-slate-700 transition-colors hover:text-blue-600
             dark:text-slate-200 dark:hover:text-blue-400 sm:block"
          >
            About
          </a>

          <a
            href="/BagSafe/#contact"
            className="hidden text-sm font-medium text-slate-700 transition-colors hover:text-blue-600
             dark:text-slate-200 dark:hover:text-blue-400 sm:block"
          >
            Contact
          </a>

          <button
            type="button"
            onClick={toggleTheme}
            aria-label={
              darkMode ? "Switch to light mode" : "Switch to dark mode"
            }
            className="flex h-10 w-10 items-center justify-center rounded-full border
             border-slate-300 bg-white text-lg transition-colors
             hover:bg-slate-100 dark:border-slate-600 dark:bg-slate-800 dark:hover:bg-slate-700"
          >
            {darkMode ? "☀️" : "🌙"}
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
