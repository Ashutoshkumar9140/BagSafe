import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useApp } from "../context/AppContext";

function Home() {
  const navigate = useNavigate();
  const { user, logout } = useApp();
  const [search, setSearch] = useState("");

  const cities = [
    "Delhi",
    "Kanpur",
    "Lucknow",
    "Noida",
    "Prayagraj",
    "Jaipur",
    "Agra",
    "Varanasi",
    "Gurgaon",
    "Ghaziabad",
  ];

  // ........................ filter the city list as the user types ........................

  const filteredCities = cities.filter((city) =>
    city.toLowerCase().includes(search.trim().toLowerCase()),
  );

  // ........................ keep one common entry point for login and signup ........................

  const openLogin = (role = "", city = "") => {
    if (user) {
      logout();
    }

    navigate(`/login${city ? `?city=${encodeURIComponent(city)}` : ""}`);
  };

  // ........................ show simple demo reviews on the landing page ........................

  const reviews = [
    {
      name: "Rahul Verma",
      role: "Student",
      text: "The shelter search made my exam trip much less stressful. The request flow was simple and clear.",
      rating: 5,
    },
    {
      name: "Priya Singh",
      role: "Student",
      text: "I liked being able to see the homeowner details and track my request from one dashboard.",
      rating: 5,
    },
    {
      name: "Amit Sharma",
      role: "Homeowner",
      text: "BagSafe gives homeowners a clean way to manage shelters and student requests in one place.",
      rating: 4,
    },
  ];

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <Navbar />

      <main>
        <section
          className="bg-gradient-to-br from-blue-50 via-white to-cyan-50
         dark:from-slate-950 dark:via-slate-900 dark:to-blue-950/30"
        >
          <div className="mx-auto max-w-7xl px-4 py-20 text-center sm:px-6 sm:py-24 lg:px-8">
            <p className="mb-4 text-sm font-bold uppercase tracking-[0.2em] text-blue-600">
              Welcome to BagSafe
            </p>
            <h1 className="mx-auto max-w-4xl text-4xl font-black leading-tight sm:text-5xl lg:text-6xl">
              Find a safe place to stay before your exam
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-slate-600 dark:text-slate-300 sm:text-lg">
              BagSafe helps students find temporary shelter near their exam
              center while allowing homeowners to offer a safe place for them.
            </p>

            <div className="mt-10 flex justify-center">
              <button
                type="button"
                onClick={() => openLogin()}
                className="bagsafe-home-button w-full max-w-xs rounded-2xl px-10 py-4 text-base 
                font-extrabold transition sm:w-auto"
              >
                Login / Signup
              </button>
            </div>

            <div className="mx-auto mt-8 grid max-w-3xl grid-cols-1 gap-3 text-left sm:grid-cols-3">
              <div
                className="rounded-2xl border border-blue-100 bg-white/80 p-4 shadow-sm
               dark:border-blue-900 dark:bg-slate-900/80"
              >
                <p className="text-2xl font-black text-blue-600">10+</p>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                  Supported cities
                </p>
              </div>
              <div
                className="rounded-2xl border border-cyan-100 bg-white/80 p-4 shadow-sm
               dark:border-cyan-900 dark:bg-slate-900/80"
              >
                <p className="text-2xl font-black text-cyan-600">24/7</p>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                  Simple request tracking
                </p>
              </div>
              <div
                className="rounded-2xl border border-violet-100 bg-white/80 p-4 shadow-sm
               dark:border-violet-900 dark:bg-slate-900/80"
              >
                <p className="text-2xl font-black text-violet-600">1</p>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                  Dashboard for everything
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="border-y border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
          <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
            <div className="text-center">
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-blue-600">
                Explore locations
              </p>
              <h2 className="mt-2 text-3xl font-black">
                Popular Exam Destinations
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-slate-600 dark:text-slate-300">
                Search a supported city and continue as a student to find demo
                and homeowner-added shelters near your exam area.
              </p>
            </div>

            <div className="mx-auto mt-8 max-w-2xl">
              <div
                className="flex items-center rounded-2xl border border-slate-300
               bg-slate-50 px-4 py-3 shadow-sm dark:border-slate-700 dark:bg-slate-950"
              >
                <span className="mr-3 text-lg">🔍</span>
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  type="text"
                  placeholder="Search city"
                  className="w-full bg-transparent text-sm outline-none"
                />
              </div>
            </div>

            <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
              {filteredCities.map((city) => (
                <button
                  key={city}
                  type="button"
                  onClick={() => openLogin("student", city)}
                  className="rounded-2xl border border-slate-200 bg-slate-50 p-5 text-center 
                  transition hover:-translate-y-1 hover:border-blue-300 hover:bg-blue-50
                   dark:border-slate-700 dark:bg-slate-950 dark:hover:border-blue-700 dark:hover:bg-blue-950/40"
                >
                  <p className="font-bold">{city}</p>
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    Find shelters
                  </p>
                </button>
              ))}
            </div>

            {filteredCities.length === 0 && (
              <p className="mt-8 text-center text-sm text-slate-500 dark:text-slate-400">
                No supported city found.
              </p>
            )}
          </div>
        </section>

        <section className="bg-gradient-to-r from-emerald-50 to-cyan-50 dark:from-emerald-950/20 dark:to-cyan-950/20">
          <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
            <div className="text-center">
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-emerald-600">
                Student & Homeowner Reviews
              </p>
              <h2 className="mt-2 text-3xl font-black">
                What people say about BagSafe
              </h2>
            </div>

            <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-3">
              {reviews.map((review) => (
                <article
                  key={review.name}
                  className="rounded-2xl border border-emerald-100 bg-white p-6 shadow-sm
                   dark:border-emerald-900 dark:bg-slate-900"
                >
                  <div className="text-lg tracking-widest text-amber-500">
                    {"★".repeat(review.rating)}
                    {"☆".repeat(5 - review.rating)}
                  </div>
                  <p className="mt-4 text-sm leading-7 text-slate-600 dark:text-slate-300">
                    “{review.text}”
                  </p>
                  <div className="mt-5 border-t border-slate-100 pt-4 dark:border-slate-700">
                    <p className="font-bold">{review.name}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {review.role}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section
          id="about"
          className="border-y border-blue-100 bg-blue-50/70
         dark:border-slate-800 dark:bg-slate-900/70"
        >
          <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-3xl text-center">
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-blue-600">
                About BagSafe
              </p>
              <h2 className="mt-2 text-3xl font-black">
                A simple place to wait before your exam
              </h2>
              <p className="mt-6 leading-7 text-slate-600 dark:text-slate-300">
                BagSafe connects students with homeowners who can provide a
                temporary and comfortable place near an exam center. Students
                can search their destination, choose a shelter, upload
                supporting documents, send a request, chat with the homeowner,
                and track their booking from one dashboard.
              </p>
            </div>
          </div>
        </section>

        <section id="contact" className="bg-slate-900 text-white">
          <div className="mx-auto max-w-7xl px-4 py-16 text-center sm:px-6 lg:px-8">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-cyan-400">
              Contact
            </p>
            <h2 className="mt-2 text-3xl font-black">Have a question?</h2>
            <p className="mx-auto mt-4 max-w-xl text-slate-300">
              Get in touch with the BagSafe team if you need help or want to
              know more about the platform.
            </p>
            <div className="mt-8 flex flex-col items-center gap-3 text-sm text-slate-300">
              <p>📧 support@bagsafe.demo</p>
              <p>📞 +91 98765 43210</p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default Home;
