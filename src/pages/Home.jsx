import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function Home() {
  const navigate = useNavigate();
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
  const filteredCities = cities.filter((city) =>
    city.toLowerCase().includes(search.trim().toLowerCase()),
  );

  const searchCity = (city) => {
    navigate(`/login?role=student&city=${encodeURIComponent(city)}`);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <Navbar />
      <main>
        <section className="bg-slate-50 dark:bg-slate-950">
          <div className="mx-auto max-w-7xl px-6 py-20 text-center sm:py-24">
            <p className="mb-4 text-sm font-semibold uppercase tracking-wider text-blue-600">
              Welcome to BagSafe
            </p>
            <h1 className="mx-auto max-w-3xl text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
              Find a safe place to stay before your exam
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-slate-600 dark:text-slate-300 sm:text-lg">
              BagSafe helps students find temporary shelter near their exam
              center while allowing homeowners to offer a safe place for them.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                to="/login?role=student"
                className="w-full rounded-lg bg-blue-600 px-7 py-3.5 font-semibold text-white shadow-sm transition hover:bg-blue-700 sm:w-auto"
              >
                🎓 I'm a Student
              </Link>
              <Link
                to="/login?role=homeowner"
                className="w-full rounded-lg border border-slate-300 bg-white px-7 py-3.5 font-semibold text-slate-800 shadow-sm transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800 sm:w-auto dark:text-slate-200 dark:border-slate-600"
              >
                🏠 I'm a Homeowner
              </Link>
            </div>
          </div>
        </section>

        <section className="border-y border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 dark:border-slate-700">
          <div className="mx-auto max-w-7xl px-6 py-16">
            <div className="text-center">
              <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">
                Explore locations
              </p>
              <h2 className="mt-2 text-3xl font-bold">
                Popular Exam Destinations
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-slate-600 dark:text-slate-300">
                Search a supported city and continue as a student to find demo
                and homeowner-added shelters near your exam area.
              </p>
            </div>
            <div className="mx-auto mt-8 max-w-2xl">
              <div className="flex items-center rounded-lg border border-slate-300 bg-slate-50 px-4 py-3 dark:border-slate-700 dark:bg-slate-800 dark:bg-slate-950 dark:border-slate-600">
                <span className="mr-3 text-lg">🔍</span>
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  type="text"
                  placeholder="Search city"
                  className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400 dark:placeholder:text-slate-500"
                />
              </div>
            </div>
            <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
              {filteredCities.map((city) => (
                <button
                  key={city}
                  type="button"
                  onClick={() => searchCity(city)}
                  className="rounded-xl border border-slate-200 bg-slate-50 p-5 text-center transition hover:-translate-y-1 hover:border-blue-200 hover:bg-blue-50 dark:border-slate-700 dark:bg-slate-800 dark:hover:border-blue-700 dark:hover:bg-slate-700 dark:bg-slate-950 dark:hover:bg-blue-950/50"
                >
                  <p className="font-semibold">{city}</p>
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

        <section
          id="about"
          className="border-y border-blue-100 bg-blue-50/60 dark:border-slate-800 dark:bg-slate-900/60"
        >
          <div className="mx-auto max-w-7xl px-6 py-20">
            <div className="mx-auto max-w-3xl text-center">
              <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">
                About BagSafe
              </p>
              <h2 className="mt-2 text-3xl font-bold">
                A simple place to wait before your exam
              </h2>
              <p className="mt-6 leading-7 text-slate-600 dark:text-slate-300">
                BagSafe connects students with homeowners who can provide a
                temporary and comfortable place near an exam center. Students
                can search their destination, choose a shelter, and send a
                request to the homeowner.
              </p>
            </div>
          </div>
        </section>

        <section id="contact" className="bg-slate-900 text-white">
          <div className="mx-auto max-w-7xl px-6 py-16 text-center">
            <p className="text-sm font-semibold uppercase tracking-wider text-blue-400">
              Contact
            </p>
            <h2 className="mt-2 text-3xl font-bold">Have a question?</h2>
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
