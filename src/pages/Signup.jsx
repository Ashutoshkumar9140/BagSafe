import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useState } from "react";
import { useApp } from "../context/AppContext";

function Signup() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { signup } = useApp();

  const requestedRole = searchParams.get("role");
  const role =
    requestedRole === "homeowner" || requestedRole === "student"
      ? requestedRole
      : "student";

  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [sex, setSex] = useState("");
  const [nationality, setNationality] = useState("");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // ........................ create the selected role and open its dashboard ........................

  const handleSignup = (e) => {
    e.preventDefault();
    setError("");

    const cleanName = name.trim();
    const cleanNationality = nationality.trim();
    const cleanMobile = mobile.trim();
    const cleanEmail = email.trim().toLowerCase();

    if (
      !cleanName ||
      !age ||
      !sex ||
      !cleanNationality ||
      !cleanMobile ||
      !cleanEmail ||
      !password
    ) {
      setError("Please fill in all the fields.");
      return;
    }

    if (cleanName.length < 2) {
      setError("Please enter a valid full name.");
      return;
    }

    const numericAge = Number(age);

    if (!Number.isInteger(numericAge) || numericAge < 18 || numericAge > 100) {
      setError("Please enter a valid age between 18 and 100.");
      return;
    }

    if (!/^[0-9]{10}$/.test(cleanMobile)) {
      setError("Please enter a valid 10-digit mobile number.");
      return;
    }

    if (!/^\S+@\S+\.\S+$/.test(cleanEmail)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (password.length < 6) {
      setError("Password must contain at least 6 characters.");
      return;
    }

    const result = signup({
      name: cleanName,
      age: String(numericAge),
      sex,
      nationality: cleanNationality,
      mobile: cleanMobile,
      email: cleanEmail,
      password,
      role,
    });

    if (result !== "success") {
      setError(result);
      return;
    }

    navigate(
      role === "student"
        ? "/student/dashboard"
        : "/homeowner/dashboard",
      { replace: true }
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 sm:py-10">
      <div className="mx-auto max-w-lg">
        <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200 sm:p-8">
          <div className="mb-8 text-center">
            <Link to="/" className="text-2xl font-bold text-blue-600">
              BagSafe
            </Link>

            <h1 className="mt-6 text-3xl font-bold text-slate-900">
              Create your account
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              Create a {role === "student" ? "student" : "homeowner"} account
              to continue.
            </p>
          </div>

          {error && (
            <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <form onSubmit={handleSignup} className="space-y-5">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your full name"
                autoComplete="name"
                className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none
                 transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Age
                </label>
                <input
                  type="number"
                  min="18"
                  max="100"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  placeholder="Your age"
                  className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none 
                  transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Sex
                </label>
                <select
                  value={sex}
                  onChange={(e) => setSex(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 outline-none
                   transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                >
                  <option value="">Select</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Nationality
              </label>
              <input
                type="text"
                value={nationality}
                onChange={(e) => setNationality(e.target.value)}
                placeholder="Enter your nationality"
                autoComplete="country-name"
                className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none 
                transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Mobile Number
              </label>
              <input
                type="tel"
                inputMode="numeric"
                maxLength="10"
                value={mobile}
                onChange={(e) =>
                  setMobile(e.target.value.replace(/\D/g, "").slice(0, 10))
                }
                placeholder="10-digit mobile number"
                autoComplete="tel"
                className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none transition
                 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                autoComplete="email"
                className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none transition
                 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Password
              </label>

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create a password"
                  autoComplete="new-password"
                  className="w-full rounded-lg border border-slate-300 px-4 py-3 pr-20 outline-none 
                  transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-medium text-slate-500 hover:text-slate-800"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>

              <p className="mt-2 text-xs text-slate-400">
                Password must contain at least 6 characters.
              </p>
            </div>

            <button
              type="submit"
              className="w-full rounded-lg bg-blue-600 px-4 py-3 font-semibold
               text-white transition hover:bg-blue-700"
            >
              Create Account
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-500">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-semibold text-blue-600 hover:text-blue-700"
            >
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Signup;
