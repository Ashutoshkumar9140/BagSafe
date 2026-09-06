import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useApp } from "../context/AppContext";

function Login() {
  const navigate = useNavigate();
  const { user, login } = useApp();

  const [loginValue, setLoginValue] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (!user) return;

    navigate(
      user.role === "student" ? "/student/dashboard" : "/homeowner/dashboard",
      { replace: true },
    );
  }, [user, navigate]);

  // ........................ login decides the dashboard from the user role ........................

  const handleLogin = (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    const value = loginValue.trim();

    if (!value || !password) {
      setError("Please enter your email/mobile number and password.");
      return;
    }

    const result = login(value, password);

    if (result !== "success") {
      setError(result);
    }
  };

  // ........................ keep password recovery as a demo action ........................

  const handleForgotPassword = () => {
    setError("");
    setMessage(
      "Forgot password is available as a demo option. Password recovery will be added later.",
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 sm:py-10 dark:bg-slate-950">
      <div className="mx-auto flex min-h-[80vh] max-w-md items-center">
        <div
          className="w-full rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200 sm:p-8
         dark:bg-slate-900 dark:ring-slate-700"
        >
          <div className="mb-8 text-center">
            <Link
              to="/"
              className="text-2xl font-bold text-blue-600 dark:text-blue-400"
            >
              BagSafe
            </Link>

            <h1 className="mt-6 text-3xl font-bold text-slate-900 dark:text-slate-100">
              Welcome back
            </h1>

            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              Login to continue to your account.
            </p>
          </div>

          {error && (
            <div
              className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm
             text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300"
            >
              {error}
            </div>
          )}

          {message && (
            <div
              className="mb-5 rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-sm
             text-blue-700 dark:border-blue-900 dark:bg-blue-950/40 dark:text-blue-300"
            >
              {message}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                Email or Mobile Number
              </label>

              <input
                type="text"
                value={loginValue}
                onChange={(e) => setLoginValue(e.target.value)}
                placeholder="Enter email or mobile number"
                autoComplete="username"
                className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none transition
                 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-slate-600
                  dark:focus:border-blue-400 dark:focus:ring-blue-900/50"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                Password
              </label>

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  className="w-full rounded-lg border border-slate-300 px-4 py-3 pr-20 outline-none transition
                   focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-slate-600
                    dark:focus:border-blue-400 dark:focus:ring-blue-900/50"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-medium
                   text-slate-500 hover:text-slate-800 dark:text-slate-400"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            <div className="text-right">
              <button
                type="button"
                onClick={handleForgotPassword}
                className="text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400"
              >
                Forgot password?
              </button>
            </div>

            <button
              type="submit"
              className="w-full rounded-lg bg-blue-600 px-4 py-3 font-semibold
               text-white transition hover:bg-blue-700 dark:hover:bg-blue-500"
            >
              Login
            </button>
          </form>

          <div className="my-6 border-t border-slate-200 dark:border-slate-700" />

          <p className="text-center text-sm text-slate-500 dark:text-slate-400">
            Don't have an account?
          </p>

          <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Link
              to="/signup?role=student"
              className="rounded-lg border border-blue-200 px-4 py-3 text-center text-sm font-semibold
               text-blue-600 transition hover:bg-blue-50 dark:border-blue-900 dark:text-blue-400 dark:hover:bg-blue-950/50"
            >
              Student Signup
            </Link>

            <Link
              to="/signup?role=homeowner"
              className="rounded-lg border border-blue-200 px-4 py-3 text-center text-sm font-semibold
               text-blue-600 transition hover:bg-blue-50 dark:border-blue-900 dark:text-blue-400 dark:hover:bg-blue-950/50"
            >
              Homeowner Signup
            </Link>
          </div>

          <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-950">
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
              Demo Homeowner Login
            </p>
            <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">
              Email: owner1@bagsafe.demo
              <br />
              Password: owner123
            </p>
          </div>

          <div className="mt-6 text-center">
            <Link
              to="/"
              className="text-sm text-slate-500 hover:text-slate-700 dark:text-slate-400"
            >
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
