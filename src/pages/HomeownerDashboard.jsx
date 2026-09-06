import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";
import HomeownerProfile from "../components/HomeownerProfile";
import Wallet from "../components/Wallet";
import Chat from "../components/Chat";

function HomeownerDashboard() {
  const navigate = useNavigate();
  const {
    user,
    logout,
    updateRequestStatus,
    addShelter,
    updateShelter,
    deleteShelter,
  } = useApp();

  const [requests, setRequests] = useState([]);
  const [shelters, setShelters] = useState([]);
  const [showShelterForm, setShowShelterForm] = useState(false);
  const [editingShelterId, setEditingShelterId] = useState(null);
  const [showProfile, setShowProfile] = useState(false);
  const [chatRequest, setChatRequest] = useState(null);

  const [shelterName, setShelterName] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [area, setArea] = useState("");
  const [capacity, setCapacity] = useState("");
  const [price, setPrice] = useState("");
  const [availability, setAvailability] = useState("");
  const [amenities, setAmenities] = useState([]);

  const [shelterMessage, setShelterMessage] = useState("");
  const [deleteShelterId, setDeleteShelterId] = useState(null);

  const availableAmenities = [
    "Food",
    "Breakfast",
    "Chairs",
    "Fan",
    "Cooler",
    "Drinking Water",
    "Charging",
    "Wi-Fi",
  ];

  useEffect(() => {
    loadRequests();
    loadShelters();

    const handleRequestUpdate = () => {
      loadRequests();
    };

    const handleStorageUpdate = (event) => {
      if (event.key === "bagsafeRequests") {
        loadRequests();
      }

      if (event.key === "bagsafeOwnerShelters") {
        loadShelters();
      }
    };

    const handleShelterUpdate = () => {
      loadShelters();
    };

    window.addEventListener(
      "bagsafeRequestUpdated",
      handleRequestUpdate
    );

    window.addEventListener(
      "storage",
      handleStorageUpdate
    );

    window.addEventListener(
      "bagsafeShelterUpdated",
      handleShelterUpdate
    );

    return () => {
      window.removeEventListener(
        "bagsafeRequestUpdated",
        handleRequestUpdate
      );

      window.removeEventListener(
        "storage",
        handleStorageUpdate
      );

      window.removeEventListener(
        "bagsafeShelterUpdated",
        handleShelterUpdate
      );
    };
  }, [user]);

  const loadRequests = () => {
    const savedRequests =
      JSON.parse(localStorage.getItem("bagsafeRequests")) || [];

    const homeownerRequests = savedRequests.filter(
      (request) => request.homeownerId === user?.id
    );

    setRequests(homeownerRequests);
  };

  const loadShelters = () => {
    const savedShelters =
      JSON.parse(localStorage.getItem("bagsafeOwnerShelters")) || [];

    const homeownerShelters = savedShelters.filter(
      (shelter) => shelter.homeownerId === user?.id
    );

    setShelters(homeownerShelters);
  };

  const handleRequestStatus = (requestId, status) => {
    const updatedRequests = updateRequestStatus(
      requestId,
      status
    );

    const homeownerRequests = updatedRequests.filter(
      (request) => request.homeownerId === user?.id
    );

    setRequests(homeownerRequests);
  };

  const handleAmenityChange = (amenity) => {
    if (amenities.includes(amenity)) {
      setAmenities(
        amenities.filter((item) => item !== amenity)
      );
    } else {
      setAmenities([...amenities, amenity]);
    }
  };

  const resetShelterForm = () => {
    setShelterName("");
    setAddress("");
    setCity("");
    setArea("");
    setCapacity("");
    setPrice("");
    setAvailability("");
    setAmenities([]);
    setEditingShelterId(null);
    setShowShelterForm(false);
  };

  const handleAddShelter = (e) => {
    e.preventDefault();

    setShelterMessage("");

    if (
      !shelterName ||
      !address ||
      !city ||
      !area ||
      !capacity ||
      !price ||
      !availability
    ) {
      setShelterMessage("Please fill in all required fields.");
      return;
    }

    if (Number(capacity) < 1) {
      setShelterMessage("Capacity must be at least 1 student.");
      return;
    }

    if (Number(price) <= 0) {
      setShelterMessage("Price must be greater than ₹0 per student.");
      return;
    }

    const shelterData = {
      homeownerId: user.id,
      homeownerName: user.name,
      homeownerEmail: user.email,
      name: shelterName.trim(),
      address: address.trim(),
      city: city.trim(),
      area: area.trim(),
      capacity: Number(capacity),
      price: Number(price),
      availability,
      amenities,
    };

    if (editingShelterId) {
      const updatedShelters = updateShelter(
        editingShelterId,
        shelterData
      );

      setShelters(
        updatedShelters.filter(
          (shelter) => shelter.homeownerId === user?.id
        )
      );
    } else {
      const newShelter = addShelter(shelterData);
      setShelters([...shelters, newShelter]);
    }

    resetShelterForm();
  };

  const handleEditShelter = (shelter) => {
    setEditingShelterId(shelter.id);
    setShelterName(shelter.name || "");
    setAddress(shelter.address || "");
    setCity(shelter.city || "");
    setArea(shelter.area || "");
    setCapacity(String(shelter.capacity || ""));
    setPrice(String(shelter.price || ""));
    setAvailability(shelter.availability || "");
    setAmenities(Array.isArray(shelter.amenities) ? shelter.amenities : []);
    setShelterMessage("");
    setShowShelterForm(true);

    window.setTimeout(() => {
      document
        .getElementById("shelter-form")
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 0);
  };

  const handleDeleteShelter = () => {
    if (!deleteShelterId) {
      return;
    }

    const updatedShelters = deleteShelter(deleteShelterId);
    const homeownerShelters = updatedShelters.filter(
      (shelter) => shelter.homeownerId === user?.id
    );

    setShelters(homeownerShelters);
    setDeleteShelterId(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <header className="border-b border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div>
            <h1 className="text-2xl font-bold text-blue-600">
              BagSafe
            </h1>

            <p className="text-sm text-slate-500 dark:text-slate-400">
              Homeowner Dashboard
            </p>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={() => {
                logout();
                navigate("/login?role=homeowner", { replace: true });
              }}
              className="bagsafe-home-button rounded-xl px-3 py-2 text-sm font-bold sm:px-4"
            >
              🏠 Home
            </button>

            <button
              type="button"
              onClick={() => setShowProfile(true)}
              className="flex items-center gap-3 rounded-xl px-2 py-2 transition hover:bg-slate-100"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-100 text-lg">
                🏠
              </div>

              <div className="hidden text-right sm:block">
                <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                  {user?.name}
                </p>

                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Homeowner
                </p>
              </div>
            </button>

            <button
              type="button"
              onClick={() => {
                logout();
                navigate("/login?role=homeowner", { replace: true });
              }}
              className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-10">
        <section className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">
            Welcome back
          </p>

          <h2 className="mt-2 text-3xl font-bold text-slate-900 dark:text-slate-100">
            Manage your shelters and requests
          </h2>

          <p className="mt-3 max-w-2xl text-slate-600 dark:text-slate-300">
            Manage your available rooms and review requests from
            students.
          </p>
        </section>

        <section className="bagsafe-section bagsafe-blue-section mb-8 rounded-3xl p-3 sm:p-4">
          <Wallet role="homeowner" />
        </section>

        <section className="bagsafe-section bagsafe-purple-section grid grid-cols-1 gap-5 rounded-3xl p-4 sm:grid-cols-3 sm:p-5">
          <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-slate-700">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              My Shelters
            </p>

            <p className="mt-2 text-3xl font-bold text-slate-900 dark:text-slate-100">
              {shelters.length}
            </p>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-slate-700">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Total Requests
            </p>

            <p className="mt-2 text-3xl font-bold text-slate-900 dark:text-slate-100">
              {requests.length}
            </p>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-slate-700">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Pending Requests
            </p>

            <p className="mt-2 text-3xl font-bold text-yellow-600">
              {
                requests.filter(
                  (request) => request.status === "pending"
                ).length
              }
            </p>
          </div>
        </section>

        <section className="bagsafe-section bagsafe-amber-section mt-8 rounded-3xl p-4 sm:p-6">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                My Shelters
              </h3>

              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Add and manage the places you offer to students.
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                setShowShelterForm(!showShelterForm);
                setShelterMessage("");
              }}
              className="rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
            >
              {showShelterForm
                ? "Close Form"
                : "+ Add Shelter"}
            </button>
          </div>

          {showShelterForm && (
            <form
              id="shelter-form"
              onSubmit={handleAddShelter}
              className="mt-6 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-slate-700"
            >
              <h4 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                {editingShelterId ? "Edit shelter" : "Add a new shelter"}
              </h4>

              {shelterMessage && (
                <div className="mt-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {shelterMessage}
                </div>
              )}

              <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                    Home / Room Name
                  </label>

                  <input
                    type="text"
                    value={shelterName}
                    onChange={(e) =>
                      setShelterName(e.target.value)
                    }
                    placeholder="e.g. Sunrise Room"
                    className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 placeholder-slate-400 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:placeholder-slate-500 dark:focus:ring-blue-900/40"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                    Address
                  </label>

                  <input
                    type="text"
                    value={address}
                    onChange={(e) =>
                      setAddress(e.target.value)
                    }
                    placeholder="Enter full address"
                    className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 placeholder-slate-400 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:placeholder-slate-500 dark:focus:ring-blue-900/40"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                    City
                  </label>

                  <input
                    type="text"
                    value={city}
                    onChange={(e) =>
                      setCity(e.target.value)
                    }
                    placeholder="e.g. Noida"
                    className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 placeholder-slate-400 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:placeholder-slate-500 dark:focus:ring-blue-900/40"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                    Area
                  </label>

                  <input
                    type="text"
                    value={area}
                    onChange={(e) =>
                      setArea(e.target.value)
                    }
                    placeholder="e.g. Sector 62"
                    className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 placeholder-slate-400 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:placeholder-slate-500 dark:focus:ring-blue-900/40"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                    Capacity
                  </label>

                  <input
                    type="number"
                    min="1"
                    value={capacity}
                    onChange={(e) =>
                      setCapacity(e.target.value)
                    }
                    placeholder="Number of students"
                    className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 placeholder-slate-400 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:placeholder-slate-500 dark:focus:ring-blue-900/40"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                    Price per Student
                  </label>

                  <div className="flex items-center rounded-lg border border-slate-300 bg-white px-3 dark:border-slate-600 dark:bg-slate-900">
                    <span className="text-slate-600 dark:text-slate-300">₹</span>
                    <input
                      type="number"
                      min="1"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      placeholder="e.g. 350"
                      className="w-full rounded-lg border-0 bg-transparent px-2 py-3 text-slate-900 placeholder-slate-400 outline-none dark:text-slate-100 dark:placeholder-slate-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                    Availability
                  </label>

                  <select
                    value={availability}
                    onChange={(e) =>
                      setAvailability(e.target.value)
                    }
                    className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:focus:ring-blue-900/40"
                  >
                    <option value="">
                      Select availability
                    </option>

                    <option value="Few Hours">
                      Few Hours
                    </option>

                    <option value="Whole Day">
                      Whole Day
                    </option>

                    <option value="Whole Night">
                      Whole Night
                    </option>

                    <option value="Day and Night">
                      Day and Night
                    </option>
                  </select>
                </div>
              </div>

              <div className="mt-6">
                <p className="mb-3 text-sm font-medium text-slate-700 dark:text-slate-300">
                  Amenities
                </p>

                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {availableAmenities.map((amenity) => (
                    <label
                      key={amenity}
                      className="flex cursor-pointer items-center gap-2 rounded-lg border border-slate-200 bg-white p-3 text-sm text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
                    >
                      <input
                        type="checkbox"
                        checked={amenities.includes(amenity)}
                        onChange={() =>
                          handleAmenityChange(amenity)
                        }
                        className="h-4 w-4"
                      />

                      {amenity}
                    </label>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                className="mt-6 rounded-xl bg-green-600 px-6 py-3 font-semibold text-white transition hover:bg-green-700"
              >
                {editingShelterId ? "Save Shelter Changes" : "Add Shelter"}
              </button>
            </form>
          )}

          <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2">
            {shelters.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center md:col-span-2 dark:border-slate-600 dark:bg-slate-900">
                <div className="text-4xl">🏠</div>

                <h4 className="mt-4 text-lg font-semibold text-slate-800 dark:text-slate-200">
                  No shelters added yet
                </h4>

                <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                  Add your first shelter so students can find it.
                </p>
              </div>
            ) : (
              shelters.map((shelter) => (
                <div
                  key={shelter.id}
                  className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-slate-700"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h4 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                        {shelter.name}
                      </h4>

                      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                        {shelter.area}, {shelter.city}
                      </p>

                      <p className="mt-1 text-xs font-medium text-slate-600 dark:text-slate-300">
                        Hosted by {shelter.homeownerName || user?.name}
                      </p>
                    </div>

                    <div className="flex shrink-0 gap-2">
                      <button
                        type="button"
                        onClick={() => handleEditShelter(shelter)}
                        className="rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 text-sm font-bold text-blue-700 transition hover:bg-blue-100 dark:border-blue-900 dark:bg-blue-950/40 dark:text-blue-300"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeleteShelterId(shelter.id)}
                        className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm font-bold text-red-600 transition hover:bg-red-100 dark:border-red-900 dark:bg-red-950/40 dark:text-red-400"
                      >
                        Delete
                      </button>
                    </div>
                  </div>

                  <div className="mt-5 space-y-2 text-sm text-slate-600 dark:text-slate-300">
                    <p>
                      📍 {shelter.address}
                    </p>

                    <p>
                      👥 Capacity: {shelter.capacity} students
                    </p>

                    <p>
                      🕐 Availability: {shelter.availability}
                    </p>
                  </div>

                  {shelter.amenities.length > 0 && (
                    <div className="mt-5 flex flex-wrap gap-2">
                      {shelter.amenities.map((amenity) => (
                        <span
                          key={amenity}
                          className="rounded-full bg-blue-50 px-3 py-1 text-xs text-blue-700"
                        >
                          {amenity}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </section>

        <section className="bagsafe-section bagsafe-rose-section mt-12 rounded-3xl p-4 sm:p-6">
          <div className="mb-5">
            <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
              Student Requests
            </h3>

            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Requests sent to your shelters will appear here.
            </p>
          </div>

          {requests.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center dark:border-slate-600 dark:bg-slate-900">
              <div className="text-4xl">📩</div>

              <h4 className="mt-4 text-lg font-semibold text-slate-800 dark:text-slate-200">
                No requests yet
              </h4>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500 dark:text-slate-400">
                When a student sends a request to one of your
                shelters, you will see it here.
              </p>
            </div>
          ) : (
            <div className="max-h-[620px] space-y-5 overflow-y-auto pr-1">
              {requests.map((request) => (
                <div
                  key={request.requestId}
                  className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-slate-700"
                >
                  <div className="flex flex-col justify-between gap-4 sm:flex-row">
                    <div>
                      <div className="flex flex-wrap items-center gap-3">
                        <h4 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                          {request.studentName}
                        </h4>

                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${
                            request.status === "accepted"
                              ? "bg-green-50 text-green-700"
                              : request.status === "rejected"
                              ? "bg-red-50 text-red-700"
                              : "bg-yellow-50 text-yellow-700 dark:bg-yellow-950/40 dark:text-yellow-300"
                          }`}
                        >
                          {request.status}
                        </span>
                      </div>

                      <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                        Request ID: {request.requestId}
                      </p>
                    </div>

                    <div className="text-left sm:text-right">
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        Shelter
                      </p>

                      <p className="font-semibold text-slate-900 dark:text-slate-100">
                        {request.shelterName}
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <div className="rounded-lg bg-slate-50 p-4 dark:bg-slate-950">
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Students
                      </p>

                      <p className="mt-1 font-semibold text-slate-900 dark:text-slate-100">
                        {request.students}
                      </p>
                    </div>

                    <div className="rounded-lg bg-slate-50 p-4 dark:bg-slate-950">
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Location
                      </p>

                      <p className="mt-1 font-semibold text-slate-900 dark:text-slate-100">
                        {request.area}, {request.city}
                      </p>
                    </div>

                    <div className="rounded-lg bg-slate-50 p-4 dark:bg-slate-950">
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Estimated Amount
                      </p>

                      <p className="mt-1 font-semibold text-slate-900 dark:text-slate-100">
                        ₹{request.totalCost}
                      </p>
                    </div>
                  </div>

                  <div className="mt-5">
                    <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                      Student Message
                    </p>

                    <div className="mt-2 rounded-lg bg-slate-50 p-4 text-sm leading-6 text-slate-700 dark:bg-slate-950 dark:text-slate-200">
                      {request.message ||
                        "No message provided."}
                    </div>
                  </div>

                  {request.verificationDocument && (
                    <div className="mt-4 rounded-lg border border-green-200 bg-green-50 p-4 dark:border-green-900 dark:bg-green-950/40">
                      <p className="text-sm font-semibold text-green-700">
                        ✓ Exam document submitted
                      </p>

                      <p className="mt-1 text-xs text-green-700 dark:text-green-300">
                        {request.verificationDocument}
                      </p>
                    </div>
                  )}

                  <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:justify-end">
                    <button
                      type="button"
                      onClick={() =>
                        setChatRequest(request)
                      }
                      className="rounded-lg border border-blue-200 bg-blue-50 px-5 py-3 text-sm font-semibold text-blue-700 transition hover:bg-blue-100"
                    >
                      💬 Chat with Student
                    </button>

                    {request.status === "pending" && (
                      <>
                        <button
                          type="button"
                          onClick={() =>
                            handleRequestStatus(
                              request.requestId,
                              "rejected"
                            )
                          }
                          className="rounded-lg border border-red-200 px-5 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-50 dark:border-red-900 dark:text-red-400 dark:hover:bg-red-950/40"
                        >
                          Reject Request
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            handleRequestStatus(
                              request.requestId,
                              "accepted"
                            )
                          }
                          className="rounded-lg bg-green-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-green-700"
                        >
                          Accept Request
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      {deleteShelterId && (
        <div className="fixed inset-0 z-[90] flex items-center justify-center bg-slate-950/60 px-4 backdrop-blur-sm" role="dialog" aria-modal="true">
          <div className="w-full max-w-md rounded-2xl border border-red-200 bg-white p-6 shadow-2xl dark:border-red-900 dark:bg-slate-900">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-red-600">Delete shelter</p>
                <h3 className="mt-2 text-xl font-black text-slate-900 dark:text-slate-100">Are you sure?</h3>
              </div>
              <button type="button" onClick={() => setDeleteShelterId(null)} className="flex h-10 w-10 items-center justify-center rounded-full bg-red-50 text-2xl font-bold text-red-600 dark:bg-red-950/40 dark:text-red-400">×</button>
            </div>
            <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">This shelter will be removed from your homeowner dashboard and will no longer appear in future searches.</p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <button type="button" onClick={handleDeleteShelter} className="flex-1 rounded-xl bg-red-600 px-4 py-3 font-bold text-white hover:bg-red-700">Delete Shelter</button>
              <button type="button" onClick={() => setDeleteShelterId(null)} className="flex-1 rounded-xl border border-slate-300 bg-white px-4 py-3 font-bold text-slate-700 hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-200">Cancel</button>
            </div>
          </div>
        </div>
      )}

      {showProfile && (
        <HomeownerProfile
          onClose={() => setShowProfile(false)}
        />
      )}

      {chatRequest && (
        <Chat
          request={chatRequest}
          onClose={() => setChatRequest(null)}
        />
      )}
    </div>
  );
}

export default HomeownerDashboard;