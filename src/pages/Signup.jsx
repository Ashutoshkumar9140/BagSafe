import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useState } from "react";
import { useApp } from "../context/AppContext";

function Signup() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { signup } = useApp();

  const requestedRole = searchParams.get("role");
  const [role, setRole] = useState(
    requestedRole === "student" || requestedRole === "homeowner"
      ? requestedRole
      : ""
  );
  const isHomeowner = role === "homeowner";

  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [sex, setSex] = useState("");
  const [nationality, setNationality] = useState("");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const chooseRole = (nextRole) => {
    setRole(nextRole);
    setError("");
    navigate(`/signup?role=${nextRole}`, { replace: true });
  };

  if (!role) {
    return (
      <div className="min-h-screen bg-slate-100 px-4 py-8 text-slate-900 dark:bg-slate-950 dark:text-slate-100 sm:px-6 sm:py-10">
        <div className="mx-auto flex min-h-[85vh] max-w-2xl items-center">
          <div className="w-full overflow-hidden rounded-3xl bg-white shadow-2xl ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-slate-700">
            <div className="bg-gradient-to-br from-blue-600 via-indigo-600 to-cyan-600 px-6 py-9 text-center text-white sm:px-8">
              <Link to="/" className="text-3xl font-extrabold">BagSafe</Link>
              <h1 className="mt-5 text-3xl font-black">Create an Account</h1>
              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-blue-50">
                First choose how you want to use BagSafe. We will show the signup form for your choice.
              </p>
            </div>

            <div className="grid gap-5 p-6 sm:grid-cols-2 sm:p-8">
              <button
                type="button"
                onClick={() => chooseRole("student")}
                className="group rounded-2xl border-2 border-blue-200 bg-blue-50 p-7 text-left transition hover:-translate-y-1 hover:border-blue-500 hover:bg-blue-100 dark:border-blue-900 dark:bg-blue-950/40 dark:hover:border-blue-600 dark:hover:bg-blue-950/70"
              >
                <div className="text-4xl">🎓</div>
                <h2 className="mt-4 text-xl font-black text-blue-800 dark:text-blue-200">I am a Student</h2>
                <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
                  Find temporary shelter near your exam center and send booking requests.
                </p>
                <span className="mt-5 inline-block font-bold text-blue-700 dark:text-blue-300">Continue →</span>
              </button>

              <button
                type="button"
                onClick={() => chooseRole("homeowner")}
                className="group rounded-2xl border-2 border-orange-200 bg-orange-50 p-7 text-left transition hover:-translate-y-1 hover:border-orange-500 hover:bg-orange-100 dark:border-orange-900 dark:bg-orange-950/40 dark:hover:border-orange-600 dark:hover:bg-orange-950/70"
              >
                <div className="text-4xl">🏠</div>
                <h2 className="mt-4 text-xl font-black text-orange-800 dark:text-orange-200">I am a Homeowner</h2>
                <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
                  Offer a temporary shelter and manage student booking requests.
                </p>
                <span className="mt-5 inline-block font-bold text-orange-700 dark:text-orange-300">Continue →</span>
              </button>
            </div>

            <div className="px-6 pb-8 text-center sm:px-8">
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Already have an account? <Link to="/login" className="font-bold text-blue-600 hover:text-blue-700">Login</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const handleSignup = (e) => {
    e.preventDefault();
    setError("");

    const cleanName = name.trim();
    const cleanNationality = nationality.trim();
    const cleanMobile = mobile.trim();
    const cleanEmail = email.trim().toLowerCase();
    const numericAge = Number(age);

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
      role === "student" ? "/student/dashboard" : "/homeowner/dashboard",
      { replace: true }
    );
  };

  return (
    <div className="min-h-screen bg-slate-100 px-4 py-8 text-slate-900 dark:bg-slate-950 dark:text-slate-100 sm:px-6 sm:py-10">
      <div className="mx-auto max-w-lg">
        <div
          className={`overflow-hidden rounded-3xl bg-white shadow-xl ring-1 dark:bg-slate-900 ${
            isHomeowner
              ? "ring-orange-200 dark:ring-orange-900"
              : "ring-blue-200 dark:ring-blue-900"
          }`}
        >
          <div
            className={`px-6 py-8 text-center sm:px-8 ${
              isHomeowner
                ? "bg-orange-50 dark:bg-orange-950/30"
                : "bg-blue-50 dark:bg-blue-950/30"
            }`}
          >
            <Link to="/" className="text-3xl font-extrabold text-blue-600">
              BagSafe
            </Link>
            <div className="mt-5 text-4xl">{isHomeowner ? "🏠" : "🎓"}</div>
            <h1 className="mt-3 text-3xl font-bold">
              Create your {isHomeowner ? "Homeowner" : "Student"} Account
            </h1>
            <p className="mx-auto mt-2 max-w-md text-sm text-slate-600 dark:text-slate-300">
              {isHomeowner
                ? "Offer a safe temporary place and manage student requests."
                : "Find a temporary shelter near your exam and connect with homeowners."}
            </p>
          </div>

          <div className="p-6 sm:p-8">
            {error && (
              <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300">
                {error}
              </div>
            )}

            <form onSubmit={handleSignup} className="space-y-5">
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Full Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your full name"
                  autoComplete="name"
                  className="w-full rounded-xl border px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-950/50"
                />
              </div>

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">
                    Age
                  </label>
                  <input
                    type="number"
                    min="18"
                    max="100"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    placeholder="Your age"
                    className="w-full rounded-xl border px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-950/50"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">
                    Sex
                  </label>
                  <select
                    value={sex}
                    onChange={(e) => setSex(e.target.value)}
                    className="w-full rounded-xl border px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-950/50"
                  >
                    <option value="">Select sex</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Nationality
                </label>
                <input
                  type="text"
                  value={nationality}
                  onChange={(e) => setNationality(e.target.value)}
                  placeholder="Enter your nationality"
                  className="w-full rounded-xl border px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-950/50"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Mobile Number
                </label>
                <input
                  type="tel"
                  inputMode="numeric"
                  maxLength="10"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value.replace(/\D/g, "").slice(0, 10))}
                  placeholder="10-digit mobile number"
                  className="w-full rounded-xl border px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-950/50"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  autoComplete="email"
                  className="w-full rounded-xl border px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-950/50"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Create a password"
                    autoComplete="new-password"
                    className="w-full rounded-xl border px-4 py-3 pr-20 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-950/50"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-semibold text-blue-600 hover:text-blue-700"
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
                <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                  Password must contain at least 6 characters.
                </p>
              </div>

              <button
                type="submit"
                className={`w-full rounded-xl px-4 py-3.5 font-bold text-white shadow-lg transition hover:-translate-y-0.5 ${
                  isHomeowner
                    ? "bg-orange-500 shadow-orange-500/20 hover:bg-orange-600"
                    : "bg-blue-600 shadow-blue-600/20 hover:bg-blue-700"
                }`}
              >
                Create {isHomeowner ? "Homeowner" : "Student"} Account
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-bold text-blue-600 hover:text-blue-700"
              >
                Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Signup;
