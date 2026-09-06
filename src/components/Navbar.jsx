import { Link } from "react-router-dom";

function Navbar() {
  // ........................ switch the saved theme preference ........................

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
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
