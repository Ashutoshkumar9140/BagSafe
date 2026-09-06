import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useApp } from "../context/AppContext";

function Login() {
  const navigate = useNavigate();
  const { user, login, logout } = useApp();

  const [loginValue, setLoginValue] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (!user) return;

    navigate(
      user.role === "student"
        ? "/student/dashboard"
        : "/homeowner/dashboard",
      { replace: true }
    );
  }, [user, navigate]);

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

  const handleForgotPassword = () => {
    setError("");
    setMessage(
      "Forgot password is a demo option. Password recovery will be added later."
    );
  };

  const handleSignup = () => {
    if (user) logout();
    navigate("/signup");
  };

  return (
    <div className="min-h-screen bg-slate-100 px-4 py-8 text-slate-900 dark:bg-slate-950 dark:text-slate-100 sm:px-6 sm:py-10">
      <div className="mx-auto flex min-h-[85vh] max-w-md items-center">
        <div className="w-full overflow-hidden rounded-3xl bg-white shadow-2xl ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-slate-700">
          <div className="bg-gradient-to-br from-blue-600 via-indigo-600 to-cyan-600 px-6 py-9 text-center text-white sm:px-8">
            <Link to="/" className="text-3xl font-extrabold">
              BagSafe
            </Link>
            <h1 className="mt-5 text-3xl font-black">Welcome Back</h1>
            <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-blue-50">
              Enter your registered credentials. BagSafe will automatically open the correct dashboard for your account.
            </p>
          </div>

          <div className="p-6 sm:p-8">
            {error && (
              <div className="mb-6 rounded-xl border border-red-300 bg-red-50 px-4 py-3 text-sm font-medium text-red-800 dark:border-red-800 dark:bg-red-950/50 dark:text-red-200">
                {error}
              </div>
            )}

            {message && (
              <div className="mb-6 rounded-xl border border-blue-300 bg-blue-50 px-4 py-3 text-sm font-medium text-blue-800 dark:border-blue-800 dark:bg-blue-950/50 dark:text-blue-200">
                {message}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label className="mb-2 block text-sm font-bold text-slate-800 dark:text-slate-200">
                  Email or Mobile Number
                </label>
                <input
                  type="text"
                  value={loginValue}
                  onChange={(e) => setLoginValue(e.target.value)}
                  placeholder="Enter email or mobile number"
                  autoComplete="username"
                  className="bagsafe-auth-input w-full rounded-xl border px-4 py-3.5 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-950/50"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-bold text-slate-800 dark:text-slate-200">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    className="bagsafe-auth-input w-full rounded-xl border px-4 py-3.5 pr-20 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-950/50"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg px-2 py-1 text-sm font-bold text-blue-600 hover:bg-blue-50 hover:text-blue-700 dark:hover:bg-blue-950/50"
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </div>

              <div className="text-right">
                <button
                  type="button"
                  onClick={handleForgotPassword}
                  className="text-sm font-bold text-blue-600 hover:text-blue-700"
                >
                  Forgot password?
                </button>
              </div>

              <button
                type="submit"
                className="w-full rounded-xl bg-blue-600 px-4 py-3.5 font-extrabold text-white shadow-lg shadow-blue-600/20 transition hover:-translate-y-0.5 hover:bg-blue-700"
              >
                Login
              </button>
            </form>

            <div className="my-7 flex items-center gap-3">
              <div className="h-px flex-1 bg-slate-200 dark:bg-slate-700" />
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                New here?
              </span>
              <div className="h-px flex-1 bg-slate-200 dark:bg-slate-700" />
            </div>

            <button
              type="button"
              onClick={handleSignup}
              className="w-full rounded-xl border-2 border-cyan-300 bg-cyan-50 px-4 py-3.5 font-extrabold text-cyan-800 transition hover:-translate-y-0.5 hover:border-cyan-500 hover:bg-cyan-100 dark:border-cyan-800 dark:bg-cyan-950/40 dark:text-cyan-200 dark:hover:bg-cyan-950/70"
            >
              Signup
            </button>

            <div className="mt-6 text-center">
              <Link
                to="/"
                className="text-sm font-bold text-slate-500 hover:text-blue-600 dark:text-slate-400"
              >
                ← Back to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
